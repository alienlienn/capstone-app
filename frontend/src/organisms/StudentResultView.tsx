import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Text, Image, ScrollView, DimensionValue, ActivityIndicator, Alert, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { colors } from "../styles/colors";
import { StudentPerformanceSummary, StudentResult, DropdownOption } from "../types/types";
import { getParentStudents, fetchStudentResults } from "../services/result";
import { fetchTermOptions } from "../services/lookup";
import Dropdown from "../atoms/Dropdown";
import Button from "../atoms/Button";
import { styles } from "../styles/styles";

interface StudentResultViewProps {
  summary?: StudentPerformanceSummary | null;
  results?: StudentResult[];
}

export default function StudentResultView({ summary: initialSummary, results: initialResults }: StudentResultViewProps) {
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedTerm, setSelectedTerm] = useState<string>("");
  const [students, setStudents] = useState<DropdownOption[]>([]);
  const [termOptions, setTermOptions] = useState<DropdownOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState<{
    summary: StudentPerformanceSummary | null, 
    results: StudentResult[],
    studentInfo?: {
      nric: string;
      date_of_birth: string | null;
      assigned_groups: string | null;
      school_name: string;
      teacher_name: string;
    }
  }>({ 
    summary: initialSummary || null, 
    results: initialResults || [] 
  });
  const [viewClicked, setViewClicked] = useState(!!initialResults && initialResults.length > 0);

  const currentUser = (global as any).loggedInUser;
  const isParent = currentUser?.role === "user";

  useFocusEffect(
    useCallback(() => {
      // Reset to selection screen when tab is navigated back to
      if (isParent) {
        setViewClicked(false);
        // Clear previous fetched data to ensure "very start" state
        setFetchedData({ summary: initialSummary || null, results: initialResults || [] });
      }
    }, [isParent, initialSummary, initialResults])
  );

  useEffect(() => {
    if (isParent && !initialResults) {
      const loadInitialData = async () => {
        try {
          const [studentData, termData] = await Promise.all([
            getParentStudents(currentUser.id),
            fetchTermOptions()
          ]);
          setStudents(studentData.map((s: any) => ({
             label: `${s.first_name} ${s.last_name}`,
             value: s.id.toString(),
          })));
          setTermOptions(termData);
        } catch (error) {
          console.error("Error loading selection data:", error);
        }
      };
      loadInitialData();
    }
  }, [isParent, currentUser?.id]);

  const handleFetch = async () => {
    if (!selectedStudent || !selectedTerm) {
      Alert.alert("Required", "Please select a student and term.");
      return;
    }
    setLoading(true);
    try {
      const data = await fetchStudentResults(parseInt(selectedStudent), selectedTerm);
      
      if (!data || (!data.summary && (!data.results || data.results.length === 0))) {
        Alert.alert("Notice", "Results for this term have not yet been released.");
        return;
      }

      setFetchedData({
        summary: data.summary,
        results: data.results || [],
        studentInfo: data.student_info
      });
      setViewClicked(true);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to load results.");
    } finally {
      setLoading(false);
    }
  };

  const summary = fetchedData.summary;
  const results = fetchedData.results;

  if (isParent && !viewClicked) {
    return (
      <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
          <View style={localStyles.selectionHeader}>
            <Text style={localStyles.headerTitle}>Academic Results</Text>
            <Text style={localStyles.headerSubtitle}>Select a child and term to view their performance report.</Text>
          </View>

          <View style={{ paddingHorizontal: 24 }}>
            <View style={localStyles.selectionBox}>
              <View style={localStyles.inputGroup}>
                 <Text style={localStyles.dropdownLabel}>CHILD:</Text>
                 <Dropdown 
                    placeholder="Select Child"
                    options={students}
                    value={selectedStudent}
                    onSelect={setSelectedStudent}
                    containerStyle={localStyles.dropdownContainer}
                 />
              </View>
              <View style={localStyles.inputGroup}>
                 <Text style={localStyles.dropdownLabel}>School Term:</Text>
                 <Dropdown 
                    placeholder="Select Term"
                    options={termOptions}
                    value={selectedTerm}
                    onSelect={setSelectedTerm}
                    containerStyle={localStyles.dropdownContainer}
                 />
              </View>
              <Button 
                 buttonTitle={loading ? "Generating Report..." : "View Report Card"}
                 onPressButton={handleFetch}
                 disabled={loading}
                 buttonStyle={localStyles.fetchButton}
              />
            </View>
          </View>
      </SafeAreaView>
    );
  }

  const handlePrint = async () => {
    try {
      const studentName = students.find((s) => s.value === selectedStudent)?.label || "Student Name";
      const printDate = new Date().toLocaleDateString('en-GB');
      const studentInfo = fetchedData.studentInfo;
      
      const currentYear = summary?.year || new Date().getFullYear();
      
      // Calculate Age on 1st Jan
      let ageOnJan1 = "--";
      if (studentInfo?.date_of_birth) {
        const dob = new Date(studentInfo.date_of_birth);
        const dobYear = dob.getFullYear();
        let age = currentYear - dobYear;
        // If student's date_of_birth is "yyyy-01-01", add 1 to the age
        if (dob.getMonth() === 0 && dob.getDate() === 1) {
          age += 1;
        }
        ageOnJan1 = age.toString();
      }

      // Parse Class from assigned_groups (2nd item)
      let studentClass = "--";
      if (studentInfo?.assigned_groups) {
        try {
          const groups = studentInfo.assigned_groups.split(',').map(g => g.trim());
          if (groups.length >= 2) {
             // Example: "secondary 4-4" -> "4-4"
             studentClass = groups[1].replace(/secondary\s+/i, '');
          } else if (groups.length === 1) {
             studentClass = groups[0].replace(/secondary\s+/i, '');
          }
        } catch (e) {
          console.log("Error parsing groups", e);
        }
      }

      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #000; }
              .header { text-align: center; margin-bottom: 40px; }
              .school-name { font-size: 24px; font-weight: bold; letter-spacing: 1px; margin: 0; text-transform: uppercase; }
              .school-country { font-size: 16px; margin: 5px 0 20px 0; text-transform: uppercase; }
              .report-title { font-size: 18px; font-weight: bold; margin-bottom: 30px; }
              
              .info-table { width: 100%; margin-bottom: 20px; font-size: 14px; border: none; }
              .info-table td { padding: 4px; border: none; vertical-align: top; }
              
              .results-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px; }
              .results-table th, .results-table td { padding: 8px; text-align: left; }
              .results-table th { border-top: 2px solid #000; border-bottom: 1px solid #000; font-weight: bold; }
              .results-table td { border: none; }
              .results-table tr.last-row td { border-bottom: 2px solid #000; }
              
              .summary-container { display: flex; justify-content: space-between; font-size: 14px; margin-top: 10px; }
              .summary-left, .summary-right { width: 48%; }
              .summary-row { display: flex; margin-bottom: 5px; }
              .summary-label { width: 150px; font-weight: bold; }
              
              .comments-section { margin-top: 40px; font-size: 14px; }
              .comments-title { font-weight: bold; margin-bottom: 10px; text-decoration: underline; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 class="school-name">${studentInfo?.school_name || 'SCHOOL NAME'}</h1>
              <p class="school-country">SINGAPORE</p>
              <h2 class="report-title">Examination Results</h2>
            </div>

            <table class="info-table">
              <tr>
                <td style="width: 150px; font-weight: bold;">Name</td>
                <td>: <span style="text-transform: uppercase;">${studentName}</span></td>
                <td style="width: 150px; font-weight: bold;">Date</td>
                <td>: ${printDate}</td>
              </tr>
              <tr>
                <td style="font-weight: bold;">Age on 1st Jan</td>
                <td>: ${ageOnJan1}</td>
                <td style="font-weight: bold;">Identification No.</td>
                <td>: ${studentInfo?.nric || '--'}</td>
              </tr>
              <tr>
                <td style="font-weight: bold;">Class</td>
                <td>: ${studentClass}</td>
                <td style="font-weight: bold;">S/N</td>
                <td>: ${summary?.student_id || selectedStudent || '--'}</td>
              </tr>
              <tr>
                <td style="font-weight: bold;">Class Teacher</td>
                <td colspan="3">: <span style="text-transform: uppercase;">${studentInfo?.teacher_name || '--'}</span></td>
              </tr>
            </table>

            <table class="results-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Score</th>
                  <th>Grade</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                ${results.map((res, i) => `
                  <tr class="${i === results.length - 1 ? 'last-row' : ''}">
                    <td style="text-transform: uppercase;">${res.subject}</td>
                    <td>${res.score ?? '--'}</td>
                    <td>${res.grade ?? '--'}</td>
                    <td>${res.remarks ?? ''}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="summary-container">
              <div class="summary-left">
                <div class="summary-row">
                  <span class="summary-label">Total Mark:</span>
                  <span>${summary?.total_marks ?? 0} / ${summary?.total_max_marks ?? 0}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">Percentage:</span>
                  <span>${summary?.overall_percentage ? summary.overall_percentage.toFixed(1) : "0.0"}%</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">Class Position:</span>
                  <span>${summary?.class_position ?? '--'} / ${summary?.class_total ?? '--'}</span>
                </div>
              </div>
              <div class="summary-right">
                <div class="summary-row">
                  <span class="summary-label">L1R4 Aggregate:</span>
                  <span>${summary?.l1r4 ?? '--'}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">L1R5 Aggregate:</span>
                  <span>${summary?.l1r5 ?? '--'}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">Attendance:</span>
                  <span>${summary?.attendance_present ?? 0} / ${summary?.attendance_total ?? 0}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">Conduct:</span>
                  <span style="text-transform: uppercase;">${summary?.conduct?.replace(/_/g, ' ') ?? '--'}</span>
                </div>
              </div>
            </div>

            <div class="comments-section">
              <div class="comments-title">Teacher's Comments:</div>
              <p>${summary?.teacher_comments || "No comments available for this term."}</p>
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error("Error printing:", error);
      Alert.alert("Error", "Could not generate PDF");
    }
  };

  const renderSubjectRow = (res: StudentResult, index: number, isLast: boolean) => {
    // Subject color indicator tied to subject category
    const getCategoryColor = (category?: string) => {
      switch (category?.toLowerCase()) {
        case "languages":
          return "#4A90E2"; // Blue
        case "mathematics":
          return "#7ED321"; // Green
        case "sciences":
          return "#9013FE"; // Purple
        case "humanities":
          return "#F5A623"; // Orange
        case "electives":
          return "#50E3C2"; // Teal/Cyan
        case "others":
        default:
          return "#808080"; // Grey
      }
    };

    const indicatorColor = getCategoryColor(res.category);

    return (
      <View key={index} style={[localStyles.subjectRow, isLast && { borderBottomWidth: 0 }]}>
        <View style={localStyles.subjectNameContainer}>
          <View style={[localStyles.subjectIndicator, { backgroundColor: indicatorColor }]} />
          <Text style={localStyles.subjectText}>{res.subject}</Text>
        </View>
        <Text style={localStyles.scoreText}>
          <Text style={localStyles.boldScore}>{res.score ?? "--"}</Text> / {res.max_score ?? 100}
        </Text>
        <Text style={localStyles.gradeText}>{res.grade ?? "--"}</Text>
        <Text style={[localStyles.remarksText, { color: indicatorColor }]}>{res.remarks ?? ""}</Text>
      </View>
    );
  };

  // Safe division for attendance
  const attendancePercent =
    summary?.attendance_total && summary.attendance_total > 0
      ? Math.round((summary.attendance_present! / summary.attendance_total!) * 100)
      : 0;

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: colors.background_color }}>
      <View style={styles.screenTopHeader}>
        {isParent && (
          <Pressable 
            onPress={() => setViewClicked(false)} 
            style={{ padding: 8 }}
          >
            <Image 
               source={require("../../assets/chevron_icons/chevron_left.png")} 
               style={{ width: 20, height: 20 }}
            />
          </Pressable>
        )}
        <Text style={[styles.screenTopHeaderLabel, isParent ? { marginRight: 28 } : { flex: 1, textAlign: 'center' }]}>
          {isParent ? "Academic Results" : "Student Performance"}
        </Text>
      </View>

      <ScrollView style={localStyles.container}>
       <View style={{ width: '95%', alignSelf: 'center', paddingHorizontal: 10, }}>
        
        {/* Overview Cards Row */}
        <View style={localStyles.overviewCards}>
          {/* Overall Average */}
          <View style={localStyles.summaryCard}>
            <Text style={localStyles.cardLabel}>Overall Average</Text>
            <View style={localStyles.averageContainer}>
              <Text style={localStyles.averageValue}>
                {summary?.overall_percentage ? summary.overall_percentage.toFixed(1) : "0.0"}%
              </Text>
            </View>
            <View style={localStyles.progressBarContainer}>
              <View style={[localStyles.progressBar, { width: `${summary?.overall_percentage ?? 0}%` as DimensionValue }]} />
            </View>
          </View>

          {/* Class Position */}
          <View style={localStyles.summaryCard}>
            <Text style={localStyles.cardLabel}>Class Position</Text>
            <View style={localStyles.positionRow}>
              <Text style={localStyles.positionValue}>{summary?.class_position ?? "--"} / {summary?.class_total ?? "--"}</Text>
            </View>
            {summary?.class_position && summary.class_total && (
              summary.class_position === 1 ? (
                <View style={localStyles.topPercentBadge}>
                  <Text style={localStyles.topPercentText}>🏆 Rank 1</Text>
                </View>
              ) : summary.class_position <= 3 ? (
                <View style={localStyles.topPercentBadge}>
                  <Text style={localStyles.topPercentText}>🏆 Top 3</Text>
                </View>
              ) : summary.class_position <= 10 ? (
                <View style={localStyles.topPercentBadge}>
                  <Text style={localStyles.topPercentText}>✨ Top 10</Text>
                </View>
              ) : (summary.class_position / summary.class_total) <= 0.25 ? (
                <View style={localStyles.topPercentBadge}>
                  <Text style={localStyles.topPercentText}>📈 Top 25%</Text>
                </View>
              ) : (summary.class_position / summary.class_total) <= 0.5 ? (
                <View style={[localStyles.topPercentBadge, { backgroundColor: "#E3F2FD" }]}>
                  <Text style={[localStyles.topPercentText, { color: "#1976D2" }]}>🎖️ Merit</Text>
                </View>
              ) : (
                <View style={[localStyles.topPercentBadge, { backgroundColor: "#F1F8E9" }]}>
                  <Text style={[localStyles.topPercentText, { color: "#558B2F" }]}>💪 Solid</Text>
                </View>
              )
            )}
          </View>

          {/* Attendance Pie Placeholder */}
          <View style={localStyles.summaryCard}>
            <Text style={localStyles.cardLabel}>Attendance</Text>
            <View style={localStyles.attendanceIconContainer}>
               <View style={localStyles.circleProgress}>
                  <Text style={localStyles.attendancePercentText}>{attendancePercent}%</Text>
               </View>
            </View>
            <Text style={localStyles.attendanceSubText}>{summary?.attendance_present ?? 0}/{summary?.attendance_total ?? 0} Days</Text>
          </View>
        </View>

        {/* Subject Grades Table */}
        <View style={localStyles.resultsTable}>
          <View style={localStyles.tableHeader}>
            <View style={{ width: 11 }} />
            <Text style={localStyles.headerSubject}>Subject Grades</Text>
            <Text style={localStyles.headerScore}>Score</Text>
            <Text style={localStyles.headerGrade}>Grade</Text>
            <View style={{ flex: 1 }} />
          </View>
          {results.map((res, index) => renderSubjectRow(res, index, index === results.length - 1))}

          {/* Footer info in the results box */}
          <View style={localStyles.tableFooter}>
             <View style={localStyles.footerItem}>
                <Text style={localStyles.footerLabel}>Total Marks: </Text>
                <Text style={localStyles.footerValue}>{summary?.total_marks ?? 0} / {summary?.total_max_marks ?? 0}</Text>
             </View>
             <View style={localStyles.footerItem}>
                <Text style={localStyles.footerLabel}>Pass/Fail: </Text>
                <View style={[localStyles.passBadge, { backgroundColor: "#E8F5E9" }]}>
                  <Text style={[localStyles.passText, { color: "#2E7D32" }]}>PASSED</Text>
                </View>
             </View>
          </View>
        </View>

        {/* L1R4/L1R5 Row (New Requirement) */}
        {(summary?.l1r4 || summary?.l1r5) && (
          <View style={localStyles.scoringRow}>
             <View style={localStyles.scoreBadge}>
                <Text style={localStyles.scoreBadgeLabel}>L1R4:</Text>
                <Text style={localStyles.scoreBadgeValue}>{summary.l1r4 ?? "--"}</Text>
             </View>
             <View style={localStyles.scoreDivider} />
             <View style={localStyles.scoreBadge}>
                <Text style={localStyles.scoreBadgeLabel}>L1R5:</Text>
                <Text style={localStyles.scoreBadgeValue}>{summary.l1r5 ?? "--"}</Text>
             </View>
             <View style={localStyles.scoreDivider} />
             <View style={localStyles.scoreBadge}>
                <Text style={localStyles.scoreBadgeLabel}>Conduct:</Text>
                <Text style={[localStyles.scoreBadgeValue, { textTransform: 'capitalize' }]}>{summary.conduct?.replace("_", " ") ?? "--"}</Text>
             </View>
          </View>
        )}

        {/* Teacher's Comments */}
        <View style={localStyles.commentsContainer}>
          <View style={localStyles.commentsHeader}>
             <Text style={localStyles.commentsTitle}>Teacher's Comments:</Text>
          </View>
          <Text style={localStyles.commentsText}>
             {summary?.teacher_comments || "No comments available for this term."}
          </Text>
        </View>

        <View style={localStyles.actionButtonsRow}>
          <Button 
            buttonTitle="Print Report"
            onPressButton={handlePrint}
            buttonStyle={[localStyles.buttonContainer, { flex: 1 }]}
            textStyle={localStyles.buttonText}
            iconSource={require("../../assets/print_icon.png")}
            iconStyle={localStyles.buttonIcon}
          />
        </View>
        
        <View style={{ height: 40 }} />
       </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  overviewCards: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 10,
    width: "31%",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: "center",
  },
  cardLabel: {
    fontSize: 10,
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  averageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  averageValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 6,
  },
  gradeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: "#FDF2F2",
    borderRadius: 4,
    marginLeft: 6,
  },
  gradeBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#D32F2F",
  },
  progressBarContainer: {
    width: "95%",
    height: 6,
    backgroundColor: "#EEE",
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 6,
  },
  progressBar: {
    height: "100%",
    backgroundColor: colors.primary_500,
  },
  positionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  positionValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  topPercentBadge: {
    backgroundColor: "#FFF4E5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  topPercentText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#F57C00",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  attendanceIconContainer: {
    marginVertical: 4,
    alignItems: "center",
  },
  attendancePercentText: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.primary_500,
    includeFontPadding: false,
    textAlign: "center",
  },
  circleProgress: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: colors.primary_500,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  attendanceSubText: {
    fontSize: 9,
    color: "#888",
  },
  resultsTable: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    paddingBottom: 8,
    marginBottom: 8,
  },
  headerSubject: { 
    flex: 4, 
    fontSize: 13, 
    fontWeight: "bold", 
    color: colors.gray_700,
    marginLeft: -2,
  },
  headerScore: { 
    flex: 2.5, 
    fontSize: 13, 
    fontWeight: "bold", 
    color: colors.gray_700, 
    textAlign: "center",
    marginRight: 3,
  },
  headerGrade: { 
    flex: 1.5, 
    fontSize: 13, 
    fontWeight: "bold", 
    color: colors.gray_700,
    textAlign: "right",
    marginRight: -8,
  },
  subjectRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F9F9F9",
  },
  subjectNameContainer: {
    flex: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  subjectIndicator: {
    width: 3,
    height: 20,
    borderRadius: 2,
    marginRight: 8,
  },
  subjectText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    includeFontPadding: false,
  },
  scoreText: {
    flex: 2.5,
    fontSize: 12,
    color: "#999",
    textAlign: "left",
    textAlignVertical: "center",
    marginLeft: 26,
    includeFontPadding: false,
  },
  boldScore: {
    fontWeight: "bold",
    color: "#333",
  },
  gradeText: {
    flex: 1.5,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
    color: "#333",
    marginRight: -8,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  remarksText: {
    flex: 1,
    fontSize: 11,
    textAlign: "right",
    marginLeft: 4,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  tableFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray_200,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  footerLabel: { fontSize: 12, color: "#666" },
  footerValue: { fontSize: 13, fontWeight: "bold", color: "#333" },
  passBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  passText: { fontSize: 11, fontWeight: "bold" },
  commentsContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  commentsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  commentsTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.primary_850,
  },
  commentsText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#444",
  },
  scoringRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    paddingLeft: -12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  scoreBadge: {
    flex: 1,
    alignItems: "center",
  },
  scoreDivider: {
    width: 1,
    height: "100%",
    backgroundColor: colors.gray_200,
  },
  scoreBadgeLabel: { 
    fontSize: 10, 
    color: "#888", 
    marginBottom: 2,
    fontWeight: "600",
    textTransform: "uppercase"
  },
  scoreBadgeValue: { 
    fontSize: 15, 
    fontWeight: "bold", 
    color: colors.primary_700 
  },
  selectionHeader: {
    paddingTop: 30,
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: "center",
  },
  logoSmall: {
    width: 60,
    height: 60,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.primary_800,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.gray_500,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  selectionBox: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  dropdownLabel: {
    fontSize: 12,
    color: colors.gray_500,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 2,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: colors.gray_300,
    borderRadius: 10,
  },
  fetchButton: {
    backgroundColor: colors.primary_700,
    width: "100%",
    height: 52,
    borderRadius: 10,
    marginTop: 8,
  },
  backLink: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 8,
  },
  backText: {
    fontSize: 16,
    color: colors.gray_800,
    fontWeight: "600",
    marginLeft: 8,
  },
  buttonContainer: {
    backgroundColor: colors.gray_100,
    elevation: 2,
    shadowColor: colors.gray_900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray_200,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "auto",
    height: "auto"
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.gray_800,
  },
  buttonIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
    tintColor: colors.gray_800,
  },
  actionButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: -4,
    gap: 8,
    width: "100%",
  },
});
