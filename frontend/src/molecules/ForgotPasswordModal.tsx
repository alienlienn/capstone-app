import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, TouchableWithoutFeedback, ActivityIndicator } from "react-native";
import { colors } from "../styles/colors";
import Button from "../atoms/Button";
import UserInput from "../atoms/UserInput";
import { forgotPassword } from "../services/auth";

interface ForgotPasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ visible, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleResetPassword = async () => {
    if (!email) {
      setErrorMessage("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      
      const response = await forgotPassword(email);
      setSuccessMessage(response.message || "Reset password link sent to your email");
      setEmail("");
    } catch (error: any) {
      setErrorMessage(error?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setErrorMessage(null);
    setSuccessMessage(null);
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Forgot Password</Text>
              <Text style={styles.instructionText}>
                Enter your registered email address and we'll send you a link to reset your password.
              </Text>

              <UserInput
                placeholder="Email Address"
                inputValue={email}
                onChangeInputText={setEmail}
                secureInputTextEntry={false}
              />

              {errorMessage && (
                <Text style={styles.errorText}>{errorMessage}</Text>
              )}

              {successMessage && (
                <Text style={styles.successText}>{successMessage}</Text>
              )}

              <View style={styles.buttonRow}>
                <Button
                  buttonTitle={loading ? "Sending..." : "Reset Password"}
                  onPressButton={handleResetPassword}
                  disabled={loading}
                  width={"100%"}
                />
              </View>
              
              <Button
                buttonTitle="Close"
                onPressButton={handleClose}
                width={"100%"}
                buttonStyle={{ marginTop: 10, backgroundColor: colors.gray_300 }}
                textStyle={{ color: colors.gray_700 }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.gray_50,
    width: "100%",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary_800,
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: colors.gray_600,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
  successText: {
    color: colors.success,
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
  buttonRow: {
    width: "100%",
    marginTop: 10,
  },
});
