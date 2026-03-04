import React, { useState } from "react";
import { Pressable, Text, View, Image, Modal, Linking, PanResponder, Animated } from "react-native";
import { TeacherCardProps } from "../types/types";
import { styles } from "../styles/styles";
import { ENV } from "../config/environment";
import LinkText from "../atoms/LinkText";
import { colors } from "../styles/colors";
import ProfileAvatar from "../atoms/ProfileAvatar";

export default function TeacherCard({ user, onPress }: TeacherCardProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const translateY = React.useRef(new Animated.Value(0)).current;

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 10,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          closeModal();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const closeModal = () => {
    Animated.timing(translateY, {
      toValue: 800, // Move further down to ensure it's off-screen
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      // Removed the immediate reset of translateY. 
      // It will be reset when the modal is opened again in handlePress.
    });
  };

  const openTelegram = (mobile?: string) => {
    if (mobile) {
      // Clean mobile number - keep only digits and plus sign
      const cleanMobile = mobile.replace(/[^\d+]/g, "");
      
      // Ensure it starts with a plus if it's a mobile number
      // Telegram t.me links work best with the international format without the "+" prefix for phone numbers
      const phoneForLink = cleanMobile.startsWith("+") ? cleanMobile.substring(1) : cleanMobile;
      
      const url = `https://t.me/+${phoneForLink}`;
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          // Fallback to web link if app isn't installed
          Linking.openURL(`https://web.telegram.org/post?phone=${phoneForLink}`);
        }
      }).catch(err => console.error("Couldn't load page", err));
    }
  };

  const openOutlook = (email: string) => {
    const url = `mailto:${email}`;
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const handlePress = () => {
    translateY.setValue(600); // Start off-screen
    setModalVisible(true);
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      damping: 20,
      stiffness: 100,
    }).start();
    if (onPress) onPress();
  };

  return (
    <>
      <Pressable 
        style={{ 
          backgroundColor: "#FFFFFF", 
          borderRadius: 14, 
          padding: 14, 
          marginBottom: 16, 
          flexDirection: "row", 
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#F1F5F9",
          // iOS Shadow
          shadowColor: colors.gray_900,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          // Android Shadow
          elevation: 3,
        }} 
        onPress={handlePress}
      >
        <ProfileAvatar 
          imageUrl={user.profile_image_url} 
          containerStyle={{ 
            width: 60, 
            height: 60, 
            borderRadius: 999, 
            marginRight: 16, 
            marginTop: 0,
            borderWidth: 2,
            borderColor: "#F1F5F9",
            elevation: 4,
            shadowOpacity: 0.1,
            alignSelf: "center",
          }} 
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 17, fontWeight: "700", color: "#1E293B", letterSpacing: 0.2 }}>
            {user.first_name} {user.last_name}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
            <View style={{ backgroundColor: "#F1F5F9", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
              <Text style={{ fontSize: 11, fontWeight: "600", color: "#64748B", textTransform: "uppercase" }}>
                {user.school_role || "Admin"}
              </Text>
            </View>
          </View>
          <Text style={{ fontSize: 13, color: "#94A3B8", marginTop: 6 }}>{user.school_name || "N/A"}</Text>
        </View>
        <View style={{ padding: 8, borderRadius: 20 }}>
          <Image
            source={require("../../assets/chevron_icons/chevron_right.png")}
            style={{ width: 14, height: 14, tintColor: "#64748B" }}
          />
        </View>
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none" // Changed from "slide" to "none" for smoother custom closing
        onRequestClose={closeModal}
      >
        <Pressable 
          style={{ flex: 1, backgroundColor: "rgba(15, 23, 42, 0.6)", justifyContent: "flex-end" }}
          onPress={closeModal}
        >
          <Animated.View
            style={{
              transform: [{ translateY }],
              width: "100%",
            }}
            {...panResponder.panHandlers}
          >
            <Pressable 
              style={{ 
                width: "100%", 
                backgroundColor: "white", 
                borderTopLeftRadius: 24, 
                borderTopRightRadius: 24, 
                padding: 24, 
                alignItems: "center",
                paddingBottom: 40
              }}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={{ width: 40, height: 4, backgroundColor: "#E2E8F0", borderRadius: 2, marginBottom: 24 }} />
              
              <ProfileAvatar 
                imageUrl={user.profile_image_url}
                containerStyle={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: 40, 
                  marginBottom: 16, 
                  borderWidth: 4, 
                  borderColor: "#F8FAFC", 
                  marginTop: 0,
                  elevation: 8,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 12
                }}
              />
              <Text style={{ fontSize: 22, fontWeight: "800", color: "#1E293B" }}>{user.first_name} {user.last_name}</Text>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#64748B", marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>
                {user.school_role || "Admin"}
              </Text>
              <Text style={{ fontSize: 15, color: "#94A3B8", marginTop: 4 }}>{user.school_name || "N/A"}</Text>
              
              <View style={{ marginTop: 32, width: "100%" }}>
                <View style={{ gap: 12 }}>
                  <Pressable 
                    onPress={() => openTelegram(user.mobile_number)}
                    style={({ pressed }) => ({
                      backgroundColor: "#0088CC",
                      paddingVertical: 14,
                      paddingHorizontal: 20,
                      borderRadius: 14,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: pressed ? 0.8 : 1,
                      gap: 10
                    })}
                  >
                    <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 16 }}>Message on Telegram</Text>
                  </Pressable>

                  <Pressable 
                    onPress={() => openOutlook(user.email)}
                    style={({ pressed }) => ({
                      backgroundColor: "#0078D4",
                      paddingVertical: 14,
                      paddingHorizontal: 20,
                      borderRadius: 14,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: pressed ? 0.8 : 1,
                      gap: 10
                    })}
                  >
                    <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 16 }}>Send Outlook Email</Text>
                  </Pressable>
                </View>
              </View>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
}
