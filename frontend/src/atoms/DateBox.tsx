import { Pressable, View, Text, Image } from "react-native";
import { colors } from "../styles/colors";

interface DateBoxProps {
  label: string;
  onPress: () => void;
}

export default function DateBox({ label, onPress }: DateBoxProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: colors.gray_300,
        borderRadius: 8,
        padding: 12,
        backgroundColor: colors.gray_50,
      }}
    >
      <Text style={{ color: colors.gray_700 }}>{label}</Text>
      <Image
        source={require("../../assets/calendar_icon.png")}
        style={{ width: 18, height: 18 }}
      />
    </Pressable>
  );
}
