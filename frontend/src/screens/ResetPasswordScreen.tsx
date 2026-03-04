import React from "react";
import { View, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import ResetPasswordForm from "../organisms/ResetPasswordForm";
import { colors } from "../styles/colors";

export default function ResetPasswordScreen() {
  const route = useRoute<any>();
  const { email, token } = route.params || {};

  return (
    <View style={styles.container}>
      <ResetPasswordForm email={email} token={token} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.background_color,
    justifyContent: "center",
    alignItems: "center",
  },
});
