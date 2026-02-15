import { useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import EventListCard from "../molecules/EventListCard";
import EventDetailsModal from "./EventDetailsModal";
import { CalendarViewProps, Day, CalendarEvent } from "../types/types";
import { calendarStyles, calendarTheme, calendarMarkedDates } from "../styles/calendarstyles";
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

  const currentMonth = month !== undefined ? month + 1 : today.getMonth() + 1;
  const currentYear = year ?? today.getFullYear();
  
  const lastDayOfMonth = new Date(currentYear, currentMonth, 0);
  const lastDayString = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(lastDayOfMonth.getDate()).padStart(2, "0")}`;

  const expandedEvents = expandEventsByDateRange(events ?? []);
  const todayEvents: CalendarEvent[] = expandedEvents
    .filter(e => e.startDate === todayString)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  const upcomingEvents: CalendarEvent[] = expandedEvents
    .filter(e => e.startDate > todayString && e.startDate <= lastDayString)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  return (
    <View style={{ flex: 1 }}>
      <Calendar
        current={`${currentYear}-${String(currentMonth).padStart(2, "0")}-01`}
        onDayPress={(day: Day) => setSelectedDate(day.dateString)}
        markingType="multi-dot"
        markedDates={calendarMarkedDates(selectedDate, todayString, events)}
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
          <View style={{ marginBottom: 24 }}>
            <Text style={[styles.eventListLabel, { marginTop: 8 }]}>Today's Events</Text>
            {todayEvents.map((event, index) => (
              <EventListCard
                key={`today-${index}`}
                date={event.startDate}
                title={event.title}
                venue={event.venue}
                startTime={event.startTime}
                endTime={event.endTime}
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
            <Text style={[styles.eventListLabel, { marginTop: -4 }]}>Upcoming Events</Text>
            {upcomingEvents.map((event, index) => (
              <EventListCard
                key={`upcoming-${index}`}
                date={event.startDate}
                title={event.title}
                venue={event.venue}
                startTime={event.startTime}
                endTime={event.endTime}
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
