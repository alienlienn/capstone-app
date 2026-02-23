import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Pressable, Image, ScrollView, StyleSheet, Alert, TextInput, ActivityIndicator } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Dropdown from "../atoms/Dropdown";
import Button from "../atoms/Button";
import { colors } from "../styles/colors";
import { styles } from "../styles/styles";
import { StudentResult, StudentPerformanceSummary, DropdownOption } from "../types/types";
import { fetchTermOptions } from "../services/lookup";
import { fetchStudentResults } from "../services/result";

interface EditResultsFormProps {
  studentId: number;
}

export default function EditResultsForm({ studentId }: EditResultsFormProps) {
  const navigation = useNavigation<any>();
  const [selectedTerm, setSelectedTerm] = useState("");
  const [termOptions, setTermOptions] = useState<DropdownOption[]>([]);
  const [year, setYear] = useState("2026");
  const [loading, setLoading] = useState(false);
  const [hasExistingResults, setHasExistingResults] = useState(false);
  
  // Results form state
  const [results, setResults] = useState<StudentResult[]>([]);
  const [summary, setSummary] = useState<Partial<StudentPerformanceSummary>>({});

  useFocusEffect(
    useCallback(() => {
      setSelectedTerm("");
      setResults([]);
      setSummary({});
    }, [])
  );

  useEffect(() => {
    const getOptions = async () => {
      const options = await fetchTermOptions();
      setTermOptions(options);
    };
    getOptions();
  }, []);

  useEffect(() => {
    if (selectedTerm && studentId) {
      fetchData();
    }
  }, [selectedTerm, studentId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchStudentResults(studentId, selectedTerm);
      if (data) {
        setResults(data.results || []);
        setHasExistingResults(data.results && data.results.length > 0);
        // If summary exists, use it. If not, reset it but keep studentId and term.
        setSummary(data.summary || {
          term: selectedTerm,
          year: parseInt(year),
          student_id: studentId
        });
      } else {
        setResults([]);
        setHasExistingResults(false);
        setSummary({
          term: selectedTerm,
          year: parseInt(year),
          student_id: studentId
        });
      }
    } catch (error) {
       Alert.alert("Error", "Failed to load student results.");
       setResults([]);
       setHasExistingResults(false);
       setSummary({});
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateResult = (index: number, field: keyof StudentResult, value: any) => {
    const updatedResults = [...results];
    updatedResults[index] = { ...updatedResults[index], [field]: value };
    setResults(updatedResults);
  };

  const removeSubject = (index: number) => {
    const updatedResults = results.filter((_, i) => i !== index);
    setResults(updatedResults);
  };

  const addNewSubject = () => {
    setResults([...results, {
      student_id: studentId,
      subject: "",
      score: 0,
      max_score: 100,
      grade: "",
      remarks: "",
      term: selectedTerm,
      year: parseInt(year),
      teacher_id: (global as any).loggedInUser?.id || 0
    }]);
  };

  const handleSave = async () => {
    if (!selectedTerm) return;
    
    setLoading(true);
    try {
      // updateTermReport code removed as requested
      Alert.alert("Success", "Results update pending implementation!");
      navigation.navigate("Results");
    } catch (error) {
      Alert.alert("Error", "Failed to process results.");
    } finally {
      setLoading(false);
    }
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
          { paddingTop: 20, paddingBottom: -20 },
        ]}
      >
        <View style={localStyles.termSection}>
          <Text style={styles.createEventFormFieldLabel}>Select Term:</Text>
          <Dropdown
            placeholder="Select Term"
            options={termOptions}
            value={selectedTerm}
            onSelect={setSelectedTerm}
          />
        </View>

        {selectedTerm ? (
          loading ? (
            <View style={{ marginTop: 100 }}>
              <ActivityIndicator size="large" color={colors.primary_500} />
            </View>
          ) : results.length > 0 ? (
            <View>
              {/* Subject Details Table */}
              <View style={localStyles.sectionContainer}>
                <Text style={localStyles.sectionTitle}>Subject Results</Text>
                
                <View style={localStyles.tableHeader}>
                   <Text style={[localStyles.th, { flex: 3.5, marginRight: 4, paddingHorizontal: 6 }]}>Subject</Text>
                   <Text style={[localStyles.th, { flex: 1.1, marginRight: 4, paddingHorizontal: 6 }]}>Score</Text>
                   <Text style={[localStyles.th, { flex: 1.1, marginRight: 4, paddingHorizontal: 6 }]}>Grade</Text>
                   <View style={{ width: 24, marginLeft: 4 }} /> 
                </View>

                {results.map((res, index) => (
                  <View key={index} style={localStyles.subjectEditRow}>
                     <TextInput 
                        style={[localStyles.tableInput, { flex: 3.5 }]}
                        value={res.subject}
                        onChangeText={(val) => handleUpdateResult(index, "subject", val)}
                        placeholder="Subject"
                      />
                     <TextInput 
                        style={[localStyles.tableInput, { flex: 1.1 }]}
                        value={res.score?.toString()}
                        keyboardType="numeric"
                        onChangeText={(val) => handleUpdateResult(index, "score", parseFloat(val))}
                        placeholder="Score"
                      />
                     <TextInput 
                        style={[localStyles.tableInput, { flex: 1.1 }]}
                        value={res.grade}
                        onChangeText={(val) => handleUpdateResult(index, "grade", val)}
                        placeholder="A1"
                      />
                     <Pressable 
                        onPress={() => removeSubject(index)} 
                        style={{ padding: 4, justifyContent: "center" }}
                      >
                       <Image 
                          source={require("../../assets/remove_icon.png")} 
                          style={{ width: 16, height: 16, tintColor: colors.error }} 
                        />
                     </Pressable>
                  </View>
                ))}

                <Pressable style={localStyles.addSubjectBtn} onPress={addNewSubject}>
                  <Text style={localStyles.addSubjectText}>+ Add New Subject</Text>
                </Pressable>
              </View>

              {/* Summary Data Section */}
              <View style={[localStyles.sectionContainer, { marginTop: 20 }]}>
                 <Text style={localStyles.sectionTitle}>Performance Summary</Text>
                 <View style={localStyles.row}>
                   <View style={localStyles.halfWidth}>
                     <Text style={localStyles.smallLabel}>Overall %</Text>
                     <TextInput 
                        style={localStyles.input}
                        value={summary.overall_percentage?.toString()}
                        keyboardType="numeric"
                        onChangeText={(val) => setSummary({...summary, overall_percentage: parseFloat(val)})}
                        placeholder="e.g. 89.4"
                      />
                   </View>
                   <View style={localStyles.halfWidth}>
                     <Text style={localStyles.smallLabel}>Class Rank</Text>
                     <TextInput 
                        style={localStyles.input}
                        value={summary.class_position?.toString()}
                        keyboardType="numeric"
                        onChangeText={(val) => setSummary({...summary, class_position: parseInt(val)})}
                        placeholder="e.g. 6"
                      />
                   </View>
                 </View>

                 <View style={localStyles.row}>
                   <View style={localStyles.halfWidth}>
                     <Text style={localStyles.smallLabel}>Attendance (Present)</Text>
                     <TextInput 
                        style={localStyles.input}
                        value={summary.attendance_present?.toString()}
                        keyboardType="numeric"
                        onChangeText={(val) => setSummary({...summary, attendance_present: parseInt(val)})}
                        placeholder="e.g. 96"
                      />
                   </View>
                 </View>

                 <View style={localStyles.row}>
                   <View style={localStyles.halfWidth}>
                     <Text style={localStyles.smallLabel}>L1R4</Text>
                     <TextInput 
                        style={localStyles.input}
                        value={summary.l1r4?.toString()}
                        keyboardType="numeric"
                        onChangeText={(val) => setSummary({...summary, l1r4: parseInt(val)})}
                        placeholder="e.g. 12"
                      />
                   </View>
                   <View style={localStyles.halfWidth}>
                     <Text style={localStyles.smallLabel}>L1R5</Text>
                     <TextInput 
                        style={localStyles.input}
                        value={summary.l1r5?.toString()}
                        keyboardType="numeric"
                        onChangeText={(val) => setSummary({...summary, l1r5: parseInt(val)})}
                        placeholder="e.g. 15"
                      />
                   </View>
                 </View>
                 
                 <View style={{ marginTop: 12 }}>
                    <Text style={localStyles.smallLabel}>Teacher's Comments</Text>
                     <TextInput 
                        style={[localStyles.input, { height: 80, textAlignVertical: "top", paddingTop: 8 }]}
                        value={summary.teacher_comments}
                        multiline
                        onChangeText={(val) => setSummary({...summary, teacher_comments: val})}
                        placeholder="Enter overall student feedback..."
                      />
                 </View>
              </View>

               <Button
                  buttonTitle="Update All Results"
                  onPressButton={handleSave}
                  buttonStyle={localStyles.saveButton}
                  disabled={loading}
                />

               {!hasExistingResults && (
                 <Button
                    buttonTitle="Cancel"
                    onPressButton={() => {
                        setResults([]);
                        setSummary({
                          term: selectedTerm,
                          year: parseInt(year),
                          student_id: studentId
                        });
                    }}
                    buttonStyle={localStyles.cancelButton}
                    textStyle={localStyles.cancelButtonText}
                  />
               )}
            </View>
          ) : (
            <View style={localStyles.emptyResultsContainer}>
               <Image 
                 source={require("../../assets/result_icon.png")} 
                 style={{ width: 80, height: 80, tintColor: colors.gray_300 }} 
               />
               <Text style={localStyles.emptyResultsTitle}>Results not yet entered</Text>
               <Text style={localStyles.emptyResultsSub}>Results for the selected term have not been entered yet.</Text>
               
               <Pressable style={localStyles.startEntryBtn} onPress={addNewSubject}>
                 <Text style={localStyles.startEntryText}>+  Start Entering Results Manually</Text>
               </Pressable>
            </View>
          )
        ) : (
          <View style={localStyles.noSelectionContainer}>
            <Image 
               source={require("../../assets/calendar_icon.png")} 
               style={{ width: 120, height: 120, opacity: 0.3 }}
            />
            <Text style={localStyles.noSelectionText}>Please select a term to begin viewing or editing grades.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  termSection: {
    marginBottom: 8,
  },
  sectionContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary_850,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  halfWidth: {
    width: "48%",
  },
  smallLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: "#333",
  },
  tableHeader: {
    flexDirection: "row",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    marginBottom: 8,
  },
  th: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#888",
  },
  subjectEditRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tableInput: {
    borderWidth: 1,
    borderColor: "#F0F0F0",
    backgroundColor: "#FAFAFA",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 4,
    fontSize: 13,
    marginRight: 4,
  },
  addSubjectBtn: {
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 8,
  },
  addSubjectText: {
    color: colors.primary_500,
    fontWeight: "600",
  },
  saveButton: {
    width: "100%",
    marginTop: 32,
    backgroundColor: colors.primary_500,
  },
  cancelButton: {
    width: "100%",
    marginTop: 12,
    backgroundColor: colors.gray_200,
  },
  cancelButtonText: {
    color: colors.primary_850,
  },
  noSelectionContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
  },
  noSelectionText: {
    color: colors.gray_500,
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 16,
    paddingHorizontal: 40,
  },
  emptyResultsContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    backgroundColor: "white",
    padding: 30,
    borderRadius: 16,
    marginHorizontal: 10,
    elevation: 1,
  },
  emptyResultsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary_850,
    marginTop: 16,
  },
  emptyResultsSub: {
    fontSize: 14,
    color: colors.gray_500,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  startEntryBtn: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.primary_500,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  startEntryText: {
    color: colors.primary_500,
    fontWeight: "600",
    textAlign: "center",
  }
});

