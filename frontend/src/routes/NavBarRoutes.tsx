import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavbar from "../molecules/BottomNavBar";
import HomePage from "../pages/HomePage";
import DashboardPage from "../pages/DashboardPage";
import ResultsPage from "../pages/ResultsPage";
import MessagesPage from "../pages/MessagesPage";
import ProfilePage from "../pages/ProfilePage";

const Tab = createBottomTabNavigator();

function NavBarRoutes({ route }: { route: any }) {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}>
        <Tab.Screen name="Home" component={HomePage} />
        <Tab.Screen name="Dashboard" component={DashboardPage} />
        <Tab.Screen name="Results" component={ResultsPage} />
        <Tab.Screen name="Messages" component={MessagesPage} />
        <Tab.Screen name="Profile" component={ProfilePage} />
      </Tab.Navigator>
      <SafeAreaView edges={['bottom']} >
        <BottomNavbar route={route} />
      </SafeAreaView>
    </View>
  );
}

export default NavBarRoutes;
