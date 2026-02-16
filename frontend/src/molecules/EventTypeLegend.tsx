import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../styles/colors";

const EVENT_TYPE_LEGEND = [
  { label: "Announcement", color: colors.event_announcement },
  { label: "Exam", color: colors.event_exams },
  { label: "Holiday", color: colors.event_holiday },
  { label: "Meeting", color: colors.event_meeting },
  { label: "Other", color: colors.event_default },
];

export default function EventTypeLegend() {
  return (
      <View style={legendStyles.legendContainer}>
        <View style={legendStyles.legendRow}>
      {EVENT_TYPE_LEGEND.map((item) => (
        <View key={item.label} style={legendStyles.legendItem}>
          <View style={[legendStyles.colorDot, { backgroundColor: item.color }]} />
          <Text style={legendStyles.legendLabel}>{item.label}</Text>
        </View>
      ))}
        </View>
    </View>
  );
}

const legendStyles = StyleSheet.create({
  legendContainer: {
    width: "100%",
    alignSelf: "center",
    marginBottom: 12,
    paddingLeft: 6,
    paddingRight: 6,
    maxWidth: 370, // match calendar max width if set
  },
  legendRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 4,
    marginBottom: -2,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 7,
    marginRight: 4,
  },
  legendLabel: {
    fontSize: 12,
    color: colors.gray_700,
  },
});
