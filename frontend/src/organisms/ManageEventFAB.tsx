import { Modal, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import FloatingButton from "../atoms/FloatingButton";
import EventActionMenu from "../molecules/EventActionMenu";
import EventSearchModal from "./EventSearchModal";
import { CalendarEvent } from "../types/types";
import { styles } from "../styles/styles";

export default function ManageEventFAB({ onRefresh }: { onRefresh?: () => void }) {
  const navigation = useNavigation<any>();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <FloatingButton
        label="Manage Event"
        iconSource={require("../../assets/calendar_icon.png")}
        onPress={() => setMenuOpen(true)}
      />

      {/* Event Action Menu Modal */}
      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <Pressable
          style={styles.modalCenteredOverlay}
          onPress={() => setMenuOpen(false)}
        >
          <EventActionMenu
            onCreate={() => {
              setMenuOpen(false);
              navigation.navigate("CreateEvent");
            }}
            onEdit={() => {
              setMenuOpen(false);
              setSearchOpen(true);
            }}
            onRemove={() => {
              setMenuOpen(false);
              // TODO: confirm delete
            }}
          />
        </Pressable>
      </Modal>

      {/* Event Search / Edit Modal */}
      <EventSearchModal
        visible={searchOpen}
        onClose={() => {
          setSearchOpen(false);
          if (onRefresh) onRefresh();
        }}
        onSelect={(event) => {
          setSearchOpen(false);
          navigation.navigate("EditEvent", { event }); // Navigate to EditEvent screen with selected event
        }}
      />
    </>
  );
}
