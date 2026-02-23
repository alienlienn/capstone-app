import { useState, useCallback } from "react";
import { ScrollView } from "react-native";
import { styles } from "../styles/styles";
import ChildCalendarSection from "../organisms/ChildCalendarSection";
import ManageEventFAB from "../organisms/ManageEventFAB";

export default function HomeScreen() {
  const [refreshKey, setRefreshKey] = useState(0);

  const currentUser = (global as any).loggedInUser;
  const showFAB = currentUser?.role !== "user";

  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <>
      <ScrollView style={styles.pageContainer}>
        <ChildCalendarSection refreshKey={refreshKey} />
      </ScrollView>
      {showFAB && <ManageEventFAB onRefresh={handleRefresh} />}
    </>
  );
}
