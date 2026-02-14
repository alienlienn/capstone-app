import { Pressable, View, Text, Image, ViewStyle, TextStyle } from "react-native";
import { styles } from "../styles/styles";
import { colors } from "../styles/colors";
import { DateBoxProps } from "../types/types";

type ExtendedProps = DateBoxProps & {
  value?: string | null;
  placeholder?: string;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  showIcon?: boolean;
  hideLabel?: boolean; // ✅ new prop
};

export default function DateBox({
  label,
  value,
  placeholder = "Select date",
  onPress,
  disabled = false,
  containerStyle,
  textStyle,
  showIcon = true,
  hideLabel = true, // default true since Field renders the label
}: ExtendedProps) {
  const displayText = value || placeholder;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.dateBoxContainer,
        disabled && { opacity: 0.5 },
        containerStyle,
      ]}
    >
      <View>
        {!hideLabel && (
          <Text style={{ fontSize: 12, color: colors.gray_500 }}>
            {label}
          </Text>
        )}
        <Text style={[{ color: colors.gray_700, fontSize: 14 }, textStyle]}>
          {displayText}
        </Text>
      </View>

      {showIcon && (
        <Image
          source={require("../../assets/calendar_icon.png")}
          style={{ width: 18, height: 18 }}
        />
      )}
    </Pressable>
  );
}
