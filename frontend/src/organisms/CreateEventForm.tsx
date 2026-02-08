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

import { fetchEventTypeOptions, fetchAffectedGroupOptions } from "../services/lookup"
import type { DropdownOption } from "../types/types"
import { ENV } from "../config/environment"
import { styles } from "../styles/styles"


export default function CreateEventForm() {
  const navigation = useNavigation<any>()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [eventType, setEventType] = useState<string | null>(null)
  const [affectedGroups, setAffectedGroups] = useState<string[]>([])
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [showStartPicker, setShowStartPicker] = useState(false)
  const [showEndPicker, setShowEndPicker] = useState(false)
  const [eventTypeOptions, setEventTypeOptions] = useState<DropdownOption[]>([])
  const [groupOptions, setGroupOptions] = useState<DropdownOption[]>([])
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function loadOptions() {
      try {
        setLoadingOptions(true)
        const [types, groups] = await Promise.all([
          fetchEventTypeOptions(),
          fetchAffectedGroupOptions(),
        ])
        setEventTypeOptions(types)
        setGroupOptions(groups)
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

  const handleCreateEvent = async () => {
    if (!title || !startDate || !endDate || !eventType || affectedGroups.length === 0) {
      Alert.alert("Error", "Please fill in all required fields")
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
          event_type: eventType,
          affected_groups: affectedGroups[0],
          start_datetime: startDate.toISOString(),
          end_datetime: endDate.toISOString(),
          created_by: 1, 
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
        <Text style={styles.screenTopHeaderLabel}> Create Event</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.createEventScrollContent}
      >
        <Field label="Title">
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

        <Field label="Event Type">
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

        <Field label="Affected Group(s)">
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

        <Field label="Start Date" marginBottom={24}>
          <DateBox
            label={startDate ? formatDate(startDate) : "Select date"}
            onPress={() => setShowStartPicker(true)}
          />
        </Field>

        <Field label="End Date" marginBottom={32}>
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

      {/* Date Pickers */}
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


function Field({ label, children, marginBottom = 12}: {
  label: string
  children: React.ReactNode
  marginBottom?: number
}) {
  return (
    <View style={{ marginBottom }}>
      <Text style={styles.createEventFormFieldLabel}>{label}</Text>
      {children}
    </View>
  )
}
