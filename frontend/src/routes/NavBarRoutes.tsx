import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavbar from "../molecules/BottomNavBar";
import HomeScreen from "../screens/HomeScreen";
import DashboardScreen from "../screens/DashboardScreen";
import ResultsScreen from "../screens/ResultsScreen";
import MessagesScreen from "../screens/MessagesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import EventManagementScreen from "../screens/EventManagementScreen";

const Tab = createBottomTabNavigator();

function NavBarRoutes({ route }: { route: any }) {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Results" component={ResultsScreen} />
        <Tab.Screen name="Messages" component={MessagesScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="EditProfile" component={EditProfileScreen} />
        <Tab.Screen name="EventManagement" component={EventManagementScreen} />
      </Tab.Navigator>
      <SafeAreaView edges={['bottom']} >
        <BottomNavbar route={route} />
      </SafeAreaView>
    </View>
  );
}

export default NavBarRoutes;
