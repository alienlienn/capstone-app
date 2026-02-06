import { Pressable, Text, Image } from "react-native";
import { colors } from "../styles/colors";

interface Props {
  icon: any;
  label: string;
  tintColor: string;
  onPress: () => void;
}

export default function ActionMenuItem({
  icon,
  label,
  tintColor,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
      }}
    >
      <Image
        source={icon}
        style={{
          width: 22,
          height: 22,
          tintColor,
          marginRight: 12,
        }}
      />

      <Text
        style={{
          flex: 1,
          fontSize: 16,
          fontWeight: "500",
          color: colors.primary_850,
        }}
      >
        {label}
      </Text>

      <Image
        source={require("../../assets/chevron_icons/chevron_right.png")}
        style={{
          width: 16,
          height: 16,
          tintColor: colors.gray_400,
        }}
      />
    </Pressable>
  );
}
