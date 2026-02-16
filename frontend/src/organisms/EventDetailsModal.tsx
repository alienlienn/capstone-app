import React, { useRef } from "react";
import { Modal, View, Image, ScrollView, Text, Animated, PanResponder, StyleSheet } from "react-native";
import { EventDetailsModalProps } from "../types/types";
import { colors } from "../styles/colors";
import { styles } from "../styles/styles";


export default function EventDetailsModal({ visible, event, onClose }: EventDetailsModalProps) {
  const panY = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(
    panY.interpolate({ inputRange: [0, 600], outputRange: [0.5, 0], extrapolate: 'clamp' })
  ).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => evt.nativeEvent.locationY <= 40,
      onMoveShouldSetPanResponder: (evt, gestureState) => Math.abs(gestureState.dy) > 5 && evt.nativeEvent.locationY <= 40,
      onPanResponderMove: (evt, gestureState) => {
        const dy = Math.max(0, gestureState.dy);
        panY.setValue(dy);
      },
      onPanResponderRelease: (evt, gestureState) => {
        const dy = Math.max(0, gestureState.dy);
        const shouldClose = dy > 120;

        panY.stopAnimation(() => {
          if (shouldClose) {
            Animated.timing(panY, { toValue: 600, duration: 200, useNativeDriver: true }).start(() => {
              onClose();
              setTimeout(() => panY.setValue(0), 300);
            });
          } else {
            Animated.spring(panY, { toValue: 0, useNativeDriver: true, bounciness: 6 }).start();
          }
        });
      },
    })
  ).current;

  const translateY = panY.interpolate({ inputRange: [0, 1000], outputRange: [0, 1000], extrapolate: "clamp" });

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <Animated.View style={styles.eventDetailsModalView}>
        <Animated.View
          pointerEvents={visible ? 'auto' : 'none'}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.gray_900,
            opacity: backdropOpacity,
          }}
        />

        <Animated.View
          {...panResponder.panHandlers}
          style={[styles.eventDetailsModalContainer, { transform: [{ translateY }] }]}
        >
          <View style={{ alignItems: "center", marginBottom: 12 }}>
            <Image
              source={require("../../assets/drag_icon.png")}
              style={styles.eventDetailsModalDragIcon}
            />
          </View>

          {event && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.eventDetailsModalTitle}>
                {event.title}
              </Text>

              {event.description && (
                <View style={{ marginBottom: 16 }}>
                  <Text style={styles.eventDetailsModalLabel}>
                    DESCRIPTION
                  </Text>
                  <Text style={styles.eventDetailsModalText}>
                    {event.description}
                  </Text>
                </View>
              )}

              {/* Date Range */}
              <View style={{ marginBottom: 16 }}>
                <Text style={styles.eventDetailsModalLabel}>
                  DATE
                </Text>
                <Text style={styles.eventDetailsModalText}>
                  {event.startDate === event.endDate
                    ? event.startDate
                    : `${event.startDate} to ${event.endDate}`}
                </Text>
              </View>

              {/* Time */}
              <View style={{ marginBottom: 16 }}>
                <Text style={styles.eventDetailsModalLabel}>
                  TIME
                </Text>
                <Text style={styles.eventDetailsModalText}>
                  {event.startTime && event.endTime && !(event.startTime === "00:00" && event.endTime === "00:00")
                    ? `${event.startTime} - ${event.endTime}`
                    : "Not Specified"}
                </Text>
              </View>

              {/* Venue */}
              <View style={{ marginBottom: 16 }}>
                <Text style={styles.eventDetailsModalLabel}>
                  VENUE
                </Text>
                <Text style={styles.eventDetailsModalText}>
                  {event.venue || "Not Specified"}
                </Text>
              </View>
            </ScrollView>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
