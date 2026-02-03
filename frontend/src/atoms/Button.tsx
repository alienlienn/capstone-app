import { Pressable, Text, PressableStateCallbackType, Image, ImageStyle, TextStyle } from "react-native";
import { styles, buttonDefault, buttonHover } from "../styles/styles";
import { ButtonProps } from "../types/types";


function Button({buttonTitle, onPressButton, width, height, disabled = false, buttonStyle, iconSource, iconStyle, textStyle}: ButtonProps) {
  return (
    <Pressable
      onPress={onPressButton}
      disabled={disabled}
      style={(state: PressableStateCallbackType) => [
        styles.buttonContainer,
        buttonDefault(width, height, disabled),
        buttonHover(state.pressed, (state as any).hovered ?? false),
        { flexDirection: iconSource ? "row" : "column", alignItems: "center", justifyContent: "center" },
        buttonStyle
      ]}
    >
      {iconSource && (
        <Image
          source={iconSource}
          style={[
            styles.buttonIcon,
            iconStyle, 
          ]}
        />
      )}
      <Text style={[styles.buttonText, textStyle]}>{buttonTitle}</Text>
    </Pressable>
  );
}

export default Button;
