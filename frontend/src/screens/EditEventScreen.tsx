import { View, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import EditEventForm from "../organisms/EditEventForm";

export default function EditEventScreen() {
  const route = useRoute();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <EditEventForm />
      </ScrollView>
    </View>
  );
}
