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

  // Reduce vertical gap between lines of dates
  // @ts-ignore
  "stylesheet.calendar.main": {
    week: {
      marginTop: 2,
      marginBottom: 2,
      flexDirection: "row",
      justifyContent: "space-around",
    },
  },
}


type CustomMarkedDate = {
  customStyles?: {
    container?: ViewStyle;
    text?: TextStyle;
  };
  dots?: Array<{ key: string; color: string }>;
  selected?: boolean;
  selectedColor?: string;
  selectedTextColor?: string;
  activeOpacity?: number;
  // Custom property to handle dash logic
  isNoEvent?: boolean;
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
    case "school event":
      return colors.event_school_event; 
    case "announcement":
      return colors.event_announcement; 
    default:
      return colors.event_default; 
  }
};

export const calendarMarkedDates = (selectedDate: string, todayString: string, eventDates?: EventDate[]): CalendarMarkedDates => {
  const marked: CalendarMarkedDates = {};

  // Build event type map for dots
  const eventTypeMap = new Map<string, string[]>();
  if (eventDates) {
    eventDates.forEach((event) => {
      const parseDate = (dStr: string) => {
        if (dStr.includes("/")) {
          const [d, m, y] = dStr.split("/").map(Number);
          return new Date(y, m - 1, d);
        }
        return new Date(dStr);
      };

      const start = parseDate(event.startDate);
      const end = parseDate(event.endDate || event.startDate);
      
      for (let current = new Date(start); current <= end; current.setDate(current.getDate() + 1)) {
        const key = current.toISOString().split("T")[0];
        const arr = eventTypeMap.get(key) ?? [];
        arr.push(event.eventType ?? "other");
        eventTypeMap.set(key, arr);
      }
    });
  }

  // Always mark selected date (whether it's today or not)
  const selectedTypes = eventTypeMap.get(selectedDate) ?? [];
  const selectedDots = selectedTypes.slice(0, 3).map((t, i) => ({ key: `event${i + 1}`, color: eventTypeColor(t) })); // Use original event colors

  // Selected date styling - filled background with primary color
  marked[selectedDate] = {
    selected: true,
    selectedColor: colors.primary_100,
    selectedTextColor: colors.primary_600,
    // When no dots, the native background can look shifted. 
    // We combine native selection with centering offsets to ensure visual balance.
    customStyles: {
      container: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.primary_600,
      },
      text: {
        // Ensuring text is not bolded for selected date
        fontWeight: "400",
        textAlign: "center",
      }
    },
    ...(selectedDots.length > 0 && { dots: selectedDots }),
    isNoEvent: selectedDots.length === 0,
  };

  // Mark today if not selected
  if (selectedDate !== todayString) {
    const todayTypes = eventTypeMap.get(todayString) ?? [];
    const todayDots = todayTypes.slice(0, 3).map((t, i) => ({ key: `event${i + 1}`, color: eventTypeColor(t) }));

    marked[todayString] = {
      customStyles: {
        container: {
          // Remove circular background and border for today, keeping only bold text
          backgroundColor: 'transparent',
        },
        text: {
          color: colors.primary_600,
          fontWeight: "700",
        },
      },
      ...(todayDots.length > 0 && { dots: todayDots }),
      isNoEvent: todayDots.length === 0,
    };
  }

  // Mark other event dates with just dots
  eventTypeMap.forEach((typesArr, dateStr) => {
    if (dateStr === selectedDate || dateStr === todayString) return;
    const dotsForDate = typesArr.slice(0, 3).map((t, i) => ({ key: `event${i + 1}`, color: eventTypeColor(t) }));
    if (dotsForDate.length > 0) {
      marked[dateStr] = { 
        dots: dotsForDate 
      };
    }
  });

  // New addition: Mark ALL other dates in the month (approximately) as having No Event
  // The calendar component only shows dates that are actually rendered, so we just need a baseline.
  // We'll calculate the current month range to ensure at least those have the dash.
  const [y, m] = todayString.split("-").map(Number);
  const daysInMonth = new Date(y, m, 0).getDate();
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
    if (!marked[dateStr]) {
      marked[dateStr] = { isNoEvent: true };
    }
  }

  return marked;
};