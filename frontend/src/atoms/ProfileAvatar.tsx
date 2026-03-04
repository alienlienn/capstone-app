import React from "react";
import { Image, View, ViewStyle, Platform } from "react-native";
import { ProfileAvatarProps } from "../types/types";
import { styles } from "../styles/styles";
import { ENV } from "../config/environment";

export default function ProfileAvatar({
  imageUrl,
  containerStyle,
}: ProfileAvatarProps & { containerStyle?: ViewStyle }) {
  const displayUrl = React.useMemo(() => {
    if (!imageUrl) return null;

    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://") || imageUrl.startsWith("file://")) {
      return `${imageUrl}${imageUrl.includes('?') ? '&' : '?'}cache_bust=${new Date().getTime()}`;
    }

    const baseUrl = ENV.API_BASE_URL.endsWith('/') ? ENV.API_BASE_URL.slice(0, -1) : ENV.API_BASE_URL;
    let path = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    
    return `${baseUrl}${path}${path.includes('?') ? '&' : '?'}cache_bust=${new Date().getTime()}`;
  }, [imageUrl]);

  return (
    <View style={[styles.avatarContainer, containerStyle]}>
      <Image
        source={
          displayUrl
            ? { uri: displayUrl }
            : require("../../assets/default_profile_avatar.png")
        }
        style={[
          styles.avatarImage, 
          containerStyle?.width ? { width: containerStyle.width, height: containerStyle.height, borderRadius: (containerStyle as any).borderRadius || 999 } : {},
          !displayUrl ? { transform: [{ scale: 1.2 }] } : {}
        ]}
        resizeMode="cover" 
      />
    </View>
  );
}
