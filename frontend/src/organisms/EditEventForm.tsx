import { useState, useEffect } from "react"
import { View, Text, Pressable, Image, Alert, ScrollView, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation, useRoute } from "@react-navigation/native"
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker"
import Dropdown from "../atoms/Dropdown"
import FilterMultiSelect from "../atoms/FilterMultiSelect"
import UserInput from "../atoms/UserInput"
import DateBox from "../atoms/DateBox"
import Button from "../atoms/Button"
import { colors } from "../styles/colors"
import { fetchEventTypeOptions, fetchAffectedGroupOptions, fetchEventTimeOptions } from "../services/lookup"
import { updateEvent } from "../services/event"
import type { DropdownOption, CalendarEvent } from "../types/types"
import { styles } from "../styles/styles"


export default function EditEventForm() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { event } = route.params as { event: CalendarEvent }

  const [title, setTitle] = useState(event.title || "")
  const [description, setDescription] = useState(event.description || "")
  const [eventType, setEventType] = useState<string | null>(event.eventType || null)
  const [venue, setVenue] = useState(event.venue || "")
  const [venueNotAvailable, setVenueNotAvailable] = useState(!event.venue)
  const [timeNotAvailable, setTimeNotAvailable] = useState(!event.startTime && !event.endTime)
  const [startTime, setStartTime] = useState<string | null>(event.startTime || null)
  const [endTime, setEndTime] = useState<string | null>(event.endTime || null)
  const [affectedGroups, setAffectedGroups] = useState<string[]>(
    event.affectedGroups ? event.affectedGroups.split(",") : []
  )
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [showStartPicker, setShowStartPicker] = useState(false)
  const [showEndPicker, setShowEndPicker] = useState(false)
  const [eventTypeOptions, setEventTypeOptions] = useState<DropdownOption[]>([])
  const [eventTimeOptions, setEventTimeOptions] = useState<DropdownOption[]>([])
  const [groupOptions, setGroupOptions] = useState<DropdownOption[]>([])
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setTitle(event.title || "")
    setDescription(event.description || "")
    setEventType(event.eventType || null)
    setVenue(event.venue || "")
    setVenueNotAvailable(!event.venue)
    setTimeNotAvailable(!event.startTime && !event.endTime)
    setStartTime(event.startTime || null)
    setEndTime(event.endTime || null)
    setAffectedGroups(event.affectedGroups ? event.affectedGroups.split(",") : [])

    async function loadOptions() {
      try {
        setLoadingOptions(true)
        const [types, groups, times] = await Promise.all([
          fetchEventTypeOptions(),
          fetchAffectedGroupOptions(),
          fetchEventTimeOptions(),
        ])
        setEventTypeOptions(types)
        setGroupOptions(groups)
        setEventTimeOptions(times)

        if (event.startDate) {
          const [d, m, y] = event.startDate.split("/").map(Number)
          setStartDate(new Date(y, m - 1, d))
        }
        if (event.endDate) {
          const [d, m, y] = event.endDate.split("/").map(Number)
          setEndDate(new Date(y, m - 1, d))
        }
      } catch (error) {
        console.error("Error loading event options:", error)
        Alert.alert("Error", "Failed to load event options")
      } finally {
        setLoadingOptions(false)
      }
    }
    loadOptions()
  }, [event])

  const formatDate = (date: Date) =>
    `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`

  const handleUpdateEvent = async () => {
    if (!title || !startDate || !endDate || !eventType) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    if (!venueNotAvailable && !venue) {
      Alert.alert("Error", "Please enter a venue or check 'Venue not available'")
      return
    }

    if (!timeNotAvailable && (!startTime || !endTime)) {
      Alert.alert("Error", "Please select start and end times or check 'Time not available'")
      return
    }

    if (endDate < startDate) {
      Alert.alert("Error", "End date cannot be before start date")
      return
    }

    setSubmitting(true)

    const formatDateTimeToISO = (date: Date, timeStr: string | null) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const day = String(date.getDate()).padStart(2, "0")
      const time = timeStr || "00:00"
      return `${year}-${month}-${day}T${time}:00`
    }

    try {
      if (!event.id) throw new Error("Event ID not found")
      
      await updateEvent(event.id, {
        school_id: 1, 
        title,
        description,
        event_type: eventType,
        venue: venueNotAvailable ? null : venue,
        affected_groups: affectedGroups,
        start_time: timeNotAvailable ? null : startTime,
        end_time: timeNotAvailable ? null : endTime,
        start_datetime: formatDateTimeToISO(startDate, timeNotAvailable ? null : startTime),
        end_datetime: formatDateTimeToISO(endDate, timeNotAvailable ? null : endTime),
        created_by: event.createdBy || 1, 
      })

      Alert.alert("Success", "Event updated successfully")
      navigation.goBack()
    } catch (error: any) {
      console.error("Error updating event:", error)
      Alert.alert("Error", error?.detail?.[0]?.msg || "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingOptions) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary_600} />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.pageContainer}>
      <View style={styles.screenTopHeader}>
        <Pressable 
          onPress={() => navigation.goBack()} 
          style={{ padding: 8 }}
        >
          <Image
            source={require("../../assets/chevron_icons/chevron_left.png")}
            style={{ width: 20, height: 20 }}
          />
        </Pressable>
        <Text style={styles.screenTopHeaderLabel}>Edit Event</Text>
      </View>

      <ScrollView contentContainerStyle={styles.createEventScrollContent}>
        <Field label="Event Title" required>
          <UserInput inputValue={title} placeholder="Enter title" onChangeInputText={setTitle} />
        </Field>

        <Field label="Description">
          <UserInput
            inputValue={description}
            placeholder="Enter description"
            onChangeInputText={setDescription}
            containerStyle={{ height: 80 }}
            inputStyle={{ textAlignVertical: "top", paddingTop: 8 }}
          />
        </Field>

        <Field label="Event Type" required>
          <Dropdown
            value={eventType}
            placeholder="Select Type"
            options={eventTypeOptions}
            onSelect={setEventType}
          />
        </Field>

        <Field label="Venue" required>
          {!venueNotAvailable && (
            <UserInput inputValue={venue} placeholder="Enter venue" onChangeInputText={setVenue} />
          )}
        </Field>

        <Pressable
          style={[styles.notAvailableOption, { marginTop: -16 }]}
          onPress={() => setVenueNotAvailable(!venueNotAvailable)}
        >
          <Image
            source={
              venueNotAvailable
                ? require("../../assets/checkbox_icons/box_checked_icon.png")
                : require("../../assets/checkbox_icons/box_unchecked_icon.png")
            }
            style={{ width: 16, height: 16, marginRight: 6 }}
          />
          <Text style={styles.notAvailableText}>Venue not available</Text>
        </Pressable>


        {/* Add space if only time not available is checked and venue not available is unchecked */}
        {!venueNotAvailable && timeNotAvailable && (
          <View style={{ height: 12 }} />
        )}
        {/* Add space if both not available are checked */}
        {venueNotAvailable && timeNotAvailable && (
          <View style={{ height: 12 }} />
        )}

        {!timeNotAvailable && (
          <>
            <Field label="Start Time" required>
              <Dropdown
                value={startTime}
                placeholder="Select Start Time"
                options={eventTimeOptions}
                onSelect={setStartTime}
              />
            </Field>
            <Field label="Select End Time" required>
              <Dropdown
                value={endTime}
                placeholder="End"
                options={eventTimeOptions}
                onSelect={setEndTime}
              />
            </Field>
          </>
        )}

        <Pressable
          style={[styles.notAvailableOption, {marginTop: -16 }]}
          onPress={() => setTimeNotAvailable(!timeNotAvailable)}
        >
          <Image
            source={
              timeNotAvailable
                ? require("../../assets/checkbox_icons/box_checked_icon.png")
                : require("../../assets/checkbox_icons/box_unchecked_icon.png")
            }
            style={{ width: 16, height: 16, marginRight: 6, }}
          />
          <Text style={styles.notAvailableText}>Time not available</Text>
        </Pressable>

        <Field label="Affected Groups" required>
          <FilterMultiSelect
            options={groupOptions}
            selectedValues={affectedGroups}
            onChange={setAffectedGroups}
            label="Select group(s)"
          />
        </Field>

        <Field label="Start Date" required>
          <DateBox
            value={startDate ? formatDate(startDate) : "Select date"}
            onPress={() => setShowStartPicker(true)}
          />
        </Field>

        <Field label="End Date" required>
          <DateBox
            value={endDate ? formatDate(endDate) : "Select date"}
            onPress={() => setShowEndPicker(true)}
          />
        </Field>

        {showStartPicker && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display="default"
            onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
              setShowStartPicker(false)
              if (selectedDate) setStartDate(selectedDate)
            }}
          />
        )}
        {showEndPicker && (
          <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            display="default"
            onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
              setShowEndPicker(false)
              if (selectedDate) setEndDate(selectedDate)
            }}
          />
        )}

        <View style={{ marginTop: 24 }}>
          <Button
            buttonTitle={submitting ? "Saving Changes..." : "Save Changes"}
            onPressButton={handleUpdateEvent}
            disabled={submitting}
            width={"100%"}
            height={48}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function Field({ label, children, marginBottom = 12, required = false }: {
  label: string
  children: React.ReactNode
  marginBottom?: number
  required?: boolean
}) {
  return (
    <View style={{ marginBottom }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.createEventFormFieldLabel}>{label}</Text>
        {required && <Text style={styles.mandatoryField}>*</Text>}
      </View>
      {children}
    </View>
  )
}
