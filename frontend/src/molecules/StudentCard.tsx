import { Pressable, Text, Image } from "react-native";
import { StudentCardProps } from "../types/types";
import { styles } from "../styles/styles";

export default function StudentCard({ firstName, lastName, onPress }: StudentCardProps) {
  return (
    <Pressable style={styles.studentCardContainer} onPress={onPress}>
      <Text style={styles.studentCardName}>
        {firstName} {lastName}
      </Text>
      <Image
        source={require("../../assets/chevron_icons/chevron_right.png")}
        style={styles.studentCardChevron}
      />
    </Pressable>
  );
}
