import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import ResultsFilterForm from "../organisms/ResultsFilterForm";
import StudentResultView from "../organisms/StudentResultView";
import { colors } from "../styles/colors";

function ResultsScreen() {
  const currentUser = (global as any).loggedInUser;
  const isParent = currentUser?.role === "user";

  const [filterValues, setFilterValues] = useState({ level: "all levels", search: "" });

  const handleFilterUpdate = (filter: { level: string; search: string }) => {
    setFilterValues(filter);
  };

  if (isParent) {
    return (
      <View style={localStyles.screenContainer}>
        <StudentResultView />
      </View>
    );
  }

  return (
    <View style={localStyles.screenContainer}>
      <ResultsFilterForm onFilterChange={handleFilterUpdate} />
    </View>
  );
}

const localStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background_color,
  },
});

export default ResultsScreen;


