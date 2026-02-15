import { Modal, View, Text, Pressable, FlatList, Image, Alert } from "react-native"
import { useState, useEffect } from "react"
import { colors } from "../styles/colors"
import { StyleSheet } from "react-native"
import { CalendarEvent } from "../types/types"
import { fetchEventsByUserId, deleteEvent, updateEvent, addEvent } from "../services/event"
import UserInput from "../atoms/UserInput"

type EditEventModalProps = {
  visible: boolean
  onClose: () => void
  onSelect: (event: CalendarEvent) => void
}

export default function EventSearchModal({ visible, onClose, onSelect }: EditEventModalProps) {
  const [searchText, setSearchText] = useState("")
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

  const currentUserId = (global as any).loggedInUser?.id

  const loadEvents = () => {
    if (currentUserId) {
      fetchEventsByUserId(currentUserId)
        .then((allEvents) => {
          const expandedEvents: CalendarEvent[] = []
          allEvents.forEach((event) => {
            const startParts = event.startDate.split("/").map(Number)
            const endParts = (event.endDate || event.startDate).split("/").map(Number)

            const start = new Date(startParts[2], startParts[1] - 1, startParts[0])
            const end = new Date(endParts[2], endParts[1] - 1, endParts[0])

            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
              const dayStr = `${String(d.getDate()).padStart(2, "0")}/${String(
                d.getMonth() + 1
              ).padStart(2, "0")}/${d.getFullYear()}`
              expandedEvents.push({
                ...event,
                date: dayStr, // Specific day in the range
              })
            }
          })
          // Sort events: by date (earliest first), then by title (A-Z)
          expandedEvents.sort((a, b) => {
            const dateA = (a.date || "").split("/").reverse().join("");
            const dateB = (b.date || "").split("/").reverse().join("");

            if (dateA !== dateB) {
              return dateA.localeCompare(dateB);
            }
            return (a.title || "").localeCompare(b.title || "");
          });
          setEvents(expandedEvents)
        })
        .catch((err) => console.error("Error fetching events:", err))
    }
  }

  useEffect(() => {
    if (visible) {
      loadEvents()
    }
  }, [visible, currentUserId])

  const parseDDMMYYYY = (dateStr: string) => {
    const [d, m, y] = dateStr.split("/").map(Number)
    return new Date(y, m - 1, d)
  }

  const formatDateTimeToISO = (date: Date, timeStr: string | null) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const time = timeStr || "00:00"
    return `${year}-${month}-${day}T${time}:00`
  }

  const createPayload = (event: CalendarEvent, start: Date, end: Date) => {
    return {
      school_id: event.schoolId || 1,
      title: event.title,
      description: event.description,
      event_type: event.eventType,
      venue: event.venue,
      affected_groups: event.affectedGroups ? event.affectedGroups.split(",") : [],
      start_time: event.startTime,
      end_time: event.endTime,
      start_datetime: formatDateTimeToISO(start, event.startTime || null),
      end_datetime: formatDateTimeToISO(end, event.endTime || null),
      created_by: event.createdBy || 1,
    }
  }

  const handleDeleteEvent = () => {
    if (!selectedEvent || !selectedEvent.id || !selectedEvent.date) return

    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete this event on ${selectedEvent.date}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const selectedDateStr = selectedEvent.date!
              const startDateStr = selectedEvent.startDate
              const endDateStr = selectedEvent.endDate || selectedEvent.startDate

              if (selectedDateStr === startDateStr && selectedDateStr === endDateStr) {
                // Single day event, delete the whole thing
                await deleteEvent(selectedEvent.id!)
              } else if (selectedDateStr === startDateStr) {
                // Deleting the start date, move start date to next day
                const nextDay = parseDDMMYYYY(selectedDateStr)
                nextDay.setDate(nextDay.getDate() + 1)

                await updateEvent(
                  selectedEvent.id!,
                  createPayload(selectedEvent, nextDay, parseDDMMYYYY(endDateStr))
                )
              } else if (selectedDateStr === endDateStr) {
                // Deleting the end date, move end date to previous day
                const prevDay = parseDDMMYYYY(selectedDateStr)
                prevDay.setDate(prevDay.getDate() - 1)

                await updateEvent(
                  selectedEvent.id!,
                  createPayload(selectedEvent, parseDDMMYYYY(startDateStr), prevDay)
                )
              } else {
                // Deleting in the middle! Split into two events.
                const dayBefore = parseDDMMYYYY(selectedDateStr)
                dayBefore.setDate(dayBefore.getDate() - 1)

                const dayAfter = parseDDMMYYYY(selectedDateStr)
                dayAfter.setDate(dayAfter.getDate() + 1)

                // 1. Update existing event to end the day before
                await updateEvent(
                  selectedEvent.id!,
                  createPayload(selectedEvent, parseDDMMYYYY(startDateStr), dayBefore)
                )

                // 2. Create new event starting the day after
                await addEvent(createPayload(selectedEvent, dayAfter, parseDDMMYYYY(endDateStr)))
              }

              Alert.alert("Success", "Event updated successfully")
              setSelectedEvent(null)
              loadEvents() // Refresh list
            } catch (error) {
              console.error("Delete failed:", error)
              Alert.alert("Error", "Failed to delete event")
            }
          },
        },
      ]
    )
  }

  const filteredEvents = events.filter((e) =>
    (e.title || "").toLowerCase().includes(searchText.toLowerCase())
  );

  const renderEvent = ({ item }: { item: CalendarEvent }) => {
    const isSelected =
      selectedEvent?.id === item.id && selectedEvent?.date === item.date

    return (
      <Pressable
        style={[
          styles.editEventRow,
          isSelected && { backgroundColor: colors.primary_100 },
        ]}
        onPress={() => {
          if (isSelected) {
            setSelectedEvent(null);
          } else {
            setSelectedEvent(item);
          }
        }}
      >
        <Text style={styles.editEventTitle}>{item.title}</Text>
        <Text style={styles.editEventDate}>{item.date}</Text>
      </Pressable>
    )
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalCenteredOverlay}>
        <View style={styles.editEventModalContainer}>
          <Text style={styles.editEventHeader}>Select Event to Edit/Remove</Text>

          {/* Search bar with UserInput and search icon */}
          <View style={styles.searchRow}>
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: colors.gray_50, borderRadius: 8, borderWidth: 1, borderColor: colors.gray_200 }}>
              <UserInput
                inputValue={searchText}
                placeholder="Search event title"
                onChangeInputText={setSearchText}
                containerStyle={{ flex: 1, height: 40, marginBottom: 0, backgroundColor: 'transparent', borderWidth: 0 }}
                inputStyle={{ alignItems: "center", marginBottom: -2, paddingRight: 36 }}
              />
              <Image
                source={require("../../assets/search_icon.png")}
                style={{ width: 16, height: 16, position: "absolute", right: 12, tintColor: colors.gray_500 }}
              />
            </View>
          </View>

          {/* Event list header */}
          <View style={styles.editEventTableHeader}>
            <Text style={styles.tableHeaderTitle}>Event Title</Text>
            <Text style={styles.tableHeaderDate}>Dates</Text>
          </View>

          {/* Event list */}
          <FlatList
            data={filteredEvents}
            keyExtractor={(item, index) => `${item.id}_${item.date}_${index}`}
            renderItem={renderEvent}
            style={{ flex: 1, }}
            ListEmptyComponent={
              <View style={{ padding: 20, alignItems: "center" }}>
                <Text style={{ color: colors.gray_500 }}>No events found</Text>
              </View>
            }
          />

          {/* Footer buttons */}
          <View style={styles.editEventFooter}>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[
                styles.selectButton,
                !selectedEvent && { opacity: 0.5 },
              ]}
              onPress={() => selectedEvent && onSelect(selectedEvent)}
              disabled={!selectedEvent}
            >
              <Text style={styles.editButtonText}>Edit Event</Text>
            </Pressable>
            <Pressable
              style={[
                styles.deleteButton,
                !selectedEvent && { opacity: 0.5 },
              ]}
              onPress={handleDeleteEvent}
              disabled={!selectedEvent}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalCenteredOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  editEventModalContainer: {
    width: "100%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    overflow: "hidden",
    flex: 1, // Ensure the container expands
  },
  editEventHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    marginLeft: 2,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  calendarButton: {
    marginLeft: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.gray_200,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  calendarIcon: {
    width: 24,
    height: 24,
  },
  editEventTableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray_300,
    marginBottom: 4,
    marginHorizontal: 4,
    alignItems: "center",
  },
  tableHeaderTitle: { flex: 2, fontWeight: "600", fontSize: 14 },
  tableHeaderDate: { flex: 1, fontWeight: "600", fontSize: 14, textAlign: "left" },
  editEventRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    marginHorizontal: 4,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.gray_200,
  },
  editEventTitle: { flex: 2, fontSize: 14 },
  editEventDate: { flex: 1, fontSize: 13, color: colors.gray_600, textAlign: "left" },
  editEventFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  cancelButton: {
    backgroundColor: colors.gray_200,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
    alignSelf: "center"
  },
  cancelButtonText: { fontSize: 14, fontWeight: "600" },
  selectButton: {
    backgroundColor: colors.primary_600,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
    alignSelf: "center"
  },
  editButtonText: { fontSize: 14, fontWeight: "600", color: "#fff" },
  deleteButton: {
    backgroundColor: colors.error,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
    alignSelf: "center"
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
})
