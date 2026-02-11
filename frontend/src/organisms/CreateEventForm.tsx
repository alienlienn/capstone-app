import { useState, useEffect } from "react"
import { View, Text, Pressable, Image, Alert, ScrollView, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker"

import Dropdown from "../atoms/Dropdown"
import FilterMultiSelect from "../atoms/FilterMultiSelect"
import UserInput from "../atoms/UserInput"
import DateBox from "../atoms/DateBox"
import Button from "../atoms/Button"
import { colors } from "../styles/colors"

import { fetchEventTypeOptions, fetchAffectedGroupOptions, fetchEventTimeOptions } from "../services/lookup"
import type { DropdownOption } from "../types/types"
import { styles } from "../styles/styles"

import { ENV } from "../config/environment"


export default function CreateEventForm() {
  const navigation = useNavigation<any>()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [eventType, setEventType] = useState<string | null>(null)
  const [venue, setVenue] = useState("")
  const [venueNotAvailable, setVenueNotAvailable] = useState(false)
  const [timeNotAvailable, setTimeNotAvailable] = useState(false)
  const [startTime, setStartTime] = useState<string | null>(null)
  const [endTime, setEndTime] = useState<string | null>(null)
  const [affectedGroups, setAffectedGroups] = useState<string[]>([])
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
      } catch (error) {
        console.error("Error loading event options:", error)
        Alert.alert("Error", "Failed to load event options")
      } finally {
        setLoadingOptions(false)
      }
    }
    loadOptions()
  }, [])

  const formatDate = (date: Date) =>
    `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`

  const formatDateToISO = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}T00:00:00`
  }

  const handleCreateEvent = async () => {
    if (!title || !startDate || !endDate || !eventType || affectedGroups.length === 0) {
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

    try {
      const response = await fetch(`${ENV.API_BASE_URL}/event/add_event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          school_id: 1,
          title,
          description,
          venue: venueNotAvailable ? null : venue,
          event_type: eventType,
          affected_groups: affectedGroups[0],
          start_date: formatDateToISO(startDate),
          end_date: formatDateToISO(endDate),
          start_time: timeNotAvailable ? null : startTime,
          end_time: timeNotAvailable ? null : endTime,
          created_by: (global as any).loggedInUser?.id || 1, 
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Add event failed:", errorData)
        Alert.alert("Error", "Failed to create event")
        return
      }

      const data = await response.json()
      console.log("Event created:", data)

      setTitle("")
      setDescription("")
      setEventType(null)
      setVenue("")
      setVenueNotAvailable(false)
      setTimeNotAvailable(false)
      setStartTime(null)
      setEndTime(null)
      setAffectedGroups([])
      setStartDate(null)
      setEndDate(null)

      Alert.alert("Success", "Event created successfully", [
        { text: "OK", onPress: () => navigation.navigate("Home") },
      ])
    } catch (error) {
      console.error("Error creating event:", error)
      Alert.alert("Error", "An unexpected error occurred")
    } finally {
      setSubmitting(false)
    }
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
        <Text style={styles.screenTopHeaderLabel}>Create Event</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.createEventScrollContent}
      >
        <Field label="Title" required>
          <UserInput
            inputValue={title}
            placeholder="Event title"
            onChangeInputText={setTitle}
          />
        </Field>

        <Field label="Description">
          <UserInput
            inputValue={description}
            placeholder="Event description"
            onChangeInputText={setDescription}
            containerStyle={{ height: 80 }}
          />
        </Field>

        <Field label="Venue" required>
          {!venueNotAvailable && (
            <UserInput
              inputValue={venue}
              placeholder="Venue"
              onChangeInputText={setVenue}
            />
          )}
        </Field>

        <Pressable
          onPress={() => setVenueNotAvailable(!venueNotAvailable)}
          style={[styles.notAvailableOption, { marginTop: -16 }]}
        >
          <Image
            source={
              venueNotAvailable
                ? require("../../assets/checkbox_icons/box_checked_icon.png")
                : require("../../assets/checkbox_icons/box_unchecked_icon.png")
            }
            style={{ width: 16, height: 16, marginRight: 6 }}
          />
          <Text style={styles.notAvailableText}>
            Venue not available
          </Text>
        </Pressable>

        {!timeNotAvailable && (
          <>
            <Field label="Start Time" required>
              {loadingOptions ? (
                <ActivityIndicator color={colors.primary_600} size="small" />
              ) : (
                <Dropdown
                  value={startTime}
                  placeholder="Select Start Time"
                  options={eventTimeOptions}
                  onSelect={setStartTime}
                />
              )}
            </Field>

            <Field label="End Time" marginBottom={-4} required>
              {loadingOptions ? (
                <ActivityIndicator color={colors.primary_600} size="small" />
              ) : (
                <Dropdown
                  value={endTime}
                  placeholder="Select End Time"
                  options={eventTimeOptions}
                  onSelect={setEndTime}
                />
              )}
            </Field>

            <Pressable
              onPress={() => setTimeNotAvailable(!timeNotAvailable)}
              style={styles.notAvailableOption}
            >
              <Image
                source={
                  timeNotAvailable
                    ? require("../../assets/checkbox_icons/box_checked_icon.png")
                    : require("../../assets/checkbox_icons/box_unchecked_icon.png")
                }
                style={{ width: 16, height: 16, marginRight: 6 }}
              />
              <Text style={styles.notAvailableText}>
                Time not available
              </Text>
            </Pressable>
          </>
        )}

        {timeNotAvailable && (
          <View style={{ marginBottom: 24 }}>
            <Pressable
              onPress={() => setTimeNotAvailable(!timeNotAvailable)}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Image
                source={
                  timeNotAvailable
                    ? require("../../assets/checkbox_icons/box_checked_icon.png")
                    : require("../../assets/checkbox_icons/box_unchecked_icon.png")
                }
                style={{ width: 16, height: 16, marginRight: 6 }}
              />
              <Text style={styles.notAvailableOption}>
                Time not available
              </Text>
            </Pressable>
          </View>
        )}

        <Field label="Event Type" required>
          {loadingOptions ? (
            <ActivityIndicator color={colors.primary_600} size="small" />
          ) : (
            <Dropdown
              value={eventType}
              placeholder="Select Event Type"
              options={eventTypeOptions}
              onSelect={setEventType}
            />
          )}
        </Field>

        <Field label="Affected Group(s)" required>
          {loadingOptions ? (
            <ActivityIndicator color={colors.primary_600} size="small" />
          ) : (
            <FilterMultiSelect
              label="Select group(s)"
              options={groupOptions}
              selectedValues={affectedGroups}
              onChange={setAffectedGroups}
            />
          )}
        </Field>

        <Field label="Start Date" marginBottom={24} required>
          <DateBox
            label={startDate ? formatDate(startDate) : "Select date"}
            onPress={() => setShowStartPicker(true)}
          />
        </Field>

        <Field label="End Date" marginBottom={32} required>
          <DateBox
            label={endDate ? formatDate(endDate) : "Select date"}
            onPress={() => setShowEndPicker(true)}
          />
        </Field>

        <Button
          buttonTitle={submitting ? "Creating..." : "Create Event"}
          onPressButton={handleCreateEvent}
          width="100%"
          height={48}
          disabled={submitting}
        />
      </ScrollView>

      {showStartPicker && (
        <DateTimePicker
          value={startDate ?? new Date()}
          mode="date"
          display="calendar"
          onChange={(_: DateTimePickerEvent, date?: Date) => {
            setShowStartPicker(false)
            if (date) setStartDate(date)
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate ?? new Date()}
          mode="date"
          display="calendar"
          onChange={(_: DateTimePickerEvent, date?: Date) => {
            setShowEndPicker(false)
            if (date) setEndDate(date)
          }}
        />
      )}
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
