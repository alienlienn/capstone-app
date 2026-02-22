import React from "react";
import { View, StyleSheet, Text, Image, ScrollView, DimensionValue } from "react-native";
import { colors } from "../styles/colors";
import { StudentPerformanceSummary, StudentResult } from "../types/types";

interface StudentResultViewProps {
  summary: StudentPerformanceSummary | null;
  results: StudentResult[];
}

export default function StudentResultView({ summary, results }: StudentResultViewProps) {
  if (!summary && results.length === 0) {
    return (
      <View style={localStyles.emptyContainer}>
        <Text style={localStyles.emptyText}>No results found for this term.</Text>
      </View>
    );
  }

  const renderSubjectRow = (res: StudentResult, index: number) => {
    // Subject color indicator (just for design, could be tied to subject category)
    const subjectColors = [
      "#4A90E2", "#7ED321", "#9013FE", "#F5A623", 
      "#D0021B", "#50E3C2", "#417505", "#B8E986",
      "#BD10E0", "#FF4081", "#03A9F4", "#8BC34A"
    ];
    const indicatorColor = subjectColors[index % subjectColors.length];

    return (
      <View key={index} style={localStyles.subjectRow}>
        <View style={localStyles.subjectNameContainer}>
          <View style={[localStyles.subjectIndicator, { backgroundColor: indicatorColor }]} />
          <Text style={localStyles.subjectText}>{res.subject}</Text>
        </View>
        <Text style={localStyles.scoreText}>
          <Text style={localStyles.boldScore}>{res.score ?? "--"}</Text> / {res.max_score ?? 100}
        </Text>
        <Text style={[localStyles.gradeText, { color: getGradeColor(res.grade) }]}>{res.grade ?? "--"}</Text>
        <Text style={[localStyles.remarksText, { color: indicatorColor }]}>{res.remarks ?? ""}</Text>
      </View>
    );
  };

  const getGradeColor = (grade?: string) => {
    if (!grade) return "#333";
    if (grade.startsWith("A")) return "#2E7D32";
    if (grade.startsWith("B")) return "#FBC02D";
    if (grade.startsWith("C")) return "#F57C00";
    return "#D32F2F";
  };

  // Safe division for attendance
  const attendancePercent =
    summary?.attendance_total && summary.attendance_total > 0
      ? Math.round((summary.attendance_present! / summary.attendance_total!) * 100)
      : 0;

  return (
    <ScrollView style={localStyles.container}>
      {/* Overview Cards Row */}
      <View style={localStyles.overviewCards}>
        {/* Overall Average */}
        <View style={localStyles.summaryCard}>
          <Text style={localStyles.cardLabel}>Overall Average</Text>
          <View style={localStyles.averageContainer}>
            <Text style={localStyles.averageValue}>{summary?.overall_percentage ?? "0"}%</Text>
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
          <View style={localStyles.topPercentBadge}>
            <Text style={localStyles.topPercentText}>🏆 Top Rank</Text>
          </View>
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
          <Text style={localStyles.headerSubject}>Subject Grades</Text>
          <Text style={localStyles.headerScore}>Score</Text>
          <Text style={localStyles.headerGrade}>Grade</Text>
        </View>
        {results.map((res, index) => renderSubjectRow(res, index))}

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
              <Text style={localStyles.scoreBadgeLabel}>L1R4: </Text>
              <Text style={localStyles.scoreBadgeValue}>{summary.l1r4 ?? "--"}</Text>
           </View>
           <View style={localStyles.scoreBadge}>
              <Text style={localStyles.scoreBadgeLabel}>L1R5: </Text>
              <Text style={localStyles.scoreBadgeValue}>{summary.l1r5 ?? "--"}</Text>
           </View>
           <View style={localStyles.scoreBadge}>
              <Text style={localStyles.scoreBadgeLabel}>Conduct: </Text>
              <Text style={[localStyles.scoreBadgeValue, { textTransform: 'capitalize' }]}>{summary.conduct?.replace("_", " ") ?? "--"}</Text>
           </View>
        </View>
      )}

      {/* Teacher's Comments */}
      <View style={localStyles.commentsContainer}>
        <View style={localStyles.commentsHeader}>
           <Image 
              source={require("../../assets/home_icon.png")} 
              style={{ width: 20, height: 20, tintColor: colors.primary_850, marginRight: 8 }} 
           />
           <Text style={localStyles.commentsTitle}>Teacher's Comments</Text>
        </View>
        <Text style={localStyles.commentsText}>
           {summary?.teacher_comments || "No comments available for this term."}
        </Text>
      </View>
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  overviewCards: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    width: "100%",
    height: 6,
    backgroundColor: "#EEE",
    borderRadius: 3,
    overflow: "hidden",
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
    marginTop: 4,
  },
  topPercentText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#F57C00",
  },
  attendanceIconContainer: {
    marginVertical: 4,
    alignItems: "center",
  },
  attendancePercentText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary_500,
  },
  circleProgress: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    paddingBottom: 8,
    marginBottom: 8,
  },
  headerSubject: { flex: 4, fontSize: 13, fontWeight: "bold", color: "#333" },
  headerScore: { flex: 2, fontSize: 13, fontWeight: "bold", color: "#666", textAlign: "right" },
  headerGrade: { flex: 2, fontSize: 13, fontWeight: "bold", color: "#666", textAlign: "right" },
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
  },
  scoreText: {
    flex: 2,
    fontSize: 12,
    color: "#999",
    textAlign: "right",
  },
  boldScore: {
    fontWeight: "bold",
    color: "#333",
  },
  gradeText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
  },
  remarksText: {
    flex: 2,
    fontSize: 11,
    textAlign: "right",
    marginLeft: 4,
  },
  tableFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
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
  },
  scoreBadge: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
  },
  scoreBadgeLabel: { fontSize: 11, color: "#666" },
  scoreBadgeValue: { fontSize: 11, fontWeight: "bold", color: "#333" },
  emptyContainer: { padding: 40, alignItems: "center" },
  emptyText: { color: colors.gray_500, fontStyle: "italic" },
});
