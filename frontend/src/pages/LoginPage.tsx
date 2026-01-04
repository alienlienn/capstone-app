import { View, Image } from "react-native";
import LoginForm from "../organisms/LoginForm";
import { styles } from "../styles/styles";


function LoginPage() {
  return (
    <View style={styles.loginPageContainer}>
      <Image
        source={require("../../assets/educonnect_logo.png")}
        style={styles.logoImageSize}
        resizeMode="contain"
      />
      <LoginForm />
    </View>
  );
}

export default LoginPage;
