import { View } from "react-native";
import ActionMenuItem from "../atoms/ActionMenuItem";
import { colors } from "../styles/colors";

interface Props {
  onCreate: () => void;
  onEdit: () => void;
  onRemove: () => void;
}

export default function EventActionMenu({
  onCreate,
  onEdit,
  onRemove,
}: Props) {
  return (
    <View
      style={{
        width: 260,
        backgroundColor: colors.gray_50,
        borderRadius: 16,
        overflow: "hidden",
        elevation: 12,
        shadowColor: colors.gray_900,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      }}
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
    <View
      style={{
        height: 1,
        backgroundColor: colors.gray_200,
        marginHorizontal: 16,
      }}
    />
  );
}
