import { View, TextInput, Image, Pressable } from "react-native";
import { styles } from "../styles/styles";
import { UserInputProps } from "../types/types";

function UserInput({
  inputValue, 
  placeholder, 
  onChangeInputText, 
  secureInputTextEntry = false, 
  containerStyle, 
  inputStyle,
  rightIconSource,
  onPressRightIcon,
  rightIconStyle,
  multiline = false }: UserInputProps & { containerStyle?: any; inputStyle?: any; multiline?: boolean }) {

  return (
    <View style={[styles.userInputContainer, containerStyle]}>
      <TextInput
        value={inputValue}
        placeholder={placeholder}
        onChangeText={onChangeInputText}
        secureTextEntry={secureInputTextEntry}
        style={[styles.userInputText, inputStyle]}
        multiline={multiline}
      />
      {rightIconSource && (
        <Pressable onPress={onPressRightIcon}>
          <Image source={rightIconSource} style={[styles.userInputIcon, rightIconStyle]} />
        </Pressable>
      )}
    </View>
  );
}

export default UserInput;
