import { View, StyleSheet } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import SettingOption from "../molecules/SettingOption";

export default function SettingsList({ user }: { user: any }) {
  const navigation = useNavigation();
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
        onPress={() => (navigation as any).navigate("EditProfile", { user })} 
      />

      <SettingOption
        icon={require("../../assets/notification_icon.png")}
        label="Push Notifications"
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

