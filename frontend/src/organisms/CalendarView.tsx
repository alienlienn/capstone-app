import { useState } from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import EventListCard from "../molecules/EventListCard";
import EventDetailsModal from "../molecules/EventDetailsModal";
import { CalendarViewProps, Day, CalendarEvent } from "../types/types";
import { calendarStyles, calendarTheme, calendarMarkedDates } from "../styles/calendarstyles";
import { colors } from "../styles/colors";
import EventTypeLegend from "../molecules/EventTypeLegend";
import { styles } from "../styles/styles";


LocaleConfig.locales["custom"] = {
  monthNames: [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ],
  monthNamesShort: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
  dayNames: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
  dayNamesShort: ["S","M","T","W","T","F","S"],
};

LocaleConfig.defaultLocale = "custom";


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

export default function CalendarView({ month, year, events }: CalendarViewProps) {
  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const [selectedDate, setSelectedDate] = useState(todayString);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [highlightDate, setHighlightDate] = useState<string | null>(null);

  const currentMonth = month !== undefined ? month + 1 : today.getMonth() + 1;
  const currentYear = year ?? today.getFullYear();
  
  const lastDayOfMonth = new Date(currentYear, currentMonth, 0);
  const lastDayString = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(lastDayOfMonth.getDate()).padStart(2, "0")}`;

  const expandedEvents = expandEventsByDateRange(events ?? []);
  
  const onDayPress = (day: Day) => {
    const clickedDate = day.dateString;
    setSelectedDate(clickedDate);

    // Filter events for this specific date
    const eventsOnDay = expandedEvents.filter(e => e.startDate === clickedDate);
    
    if (eventsOnDay.length > 0) {
      // If it's a past date, open the modal for the first event
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const [y, m, d] = clickedDate.split("-").map(Number);
      const dateObj = new Date(y, m - 1, d);

      if (dateObj < today) {
        setSelectedEvent(eventsOnDay[0]);
        setShowEventModal(true);
      } else {
        // For current/future dates, just highlight
        setHighlightDate(clickedDate);
        setTimeout(() => {
          setHighlightDate(null);
        }, 1000);
      }
    }
  };

  const todayEvents: CalendarEvent[] = expandedEvents
    .filter(e => e.startDate === todayString)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  const upcomingEvents: CalendarEvent[] = expandedEvents
    .filter(e => e.startDate > todayString && e.startDate <= lastDayString)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  return (
    <View style={{ flex: 1 }}>
      {/* Legend is now only rendered in ChildCalendarSection for both views */}
      <Calendar
        current={`${currentYear}-${String(currentMonth).padStart(2, "0")}-01`}
        onDayPress={onDayPress}
        markingType="multi-dot"
        markedDates={calendarMarkedDates(selectedDate, todayString, events)}
        dayComponent={({ date, state, marking, onPress }: any) => {
          const isToday = todayString === date.dateString;
          const isSelected = selectedDate === date.dateString;
          const isDisabled = state === "disabled";
          const hasDots = marking?.dots && marking.dots.length > 0;
          
          return (
            <View style={{ width: 36, height: 44, alignItems: "center", justifyContent: "flex-start" }}>
              <View 
                style={[
                  { width: 36, height: 36, borderRadius: 18, justifyContent: "center", alignItems: "center" },
                  marking?.customStyles?.container,
                  isSelected && { backgroundColor: marking.selectedColor || colors.gray_200 },
                ]}
              >
                <Text 
                  onPress={() => onPress(date)}
                  style={[
                    { fontSize: 12, color: colors.gray_600 },
                    marking?.customStyles?.text,
                    isToday && { color: colors.primary_600, fontWeight: "700" },
                    isSelected && { color: marking.selectedTextColor || colors.gray_800 },
                    isDisabled && { color: "#d9e1e8" }
                  ]}
                >
                  {date.day}
                </Text>
              </View>
              
              <View style={{ flexDirection: "row", marginTop: -11, height: 8, alignItems: "center", justifyContent: "center" }}>
                {hasDots && (
                  marking.dots.map((dot: any, index: number) => (
                    <View 
                      key={index} 
                      style={{ 
                        width: 4, 
                        height: 4, 
                        borderRadius: 2, 
                        backgroundColor: dot.color, 
                        marginHorizontal: 1 
                      }} 
                    />
                  ))
                )}
              </View>
            </View>
          );
        }}
        theme={calendarTheme}
        style={calendarStyles.calendarComponent}
      />
      <View style={calendarStyles.dayHeaderLineTop} />
      <View style={calendarStyles.dayHeaderLineBottom} />

      <ScrollView
        style={{ marginTop: 16, flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {todayEvents.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text style={[styles.eventListLabel, { marginTop: 4 }]}>Today's Events</Text>
            {todayEvents.map((event, index) => (
              <EventListCard
                key={`today-${index}`}
                date={event.startDate}
                title={event.title}
                venue={event.venue}
                startTime={event.startTime}
                endTime={event.endTime}
                highlighted={highlightDate === event.startDate}
                onPress={() => {
                  setSelectedEvent(event);
                  setShowEventModal(true);
                }}
              />
            ))}
          </View>
        )}

        {upcomingEvents.length > 0 && (
          <View>
            <Text style={[styles.eventListLabel, { marginTop: 2 }]}>Upcoming Events</Text>
            {upcomingEvents.map((event, index) => (
              <EventListCard
                key={`upcoming-${index}`}
                date={event.startDate}
                title={event.title}
                venue={event.venue}
                startTime={event.startTime}
                endTime={event.endTime}
                highlighted={highlightDate === event.startDate}
                onPress={() => {
                  setSelectedEvent(event);
                  setShowEventModal(true);
                }}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <EventDetailsModal 
        visible={showEventModal} 
        event={selectedEvent} 
        onClose={() => setShowEventModal(false)} 
      />
    </View>
  );
}
