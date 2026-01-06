import { View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomNavbar from "../molecules/BottomNavBar";
import HomePage from "../pages/HomePage";
import DashboardPage from "../pages/DashboardPage";
import ResultsPage from "../pages/ResultsPage";
import MessagesPage from "../pages/MessagesPage";

const Stack = createNativeStackNavigator();

function NavBarRoutes() {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Dashboard" component={DashboardPage} />
        <Stack.Screen name="Results" component={ResultsPage} />
        <Stack.Screen name="Messages" component={MessagesPage} />
      </Stack.Navigator>
      <BottomNavbar />
    </View>
  );
}

export default NavBarRoutes;
