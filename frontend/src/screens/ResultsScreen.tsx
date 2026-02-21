import { View, Text, StyleSheet } from "react-native";
import { useState } from "react";
import ResultsFilterForm from "../organisms/ResultsFilterForm";
import { colors } from "../styles/colors";
import { styles } from "../styles/styles";

function ResultsScreen() {
  const [filterValues, setFilterValues] = useState({ level: "all levels", search: "" });

  const handleFilterUpdate = (filter: { level: string; search: string }) => {
    setFilterValues(filter);
  };

  return (
    <View style={localStyles.screenContainer}>
      <ResultsFilterForm onFilterChange={handleFilterUpdate} />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
});

export default ResultsScreen;
