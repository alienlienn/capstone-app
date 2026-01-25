import { View, Text, Image, Pressable } from "react-native";
import { SettingOptionProps } from "../types/types";
import { styles } from "../styles/styles";


export default function SettingOption({icon, label, onPress, showToggle = false, toggleValue, onToggleChange, showTopDivider = false, showChevron = false}: SettingOptionProps) {
  return (
    <View style={styles.settingOptionWrapper}>
      {showTopDivider && <View style={styles.dividerLine} />}

      <Pressable
        onPress={onPress}
        disabled={showToggle}
        style={[styles.optionRow, showToggle && styles.optionRowCompact]}
      >
        <View style={styles.optionContent}>
          <Image source={icon} style={styles.optionIcon} />
          <Text style={styles.optionLabel}>{label}</Text>
        </View>

        {showToggle ? (
          <Pressable
            onPress={() => onToggleChange?.(!toggleValue)}
            style={[styles.customSwitch, toggleValue && styles.customSwitchOn]}
          >
            <View
              style={[styles.customThumb, toggleValue && styles.customThumbOn]}
            />
          </Pressable>
        ) : showChevron ? (
          <Image
            source={require("../../assets/chevron_icons/chevron_right.png")}
            style={styles.chevronIcon}
          />
        ) : null}
      </Pressable>

      <View style={styles.dividerLine} />
    </View>
  );
}

