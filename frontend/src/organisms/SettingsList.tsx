import { View, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import SettingOption from "../molecules/SettingOption";
import { styles } from "../styles/styles";

export default function SettingsList({ user }: { user: any }) {
  const navigation = useNavigation();

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
        icon={require("../../assets/logout_icon.png")}
        label="Log out"
        onPress={handleLogout} 
      />
    </View>
  );
}
