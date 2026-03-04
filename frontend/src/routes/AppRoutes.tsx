import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import NavBarRoutes from "./NavBarRoutes";
import EditProfileScreen from "../screens/EditProfileScreen";
import CreateEventScreen from "../screens/CreateEventScreen";
import EditEventScreen from "../screens/EditEventScreen";
import EditResultsScreen from "../screens/EditResultsScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import * as Linking from "expo-linking";
import { ENV } from "../config/environment";

const Stack = createNativeStackNavigator();

const prefix = Linking.createURL("/");

function AppRoutes() {
  const linking = {
    prefixes: [prefix, "exp://", ENV.APP_BASE_URL],
    config: {
      screens: {
        ResetPassword: {
          path: "reset-password",
          parse: {
            token: (token: string) => token,
            email: (email: string) => email,
          },
        },
        Login: "login",
      },
    },
  };

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="NavBarRoutes" component={NavBarRoutes} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
        <Stack.Screen name="EditEvent" component={EditEventScreen} />
        <Stack.Screen name="EditResults" component={EditResultsScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppRoutes;
