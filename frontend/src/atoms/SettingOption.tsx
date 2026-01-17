import { View, Text, Image, Pressable, StyleSheet, Switch } from "react-native";
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

export default function SettingOption({icon, label, onPress, showToggle = false, toggleValue, onToggleChange, showTopDivider = false}: SettingOptionProps) {
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
          <Switch
            value={toggleValue}
            onValueChange={onToggleChange}
            trackColor={{ false: colors.gray_300, true: colors.primary_650 }}
            thumbColor= {colors.gray_50}
            style={styles.switch}
          />
        )}
      </Pressable>

      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "94%",
    paddingHorizontal: 16
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 22,
  },

  compactRow: {
    paddingVertical: 8,
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

  switch: {
    transform: [{ scale: 0.90 }],
  },
});
