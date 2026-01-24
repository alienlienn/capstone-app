import { ScrollView } from "react-native";
import ProfileHeader from "../organisms/ProfileHeader";
import SettingsList from "../organisms/SettingsList";
import { styles } from "../styles/styles";


function ProfileScreen() {
  const user = (global as any).loggedInUser;

  return (
    <ScrollView style={styles.pageContainer}>
      <ProfileHeader
        fullName={`${user.first_name} ${user.last_name}`}
        phone={user.mobile_number}
        email={user.email}
        imageUrl={user.profile_image_url}
      />
      <SettingsList user={user} />
    </ScrollView >
  );
}

export default ProfileScreen;

