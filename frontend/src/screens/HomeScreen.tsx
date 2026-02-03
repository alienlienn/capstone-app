import { ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../styles/styles";
import ChildCalendarSection from "../organisms/ChildCalendarSection";
import FloatingButton from "../atoms/FloatingButton";

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <>
      <ScrollView style={styles.pageContainer}>
        <ChildCalendarSection />
      </ScrollView>
      <FloatingButton
        label="Manage Events"
        iconSource={require("../../assets/calendar_icon.png")}
        onPress={() => navigation.navigate("EventManagement")}
      />
    </>
  );
}
