import { DimensionValue, } from "react-native";

// Interfaces
export interface UserInputProps {
  inputValue: string;
  placeholder: string;
  onChangeInputText: (text: string) => void;
  secureInputTextEntry?: boolean;
};

export interface ButtonProps {
  buttonTitle: string;
  onPressButton: () => void;
  width?: DimensionValue;
  height?: number;
  disabled?: boolean;
}

export interface LinkTextProps {
  linkTitle: string;
  onPressLink: () => void;
}

export interface LoginRequest {
  email: string;
  password: string;
}


// Types
export type TabItem = {
  label: string;
  icon: any;
  route: string;
};



