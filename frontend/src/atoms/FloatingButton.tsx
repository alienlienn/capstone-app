import { Pressable, Text, Image } from "react-native";
import { FloatingButtonProps } from "../types/types";
import { styles } from "../styles/styles";


function FloatingButton({label, onPress, style, textStyle, iconSource, iconStyle}: FloatingButtonProps) {
  return (
    <Pressable
      style={[styles.floatingButtonContainer, style]}
      onPress={onPress}
    >
      {iconSource && (
        <Image
          source={iconSource}
          style={[styles.floatingButtonIcon, iconStyle]}
        />
      )}
      <Text
        style={[styles.floatingButtonLabel, textStyle]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default FloatingButton;