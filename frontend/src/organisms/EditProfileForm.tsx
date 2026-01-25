import { useEffect, useState } from "react";
import { View, Pressable, Image, Text, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

import UserInput from "../atoms/UserInput";
import Dropdown from "../atoms/Dropdown";
import Button from "../atoms/Button";
import ProfileAvatar from "../atoms/ProfileAvatar";

import { ProfileDetailsFormProps, DropdownOption } from "../types/types";
import { styles } from "../styles/styles";
import { fetchGenderOptions } from "../services/genderoption";


function EditProfileForm({ user, onUpdate }: ProfileDetailsFormProps) {
  const navigation = useNavigation<any>();
  const [firstName, setFirstName] = useState(user.first_name || "");
  const [lastName, setLastName] = useState(user.last_name || "");
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState(user.password ? "********" : "");
  const [gender, setGender] = useState<string | null>(user.gender || null);
  const [genderOptions, setGenderOptions] = useState<DropdownOption[]>([]);
  const [mobileNumber, setMobileNumber] = useState(user.mobile_number || "");

  useEffect(() => { fetchGenderOptions().then(setGenderOptions); }, []);

  const handleUpdate = () => {
    const updatedPassword =
      password === "********" ? undefined : password;

    const updatedUser = {
      first_name: firstName,
      last_name: lastName,
      email,
      password: updatedPassword,
      gender: gender ?? undefined,
      mobile_number: mobileNumber,
    };

    onUpdate?.(updatedUser);

    if (updatedPassword) {
      setPassword("********");
    }
  };

  const handleAvatarEdit = () => {
    console.log("Open image picker for avatar");
  };

  return (
    <View style={styles.editProfileContainer}>
      <View style={styles.editProfileHeaderContainer}>
        <Pressable
          style={styles.backAction}
          onPress={() => navigation.navigate("NavBarRoutes", { screen: "Profile" })}
        >
          <Image
            source={require("../../assets/chevron_icons/chevron_left.png")}
            style={styles.backIcon}
          />
        </Pressable>

        <View style={{ alignSelf: "center" }}>
          <Text style={styles.editProfileHeaderTitle}>
            Edit Profile
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator
      >
        <View style={styles.editProfileAvatar}>
          <Pressable onPress={handleAvatarEdit}>
            <ProfileAvatar imageUrl={user.profile_image_url} />
          </Pressable>

          <Pressable
            style={styles.editAvatarButton}
            onPress={handleAvatarEdit}
            hitSlop={5}
          >
            <Image
              source={require("../../assets/edit_image_icon.png")}
              style={styles.editAvatarIcon}
            />
          </Pressable>
        </View>

        {/* Form */}
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
          <Dropdown
            value={gender}
            placeholder="Select Gender"
            options={genderOptions}
            onSelect={setGender}
            containerStyle={{ width: "100%" }}
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
