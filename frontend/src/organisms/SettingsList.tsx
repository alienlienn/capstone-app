import { View, Alert } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import SettingOption from "../molecules/SettingOption";
import { styles } from "../styles/styles";

export default function SettingsList({ user }: { user: any }) {
  const navigation = useNavigation();
  const [darkMode, setDarkMode] = useState(false);
  const [notification, setNotification] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            (global as any).loggedInUser = null;

            (navigation as any).reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.settingListContainer}>
      <SettingOption
        icon={require("../../assets/edit_profile_icon.png")}
        label="Edit Profile"
        showChevron
        onPress={() => (navigation as any).navigate("EditProfile", { user })} 
        showTopDivider
      />
      <SettingOption
        icon={require("../../assets/moon_icon.png")}
        label="Dark mode"
        showToggle
        toggleValue={darkMode}
        onToggleChange={setDarkMode}
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
        onPress={handleLogout} 
      />
    </View>
  );
}
