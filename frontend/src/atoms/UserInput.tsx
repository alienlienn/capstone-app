import { View, TextInput } from "react-native";
import { styles } from "../styles/styles";
import { UserInputProps } from "../types/types";

function UserInput({inputValue, placeholder, onChangeInputText, secureInputTextEntry = false, containerStyle }: UserInputProps & { containerStyle?: any }) {
  return (
    <View style={[styles.userInputContainer, containerStyle]}>
      <TextInput
        value={inputValue}
        placeholder={placeholder}
        onChangeText={onChangeInputText}
        secureTextEntry={secureInputTextEntry}
        style={styles.userInputText}
      />
    </View>
  );
}

export default UserInput;
