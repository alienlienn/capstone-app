import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import ResultsFilterForm from "../organisms/ResultsFilterForm";
import Dropdown from "../atoms/Dropdown";
import Button from "../atoms/Button";
import { colors } from "../styles/colors";
import { styles } from "../styles/styles";
import { getParentStudents } from "../services/result";
import { DropdownOption } from "../types/types";

function ResultsScreen() {
  const [filterValues, setFilterValues] = useState({ level: "all levels", search: "" });
  
  // Parent state
  const currentUser = (global as any).loggedInUser;
  const isParent = currentUser?.role === "user";
  
  const [students, setStudents] = useState<DropdownOption[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedTerm, setSelectedTerm] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isParent && currentUser?.id) {
      const fetchStudents = async () => {
        try {
          const data = await getParentStudents(currentUser.id);
          const options = data.map((s: any) => ({
            label: `${s.first_name} ${s.last_name}`,
            value: s.id.toString(),
          }));
          setStudents(options);
        } catch (error) {
          console.error("Error fetching students:", error);
        }
      };
      fetchStudents();
    }
  }, [isParent, currentUser?.id]);

  const handleFilterUpdate = (filter: { level: string; search: string }) => {
    setFilterValues(filter);
  };

  const trimesterOptions = [
    { label: "Term 1 (2025)", value: "Term 1" },
    { label: "Term 2 (2025)", value: "Term 2" },
    { label: "Term 3 (2025)", value: "Term 3" },
    { label: "Term 4 (2025)", value: "Term 4" },
    { label: "CA1 (2025)", value: "CA1" },
    { label: "CA2 (2025)", value: "CA2" },
    { label: "SA1 (2025)", value: "SA1" },
    { label: "SA2 (2025)", value: "SA2" },
  ];

  if (isParent) {
    return (
      <View style={localStyles.screenContainer}>
        <Text style={styles.screenTopHeaderLabel}>Student Results</Text>
        
        <View style={localStyles.parentDropdowns}>
          <Dropdown
            placeholder="Select Student"
            options={students}
            value={selectedStudent}
            onSelect={setSelectedStudent}
          />
          <View style={{ height: 12 }} />
          <Dropdown
            placeholder="Select Trimester"
            options={trimesterOptions}
            value={selectedTerm}
            onSelect={setSelectedTerm}
          />
          
          <Button 
            buttonTitle="View Results"
            onPressButton={() => Alert.alert("Feature coming soon", "Performance summary view is being updated.")}
            buttonStyle={localStyles.viewButton}
            disabled={loading}
          />
        </View>

        <View style={localStyles.emptyContainer}>
          <Text style={localStyles.emptyText}>Select student and term to view results</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={localStyles.screenContainer}>
      <ResultsFilterForm onFilterChange={handleFilterUpdate} />
      <View style={{ flex: 1 }}>
        {/* Teachers see their students in ResultsFilterForm already */}
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background_color,
    padding: 20,
  },
  parentDropdowns: {
    marginVertical: 16,
    zIndex: 100, // Important for dropdown visibility
  },
  viewButton: {
    marginTop: 16,
    width: "100%",
    backgroundColor: colors.primary_850,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: colors.gray_500,
    fontStyle: "italic",
    fontSize: 14,
  }
});

export default ResultsScreen;

