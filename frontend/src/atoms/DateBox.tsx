import { Pressable, View, Text, Image } from "react-native";
import { styles } from "../styles/styles";
import { colors } from "../styles/colors";
import { DateBoxProps } from "../types/types";


export default function DateBox({ label, onPress }: DateBoxProps) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.dateBoxContainer}
    >
      <Text style={{ color: colors.gray_700 }}>{label}</Text>
      <Image
        source={require("../../assets/calendar_icon.png")}
        style={{ width: 18, height: 18 }}
      />
    </Pressable>
  );
}
