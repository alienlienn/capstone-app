import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../styles/colors";
import EditResultsForm from "../organisms/EditResultsForm";

function EditResultsScreen({ route, navigation }: any) {
  const { studentId } = route.params || {};

  return (
    <SafeAreaView style={localStyles.screenContainer}>
      <EditResultsForm studentId={studentId} />
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background_color,
  },
});

export default EditResultsScreen;
