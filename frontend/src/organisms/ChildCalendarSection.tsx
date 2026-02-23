import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Dropdown from "../atoms/Dropdown";
import CalendarView from "./CalendarView";
import CalendarListView from "./CalendarListView";
import EventTypeLegend from "../molecules/EventTypeLegend";
import { styles } from "../styles/styles";
import { fetchAllEvents, fetchEventsBySchoolId } from "../services/event";
import { fetchStudentsByUserId } from "../services/auth";
import type { CalendarEvent, DropdownOption } from "../types/types";

type ViewMode = "calendar" | "list";

export default function ChildCalendarSection({ refreshKey }: { refreshKey?: number }) {
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [childOptions, setChildOptions] = useState<DropdownOption[]>([]);
  const [studentsData, setStudentsData] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [allSchoolEvents, setAllSchoolEvents] = useState<CalendarEvent[]>([]);

  const currentUser = (global as any).loggedInUser;
  const isParent = currentUser?.role === "user";

  useFocusEffect(
    React.useCallback(() => {
      if (isParent && currentUser?.id) {
        loadStudents();
      } else {
        loadEvents();
      }
    }, [currentUser])
  );

  // Re-load data when refreshKey changes
  React.useEffect(() => {
    if (isParent && currentUser?.id) {
      loadStudents();
    } else {
      loadEvents();
    }
  }, [refreshKey, currentUser]);

  // Re-filter events when selectedChild or allSchoolEvents change
  React.useEffect(() => {
    filterEventsByChild();
  }, [selectedChild, allSchoolEvents, studentsData]);

  const loadStudents = async () => {
    try {
      const students = await fetchStudentsByUserId(currentUser.id);
      setStudentsData(students);
      const options = students.map((s: any) => ({
        label: `${s.first_name} ${s.last_name || ""}`.trim(),
        value: s.id.toString()
      }));

      if (options.length > 1) {
        options.unshift({ label: "View All Children", value: "allChildren" });
        if (!selectedChild) setSelectedChild("allChildren");
      } else if (options.length === 1) {
        if (!selectedChild) setSelectedChild(options[0].value);
      }
      
      setChildOptions(options);
      
      // Load events for all unique schools these students belong to
      await loadEvents(students);
    } catch (error) {
      console.error("Error loading students:", error);
    }
  };

  const loadEvents = async (studentDataForParent?: any[]) => {
    try {
      let fetchedEvents: CalendarEvent[] = [];

      if (currentUser && currentUser.role === "super_admin") {
        fetchedEvents = await fetchAllEvents();
      } else if (isParent) {
        const data = studentDataForParent || studentsData;
        if (data && data.length > 0) {
          // Get unique school IDs from the children
          const schoolIds = Array.from(new Set(data.map((s: any) => s.school_id)));
          const eventPromises = schoolIds.map(id => fetchEventsBySchoolId(id as number));
          const results = await Promise.all(eventPromises);
          fetchedEvents = results.flat();
        } else if (currentUser.school_id) {
          fetchedEvents = await fetchEventsBySchoolId(currentUser.school_id);
        }
      } else if (currentUser && currentUser.school_id) {
        fetchedEvents = await fetchEventsBySchoolId(currentUser.school_id);
      }
      
      setAllSchoolEvents(fetchedEvents);
      if (!isParent) {
        setEvents(fetchedEvents);
      }
    } catch (error) {
      console.error("Error loading events:", error);
    }
  };

  const filterEventsByChild = () => {
    if (!isParent) return;

    if (!selectedChild || allSchoolEvents.length === 0) {
      setEvents([]);
      return;
    }

    let targetGroupsBySchool: { [schoolId: number]: string[] } = {};

    if (selectedChild === "allChildren") {
      // Collect groups per school for all children
      studentsData.forEach(s => {
        if (s.assigned_groups) {
          const groups = s.assigned_groups.split(",").map((g: string) => g.trim());
          const sId = s.school_id;
          if (!targetGroupsBySchool[sId]) targetGroupsBySchool[sId] = [];
          targetGroupsBySchool[sId] = Array.from(new Set([...targetGroupsBySchool[sId], ...groups]));
        }
      });
    } else {
      // Groups for specific child
      const child = studentsData.find(s => s.id.toString() === selectedChild);
      if (child && child.assigned_groups) {
        const groups = child.assigned_groups.split(",").map((g: string) => g.trim());
        targetGroupsBySchool[child.school_id] = groups;
      }
    }

    if (Object.keys(targetGroupsBySchool).length === 0) {
      setEvents([]);
      return;
    }

    const filtered = allSchoolEvents.filter(event => {
      const eSchoolId = event.schoolId;
      if (!eSchoolId || !targetGroupsBySchool[eSchoolId]) return false;
      
      if (!event.affectedGroups) return false;
      const eventGroups = event.affectedGroups.split(",").map(g => g.trim());
      
      // Show event if any of its affected groups match the student's groups IN THAT SCHOOL
      return eventGroups.some(eg => targetGroupsBySchool[eSchoolId].includes(eg));
    });

    setEvents(filtered);
  };

  return (
    <View style={styles.childCalendarSectionContainer}>
      <View style={styles.sectionRow}>
        {isParent && (
          <View style={{ flex: 1, position: "relative", zIndex: 10 }}>
            <Dropdown
              value={selectedChild}
              placeholder="Select child"
              options={childOptions}
              onSelect={setSelectedChild}
              height={40}
            />
          </View>
        )}

        <View style={[
          styles.segmentedToggle, 
          !isParent && { flex: 1, height: 40, marginLeft: 0, marginTop: 8 }
        ]}>
          <Pressable
            style={[
              styles.segmentOption, 
              viewMode === "calendar" && styles.segmentActive,
              !isParent && { flex: 1 }
            ]}
            onPress={() => setViewMode("calendar")}
          >
            <Text style={[styles.segmentText, viewMode === "calendar" && styles.segmentTextActive]}>
              Calendar
            </Text>
          </Pressable>
          
          <Pressable
            style={[
              styles.segmentOption, 
              viewMode === "list" && styles.segmentActive,
              !isParent && { flex: 1 }
            ]}
            onPress={() => setViewMode("list")}
          >
            <Text style={[styles.segmentText, viewMode === "list" && styles.segmentTextActive]}>
              List
            </Text>
          </Pressable>
        </View>
      </View>

      <EventTypeLegend />
      {viewMode === "calendar" ? (
        <CalendarView events={events} />
      ) : (
        <CalendarListView events={events} />
      )}
    </View>
  );
}
