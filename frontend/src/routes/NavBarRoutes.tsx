import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavbar from "../molecules/BottomNavBar";
import HomeScreen from "../screens/HomeScreen";
import ResultsScreen from "../screens/ResultsScreen";
import ContactUsScreen from "../screens/ContactUsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import CreateEventScreen from "../screens/CreateEventScreen";
import EditEventScreen from "../screens/EditEventScreen";
import EditResultsScreen from "../screens/EditResultsScreen";

const Tab = createBottomTabNavigator();

function NavBarRoutes({ route }: { route: any }) {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Results" component={ResultsScreen} />
        <Tab.Screen name="ContactUs" component={ContactUsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="EditProfile" component={EditProfileScreen} />
        <Tab.Screen name="CreateEvent" component={CreateEventScreen} />
        <Tab.Screen name="EditEvent" component={EditEventScreen} />
        <Tab.Screen name="EditResults" component={EditResultsScreen} />
      </Tab.Navigator>
      <SafeAreaView edges={['bottom']} >
        <BottomNavbar route={route} />
      </SafeAreaView>
    </View>
  );
}

export default NavBarRoutes;
