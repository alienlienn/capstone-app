import { useRef, useState } from "react";
import { View, Text, Pressable, ScrollView, Image, Modal, TouchableWithoutFeedback, StyleSheet,} from "react-native";
import { DropdownProps } from "../types/types";
import { styles } from "../styles/styles";


function Dropdown({ value, placeholder, options, onSelect, height }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const buttonRef = useRef<any>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label || placeholder;

  const openAndMeasure = () => {
    setOpen(true);

    requestAnimationFrame(() => {
      if (buttonRef.current && buttonRef.current.measureInWindow) {
        buttonRef.current.measureInWindow((x: number, y: number, width: number, height: number) => {
          setMenuPos({ x, y, width, height });
        });
      }
    });
  };

  const toggle = () => {
    if (!open) openAndMeasure();
    else setOpen(false);
  };

  return (
    <View style={styles.userInputContainer}>
      <Pressable
        ref={buttonRef}
        style={[styles.dropdownContainer, height ? { height } : {}]}
        onPress={toggle}
      >
        <Text
          style={[
            styles.dropdownSelectedText,
            !value && styles.dropdownPlaceholderText,
          ]}
        >
          {selectedLabel}
        </Text>

        <Image
          source={require("../../assets/chevron_icons/chevron_down.png")}
          style={[styles.dropdownIcon, open && styles.dropdownIconOpen]}
        />
      </Pressable>

      {open && (
        <Modal
          transparent
          visible={open}
          animationType="none"
          onRequestClose={() => setOpen(false)}
        >
          <View style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={() => setOpen(false)}>
              <View style={styles.dropdownBackdrop} />
            </TouchableWithoutFeedback>

            {/* Menu positioned to align with button */}
            <View
              style={[
                styles.dropdownMenu,
                {
                  position: "absolute",
                  top: menuPos.y + menuPos.height, 
                  left: menuPos.x,
                  width: menuPos.width,
                  overflow: "visible",
                  maxHeight: 150,
                },
              ]}
            >
              <ScrollView
                style={{ maxHeight: 150 }}
                nestedScrollEnabled
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled"
              >
                {options.map((item, index) => {
                  const isLast = index === options.length - 1;
                  return (
                    <Pressable
                      key={item.value}
                      style={[
                        styles.dropdownMenuOption,
                        isLast && styles.dropdownMenuOptionLast,
                      ]}
                      onPress={() => {
                        onSelect(item.value);
                        setOpen(false);
                      }}
                    >
                      <Text style={styles.dropdownMenuOptionText}>{item.label}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

export default Dropdown;
