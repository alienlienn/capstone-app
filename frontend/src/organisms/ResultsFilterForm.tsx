import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ActivityIndicator, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Dropdown from "../atoms/Dropdown";
import UserInput from "../atoms/UserInput";
import StudentCard from "../molecules/StudentCard";
import Button from "../atoms/Button";
import { colors } from "../styles/colors";
import { ENV } from "../config/environment";
import { styles } from "../styles/styles";

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  assigned_groups: string | null;
  school_id: number;
}

interface ResultsFilterFormProps {
  onFilterChange: (filter: { level: string; search: string }) => void;
  initialLevel?: string;
  initialSearch?: string;
}

export default function ResultsFilterForm({
  onFilterChange,
  initialLevel = "all levels",
  initialSearch = "",
}: ResultsFilterFormProps) {
  const navigation = useNavigation<any>();
  const [selectedLevel, setSelectedLevel] = useState(initialLevel);
  const [searchText, setSearchText] = useState(initialSearch);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  const currentUser = (global as any).loggedInUser;
  const isUserNotUser = currentUser?.role !== "user";

  useEffect(() => {
    if (isUserNotUser && currentUser?.id) {
      const fetchStudents = async () => {
        setLoading(true);
        try {
          // Pointing to /result/ endpoint instead of /account/
          const response = await fetch(
            `${ENV.API_BASE_URL}/result/get_teacher_students/${currentUser.id}`,
          );
          if (response.ok) {
            const data = await response.json();
            setStudents(data);
          }
        } catch (error) {
          console.error("Error fetching teacher students:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchStudents();
    }
  }, [isUserNotUser, currentUser?.id]);

  if (!isUserNotUser) {
    return null;
  }

  const levelOptions = [
    { label: "All Levels", value: "all levels" },
    { label: "Secondary 1", value: "secondary 1" },
    { label: "Secondary 2", value: "secondary 2" },
    { label: "Secondary 3", value: "secondary 3" },
    { label: "Secondary 4", value: "secondary 4" },
    { label: "Secondary 5", value: "secondary 5" },
  ];

  const handleLevelSelect = (value: string) => {
    setSelectedLevel(value);
    onFilterChange({ level: value, search: searchText });
  };

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    onFilterChange({ level: selectedLevel, search: text });
  };

  const filteredStudents = students.filter((student) => {
    const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchText.toLowerCase());

    if (selectedLevel === "all levels") {
      return matchesSearch;
    }

    // Must match assigned_groups
    if (!student.assigned_groups) {
      return false;
    }

    // Comparison is case-insensitive, assuming comma-separated or similar
    const groups = student.assigned_groups
      .toLowerCase()
      .split(",")
      .map((g) => g.trim());
    
    // Logic: if level is selected, check if student belongs to that level
    const matchesLevel = groups.some((g) =>
      g.includes(selectedLevel.toLowerCase()),
    );

    return matchesLevel && matchesSearch;
  });

  return (
    <SafeAreaView edges={["top"]}>
      <View style={localStyles.formContainer}>
        <Dropdown
          value={selectedLevel}
          placeholder="Select Level"
          options={levelOptions}
          onSelect={handleLevelSelect}
        />

        <View style={[styles.eventSearchRow, { marginTop: 12 }]}>
          <View style={styles.eventSearchContainer}>
            <UserInput
              containerStyle={styles.eventCustomSearchBox}
              inputValue={searchText}
              placeholder="Search Student Name"
              onChangeInputText={handleSearchChange}
              inputStyle={styles.eventSearchText}
            />
            <Image
              source={require("../../assets/search_icon.png")}
              style={styles.eventSearchIcon}
            />
          </View>
        </View>

        <View style={localStyles.uploadSection}>
            <Button 
                buttonTitle="Upload Results (Excel)"
                onPressButton={() => Alert.alert("Upload", "Bulk Excel Upload feature coming soon!")}
                buttonStyle={localStyles.uploadButton}
                iconSource={require("../../assets/result_icon.png")}
            />
        </View>

        <View style={localStyles.studentsList}>
          <Text style={[localStyles.studentListHeader, {marginLeft: 2}]}>
            Select a student to view/edit their results:
          </Text>
          {loading ? (
            <ActivityIndicator size="small" color={colors.primary_500} />
          ) : filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <StudentCard
                key={student.id}
                id={student.id}
                firstName={student.first_name}
                lastName={student.last_name || ""}
                onPress={() => navigation.navigate("EditResults", { studentId: student.id })}
              />
            ))
          ) : (
            <Text style={localStyles.noStudents}>
              No students found for this level.
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}


const localStyles = StyleSheet.create({
  formContainer: {
    width: "97%",
		alignSelf: "center",
  },
  studentsList: {
    marginTop: 20,
  },
  studentListHeader: {
    fontSize: 14,
    fontStyle: "italic",
    color: colors.primary_850,
    marginBottom: 8,
  },
  noStudents: {
    fontSize: 12,
    color: colors.gray_500,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 20,
  },
  uploadSection: {
    marginTop: 4,
    paddingBottom: 20,
    alignItems: "center",
  },
  uploadButton: {
    backgroundColor: colors.primary_500,
    width: "97%",
  }
});
