import { Image, View, ViewStyle, Platform } from "react-native";
import { ProfileAvatarProps } from "../types/types";
import { styles } from "../styles/styles";

export default function ProfileAvatar({
  imageUrl,
  containerStyle,
}: ProfileAvatarProps & { containerStyle?: ViewStyle }) {
  let displayUrl: any;

  if (Platform.OS === "web") {
    displayUrl = imageUrl || undefined;
  } else {
    displayUrl = imageUrl?.startsWith("http") || imageUrl?.startsWith("file://")
      ? imageUrl
      : undefined;
  }

  return (
    <View style={[styles.avatarContainer, containerStyle]}>
      <Image
        source={
          displayUrl
            ? { uri: displayUrl }
            : require("../../assets/default_profile_avatar.png")
        }
        style={styles.avatarImage}
        resizeMode="cover" 
      />
    </View>
  );
}
