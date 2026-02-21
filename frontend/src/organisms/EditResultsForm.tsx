import { useState } from "react";
import { View, Text, Pressable, Image, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import UserInput from "../atoms/UserInput";
import Dropdown from "../atoms/Dropdown";
import Button from "../atoms/Button";
import { styles } from "../styles/styles";

interface EditResultsFormProps {
  studentId: number;
}

const subjectOptions = [
  { label: "English", value: "English" },
  { label: "Mathematics", value: "Mathematics" },
  { label: "Science", value: "Science" },
  { label: "Mother Tongue", value: "Mother Tongue" },
  { label: "History", value: "History" },
  { label: "Geography", value: "Geography" },
  { label: "Literature", value: "Literature" },
];

const termOptions = [
  { label: "Term 1", value: "Term 1" },
  { label: "Term 2", value: "Term 2" },
  { label: "Term 3", value: "Term 3" },
  { label: "Term 4", value: "Term 4" },
  { label: "CA1", value: "CA1" },
  { label: "CA2", value: "CA2" },
  { label: "SA1", value: "SA1" },
  { label: "SA2", value: "SA2" },
];

export default function EditResultsForm({ studentId }: EditResultsFormProps) {
  const navigation = useNavigation<any>();

  // New Result Form State
  const [subject, setSubject] = useState("");
  const [term, setTerm] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [score, setScore] = useState("");
  const [grade, setGrade] = useState("");

  const handleSave = () => {
    // UI logic only: console log or alert for now
    console.log(`Adding result for student ${studentId}:`, {
      subject,
      term,
      year,
      score,
      grade,
    });
    navigation.navigate("Results");
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.screenTopHeader}>
        <Pressable 
          onPress={() => navigation.navigate("Results")} 
          style={{ padding: 8 }}
        >
          <Image
            source={require("../../assets/chevron_icons/chevron_left.png")}
            style={{ width: 24, height: 24 }}
          />
        </Pressable>
        <Text style={styles.screenTopHeaderLabel}>View/Edit Results</Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.createEventScrollContent,
          { paddingBottom: 40 },
        ]}
      >
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#333",
              marginBottom: 4,
            }}
          >
            Student Result Entry
          </Text>
          <Text style={{ fontSize: 14, color: "#666", marginBottom: 16 }}>
            Entering results for Student ID: {studentId}
          </Text>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={styles.createEventFormFieldLabel}>Subject</Text>
          <Dropdown
            placeholder="Select Subject"
            options={subjectOptions}
            value={subject}
            onSelect={setSubject}
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={styles.createEventFormFieldLabel}>Term</Text>
          <Dropdown
            placeholder="Select Term"
            options={termOptions}
            value={term}
            onSelect={setTerm}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <View style={{ width: "45%" }}>
            <Text style={styles.createEventFormFieldLabel}>Year</Text>
            <UserInput
              inputValue={year}
              placeholder="Year"
              onChangeInputText={setYear}
            />
          </View>
          <View style={{ width: "45%" }}>
            <Text style={styles.createEventFormFieldLabel}>Score (0-100)</Text>
            <UserInput
              inputValue={score}
              placeholder="Score"
              onChangeInputText={setScore}
            />
          </View>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={styles.createEventFormFieldLabel}>Grade (Optional)</Text>
          <UserInput
            inputValue={grade}
            placeholder="e.g. A1, B3, Pass"
            onChangeInputText={setGrade}
          />
        </View>

        <Button
          buttonTitle="Save Result"
          onPressButton={handleSave}
          buttonStyle={{ marginTop: 10 }}
        />
      </ScrollView>
    </View>
  );
}
