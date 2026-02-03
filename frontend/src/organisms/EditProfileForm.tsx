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
import { uploadProfileAvatar } from "../services/uploadprofileavatar"; 
import { updateUserProfile } from "../services/updateprofile"; 
import { ENV } from "../config/environment";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../styles/colors";

function EditProfileForm({ user }: ProfileDetailsFormProps) {
  const navigation = useNavigation<any>();
  const [firstName, setFirstName] = useState(user.first_name || "");
  const [lastName, setLastName] = useState(user.last_name || "");
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState("********");
  const [gender, setGender] = useState<string | null>(user.gender || null);
  const [genderOptions, setGenderOptions] = useState<DropdownOption[]>([]);
  const [mobileNumber, setMobileNumber] = useState(user.mobile_number || "");
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

        setAvatarUri(uri); 
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

    const payload = {
      first_name: firstName,
      last_name: lastName,
      email,
      password: updatedPassword,
      gender: gender ?? undefined,
      mobile_number: mobileNumber,
      profile_image_url: uploadedAvatarUrl
        ? uploadedAvatarUrl.startsWith("http")
          ? uploadedAvatarUrl
          : `${ENV.API_BASE_URL}${uploadedAvatarUrl}`
        : undefined,
    };

    try {
      await updateUserProfile(user.id!, payload);

      // Update global user
      (global as any).loggedInUser = { ...user, ...payload };

      Alert.alert("Success", "Profile updated successfully!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("NavBarRoutes", { screen: "Profile" }),
        },
      ]);
    } catch (err: any) {
      console.error("Update profile failed:", err);
      Alert.alert("Error", err.message || "Failed to update profile");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background_color }}>
      
      {/* Header with Back Button + Centered Title */}
      <View
        style={{
          width: "100%",
          height: 54,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          backgroundColor: colors.gray_50,
          borderTopWidth: 1,
          borderTopColor: colors.gray_200,
          elevation: 4,
          shadowColor: colors.gray_900,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          zIndex: 10,
        }}
      >
        {/* Back Button */}
        <Pressable
          style={{ padding: 8 }}
          onPress={() =>
            navigation.navigate("NavBarRoutes", { screen: "Profile" })
          }
        >
          <Image
            source={require("../../assets/chevron_icons/chevron_left.png")}
            style={{ width: 20, height: 20 }}
          />
        </Pressable>

        {/* Centered Title */}
        <Text
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 18,
            fontWeight: "600",
            color: colors.primary_850,
            marginRight: 28, // offset for back button
          }}
        >
          Edit Profile
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator>
        <View style={styles.editProfileAvatar}>
          <Pressable onPress={handleAvatarEdit}>
            <ProfileAvatar imageUrl={avatarUri} />
          </Pressable>

          <Pressable style={styles.editAvatarButton} onPress={handleAvatarEdit} hitSlop={5}>
            <Image
              source={require("../../assets/edit_image_icon.png")}
              style={styles.editAvatarIcon}
            />
          </Pressable>
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
          <Dropdown 
            value={gender} 
            placeholder="Select Gender" 
            options={genderOptions} 
            onSelect={setGender} 
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
    </SafeAreaView>
  );
}

export default EditProfileForm;
