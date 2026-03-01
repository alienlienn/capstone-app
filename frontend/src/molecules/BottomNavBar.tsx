import { View, Text, Pressable, Image } from "react-native";
import { useNavigation, getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabItem } from "../types/types";
import { styles, navBarTabIcon, navBarTabLabel } from "../styles/styles";


const TABS: TabItem[] = [
  {
    label: "Results",
    icon: require("../../assets/result_icon.png"),
    route: "Results",
  },
  {
    label: "Home",
    icon: require("../../assets/home_icon.png"),
    route: "Home",
  },
  {
    label: "Contact Us",
    icon: require("../../assets/contact_us_icon.png"),
    route: "ContactUs",
  },
  {
    label: "Profile",
    icon: require("../../assets/profile_icon.png"),
    route: "Profile",
  },
];

function BottomNavbar({ route }: { route: any }) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const currentRouteName = getFocusedRouteNameFromRoute(route) || "Home";
  
  const loggedInUser = (global as any).loggedInUser;
  const userRole = loggedInUser?.role;

  // Filter out "Contact Us" for admins
  const filteredTabs = TABS.filter(tab => {
    if (tab.route === "ContactUs" && userRole === "admin") {
      return false;
    }
    return true;
  });

  return (
    <View style={styles.navBarContainer}>
      {filteredTabs.map((tab) => {
        const isActive = currentRouteName === tab.route;

        return (
          <Pressable
            key={tab.route}
            onPress={() => navigation.navigate("NavBarRoutes", { screen: tab.route })}
            style={styles.navBarTab}
          >
            <Image
              source={tab.icon}
              style={navBarTabIcon(isActive)}
              resizeMode="contain"
            />
            <Text style={navBarTabLabel(isActive)}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default BottomNavbar;

