import { StyleSheet, ViewStyle, TextStyle } from "react-native";
import { colors } from "./colors";
import type { CalendarProps } from "react-native-calendars";


export const calendarStyles = StyleSheet.create({
  calendarContainer: {
    width: "95%",
    alignSelf: "center",
    marginTop: 30,
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

  dotColor: "transparent",
  selectedDotColor: "transparent",
}


type CustomMarkedDate = {
  customStyles: {
    container?: ViewStyle;
    text?: TextStyle;
  };
};

type CalendarMarkedDates = {
  [date: string]: CustomMarkedDate;
};

export const calendarMarkedDates = (selectedDate: string, todayString: string): CalendarMarkedDates => {
  const isTodaySelected = selectedDate === todayString;

  return {
    [selectedDate]: {
      customStyles: {
        container: {
          backgroundColor: colors.primary_700,
          borderRadius: 999,
          alignSelf: "center",
          justifyContent: "center",
          marginTop: -3,
        },
        text: {
          color: colors.gray_50,
          fontWeight: "700",
        },
      },
    },

    ...(isTodaySelected
      ? {} 
      : {
          [todayString]: {
            customStyles: {
              container: {
                borderWidth: 1,
                borderColor: colors.primary_700,
                borderRadius: 999,
                alignSelf: "center",
                justifyContent: "center",
                marginTop: -3,
              },
              text: {
                color: colors.primary_700,
                fontWeight: "700",
              },
            },
          },
        }),
  };
};