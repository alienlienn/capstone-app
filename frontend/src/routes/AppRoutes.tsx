import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import NavBarRoutes from "./NavBarRoutes";
import EditProfileScreen from "../screens/EditProfileScreen";
import EventManagementScreen from "../screens/EventManagementScreen";

const Stack = createNativeStackNavigator();

function AppRoutes() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="NavBarRoutes" component={NavBarRoutes} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="EventManagement" component={EventManagementScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppRoutes;
