import { useState, useCallback } from "react";
import { ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../styles/styles";
import ChildCalendarSection from "../organisms/ChildCalendarSection";
import ManageEventFAB from "../organisms/ManageEventFAB";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <>
      <ScrollView style={styles.pageContainer}>
        <ChildCalendarSection refreshKey={refreshKey} />
      </ScrollView>
      <ManageEventFAB onRefresh={handleRefresh} />
    </>
  );
}
