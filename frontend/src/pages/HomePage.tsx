import { View, Text } from "react-native";
import BottomNavbar from "../molecules/BottomNavBar";

function HomePage() {
  return (
    <View style={{ flex: 1, backgroundColor: "#EAEEFB" }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Welcome to EduConnect</Text>
      </View>
    </View>
  );
}

export default HomePage;
