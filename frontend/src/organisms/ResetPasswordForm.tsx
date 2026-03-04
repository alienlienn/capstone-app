import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import UserInput from "../atoms/UserInput";
import Button from "../atoms/Button";
import { colors } from "../styles/colors";
import { ENV } from "../config/environment";

interface ResetPasswordFormProps {
  email: string;
  token: string;
}

export default function ResetPasswordForm({ email, token }: ResetPasswordFormProps) {
  const navigation = useNavigation<any>();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleConfirmReset = async () => {
    if (!newPassword) {
      setErrorMessage("Please enter a new password");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const response = await fetch(`${ENV.API_BASE_URL}/account/reset_password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, new_password: newPassword, token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to reset password");
      }

      setSuccessMessage("Password has been reset successfully!");
      setTimeout(() => {
        navigation.navigate("Login");
      }, 2000);

    } catch (error: any) {
      setErrorMessage(error?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Enter a new password for {email}</Text>

      <UserInput
        placeholder="Enter New Password"
        inputValue={newPassword}
        onChangeInputText={setNewPassword}
        secureInputTextEntry={true}
      />

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      {successMessage && <Text style={styles.successText}>{successMessage}</Text>}

      <Button
        buttonTitle={loading ? "Updating..." : "Confirm"}
        onPressButton={handleConfirmReset}
        disabled={loading}
        width={"100%"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    width: "100%",
    padding: 24,
    backgroundColor: colors.gray_50,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primary_800,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray_600,
    marginBottom: 24,
    textAlign: "center",
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
});
