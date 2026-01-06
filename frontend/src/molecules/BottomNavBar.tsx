import { View, Text, Pressable } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MaterialIcons from "@react-native-vector-icons/material-icons";

type TabItem = {
  label: string;
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  route: string;
};

const TABS: TabItem[] = [
  { label: "Dashboard", icon: "dashboard", route: "Dashboard" },
  { label: "Home", icon: "home", route: "Home" },
  { label: "Results", icon: "bar-chart", route: "Results" },
  { label: "Messages", icon: "chat", route: "Messages" },
];

function BottomNavbar() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute();

  return (
    <View
      style={{
        flexDirection: "row",
        height: 72,
        backgroundColor: "#ffffff",
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
      }}
    >
      {TABS.map((tab) => {
        const isActive = route.name === tab.route;

        return (
          <Pressable
            key={tab.route}
            onPress={() => navigation.navigate(tab.route)}
            style={({ pressed }) => ({
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <MaterialIcons
              name={tab.icon}
              size={24}
              color={isActive ? "#4F46E5" : "#9CA3AF"}
            />
            <Text
              style={{
                fontSize: 12,
                marginTop: 4,
                fontWeight: isActive ? "600" : "400",
                color: isActive ? "#4F46E5" : "#9CA3AF",
              }}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default BottomNavbar;
