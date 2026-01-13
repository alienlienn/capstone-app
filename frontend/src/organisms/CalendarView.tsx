import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { colors } from "../styles/colors";

/* Locale config */
LocaleConfig.locales["custom"] = {
  monthNames: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ],
  monthNamesShort: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ],
  dayNames: [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday"
  ],
  dayNamesShort: ["S", "M", "T", "W", "T", "F", "S"],
};
LocaleConfig.defaultLocale = "custom";

type CalendarViewProps = {
  month?: number;
  year?: number;
};

type Day = {
  dateString: string;
  day: number;
  month: number;
  year: number;
};

export default function CalendarView({ month, year }: CalendarViewProps) {
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(todayString);

  const currentMonth = month !== undefined ? month + 1 : today.getMonth() + 1;
  const currentYear = year ?? today.getFullYear();

  return (
    <View style={styles.calendarContainer}>
      <Calendar
        current={`${currentYear}-${String(currentMonth).padStart(2, "0")}-01`}
        onDayPress={(day: Day) => setSelectedDate(day.dateString)}
        markingType="custom"
        markedDates={{
          [selectedDate]: {
            customStyles: {
              container: {
                backgroundColor: colors.primary_400,
                borderRadius: 999,
                alignSelf: "center",
                justifyContent: "center",
                marginTop: -3,
              },
              text: {
                color: "#F9FAFB",
                fontWeight: "600",
              },
            },
          },
          [todayString]: {
            customStyles: {
              text: {
                fontWeight: "700",
                color: colors.primary_600,
              },
            },
          },
        }}
        theme={{
          calendarBackground: colors.gray_50,

          monthTextColor: colors.gray_750,
          textMonthFontSize: 14,
          textMonthFontWeight: "700",
          arrowColor: colors.gray_450,

          textSectionTitleColor: colors.gray_650,
          textDayHeaderFontWeight: "600",
          textDayHeaderFontSize: 10,

          dayTextColor: colors.gray_750,
          textDayFontSize: 12,
          todayTextColor: colors.primary_600,

          dotColor: "transparent",
          selectedDotColor: "transparent",
        }}
        style={styles.calendar}
      />

      {/* Bottom line under day names */}
      <View style={styles.dayHeaderLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    width: "92%",
    alignSelf: "center",
    marginTop: 24,
    marginBottom: 24,
  },
  calendar: {
    borderRadius: 14,
    paddingBottom: 8,
    backgroundColor: colors.gray_50,

    elevation: 4,
    shadowColor: colors.gray_900,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
  },
  dayHeaderLine: {
    height: 1,
    backgroundColor: colors.gray_300,
    marginTop: -240, // adjust to sit just under the day names
    marginHorizontal: 12,
  },
});
