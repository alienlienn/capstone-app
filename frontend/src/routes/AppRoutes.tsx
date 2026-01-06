import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "../pages/LoginPage";
import NavBarRoutes from "./NavBarRoutes";

const Stack = createNativeStackNavigator();

function AppRoutes() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="NavBarRoutes" component={NavBarRoutes} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppRoutes;
