import { ScrollView , StyleSheet } from "react-native";
import ProfileHeader from "../organisms/ProfileHeader";
import SettingsList from "../organisms/SettingsList";


function ProfilePage() {
  const user = {
    first_name: "Rita",
    last_name: "Smith",
    email: "rita@gmail.com",
    mobile_number: "+5999-771-7171",
    profile_image_url: "https://randomuser.me/api/portraits/women/44.jpg",
  };

  return (
    <ScrollView style={styles.container}>
      <ProfileHeader
        fullName={`${user.first_name} ${user.last_name}`}
        phone={user.mobile_number}
        email={user.email}
        imageUrl={user.profile_image_url}
      />
      <SettingsList />
    </ScrollView >
  );
}

export default ProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7f9",
  },
});
