// atoms/FloatingButton.tsx
import { Pressable, Text, ViewStyle, TextStyle, Image } from "react-native";
import { colors } from "../styles/colors";

interface FloatingButtonProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  iconSource?: any; // optional icon
}

function FloatingButton({label, onPress, style, textStyle, iconSource}: FloatingButtonProps) {
  return (
    <Pressable
      style={[
        {
          backgroundColor: colors.primary_700,
          paddingHorizontal: 14,
          height: 42,
          borderRadius: 999,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          position: "absolute",
          bottom: 16,
          right: 16,
          elevation: 8,
          shadowColor: colors.gray_900,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
        },
        style,
      ]}
      onPress={onPress}
    >
      {iconSource && (
        <Image
          source={iconSource}
          style={{ width: 16, height: 16, marginRight: 6, tintColor: colors.gray_50 }}
        />
      )}
      <Text
        style={[{ color: colors.gray_50, fontWeight: "600", fontSize: 14 }, textStyle]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default FloatingButton;