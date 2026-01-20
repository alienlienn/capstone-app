// src/organisms/EditProfileDetailsForm.tsx
import { View, StyleSheet } from "react-native";
import { useState } from "react";
import UserInput from "../atoms/UserInput";
import Button from "../atoms/Button";
import { ProfileDetailsFormProps } from "../types/types";

function EditProfileDetailsForm({ user, onUpdate }: ProfileDetailsFormProps) {
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

    console.log("Updating user with data:", updatedUser);

    if (onUpdate) {
      onUpdate(updatedUser);
    }
    if (updatedPassword) setPassword("********");
  };

  return (
    <View style={styles.container}>
      <UserInput inputValue={firstName} placeholder="First Name" onChangeInputText={setFirstName} />
      <UserInput inputValue={lastName} placeholder="Last Name" onChangeInputText={setLastName} />
      <UserInput inputValue={email} placeholder="Email" onChangeInputText={setEmail} />
      <UserInput
        inputValue={password}
        placeholder="Password"
        onChangeInputText={setPassword}
        secureInputTextEntry
      />
      <UserInput inputValue={gender} placeholder="Gender" onChangeInputText={setGender} />
      <UserInput inputValue={mobileNumber} placeholder="Mobile Number" onChangeInputText={setMobileNumber} />

      <View style={styles.buttonWrapper}>
        <Button buttonTitle="Update" onPressButton={handleUpdate} width="100%" height={50} />
      </View>
    </View>
  );
}

export default EditProfileDetailsForm;


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    flex: 1,
    backgroundColor: "#F2F3FA",
  },
  buttonWrapper: {
    marginTop: 16,
    marginBottom: 20,
  },
});
