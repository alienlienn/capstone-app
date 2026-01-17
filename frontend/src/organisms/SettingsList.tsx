import { View, StyleSheet } from "react-native";
import { useState } from "react";
import SettingOption from "../atoms/SettingOption";

export default function SettingsList() {
  const [darkMode, setDarkMode] = useState(false);
  const [notification, setNotification] = useState(true);

  return (
    <View style={styles.container}>
      <SettingOption
        icon={require("../../assets/moon_icon.png")}
        label="Dark mode"
        showToggle
        toggleValue={darkMode}
        onToggleChange={setDarkMode}
        showTopDivider
      />

      <SettingOption
        icon={require("../../assets/avatar_icon.png")}
        label="Profile details"
        onPress={() => console.log("Profile details")}
      />

      <SettingOption
        icon={require("../../assets/notification_icon.png")}
        label="Notifications"
        showToggle
        toggleValue={notification}
        onToggleChange={setNotification}
      />

      <SettingOption
        icon={require("../../assets/logout_icon.png")}
        label="Log out"
        onPress={() => console.log("Logout")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,  
    alignItems: "center",
    marginTop: 28,
  },
});

