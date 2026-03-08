import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, Alert, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart } from "react-native-chart-kit";
import { colors } from "../styles/colors";
import { getParentStudents, getTeacherStudents } from "../services/result";
import { fetchTermOptions } from "../services/lookup";
import Dropdown from "../atoms/Dropdown";
import Button from "../atoms/Button";
import { ENV } from "../config/environment";
import { styles as globalStyles } from "../styles/styles";
import PerformanceForm from "./PerformanceForm";

const screenWidth = Dimensions.get("window").width;

export default function DashboardForm() {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<{ label: string; value: string }[]>([]);
  const [termOptions, setTermOptions] = useState<{ label: string; value: string }[]>([]);
  const [subjectOptions, setSubjectOptions] = useState<{ label: string; value: string }[]>([]);
  
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedStartTerm, setSelectedStartTerm] = useState("");
  const [selectedEndTerm, setSelectedEndTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("Overall");

  const [progressData, setProgressData] = useState<{ labels: string[]; datasets: { data: number[] }[] } | null>(null);
  const [trends, setTrends] = useState<string[]>([]);
  const [viewClicked, setViewClicked] = useState(false);

  const currentUser = (global as any).loggedInUser;

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const fetchStudents = currentUser?.role === 'user' ? getParentStudents : getTeacherStudents;
        
        const [studentData, terms] = await Promise.all([
          fetchStudents(currentUser.id),
          fetchTermOptions()
        ]);
        setStudents(studentData.map((s: any) => ({
          label: `${s.first_name} ${s.last_name}`,
          value: s.id.toString(),
        })));
        setTermOptions(terms);
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };
    loadInitialData();
  }, []);

  const fetchStudentSubjects = async (studentId: string) => {
    try {
      const response = await fetch(`${ENV.API_BASE_URL}/result/student_subjects/${studentId}`);
      if (!response.ok) throw new Error("Failed to fetch subjects");
      const subjects: string[] = await response.json();
      const options = [
        { label: "Overall Percentage (%)", value: "Overall" },
        ...subjects.map(s => ({ label: s, value: s }))
      ];
      setSubjectOptions(options);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setSubjectOptions([{ label: "Overall Percentage (%)", value: "Overall" }]);
    }
  };

  useEffect(() => {
    if (selectedStudent) {
      fetchStudentSubjects(selectedStudent);
    }
  }, [selectedStudent]);

  const handleFetchProgress = async () => {
    if (!selectedStudent || !selectedStartTerm || !selectedEndTerm) {
      const studentLabel = currentUser?.role === 'user' ? "child" : "student";
      Alert.alert("Selection Required", `Please select a ${studentLabel} and both start and end terms.`);
      return;
    }

    setLoading(true);
    try {
      const url = `${ENV.API_BASE_URL}/result/historical/${selectedStudent}?subject_name=${encodeURIComponent(selectedSubject)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch historical data");
      const data = await response.json();

      if (data && data.length > 0) {
        // Find indices in global termOptions to slice correctly
        const startIndex = termOptions.findIndex(t => t.value === selectedStartTerm);
        const endIndex = termOptions.findIndex(t => t.value === selectedEndTerm);
        
        if (startIndex > endIndex) {
            Alert.alert("Invalid Range", "The start term cannot be after the end term.");
            setLoading(false);
            return;
        }

        // Filter and sort by term existence in termOptions
        const filteredData = data.filter((d: any) => {
            const currentTermIndex = termOptions.findIndex(t => t.value === d.term);
            return currentTermIndex >= startIndex && currentTermIndex <= endIndex;
        }).sort((a: any, b: any) => {
            return termOptions.findIndex(t => t.value === a.term) - termOptions.findIndex(t => t.value === b.term);
        });

        if (filteredData.length === 0) {
            setProgressData(null);
            Alert.alert("Notice", "No data found for the selected term range.");
        } else {
            const labels = filteredData.map((d: any) => {
                const parts = d.term.split(' ');
                // Format: "Y25 T1"
                const t = parts[1] === "Term" ? `T${parts[2]}` : parts[1];
                const ay = parts[0].slice(4);
                return `Y${ay} ${t}`;
            });
            const scores = filteredData.map((d: any) => d.score);
            const trendData = filteredData.map((d: any) => d.trend || "neutral");

            setProgressData({
              labels,
              datasets: [{ data: scores }]
            });
            setTrends(trendData);
            setViewClicked(true);
        }
      } else {
        setProgressData(null);
        Alert.alert("No Data", "No historical records matches this criteria.");
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
      setProgressData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      {!viewClicked ? (
        <>
            <View style={localStyles.selectionHeader}>
                <Text style={localStyles.headerTitle}>Analytics Dashboard</Text>
                <Text style={localStyles.headerSubtitle}>Monitor academic growth and identify performance shifts.</Text>
            </View>

            <ScrollView 
                style={{ paddingHorizontal: 24 }}
                contentContainerStyle={{ paddingVertical: 12 }}
            >
                <View style={localStyles.selectionBox}>
                    <View style={localStyles.inputGroup}>
                        <Text style={localStyles.dropdownLabel}>
                            {currentUser?.role === 'user' ? 'CHILD:' : 'STUDENT:'}
                        </Text>
                        <Dropdown 
                            placeholder={currentUser?.role === 'user' ? "Select Child" : "Select Student"}
                            options={students}
                            value={selectedStudent}
                            onSelect={setSelectedStudent}
                            containerStyle={localStyles.dropdownContainer}
                        />
                    </View>

                    <View style={localStyles.inputGroup}>
                        <Text style={localStyles.dropdownLabel}>SUBJECT:</Text>
                        <Dropdown 
                            placeholder="Select Subject"
                            options={subjectOptions}
                            value={selectedSubject}
                            onSelect={setSelectedSubject}
                            containerStyle={localStyles.dropdownContainer}
                            disabled={!selectedStudent}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={[localStyles.inputGroup, { width: '48%' }]}>
                            <Text style={localStyles.dropdownLabel}>START TERM:</Text>
                            <Dropdown 
                                placeholder="From"
                                options={termOptions}
                                value={selectedStartTerm}
                                onSelect={setSelectedStartTerm}
                                containerStyle={localStyles.dropdownContainer}
                            />
                        </View>
                        <View style={[localStyles.inputGroup, { width: '48%' }]}>
                            <Text style={localStyles.dropdownLabel}>END TERM:</Text>
                            <Dropdown 
                                placeholder="To"
                                options={termOptions}
                                value={selectedEndTerm}
                                onSelect={setSelectedEndTerm}
                                containerStyle={localStyles.dropdownContainer}
                            />
                        </View>
                    </View>

                    <Button 
                        buttonTitle={loading ? "Analyzing..." : "Generate Insights"}
                        onPressButton={handleFetchProgress}
                        disabled={loading || !selectedStudent}
                        buttonStyle={localStyles.fetchButton}
                    />
                </View>
            </ScrollView>
        </>
      ) : (
        <PerformanceForm 
          selectedSubject={selectedSubject}
          progressData={progressData}
          trends={trends}
          onAdjustSelection={() => setViewClicked(false)}
        />
      )}
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({

  selectionHeader: {
    padding: 24,
    paddingTop: 30,
    paddingBottom: 8,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.gray_800,
    textAlign: "center",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.gray_500,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 10,
    marginTop: 4,
  },
  selectionBox: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  dropdownLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.gray_500,
    marginBottom: 8,
    marginLeft: 2,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  dropdownContainer: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: colors.gray_300,
    borderRadius: 10,
  },
  fetchButton: {
    backgroundColor: colors.primary_700,
    borderRadius: 10,
    height: 52,
    marginTop: 8,
    width: "100%",
  }
});
