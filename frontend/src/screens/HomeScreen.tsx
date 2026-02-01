import { ScrollView } from "react-native";
import { styles } from "../styles/styles";
import ChildCalendarSection from "../organisms/ChildCalendarSection";

export default function HomeScreen() {
  return (
    <ScrollView style={styles.pageContainer}>
      <ChildCalendarSection />
    </ScrollView>
  );
}

