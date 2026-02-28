import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Modal, TouchableWithoutFeedback, ActivityIndicator, FlatList } from "react-native";
import { colors } from "../styles/colors";
import { fetchSubjectOptions } from "../services/lookup";

interface SubjectCodeModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SubjectCodeModal({ visible, onClose }: SubjectCodeModalProps) {
  const [subjects, setSubjects] = useState<{ name: string; code: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      const getSubjects = async () => {
        setLoading(true);
        const data = await fetchSubjectOptions();
        setSubjects(data);
        setLoading(false);
      };
      getSubjects();
    }
  }, [visible]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.modalOverlay}>
        <View style={modalStyles.modalContent}>
          <Text style={modalStyles.modalTitle}>Subject Naming Reference</Text>
          
          <Text style={modalStyles.instructionText}>
            Please take note of the standard subject naming and codes below. Use these exact names or codes when filling in results.
          </Text>

          <View style={modalStyles.tableHeader}>
            <Text style={[modalStyles.headerCell, { flex: 2 }]}>Subject Name</Text>
            <Text style={[modalStyles.headerCell, { flex: 1 }]}>Code</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="small" color={colors.primary_500} style={{ marginVertical: 20 }} />
          ) : (
            <View style={{ height: 280, width: "100%" }}>
              <FlatList
                data={subjects}
                keyExtractor={(item) => item.code}
                contentContainerStyle={{ paddingBottom: 12 }}
                renderItem={({ item }) => (
                  <View style={modalStyles.tableRow}>
                    <Text style={[modalStyles.cell, { flex: 2 }]}>{item.name}</Text>
                    <Text style={[modalStyles.cell, { flex: 1 }]}>{item.code}</Text>
                  </View>
                )}
                ListEmptyComponent={
                  <Text style={modalStyles.emptyText}>No subjects found.</Text>
                }
              />
            </View>
          )}

          <Pressable 
            style={modalStyles.closeButton} 
            onPress={onClose}
          >
            <Text style={modalStyles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
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
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary_800,
    textAlign: "center",
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 13,
    color: colors.gray_600,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 18,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderColor: colors.gray_200,
    paddingBottom: 8,
    width: "100%",
    marginBottom: 4,
  },
  headerCell: {
    fontWeight: "600",
    color: colors.primary_700,
    fontSize: 14,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: colors.gray_100,
    paddingVertical: 10,
    width: "100%",
  },
  cell: {
    fontSize: 14,
    color: colors.gray_700,
  },
  emptyText: {
    textAlign: "center",
    color: colors.gray_400,
    marginVertical: 16,
    fontStyle: "italic",
  },
  closeButton: {
    marginTop: 24,
    backgroundColor: colors.primary_500,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  closeButtonText: {
    color: colors.gray_50,
    fontWeight: "600",
    fontSize: 14,
  },
});
