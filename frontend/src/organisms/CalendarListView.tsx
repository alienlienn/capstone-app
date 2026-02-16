import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { colors } from "../styles/colors";
import type { CalendarEvent } from "../types/types";

// Helper to get color for event type
const eventTypeColor = (type?: string) => {
  switch ((type || "").toLowerCase()) {
    case "holiday": return colors.event_holiday;
    case "exam": return colors.event_exams;
    case "school event": return colors.event_school_event;
    case "announcement": return colors.event_announcement;
    default: return colors.event_default;
  }
};

function expandEventsByDateRange(events: CalendarEvent[]): CalendarEvent[] {
  const expanded: CalendarEvent[] = [];
  
  events.forEach(event => {
    const parseDate = (dStr: string) => {
      if (dStr.includes("/")) {
        const [d, m, y] = dStr.split("/").map(Number);
        return new Date(y, m - 1, d);
      }
      return new Date(dStr);
    };

    const startDate = parseDate(event.startDate);
    const endDate = parseDate(event.endDate || event.startDate);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const currentDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      expanded.push({
        ...event,
        startDate: currentDateStr,
      });
    }
  });
  
  return expanded;
}

// Group events by date
function groupEventsByDate(events: CalendarEvent[]) {
  const grouped: { [date: string]: CalendarEvent[] } = {};
  const expandedEvents = expandEventsByDateRange(events);
  
  expandedEvents.forEach(event => {
    const date = event.startDate;
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(event);
  });
  return grouped;
}

export default function CalendarListView({ events }: { events: CalendarEvent[] }) {
  const grouped = groupEventsByDate(events);
  const sortedDates = Object.keys(grouped).sort();
  const [expandedId, setExpandedId] = useState<string | number | null>(null);

  const toggleExpand = (id: string | number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={{ padding: 8 }}>
      {sortedDates.map((date, index) => (
        <View key={date}>
          {index > 0 && <View style={styles.dateDivider} />}
          <View style={styles.dateSection}>
            <Text style={styles.dateLabel}>{formatDate(date)}</Text>
            {grouped[date].map((event, idx) => {
              const id = event.id ? `${event.id}-${date}` : `${date}-${idx}`;
              const isExpanded = expandedId === id;
            
            return (
              <Pressable 
                key={id} 
                style={styles.eventCard}
                onPress={() => toggleExpand(id)}
              >
                <View style={[styles.eventTypeBar, { backgroundColor: eventTypeColor(event.eventType) }]} />
                <View style={styles.eventInfo}>
                  <View style={styles.titleRow}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Image 
                      source={require("../../assets/chevron_icons/chevron_down.png")} 
                      style={[styles.chevronIcon, isExpanded && styles.chevronRotated]} 
                    />
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Image 
                      source={require("../../assets/time_icon.png")} 
                      style={styles.icon} 
                    />
                    <Text style={styles.eventTime}>
                      {event.startTime && event.endTime 
                        ? `${event.startTime} - ${event.endTime}` 
                        : "Not Specified"}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Image 
                      source={require("../../assets/venue_icon.png")} 
                      style={styles.icon} 
                    />
                    <Text style={styles.eventVenue}>
                      {event.venue || "Not Specified"}
                    </Text>
                  </View>

                  {isExpanded && (
                    <View style={styles.descriptionContainer}>
                      <View style={styles.divider} />
                      <Text style={styles.descriptionText}>
                        {event.description || "- No Description -"}
                      </Text>
                    </View>
                  )}
                </View>
              </Pressable>
            );
          })}
          </View>
        </View>
      ))}
    </View>
  );
}

function formatDate(dateStr: string) {
  // Format YYYY-MM-DD to 'Tuesday, 21st May 2026'
  const d = new Date(dateStr);
  const day = d.toLocaleDateString(undefined, { weekday: "long" });
  const dayNum = d.getDate();
  const month = d.toLocaleDateString(undefined, { month: "long" });
  const year = d.getFullYear();
  const suffix = getDaySuffix(dayNum);
  return `${day}, ${dayNum}${suffix} ${month} ${year}`;
}
function getDaySuffix(day: number) {
  if (day >= 11 && day <= 13) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

const styles = StyleSheet.create({
  dateDivider: {
    height: 1,
    backgroundColor: colors.gray_200,
    marginTop: -2,
    marginBottom: 14,
    marginHorizontal: 2,
  },
  dateSection: {
    marginBottom: 18,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.gray_700,
    marginVertical: 6,
    marginLeft: 2,
  },
  eventCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.gray_50,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    shadowColor: colors.gray_900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  eventTypeBar: {
    width: 6,
    alignSelf: "stretch",
    borderRadius: 3,
    marginRight: 10,
  },
  eventInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.gray_900,
  },
  chevronIcon: {
    width: 14,
    height: 14,
    tintColor: colors.gray_400,
  },
  chevronRotated: {
    transform: [{ rotate: "180deg" }],
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  icon: {
    width: 12,
    height: 12,
    marginRight: 4,
    tintColor: colors.gray_450,
  },
  eventTime: {
    fontSize: 12,
    color: colors.gray_500,
    textAlign: "center",
  },
  eventVenue: {
    fontSize: 12,
    color: colors.gray_500,
    textAlign: "center",
  },
  descriptionContainer: {
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray_200,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 13,
    color: colors.gray_600,
    lineHeight: 18,
  },
});
