import React, { useRef, useEffect } from "react";
import { Modal, View, Image, ScrollView, Text, Animated, PanResponder, Pressable } from "react-native";
import { EventDetailsModalProps } from "../types/types";
import { colors } from "../styles/colors";
import { styles } from "../styles/styles";


export default function EventDetailsModal({ visible, event, onClose }: EventDetailsModalProps) {
  const translateY = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 100,
      }).start();
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 10,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          handleClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleClose = () => {
    Animated.timing(translateY, {
      toValue: 800,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose();
      translateY.setValue(600);
    });
  };

  return (
    <Modal 
      visible={visible} 
      transparent={true} 
      animationType="none" 
      onRequestClose={handleClose}
      statusBarTranslucent={true} // Allow the modal to draw under the status bar
    >
      <View style={{ flex: 1, backgroundColor: "transparent" }}>
        <Pressable 
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)" 
          }}
          onPress={handleClose}
        />
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
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
                paddingBottom: 60,
                marginBottom: -10,  
                maxHeight: "100%",
              }}
              onPress={(e) => e.stopPropagation()}
            >
            <View style={{ width: 40, height: 4, backgroundColor: "#E2E8F0", borderRadius: 2, alignSelf: "center", marginBottom: 24 }} />

            {event && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={{ fontSize: 22, fontWeight: "800", color: "#1E293B", marginBottom: 20 }}>
                  {event.title}
                </Text>

                {event.description && (
                  <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 13, fontWeight: "600", color: "#64748B", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
                      Description
                    </Text>
                    <Text style={{ fontSize: 15, color: "#475569", lineHeight: 22 }}>
                      {event.description}
                    </Text>
                  </View>
                )}

                {/* Date Range */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: "#64748B", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Date
                  </Text>
                  <Text style={{ fontSize: 15, color: "#475569" }}>
                    {event.startDate === event.endDate
                      ? event.startDate
                      : `${event.startDate} to ${event.endDate}`}
                  </Text>
                </View>

                {/* Time */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: "#64748B", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Time
                  </Text>
                  <Text style={{ fontSize: 15, color: "#475569" }}>
                    {event.startTime && event.endTime && !(event.startTime === "00:00" && event.endTime === "00:00")
                      ? `${event.startTime} - ${event.endTime}`
                      : "Not Specified"}
                  </Text>
                </View>

                {/* Venue */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: "#64748B", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Venue
                  </Text>
                  <Text style={{ fontSize: 15, color: "#475569" }}>
                    {event.venue || "Not Specified"}
                  </Text>
                </View>
              </ScrollView>
            )}
          </Pressable>
        </Animated.View>
      </View>
    </View>
  </Modal>
);
}
