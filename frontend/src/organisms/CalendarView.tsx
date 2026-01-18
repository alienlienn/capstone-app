import { useState } from "react";
import { View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { CalendarViewProps, Day } from "../types/types";
import { calendarStyles, calendarTheme, calendarMarkedDates } from "../styles/calendarstyles";

// Configure custom locale
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

export default function CalendarView({ month, year }: CalendarViewProps) {
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(todayString);

  const currentMonth = month !== undefined ? month + 1 : today.getMonth() + 1;
  const currentYear = year ?? today.getFullYear();

  return (
    <View style={calendarStyles.calendarContainer}>
      <Calendar
        current={`${currentYear}-${String(currentMonth).padStart(2, "0")}-01`}
        onDayPress={(day: Day) => setSelectedDate(day.dateString)}
        markingType="custom"
        markedDates={calendarMarkedDates(selectedDate, todayString)}
        theme={calendarTheme}
        style={calendarStyles.calendarComponent}
      />
      <View style={calendarStyles.dayHeaderLineTop} />
      <View style={calendarStyles.dayHeaderLineBottom} />
    </View>
  );
}
