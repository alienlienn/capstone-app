// src/screens/EventManagementScreen.tsx
import { View, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import EventManagementForm from "../organisms/EventManagementForm";
import BottomNavbar from "../molecules/BottomNavBar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EventManagementScreen() {
  const route = useRoute();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <EventManagementForm />
      </ScrollView>
    </View>
  );
}
