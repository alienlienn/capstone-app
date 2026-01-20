import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { colors } from "../styles/colors";

interface SettingOptionProps {
  icon: any;
  label: string;
  onPress?: () => void;
  showToggle?: boolean;
  toggleValue?: boolean;
  onToggleChange?: (value: boolean) => void;
  showTopDivider?: boolean;
}

export default function SettingOption({
  icon,
  label,
  onPress,
  showToggle = false,
  toggleValue,
  onToggleChange,
  showTopDivider = false,
}: SettingOptionProps) {
  return (
    <View style={styles.wrapper}>
      {showTopDivider && <View style={styles.divider} />}

      <Pressable
        onPress={onPress}
        disabled={showToggle}
        style={[styles.row, showToggle && styles.compactRow]}
      >
        <View style={styles.left}>
          <Image source={icon} style={styles.icon} />
          <Text style={styles.label}>{label}</Text>
        </View>

        {showToggle && (
          <Pressable
            onPress={() => onToggleChange?.(!toggleValue)}
            style={[styles.customSwitch, toggleValue && styles.customSwitchOn]}
          >
            <View
              style={[
                styles.customThumb,
                toggleValue && styles.customThumbOn,
              ]}
            />
          </Pressable>
        )}
      </Pressable>

      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "94%",
    paddingHorizontal: 16,
    alignSelf: "center",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
  },

  compactRow: {
    paddingVertical: 20,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    width: 20,
    height: 20,
    marginRight: 14,
    resizeMode: "contain",
  },

  label: {
    fontSize: 16,
    color: colors.primary_850,
    fontWeight: "400",
  },

  divider: {
    height: 1,
    backgroundColor: colors.gray_200,
  },

  customSwitch: {
    width: 42,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.7,
    borderColor: colors.primary_800,
    padding: 3,
    justifyContent: "center",
  },

  customSwitchOn: {
    backgroundColor: colors.primary_100,
    borderColor: colors.primary_600,
  },

  customThumb: {
    width: 16,
    height: 16,
    borderRadius: 10,
    backgroundColor: colors.primary_800,
    alignSelf: "flex-start",
  },

  customThumbOn: {
    alignSelf: "flex-end",
    backgroundColor: colors.primary_600,
  },
});
