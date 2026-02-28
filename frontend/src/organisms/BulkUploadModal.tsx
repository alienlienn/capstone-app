import React, { useState } from "react";
import { Modal, View, Text, StyleSheet, Pressable, Image, ActivityIndicator, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { colors } from "../styles/colors";
import Button from "../atoms/Button";
import { bulkUploadResults, downloadResultsTemplate } from "../services/result";

interface BulkUploadModalProps {
  visible: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
}

export default function BulkUploadModal({ visible, onClose, onUploadSuccess }: BulkUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Excel files
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setSelectedFile(result);
      }
    } catch (err) {
      console.error("Error picking document:", err);
      Alert.alert("Error", "Failed to select file.");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || selectedFile.canceled) {
      Alert.alert("Warning", "Please select an Excel file first.");
      return;
    }

    const file = selectedFile.assets[0];
    setLoading(true);
    try {
      await bulkUploadResults(file.uri, file.name);
      Alert.alert("Success", "Results uploaded successfully!");
      setSelectedFile(null);
      if (onUploadSuccess) onUploadSuccess();
      onClose();
    } catch (error: any) {
      Alert.alert("Upload Error", error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={localStyles.modalOverlay}>
        <View style={localStyles.modalContainer}>
          <View style={localStyles.header}>
            <Text style={localStyles.title}>Bulk Upload Results</Text>
          </View>

          <View style={localStyles.content}>
            <Text style={localStyles.instruction}>
              Upload an Excel file (.xlsx) containing the student results and summaries.
            </Text>

            <Pressable 
              style={localStyles.templateLink} 
              onPress={async () => {
                try {
                  await downloadResultsTemplate();
                } catch (error) {
                  Alert.alert("Template Error", "Failed to download template.");
                }
              }}
            >
              <Text style={localStyles.templateLinkText}>Download Structure Template</Text>
            </Pressable>

            <Pressable 
              style={[localStyles.filePicker, selectedFile && !selectedFile.canceled ? localStyles.fileSelected : null]} 
              onPress={handleSelectFile}
            >
              <Image 
                source={require("../../assets/upload_icon.png")} 
                style={{ width: 40, height: 40, tintColor: selectedFile && !selectedFile.canceled ? colors.primary_500 : colors.gray_300, marginBottom: 10 }} 
              />
              <Text style={localStyles.filePickerText}>
                {selectedFile && !selectedFile.canceled ? selectedFile.assets[0].name : "Tap to select Excel file"}
              </Text>
              {selectedFile && !selectedFile.canceled && (
                <Text style={localStyles.fileSize}>
                  {(selectedFile.assets[0].size! / 1024).toFixed(2)} KB
                </Text>
              )}
            </Pressable>

            {loading ? (
              <ActivityIndicator size="large" color={colors.primary_500} style={{ marginVertical: 20 }} />
            ) : (
              <View style={localStyles.buttonGroup}>
                <Button 
                  buttonTitle="Upload Now" 
                  onPressButton={handleUpload} 
                  disabled={!selectedFile || selectedFile.canceled}
                  buttonStyle={{ backgroundColor: colors.primary_500, width: "100%" }}
                />
                <Button 
                  buttonTitle="Cancel" 
                  onPressButton={onClose} 
                  buttonStyle={{ backgroundColor: colors.gray_200, width: "100%", marginTop: 12 }}
                  textStyle={{ color: colors.gray_600 }}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const localStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  header: {
    marginBottom: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary_850,
    textAlign: "center",
  },
  closeBtn: {
    padding: 5,
  },
  content: {
    alignItems: "center",
  },
  instruction: {
    fontSize: 14,
    color: colors.gray_600,
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 20,
  },
  templateLink: {
    marginBottom: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary_100,
    backgroundColor: colors.primary_50,
  },
  templateLinkText: {
    fontSize: 12,
    color: colors.primary_600,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  filePicker: {
    width: "100%",
    height: 150,
    borderWidth: 2,
    borderColor: colors.gray_100,
    borderStyle: "dashed",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.gray_50,
    marginBottom: 24,
  },
  fileSelected: {
    borderColor: colors.primary_300,
    backgroundColor: colors.primary_50,
  },
  filePickerText: {
    fontSize: 14,
    color: colors.gray_500,
    fontWeight: "500",
  },
  fileSize: {
    fontSize: 12,
    color: colors.gray_400,
    marginTop: 4,
  },
  buttonGroup: {
    width: "100%",
  },
});
