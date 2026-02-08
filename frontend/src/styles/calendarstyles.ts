import { StyleSheet, ViewStyle, TextStyle } from "react-native";
import { colors } from "./colors";
import type { CalendarProps } from "react-native-calendars";


export const calendarStyles = StyleSheet.create({
  calendarContainer: {
    width: "100%",
    alignSelf: "center",
    marginTop: 4,
    marginBottom: 24,
  },

	calendarComponent: {
		borderRadius: 14,
    paddingBottom: 4,
    backgroundColor: colors.gray_50,
    borderWidth: 1,
    borderColor: colors.gray_100,
    elevation: 8,
    shadowColor: colors.gray_900,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
	},

  dayHeaderLineTop: {
    position: "absolute",
    top: 53, 
    left: 0,
    right: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray_200,
    marginHorizontal: 12,
  },

  dayHeaderLineBottom: {
    position: "absolute",
    top: 77, 
    left: 0,
    right: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray_200,
    marginHorizontal: 12,
  },

});


export const calendarTheme: CalendarProps["theme"] = {
	calendarBackground: colors.gray_50,

  monthTextColor: colors.gray_750,
  textMonthFontSize: 14,
  textMonthFontWeight: "700",
  arrowColor: colors.gray_450,

  textSectionTitleColor: colors.gray_750,
  textDayHeaderFontWeight: "700",
  textDayHeaderFontSize: 10,

  dayTextColor: colors.gray_600,
  textDayFontSize: 12,
  todayTextColor: colors.primary_600,

  dotColor: colors.event_default,
  selectedDotColor: colors.event_default,
}


type CustomMarkedDate = {
  customStyles?: {
    container?: ViewStyle;
    text?: TextStyle;
  };
  dots?: Array<{ key: string; color: string }>;
  selected?: boolean;
  activeOpacity?: number;
};

type CalendarMarkedDates = {
  [date: string]: CustomMarkedDate;
};

type EventDate = {
  startDate: string;
  endDate: string;
  eventType?: string; 
};

const eventTypeColor = (type?: string) => {
  switch ((type || "").toLowerCase()) {
    case "holiday":
      return colors.event_holiday; 
    case "exam":
      return colors.event_exams; 
    case "meeting":
      return colors.event_meeting; 
    case "announcement":
      return colors.event_announcement; 
    default:
      return colors.event_default; 
  }
};

export const calendarMarkedDates = (selectedDate: string, todayString: string, eventDates?: EventDate[]): CalendarMarkedDates => {
  const isTodaySelected = selectedDate === todayString;
  const marked: CalendarMarkedDates = {};

  const eventTypeMap = new Map<string, string[]>();
  if (eventDates) {
    eventDates.forEach((event) => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      for (let current = new Date(start); current <= end; current.setDate(current.getDate() + 1)) {
        const key = current.toISOString().split("T")[0];
        const arr = eventTypeMap.get(key) ?? [];
        arr.push(event.eventType ?? "other");
        eventTypeMap.set(key, arr);
      }
    });
  }

  if (isTodaySelected) {
    const types = eventTypeMap.get(selectedDate) ?? [];
    const dots = types.slice(0, 3).map((t, i) => ({ key: `event${i + 1}`, color: eventTypeColor(t) }));

    marked[selectedDate] = {
      customStyles: {
        container: {
          backgroundColor: colors.primary_700,
          borderRadius: 999,
          alignSelf: "center",
          justifyContent: "center",
        },
        text: {
          color: colors.gray_50,
          fontWeight: "800",
        },
      },
      ...(dots.length > 0 && { dots }),
    };

    eventTypeMap.forEach((typesArr, dateStr) => {
      if (dateStr === selectedDate) return;
      const dotsForDate = typesArr.slice(0, 3).map((t, i) => ({ key: `event${i + 1}`, color: eventTypeColor(t) }));
      if (dotsForDate.length > 0) marked[dateStr] = { dots: dotsForDate };
    });

    return marked;
  }

  const selectedTypes = eventTypeMap.get(selectedDate) ?? [];
  const selectedDots = selectedTypes.slice(0, 3).map((t, i) => ({ key: `event${i + 1}`, color: eventTypeColor(t) }));

  marked[selectedDate] = {
    customStyles: {
      container: {
        borderWidth: 2,
        borderColor: colors.primary_700,
        borderRadius: 999,
        alignSelf: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
      },
      text: {
        color: colors.primary_700,
        fontWeight: "700",
      },
    },
    ...(selectedDots.length > 0 && { dots: selectedDots }),
  };

  const todayTypes = eventTypeMap.get(todayString) ?? [];
  const todayDots = todayTypes.slice(0, 3).map((t, i) => ({ key: `event${i + 1}`, color: eventTypeColor(t) }));

  marked[todayString] = {
    customStyles: {
      container: {
        backgroundColor: colors.primary_700,
        borderRadius: 999,
        alignSelf: "center",
        justifyContent: "center",
      },
      text: {
        color: colors.gray_50,
        fontWeight: "800",
      },
    },
    ...(todayDots.length > 0 && { dots: todayDots }),
  };

  eventTypeMap.forEach((typesArr, dateStr) => {
    if (dateStr === selectedDate || dateStr === todayString) return;
    const dotsForDate = typesArr.slice(0, 3).map((t, i) => ({ key: `event${i + 1}`, color: eventTypeColor(t) }));
    if (dotsForDate.length > 0) marked[dateStr] = { dots: dotsForDate };
  });

  return marked;
};