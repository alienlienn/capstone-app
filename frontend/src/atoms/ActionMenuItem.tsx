import { Pressable, Text, Image } from "react-native";
import { ActionMenuItemProps } from "../types/types";
import { styles } from "../styles/styles";


export default function ActionMenuItem({ icon, label, tintColor, onPress }: ActionMenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.actionMenuItemContainer}
    >
      <Image
        source={icon}
        style={[styles.actionMenuItemIcon, { tintColor }]}
      />

      <Text
        style={styles.actionMenuItemLabel}
      >
        {label}
      </Text>

      <Image
        source={require("../../assets/chevron_icons/chevron_right.png")}
        style={[styles.chevronIcon, { marginRight: 4, }]}
      />
    </Pressable>
  );
}
