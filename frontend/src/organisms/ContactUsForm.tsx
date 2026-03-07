import React, { useState, useEffect } from "react";
import { View, FlatList, ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UserInput from "../atoms/UserInput";
import TeacherCard from "../molecules/TeacherCard";
import { fetchAdminsBySchool } from "../services/auth";
import { User } from "../types/types";

interface ContactUsFormProps {
  userId: number;
}

const ContactUsForm = ({ userId }: ContactUsFormProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [admins, setAdmins] = useState<User[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdmins = async () => {
      try {
        const data = await fetchAdminsBySchool(userId);
        setAdmins(data);
        setFilteredAdmins(data);
      } catch (error) {
        console.error("Error loading contacts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadAdmins();
    }
  }, [userId]);

  const currentUser = (global as any).loggedInUser;
  const userRole = currentUser?.role;

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = admins.filter((admin) => {
      const fullName = `${admin.first_name} ${admin.last_name}`.toLowerCase();
      return fullName.includes(text.toLowerCase());
    });
    setFilteredAdmins(filtered);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const placeholderText = userRole === 'user' ? "Search Teachers..." : "Search Parents...";
  const emptyListText = userRole === 'user' ? "No Teachers found." : "No Parents found.";

  return (
    <SafeAreaView 
      style={{ flex: 1, width: "95%", alignSelf: "center", paddingTop: 16 }}
      edges={['top', 'left', 'right']}
    >
      <UserInput
        inputValue={searchQuery}
        placeholder={placeholderText}
        onChangeInputText={handleSearch}
        rightIconSource={require("../../assets/search_icon.png")}
      />
      <FlatList
        data={filteredAdmins}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 4 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TeacherCard
            user={item}
          />
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20, color: "#666" }}>
            {emptyListText}
          </Text>
        }
      />
    </SafeAreaView>
  );
};

export default ContactUsForm;
