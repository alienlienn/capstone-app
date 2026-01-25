import { View, Text, Pressable, FlatList, Image } from "react-native";
import { useState } from "react";
import { DropdownProps } from "../types/types";
import { styles } from "../styles/styles";


function Dropdown({value, placeholder, options, onSelect, containerStyle}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const selectedLabel = options.find((o) => o.value === value)?.label || placeholder;

  return (
    <View style={[styles.userInputContainer, containerStyle]}>
      <Pressable
        style={styles.dropdownContainer}
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
          style={[
            styles.dropdownIcon,
            open && styles.dropdownIconOpen,
          ]}
        />
      </Pressable>

      {open && (
        <View style={styles.dropdownMenu}>
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            ItemSeparatorComponent={() => (
              <View style={styles.menuOptionDivider} />
            )}
            renderItem={({ item }) => (
              <Pressable
                style={styles.dropdownMenuOption}
                onPress={() => {
                  onSelect(item.value);
                  setOpen(false);
                }}
              >
                <Text style={styles.dropdownMenuOptionText}>{item.label}</Text>
              </Pressable>
            )}
          />
        </View>
      )}
    </View>
  );
}

export default Dropdown;

