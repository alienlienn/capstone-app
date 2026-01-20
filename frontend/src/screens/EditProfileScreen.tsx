import React from "react";
import { ScrollView } from "react-native";
import EditProfileDetailsForm from "../organisms/EditProfileForm";
import { styles } from "../styles/styles";

export default function EditProfileScreen({ route }: any) {
  const user = route.params?.user;

  return (
    <ScrollView style={styles.pageContainer}>
      <EditProfileDetailsForm user={user} />
    </ScrollView>
  );
}
