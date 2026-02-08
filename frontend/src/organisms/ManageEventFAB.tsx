import { Modal, Pressable, View } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import FloatingButton from "../atoms/FloatingButton";
import EventActionMenu from "../molecules/EventActionMenu";
import { styles } from "../styles/styles";

export default function ManageEventFAB() {
  const navigation = useNavigation<any>();
  const [open, setOpen] = useState(false);

  return (
    <>
      <FloatingButton
        label="Manage Event"
        iconSource={require("../../assets/calendar_icon.png")}
        onPress={() => setOpen(true)}
      />
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          style={styles.modalCenteredOverlay}
          onPress={() => setOpen(false)}
        >
          <EventActionMenu
            onCreate={() => {
              setOpen(false);
              navigation.navigate("CreateEvent");
            }}
            onEdit={() => {
              setOpen(false);
              // future: navigate to edit
            }}
            onRemove={() => {
              setOpen(false);
              // future: confirm delete
            }}
          />
        </Pressable>
      </Modal>
    </>
  );
}
