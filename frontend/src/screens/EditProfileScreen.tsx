import { ScrollView } from "react-native";
import EditProfileForm from "../organisms/EditProfileForm";
import { styles } from "../styles/styles";


export default function EditProfileScreen() {
  const user = (global as any).loggedInUser;

  return (
    <ScrollView 
      style={styles.pageContainer}
      showsVerticalScrollIndicator={false}
    >
      <EditProfileForm user={user} />
    </ScrollView>
  );
}
