import { View, TextInput } from "react-native";
import { styles } from "../styles/styles";
import { UserInputProps } from "../types/types";

function UserInput({
  inputValue, 
  placeholder, 
  onChangeInputText, 
  secureInputTextEntry = false, 
  containerStyle, 
  inputStyle }: UserInputProps & { containerStyle?: any; inputStyle?: any }) {

  return (
    <View style={[styles.userInputContainer, containerStyle]}>
      <TextInput
        value={inputValue}
        placeholder={placeholder}
        onChangeText={onChangeInputText}
        secureTextEntry={secureInputTextEntry}
        style={[styles.userInputText, inputStyle]}
      />
    </View>
  );
}

export default UserInput;
