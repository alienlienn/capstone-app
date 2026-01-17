import { View, Text, StyleSheet } from "react-native";
import ProfileAvatar from "../atoms/ProfileAvatar";
import { colors } from "../styles/colors";

type ProfileHeaderProps = {
  fullName: string;
  phone?: string;
  email: string;
  imageUrl?: string;
};

export default function ProfileHeader({
  fullName,
  phone,
  email,
  imageUrl,
}: ProfileHeaderProps) {
  return (
    <View>
      <View style={styles.topBackground} />

      <View style={styles.content}>
        <ProfileAvatar imageUrl={imageUrl} />

        <Text style={styles.name}>{fullName}</Text>

        <View style={styles.infoContainer}>
          {phone && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{phone}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mail</Text>
            <Text style={styles.infoValue}>{email}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBackground: {
    height: 170,
    backgroundColor: colors.primary_200,
  },
  content: {
    alignItems: "center",
    marginTop: -48,
    paddingHorizontal: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
    color: colors.primary_850, 
  },
  infoContainer: {
    marginTop: 16,
    width: "94%",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.gray_400, 
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary_850,
  },
});
