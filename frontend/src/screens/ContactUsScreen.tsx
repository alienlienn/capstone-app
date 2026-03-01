import { View } from "react-native";
import ContactUsForm from "../organisms/ContactUsForm";
import { colors } from "../styles/colors";

function ContactUsScreen() {
  const currentUser = (global as any).loggedInUser;
  const userId = currentUser?.id;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background_color, paddingHorizontal: 16, alignSelf: "center"}}>
      <ContactUsForm userId={userId} />
    </View>
  );
}

export default ContactUsScreen;
