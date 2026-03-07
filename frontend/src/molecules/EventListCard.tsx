import { useEffect, useRef } from "react";
import { Pressable, View, Text, Image, Animated } from "react-native";
import { EventListCardProps } from "../types/types";
import { styles } from "../styles/styles";
import { colors } from "../styles/colors";


function formatDayMonth(dateStr: string) {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("default", { month: "short" }).toUpperCase();
  return { day, month };
}

export default function EventListCard({ date, title, venue, startTime, endTime, onPress, highlighted }: EventListCardProps) {
  const { day, month } = formatDayMonth(date);
  const isTimeMissing = !startTime || !endTime || (startTime === "00:00" && endTime === "00:00");
  const timeString = isTimeMissing ? "Not Specified" : `${startTime} - ${endTime}`;

  const venueString = venue || null;

  // Animation logic for smooth fade
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (highlighted) {
      // Instant highlight
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 0,
        useNativeDriver: false,
      }).start();
    } else {
      // Smooth fade out
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 600,
        useNativeDriver: false,
      }).start();
    }
  }, [highlighted]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.gray_50, colors.primary_50],
  });

  const borderColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.gray_50, colors.primary_300],
  });

  return (
    <Animated.View
      style={[
        styles.eventListCardContainer,
        {
          backgroundColor,
          borderColor,
          borderWidth: 1,
        }
      ]}
    >
      <Pressable 
        style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }} 
        onPress={onPress}
      >
      <View style={styles.eventListCardDateBox}>
        <Text style={styles.eventListCardDateBoxDay}>{day}</Text>
        <Text style={styles.eventListCardDateBoxMonth}>{month}</Text>
      </View>

      <View style={styles.eventListCardContent}>
        <Text style={styles.eventListCardTitle} numberOfLines={1}>
          {title || "Untitled Event"}
        </Text>
        {venueString && (
          <View style={styles.eventListCardRow}>
            <Image
              source={require("../../assets/venue_icon.png")}
              style={styles.eventListCardIcon}
            />
            <Text style={styles.eventListCardText} numberOfLines={1}>
              {venueString}
            </Text>
          </View>
        )}
        {!venueString && (
          <View style={styles.eventListCardRow}>
            <Image
              source={require("../../assets/venue_icon.png")}
              style={styles.eventListCardIcon}
            />
            <Text style={styles.eventListCardText}>
              Not Specified
            </Text>
          </View>
        )}
        {timeString && (
          <View style={styles.eventListCardRow}>
            <Image
              source={require("../../assets/time_icon.png")}
              style={styles.eventListCardIcon}
            />
            <Text style={styles.eventListCardText}>
              {timeString}
            </Text>
          </View>
        )}
      </View>

      <Animated.Image
        source={require("../../assets/chevron_icons/chevron_right.png")}
        style={styles.eventListCardChevron}
      />
      </Pressable>
    </Animated.View>
  );
}
