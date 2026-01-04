import { Pressable, Text, PressableStateCallbackType } from "react-native";
import { styles, forgotLinkTextPressed } from "../styles/styles";
import { LinkTextProps } from "../types/types";


function LinkText({ linkTitle, onPressLink }: LinkTextProps) {
  return (
    <Pressable 
      onPress={onPressLink} 
      style={styles.forgotPasswordContainer}
    >
      {(state: PressableStateCallbackType) => (
        <Text style={forgotLinkTextPressed(state.pressed)}>{linkTitle}</Text>
      )}
    </Pressable>
  );
}

export default LinkText;
