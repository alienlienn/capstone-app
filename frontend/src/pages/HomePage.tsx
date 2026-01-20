import React from "react";
import { ScrollView } from "react-native";
import CalendarView from "../organisms/CalendarView";
import { styles } from "../styles/styles";

export default function HomePage() {
  return (
    <ScrollView style={styles.pageContainer}>
      <CalendarView />
    </ScrollView>
  );
}

