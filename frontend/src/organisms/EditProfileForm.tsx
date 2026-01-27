import { useEffect, useState } from "react";
import { View, Pressable, Image, Text, ScrollView, Alert, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

import UserInput from "../atoms/UserInput";
import Dropdown from "../atoms/Dropdown";
import Button from "../atoms/Button";
import ProfileAvatar from "../atoms/ProfileAvatar";
import { ProfileDetailsFormProps, DropdownOption } from "../types/types";
import { styles } from "../styles/styles";
import { fetchGenderOptions } from "../services/genderoption";
import { uploadProfileAvatar } from "../services/uploadprofileavatar"; // your API function

function EditProfileForm({ user, onUpdate }: ProfileDetailsFormProps) {
  const navigation = useNavigation<any>();

  const [firstName, setFirstName] = useState(user.first_name || "");
  const [lastName, setLastName] = useState(user.last_name || "");
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<string | null>(user.gender || null);
  const [genderOptions, setGenderOptions] = useState<DropdownOption[]>([]);
  const [mobileNumber, setMobileNumber] = useState(user.mobile_number || "");

  // Avatar states
  const [originalAvatarUri] = useState(user.profile_image_url || ""); 
  const [avatarUri, setAvatarUri] = useState(user.profile_image_url || ""); 
  const [localFile, setLocalFile] = useState<File | null>(null); 

  useEffect(() => {
    fetchGenderOptions().then(setGenderOptions);
  }, []);

  const handleAvatarEdit = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, 
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0].uri) {
        let uri = result.assets[0].uri;

        if (Platform.OS === "web") {
          const response = await fetch(uri);
          const blob = await response.blob();
          const file = new File([blob], "avatar.jpg", { type: blob.type });
          setLocalFile(file);
          uri = URL.createObjectURL(file); 
        }

        console.log("Picked image URI/file:", uri);
        setAvatarUri(uri); 
      } else {
        console.log("Image pick canceled or no URI");
      }
    } catch (err) {
      console.error("Avatar pick error:", err);
    }
  };

  const handleUpdate = async () => {
    const updatedPassword = password === "********" ? undefined : password;
    let uploadedAvatarUrl = originalAvatarUri;

    if (avatarUri !== originalAvatarUri) {
      try {
        if (Platform.OS === "web" && localFile) {
          uploadedAvatarUrl = await uploadProfileAvatar(user.id!, localFile);
        } else {
          uploadedAvatarUrl = await uploadProfileAvatar(user.id!, avatarUri);
        }
      } catch (err) {
        console.error("Upload failed:", err);
        Alert.alert("Error", "Failed to upload avatar. Please try again.");
        return;
      }
    }

    const updatedUser = {
      id: user.id,
      first_name: firstName,
      last_name: lastName,
      email,
      password: updatedPassword,
      gender: gender ?? undefined,
      mobile_number: mobileNumber,
      profile_image_url: uploadedAvatarUrl,
    };

    onUpdate?.(updatedUser);
    
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
            source={require("../../assets/chevron_icons/chevron_left.png")}
            style={styles.backIcon}
          />
        </Pressable>

        <View style={styles.editProfileTitleContainer}>
          <Text style={styles.editProfileTitle}>Edit Profile</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator
      >
        <View style={styles.editProfileAvatar}>
          <Pressable onPress={handleAvatarEdit}>
            <ProfileAvatar imageUrl={avatarUri} />
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
