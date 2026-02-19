import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Modal, TouchableWithoutFeedback } from "react-native";
import { colors } from "../styles/colors";

const EVENT_TYPE_LEGEND = [
  { label: "Exam", color: colors.event_exams },
  { label: "Holiday", color: colors.event_holiday },
  { label: "School Event", color: colors.event_school_event },
  { label: "Announcement", color: colors.event_announcement },
  { label: "Other", color: colors.event_default },
];

export default function EventTypeLegend() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={legendStyles.container}>
      <Pressable 
        style={legendStyles.viewLegendButton} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={legendStyles.viewLegendText}>View Legend</Text>
      </Pressable>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={legendStyles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={legendStyles.modalContent}>
                <Text style={legendStyles.modalTitle}>Event Legend</Text>
                <View style={legendStyles.legendRow}>
                  {EVENT_TYPE_LEGEND.map((item) => (
                    <View key={item.label} style={legendStyles.legendItem}>
                      <View style={[legendStyles.colorDot, { backgroundColor: item.color }]} />
                      <Text style={legendStyles.legendLabel}>{item.label}</Text>
                    </View>
                  ))}
                </View>
                <Pressable 
                  style={legendStyles.closeButton} 
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={legendStyles.closeButtonText}>Close</Text>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const legendStyles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "flex-end",
    marginTop: 2,
    marginBottom: 2,
    paddingHorizontal: 2,
    maxWidth: 370,
    alignSelf: "center",
  },
  viewLegendButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  viewLegendText: {
    fontSize: 12,
    color: colors.primary_600,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: colors.gray_50,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    elevation: 5,
    shadowColor: colors.gray_900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.gray_900,
    marginBottom: 16,
  },
  legendRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 2,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 14,
    color: colors.gray_700,
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: colors.primary_600,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});

