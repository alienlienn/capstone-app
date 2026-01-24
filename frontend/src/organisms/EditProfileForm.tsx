import { View, Pressable, Image, Text, ScrollView } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import UserInput from "../atoms/UserInput";
import Button from "../atoms/Button";
import ProfileAvatar from "../atoms/ProfileAvatar";
import { ProfileDetailsFormProps } from "../types/types";
import { styles } from "../styles/styles";


function EditProfileForm({ user, onUpdate }: ProfileDetailsFormProps) {
  const navigation = useNavigation<any>();

  const [firstName, setFirstName] = useState(user.first_name || "");
  const [lastName, setLastName] = useState(user.last_name || "");
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState(user.password ? "********" : "");
  const [gender, setGender] = useState(user.gender || "");
  const [mobileNumber, setMobileNumber] = useState(user.mobile_number || "");

  const handleUpdate = () => {
    const updatedPassword = password === "********" ? undefined : password;
    const updatedUser = {
      first_name: firstName,
      last_name: lastName,
      email,
      password: updatedPassword,
      gender,
      mobile_number: mobileNumber,
    };
    if (onUpdate) onUpdate(updatedUser);
    if (updatedPassword) setPassword("********");
  };

  return (
    <View style={styles.editProfileContainer}>
      <View style={styles.editProfileHeaderContainer}>
        <Pressable
          style={styles.backAction}
          onPress={() =>
            navigation.navigate("NavBarRoutes", { screen: "Profile" })
          }
        >
          <Image
            source={require("../../assets/chevron_left.png")}
            style={styles.backIcon}
          />
        </Pressable>
        <View style={{ alignSelf: "center" }}>
          <Text style={styles.editProfileHeaderTitle}>Edit Profile</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.editProfileAvatar}>
          <ProfileAvatar imageUrl={user.profile_image_url} />
        </View>

        <View style={styles.editProfileFormContainer}>
          <Text style={styles.editProfileFieldLabel}>First Name</Text>
          <UserInput
            containerStyle={{ width: "100%" }}
            inputValue={firstName}
            placeholder="First Name"
            onChangeInputText={setFirstName}
          />

          <Text style={styles.editProfileFieldLabel}>Last Name</Text>
          <UserInput
            containerStyle={{ width: "100%" }}
            inputValue={lastName}
            placeholder="Last Name"
            onChangeInputText={setLastName}
          />

          <Text style={styles.editProfileFieldLabel}>Email</Text>
          <UserInput
            containerStyle={{ width: "100%" }}
            inputValue={email}
            placeholder="Email"
            onChangeInputText={setEmail}
          />

          <Text style={styles.editProfileFieldLabel}>Password</Text>
          <UserInput
            containerStyle={{ width: "100%" }}
            inputValue={password}
            placeholder="Password"
            onChangeInputText={setPassword}
            secureInputTextEntry
          />

          <Text style={styles.editProfileFieldLabel}>Gender</Text>
          <UserInput
            containerStyle={{ width: "100%" }}
            inputValue={gender}
            placeholder="Gender"
            onChangeInputText={setGender}
          />

          <Text style={styles.editProfileFieldLabel}>Mobile Number</Text>
          <UserInput
            containerStyle={{ width: "100%" }}
            inputValue={mobileNumber}
            placeholder="Mobile Number"
            onChangeInputText={setMobileNumber}
          />
        </View>
        <View style={styles.saveChangesButton}>
          <Button
            buttonTitle="Save Changes"
            onPressButton={handleUpdate}
            width="100%"
          />
        </View>
      </ScrollView>
    </View>
  );
}

export default EditProfileForm;
