import { Image, StyleSheet, View } from "react-native";
import { colors } from "../styles/colors";

type ProfileAvatarProps = {
  imageUrl?: string;
};

function ProfileAvatar({ imageUrl }: ProfileAvatarProps) {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: imageUrl ?? "http://localhost:8000/static/default-avatar.png",
        }}
        style={styles.avatar}
      />
    </View>
  );
}

export default ProfileAvatar;

const styles = StyleSheet.create({
  container: {
    borderRadius: 60,
    padding: 2,
    elevation: 12,
    marginTop: -20,
    backgroundColor: colors.gray_50,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
