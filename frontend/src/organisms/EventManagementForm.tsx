import { View, Pressable, Image, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Button from "../atoms/Button";
import { colors } from "../styles/colors";

export default function EventManagementForm() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background_color }}>
      
      {/* Header similar to BottomNavbar */}
      <View
        style={{
          width: "100%",
          height: 54,                 
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          backgroundColor: colors.gray_50,
          borderTopWidth: 1,
          borderTopColor: colors.gray_200,
          elevation: 4,
          shadowColor: colors.gray_900,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          zIndex: 10,
        }}
      >
        <Pressable
          style={{ padding: 8 }}
          onPress={() =>
            navigation.navigate("NavBarRoutes", { screen: "Home" })
          }
        >
          <Image
            source={require("../../assets/chevron_icons/chevron_left.png")}
            style={{ width: 20, height: 20 }}
          />
        </Pressable>

        <Text
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 18,
            fontWeight: "600",
            color: colors.primary_850,
            marginRight: 24,
          }}
        >
          Event Management
        </Text>
      </View>

      {/* Main Content */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 16,
          gap: 18,
        }}
      >
        <Button
          buttonTitle="Create Event"
          onPressButton={() => {}}
          width={"75%"}
          height={52}
          iconSource={require("../../assets/create_icon.png")}
          buttonStyle={{ backgroundColor: colors.primary_700 }}
        />
        <Button
          buttonTitle="Edit Event"
          onPressButton={() => {}}
          width={"75%"}
          height={52}
          iconSource={require("../../assets/edit_icon.png")}
        />
        <Button
          buttonTitle="Remove Event"
          onPressButton={() => {}}
          width={"75%"}
          height={52}
          iconSource={require("../../assets/delete_icon.png")}
          buttonStyle={{ backgroundColor: colors.error }}
        />
      </View>
    </SafeAreaView>
  );
}
