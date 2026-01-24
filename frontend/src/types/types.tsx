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

export interface SettingOptionProps {
  icon: any;
  label: string;
  onPress?: () => void;
  showToggle?: boolean;
  toggleValue?: boolean;
  onToggleChange?: (value: boolean) => void;
  showTopDivider?: boolean;
  showChevron?: boolean;
}


// Types
export type TabItem = {
  label: string;
  icon: any;
  route: string;
};

export type ProfileAvatarProps = {
  imageUrl?: string | null;
};

export type ProfileHeaderProps = {
  fullName: string;
  phone?: string;
  email: string;
  imageUrl?: string;
};

export type CalendarViewProps = {
  month?: number;
  year?: number;
};

export type Day = {
  dateString: string;
  day: number;
  month: number;
  year: number;
};

export type User = {
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  gender?: string;
  mobile_number?: string;
  profile_image_url?: string;
};

export type ProfileDetailsFormProps = {
  user: User;
  onUpdate?: (updatedUser: User) => void; 
};

