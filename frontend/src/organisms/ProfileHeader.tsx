import { View, Text } from "react-native";
import ProfileAvatar from "../atoms/ProfileAvatar";
import { ProfileHeaderProps } from "../types/types";
import { styles } from "../styles/styles";


export default function ProfileHeader({fullName, phone, email, imageUrl}: ProfileHeaderProps) {
  return (
    <View>
      <View style={styles.profileHeaderBackground} />

      <View style={styles.headerContent}>
        <ProfileAvatar imageUrl={imageUrl} />

        <Text style={styles.displayName}>{fullName}</Text>

        <View style={styles.contactContainer}>
          {phone && (
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Contact No.</Text>
              <Text style={styles.contactValue}>{phone}</Text>
            </View>
          )}

          <View style={styles.contactRow}>
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={styles.contactValue}>{email}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

