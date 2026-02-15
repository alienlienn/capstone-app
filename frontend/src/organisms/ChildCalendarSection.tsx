import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Dropdown from "../atoms/Dropdown";
import CalendarView from "./CalendarView";
import { styles } from "../styles/styles";
import { fetchAllEvents } from "../services/event";
import type { CalendarEvent } from "../types/types";

const CHILD_OPTIONS = [
  { label: "View All Children", value: "allChildren" },
  { label: "Alicia Tan", value: "alicia" },
  { label: "Brandon Tan", value: "brandon" },
  { label: "Charlotte Tan", value: "charlotte" },
];

type ViewMode = "calendar" | "list";

export default function ChildCalendarSection({ refreshKey }: { refreshKey?: number }) {
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      loadEvents();
    }, [])
  );

  // Re-load events when refreshKey changes
  React.useEffect(() => {
    loadEvents();
  }, [refreshKey]);

  const loadEvents = async () => {
    try {
      const fetchedEvents = await fetchAllEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error loading events:", error);
    }
  };

  return (
    <View style={styles.childCalendarSectionContainer}>
      <View style={styles.sectionRow}>
        <View style={{ flex: 1, position: "relative", zIndex: 10 }}>
          <Dropdown
            value={selectedChild}
            placeholder="Select child"
            options={CHILD_OPTIONS}
            onSelect={setSelectedChild}
            height={40}
          />
        </View>

        <View style={styles.segmentedToggle}>
          <Pressable
            style={[styles.segmentOption, viewMode === "calendar" && styles.segmentActive]}
            onPress={() => setViewMode("calendar")}
          >
            <Text style={[styles.segmentText, viewMode === "calendar" && styles.segmentTextActive]}>
              Calendar
            </Text>
          </Pressable>
          
          <Pressable
            style={[styles.segmentOption, viewMode === "list" && styles.segmentActive]}
            onPress={() => setViewMode("list")}
          >
            <Text style={[styles.segmentText, viewMode === "list" && styles.segmentTextActive]}>
              List
            </Text>
          </Pressable>
        </View>
      </View>

      {viewMode === "calendar" ? (
        <CalendarView events={events} />
      ) : (
        <View style={styles.listViewPlaceholder}>
          <Text style={styles.listViewPlaceholderText}>
            List view coming soon
          </Text>
        </View>
      )}
    </View>
  );
}
