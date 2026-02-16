import { Pressable, View, Text, Image } from "react-native";
import { EventListCardProps } from "../types/types";
import { styles } from "../styles/styles";


function formatDayMonth(dateStr: string) {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("default", { month: "short" }).toUpperCase();
  return { day, month };
}

export default function EventListCard({ date, title, venue, startTime, endTime, onPress }: EventListCardProps) {
  const { day, month } = formatDayMonth(date);
  const isTimeMissing = !startTime || !endTime || (startTime === "00:00" && endTime === "00:00");
  const timeString = isTimeMissing ? "Not Specified" : `${startTime} - ${endTime}`;

  const venueString = venue || null;

  return (
    <Pressable style={styles.eventListCardContainer} onPress={onPress}>
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

      <Image
        source={require("../../assets/chevron_icons/chevron_right.png")}
        style={styles.eventListCardChevron}
      />
    </Pressable>
  );
}
