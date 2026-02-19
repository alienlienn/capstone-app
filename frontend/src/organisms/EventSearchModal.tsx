import { Modal, View, Text, Pressable, FlatList, Image, Alert } from "react-native"
import { useState, useEffect } from "react"
import { StyleSheet } from "react-native"
import { EditEventModalProps, CalendarEvent } from "../types/types"
import { fetchEventsByUserId, deleteEvent, updateEvent, addEvent } from "../services/event"
import UserInput from "../atoms/UserInput"
import { styles } from "../styles/styles"
import { colors } from "../styles/colors"


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
                date: dayStr, 
              })
            }
          })
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
    const currentUser = (global as any).loggedInUser;
    
    if (!currentUser || !currentUser.id) {
      throw new Error("User session information is missing");
    }

    return {
      school_id: event.schoolId || currentUser.school_id,
      title: event.title,
      description: event.description,
      event_type: event.eventType,
      venue: event.venue,
      affected_groups: event.affectedGroups ? event.affectedGroups.split(",") : [],
      start_time: event.startTime,
      end_time: event.endTime,
      start_datetime: formatDateTimeToISO(start, event.startTime || null),
      end_datetime: formatDateTimeToISO(end, event.endTime || null),
      created_by: event.createdBy || currentUser.id,
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
                await deleteEvent(selectedEvent.id!)
              } else if (selectedDateStr === startDateStr) {
                const nextDay = parseDDMMYYYY(selectedDateStr)
                nextDay.setDate(nextDay.getDate() + 1)

                await updateEvent(
                  selectedEvent.id!,
                  createPayload(selectedEvent, nextDay, parseDDMMYYYY(endDateStr))
                )
              } else if (selectedDateStr === endDateStr) {
                const prevDay = parseDDMMYYYY(selectedDateStr)
                prevDay.setDate(prevDay.getDate() - 1)

                await updateEvent(
                  selectedEvent.id!,
                  createPayload(selectedEvent, parseDDMMYYYY(startDateStr), prevDay)
                )
              } else {
                const dayBefore = parseDDMMYYYY(selectedDateStr)
                dayBefore.setDate(dayBefore.getDate() - 1)

                const dayAfter = parseDDMMYYYY(selectedDateStr)
                dayAfter.setDate(dayAfter.getDate() + 1)

                await updateEvent(
                  selectedEvent.id!,
                  createPayload(selectedEvent, parseDDMMYYYY(startDateStr), dayBefore)
                )

                await addEvent(createPayload(selectedEvent, dayAfter, parseDDMMYYYY(endDateStr)))
              }

              Alert.alert("Success", "Event updated successfully")
              setSelectedEvent(null)
              loadEvents() 
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
          styles.eventSearchButtonRow,
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
        <Text style={styles.eventSearchTitle}>{item.title}</Text>
        <Text style={styles.eventSearchDate}>{item.date}</Text>
      </Pressable>
    )
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.modalCenteredOverlay, { paddingHorizontal: 16 }]}>
        <View style={styles.eventSearchModalContainer}>
          <Text style={styles.eventSearchHeader}>Select Event to Edit/Remove</Text>

          <View style={styles.eventSearchRow}>
            <View style={styles.eventSearchContainer}>
              <UserInput
                inputValue={searchText}
                placeholder="Search event title"
                onChangeInputText={setSearchText}
                containerStyle={styles.eventCustomSearchBox}
                inputStyle={styles.eventSearchText}
              />
              <Image
                source={require("../../assets/search_icon.png")}
                style={styles.eventSearchIcon}
              />
            </View>
          </View>

          <View style={styles.eventSearchTableHeader}>
            <Text style={[styles.eventSearchTableHeaderLabel, { flex: 2 }]}>Event Title</Text>
            <Text style={[styles.eventSearchTableHeaderLabel, { textAlign: "left" }]}>Dates</Text>
          </View>

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

          <View style={styles.eventSearchButtonContainer}>
            <Pressable style={[styles.eventSearchButton, { backgroundColor: colors.gray_200 }]} onPress={onClose}>
              <Text style={styles.eventSearchButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[
                styles.eventSearchSelectedItem,
                !selectedEvent && { opacity: 0.5 },
              ]}
              onPress={() => selectedEvent && onSelect(selectedEvent)}
              disabled={!selectedEvent}
            >
              <Text style={[styles.eventSearchButtonText, { color: colors.gray_50 }]}>Edit Event</Text>
            </Pressable>
            <Pressable
              style={[
                styles.eventSearchButton, 
                { backgroundColor: colors.error },
                !selectedEvent && { opacity: 0.5 },
              ]}
              onPress={handleDeleteEvent}
              disabled={!selectedEvent}
            >
              <Text style={[styles.eventSearchButtonText, { color: colors.gray_50 }]}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

