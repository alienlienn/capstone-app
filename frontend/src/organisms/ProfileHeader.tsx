import { View, Text } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import ProfileAvatar from "../atoms/ProfileAvatar";
import { ProfileHeaderProps, User } from "../types/types";
import { styles } from "../styles/styles";
import { fetchUserById } from "../services/auth";
import { ENV } from "../config/environment";

export default function ProfileHeader({ fullName, phone, email, imageUrl }: ProfileHeaderProps) {
  const [userData, setUserData] = useState<User>({
    id: (global as any).loggedInUser.id,
    first_name: (global as any).loggedInUser.first_name,
    last_name: (global as any).loggedInUser.last_name,
    email: (global as any).loggedInUser.email,
    gender: (global as any).loggedInUser.gender,
    mobile_number: (global as any).loggedInUser.mobile_number,
    profile_image_url: (global as any).loggedInUser.profile_image_url
      ? ((global as any).loggedInUser.profile_image_url.startsWith("http")
          ? (global as any).loggedInUser.profile_image_url
          : `${ENV.API_BASE_URL}${(global as any).loggedInUser.profile_image_url}`)
      : "",
  });

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      async function getUser() {
        try {
          const updatedUser = await fetchUserById(String((global as any).loggedInUser.id));
          if (!isActive) return;

          setUserData({
            ...updatedUser,
            profile_image_url: updatedUser.profile_image_url
              ? (updatedUser.profile_image_url.startsWith("http")
                  ? updatedUser.profile_image_url
                  : `${ENV.API_BASE_URL}${updatedUser.profile_image_url}`)
              : "",
          });
        } catch (err) {
          console.error("Failed to fetch user:", err);
        }
      }

      getUser();
      return () => { isActive = false };
    }, [])
  );

  return (
    <View>
      <View style={styles.profileHeaderBackground} />

      <View style={styles.headerContent}>
        <ProfileAvatar imageUrl={userData.profile_image_url} />

        <Text style={styles.displayName}>{`${userData.first_name} ${userData.last_name}`}</Text>

        <View style={styles.contactContainer}>
          {userData.mobile_number && (
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Contact No.</Text>
              <Text style={styles.contactValue}>{userData.mobile_number}</Text>
            </View>
          )}

          <View style={styles.contactRow}>
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={styles.contactValue}>{userData.email}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
