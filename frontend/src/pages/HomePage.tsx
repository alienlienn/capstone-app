import React from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import CalendarView from "../organisms/CalendarView";

export default function HomePage() {
  return (
    <ScrollView style={styles.container}>

      {/* Expo Calendar Component */}
      <CalendarView />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7f9",
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#111827",
  },
  content: {
    marginTop: 24,
  },
});
