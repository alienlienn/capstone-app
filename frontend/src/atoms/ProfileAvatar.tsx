import { Image, View, ViewStyle } from "react-native";
import { ProfileAvatarProps } from "../types/types";
import { styles } from "../styles/styles";


function ProfileAvatar({ imageUrl, containerStyle }: ProfileAvatarProps & { containerStyle?: ViewStyle }) {
  return (
    <View style={[styles.avatarContainer, containerStyle]}>
      <Image
        source={
          imageUrl
            ? { uri: imageUrl }
            : require("../../assets/default_profile_avatar.png") 
        }
        style={styles.avatarImage}
      />
    </View>
  );
}

export default ProfileAvatar;
