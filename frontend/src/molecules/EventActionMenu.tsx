import { View } from "react-native";
import ActionMenuItem from "../atoms/ActionMenuItem";
import { colors } from "../styles/colors";
import { EventActionMenuProps } from "../types/types";
import { styles } from "../styles/styles";


export default function EventActionMenu({ onCreate, onEdit, onRemove }: EventActionMenuProps) {
  return (
    <View
      style={styles.eventActionMenuContainer}
    >
      <ActionMenuItem
        label="Add New Event"
        icon={require("../../assets/create_icon.png")}
        tintColor={colors.primary_600}
        onPress={onCreate}
      />

      <Divider />

      <ActionMenuItem
        label="Edit Event"
        icon={require("../../assets/edit_icon.png")}
        tintColor={colors.error}
        onPress={onEdit}
      />

      <Divider />

      <ActionMenuItem
        label="Remove Event"
        icon={require("../../assets/delete_icon.png")}
        tintColor={colors.error}
        onPress={onRemove}
      />
    </View>
  );
}

function Divider() {
  return (
    <View style={styles.eventActionMenuDivider} />
  );
}
