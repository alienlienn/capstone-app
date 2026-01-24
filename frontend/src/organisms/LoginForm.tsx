import { useState } from "react";
import { View, Text } from "react-native";
import Button from "../atoms/Button";
import UserInput from "../atoms/UserInput";
import LinkText from "../atoms/LinkText";
import { loginUser, fetchUserById } from "../services/auth";
import { LoginRequest } from "../types/types";
import { styles } from "../styles/styles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";


function LoginForm() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    const payload: LoginRequest = { email, password };
    try {
      setLoading(true);
      setErrorMessage(null);

      const loginResponse  = await loginUser(payload);
      const user = await fetchUserById(loginResponse.user_id);
      (global as any).loggedInUser = user;
      console.log("Logged in user:", user);

      navigation.navigate("NavBarRoutes", { screen: "Home" });
    } catch (error: any) {
      setErrorMessage(error?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    console.log("forgot pwd clicked")
  }

  return (
    <View style={styles.loginFormContainer}>
      <UserInput 
        placeholder="Email" 
        inputValue={email} 
        onChangeInputText={setEmail}
        secureInputTextEntry={false}
      />
      <UserInput 
        placeholder="Password" 
        inputValue={password} 
        onChangeInputText={setPassword} 
        secureInputTextEntry={true}
      />
      <LinkText 
        linkTitle="Forgot Password?" 
        onPressLink={handleForgotPassword}
      />

      {errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
      <Button
        buttonTitle={loading ? "Logging in..." : "Login"}
        onPressButton={handleLogin}
        disabled={loading}
      />
    </View>
  );
}

export default LoginForm;
