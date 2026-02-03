import { View, Text, Pressable, ScrollView, Image } from "react-native";
import { useState } from "react";
import { DropdownProps } from "../types/types";
import { styles } from "../styles/styles";


function Dropdown({ value, placeholder, options, onSelect, height }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const selectedLabel =
    options.find((o) => o.value === value)?.label || placeholder;

  return (
    <View style={styles.userInputContainer}>
      <Pressable
        style={[
          styles.dropdownContainer,
          height ? { height } : {}, // apply custom height if provided
        ]}
        onPress={() => setOpen((prev) => !prev)}
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
        <View style={styles.dropdownMenu}>
          <ScrollView
            style={{ maxHeight: 200 }}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
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
                  <Text style={styles.dropdownMenuOptionText}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

export default Dropdown;
