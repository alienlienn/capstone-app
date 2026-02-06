import { View, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import CreateEventForm from "../organisms/CreateEventForm";


export default function CreateEventScreen() {
  const route = useRoute();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <CreateEventForm />
      </ScrollView>
    </View>
  );
}
