import { View, Text, Pressable, Image, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import Dropdown from "../atoms/Dropdown";
import Button from "../atoms/Button";
import UserInput from "../atoms/UserInput";
import DateBox from "../atoms/DateBox";
import FilterMultiSelect from "../atoms/FilterMultiSelect";
import { colors } from "../styles/colors";

export default function CreateEventForm() {
  const navigation = useNavigation<any>();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState("meeting");
  const [affectedGroups, setAffectedGroups] = useState<string[]>([]);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const formatDate = (date: Date) =>
    `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}/${date.getFullYear()}`;

  const handleCreateEvent = () => {
    if (!title || !startDate) {
      Alert.alert("Error", "Title and start date are required");
      return;
    }

    if (endDate && endDate < startDate) {
      Alert.alert("Error", "End date cannot be before start date");
      return;
    }

    // Show success alert only
    Alert.alert("Success", "Event created", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background_color }}>
      {/* Header */}
      <View
        style={{
          height: 54,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          backgroundColor: colors.gray_50,
          borderBottomWidth: 1,
          borderBottomColor: colors.gray_200,
        }}
      >
        <Pressable onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          <Image
            source={require("../../assets/chevron_icons/chevron_left.png")}
            style={{ width: 20, height: 20 }}
          />
        </Pressable>

        <Text
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 18,
            fontWeight: "600",
            marginRight: 32,
          }}
        >
          Create Event
        </Text>
      </View>

      {/* Form */}
      <ScrollView
        contentContainerStyle={{
          paddingTop: 28,
          paddingHorizontal: 28,
          paddingBottom: 12,
        }}
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
          <Dropdown
            value={eventType}
            placeholder="Select Event Type"
            options={[
              { label: "Meeting", value: "meeting" },
              { label: "Holiday", value: "holiday" },
              { label: "Exam", value: "exam" },
              { label: "Announcement", value: "announcement" },
              { label: "Other", value: "other" },
            ]}
            onSelect={setEventType}
          />
        </Field>

        <Field label="Affected Group(s)">
          <FilterMultiSelect
            label="Select group(s)"
            options={[
              { label: "Secondary 1", value: "sec1" },
              { label: "Secondary 2", value: "sec2" },
              { label: "Secondary 3", value: "sec3" },
              { label: "Secondary 4", value: "sec4" },
            ]}
            selectedValues={affectedGroups}
            onChange={setAffectedGroups}
          />
        </Field>

        {/* Start Date with increased marginBottom to increase gap above End Date */}
        <Field label="Start Date" marginBottom={24}>
          <DateBox
            label={startDate ? formatDate(startDate) : "Select date"}
            onPress={() => setShowStartPicker(true)}
          />
        </Field>

        <Field label="End Date (optional)" marginBottom={32}>
          <DateBox
            label={endDate ? formatDate(endDate) : "Select date"}
            onPress={() => setShowEndPicker(true)}
          />
        </Field>

        <Button
          buttonTitle="Create Event"
          onPressButton={handleCreateEvent}
          width="100%"
          height={48}
        />
      </ScrollView>

      {/* Pickers */}
      {showStartPicker && (
        <DateTimePicker
          value={startDate ?? new Date()}
          mode="date"
          display="calendar"
          onChange={(_: DateTimePickerEvent, date?: Date) => {
            setShowStartPicker(false);
            if (date) setStartDate(date);
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate ?? new Date()}
          mode="date"
          display="calendar"
          onChange={(_: DateTimePickerEvent, date?: Date) => {
            setShowEndPicker(false);
            if (!date) return;
            if (startDate && date < startDate) {
              Alert.alert("Invalid date", "End date cannot be before start date");
              return;
            }
            setEndDate(date);
          }}
        />
      )}
    </SafeAreaView>
  );
}

function Field({
  label,
  children,
  marginBottom = 12,
}: {
  label: string;
  children: React.ReactNode;
  marginBottom?: number;
}) {
  return (
    <View style={{ marginBottom }}>
      <Text style={{ marginBottom: 6, marginLeft: 2 }}>{label}</Text>
      {children}
    </View>
  );
}
