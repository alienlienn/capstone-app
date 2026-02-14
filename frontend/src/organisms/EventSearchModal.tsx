import { Modal, View, Text, Pressable, FlatList, Image } from "react-native"
import { useState, useEffect } from "react"
import { colors } from "../styles/colors"
import { StyleSheet } from "react-native"
import { CalendarEvent } from "../types/types"
import { fetchEventsByUserId } from "../services/event"
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

  useEffect(() => {
    if (visible && currentUserId) {
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
                startDate: dayStr,
                endDate: dayStr,
              })
            }
          })
          // Sort events: by date (earliest first), then by title (A-Z)
          expandedEvents.sort((a, b) => {
            const dateA = a.startDate.split("/").reverse().join("");
            const dateB = b.startDate.split("/").reverse().join("");

            if (dateA !== dateB) {
              return dateA.localeCompare(dateB);
            }
            return (a.title || "").localeCompare(b.title || "");
          });
          setEvents(expandedEvents)
        })
        .catch((err) => console.error("Error fetching events:", err))
    }
  }, [visible, currentUserId])

  const filteredEvents = events.filter((e) =>
    (e.title || "").toLowerCase().includes(searchText.toLowerCase())
  );

  const renderEvent = ({ item }: { item: CalendarEvent }) => {
    const isSelected =
      selectedEvent?.id === item.id && selectedEvent?.startDate === item.startDate

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
        <Text style={styles.editEventDate}>{item.startDate}</Text>
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
            keyExtractor={(item, index) => `${item.id}_${item.startDate}_${index}`}
            renderItem={renderEvent}
            style={{ flex: 1, }}
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
              onPress={() => {}}
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
  tableHeaderDate: { flex: 2, fontWeight: "600", fontSize: 14 },
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
  editEventDate: { flex: 2, fontSize: 13, color: colors.gray_600 },
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
