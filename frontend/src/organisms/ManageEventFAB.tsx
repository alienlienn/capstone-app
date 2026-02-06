import { Modal, Pressable, View } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import FloatingButton from "../atoms/FloatingButton";
import EventActionMenu from "../molecules/EventActionMenu";

export default function ManageEventFAB() {
  const navigation = useNavigation<any>();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Existing Floating Button */}
      <FloatingButton
        label="Manage Event"
        iconSource={require("../../assets/calendar_icon.png")}
        onPress={() => setOpen(true)}
      />

      {/* Floating Menu */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.25)",
            justifyContent: "center",
            alignItems: "center",
          }}
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
