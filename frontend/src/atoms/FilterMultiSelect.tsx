import { useRef, useState } from "react";
import { View, Text, Pressable, ScrollView, Image, Modal, TouchableWithoutFeedback, TextInput } from "react-native";
import { colors } from "../styles/colors";
import { styles } from "../styles/styles";
import { FilterMultiSelectProps } from "../types/types";


export default function FilterMultiSelect({ label, options, selectedValues, onChange }: FilterMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const buttonRef = useRef<any>(null);

  const openAndMeasure = () => {
    setOpen(true);
    requestAnimationFrame(() => {
      buttonRef.current?.measureInWindow(
        (x: number, y: number, width: number, height: number) => {
          setMenuPos({ x, y, width, height });
        }
      );
    });
  };

  const toggle = () => {
    if (!open) openAndMeasure();
    else setOpen(false);
  };

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase())
  );

  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const selectedLabels = options
    .filter((o) => selectedValues.includes(o.value))
    .map((o) => o.label)
    .join(", ");

  return (
    <View style={styles.userInputContainer}>
      <Pressable
        ref={buttonRef}
        style={styles.dropdownContainer}
        onPress={toggle}
      >
        <Text
          style={[
            styles.dropdownSelectedText,
            selectedValues.length === 0 && styles.dropdownPlaceholderText,
          ]}
        >
          {selectedValues.length ? selectedLabels : label}
        </Text>

        <Image
          source={require("../../assets/chevron_icons/chevron_down.png")}
          style={[styles.dropdownIcon, open && styles.dropdownIconOpen]}
        />
      </Pressable>

      {open && (
        <Modal transparent visible onRequestClose={() => setOpen(false)}>
          <View style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={() => setOpen(false)}>
              <View style={styles.dropdownBackdrop} />
            </TouchableWithoutFeedback>

            <View
              style={[
                styles.dropdownMenu,
                {
                  position: "absolute",
                  top: menuPos.y + menuPos.height,
                  left: menuPos.x,
                  width: menuPos.width,
                  maxHeight: 150,
                },
              ]}
            >
              {/* Search */}
              <View
                style={styles.filterMultiSelectSearchContainer}
              >
                <TextInput
                  placeholder="Search..."
                  value={query}
                  onChangeText={setQuery}
                  style={styles.filterMultiSelectSearchText}
                />
                <Image
                  source={require("../../assets/search_icon.png")}
                  style={{ width: 16, height: 16, tintColor: colors.gray_500 }}
                />
              </View>

              <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
                {filtered.map((item) => {
                  const selected = selectedValues.includes(item.value);

                  return (
                    <Pressable
                      key={item.value}
                      onPress={() => toggleValue(item.value)}
                      style={[
                        styles.dropdownMenuOption,
                        selected && { backgroundColor: colors.primary_100 },
                        { flexDirection: "row", alignItems: "center" },
                      ]}
                    >
                      {/* Checkbox */}
                      <Image
                        source={
                          selected
                            ? require("../../assets/checkbox_icons/box_checked_icon.png")
                            : require("../../assets/checkbox_icons/box_unchecked_icon.png")
                        }
                        style={{
                          width: 20,
                          height: 20,
                          marginRight: 8,
                          tintColor: selected ? colors.primary_700 : undefined, 
                        }}
                      />

                      <Text
                        style={[
                          styles.dropdownMenuOptionText,
                          selected && { color: colors.primary_700, fontWeight: "600", },
                        ]}
                      >
                        {item.label}
                      </Text>
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
