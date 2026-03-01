import React, { useState } from "react";
import { Pressable, Text, View, Image, Modal, Linking, PanResponder, Animated } from "react-native";
import { TeacherCardProps } from "../types/types";
import { styles } from "../styles/styles";
import { ENV } from "../config/environment";
import LinkText from "../atoms/LinkText";
import { colors } from "../styles/colors";

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

  // Use a ref to keep track of the timestamp to avoid infinite re-renders if we put it in state without care
  // However, for this specific issue, we want to force a refresh if the URL is the same but the content might have changed.
  // The simplest way is to use the current time when the component mounts.
  
  const profileImage = React.useMemo(() => {
    if (!user.profile_image_url) return require("../../assets/default_profile_avatar.png");
    
    // Ensure the URL is absolute and add a timestamp to force fresh fetch
    const baseUrl = ENV.API_BASE_URL.endsWith('/') ? ENV.API_BASE_URL.slice(0, -1) : ENV.API_BASE_URL;
    let path = user.profile_image_url;
    
    // If the path already has a protocol, don't prepend baseUrl
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return { uri: `${path}${path.includes('?') ? '&' : '?'}t=${new Date().getTime()}` };
    }

    if (!path.startsWith('/')) {
      path = `/${path}`;
    }
    
    return { uri: `${baseUrl}${path}${path.includes('?') ? '&' : '?'}t=${new Date().getTime()}` };
  }, [user.profile_image_url]);

  const openTelegram = (mobile?: string) => {
    if (mobile) {
      const cleanMobile = mobile.replace(/\s+/g, "");
      const url = `https://t.me/${cleanMobile}`;
      Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
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
        <Image source={profileImage} style={{ width: 60, height: 60, borderRadius: 30, marginRight: 16 }} />
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
        <View style={{ backgroundColor: "#F8FAFC", padding: 8, borderRadius: 20 }}>
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
              
              <Image 
                source={profileImage}
                style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 16, borderWidth: 4, borderColor: "#F1F5F9" }}
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
