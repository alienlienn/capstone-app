import { Pressable, Text, PressableStateCallbackType } from "react-native";
import { styles, buttonDefault, buttonHover } from "../styles/styles";
import { ButtonProps } from "../types/types";


function Button({buttonTitle, onPressButton, width, height, disabled = false}: ButtonProps) {
  return (
    <Pressable
      onPress={onPressButton}
      disabled={disabled}
      style={(state: PressableStateCallbackType) => [
        styles.buttonContainer,
        buttonDefault(width, height, disabled),
        buttonHover(state.pressed, (state as any).hovered ?? false),
      ]}
    >
      <Text style={styles.buttonText}>{buttonTitle}</Text>
    </Pressable>
  );
}

export default Button;
