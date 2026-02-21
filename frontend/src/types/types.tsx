import { DimensionValue, ViewStyle, ImageStyle, TextStyle } from "react-native";
import * as ImagePicker from "expo-image-picker";

// Interfaces
export interface UserInputProps {
  inputValue: string;
  placeholder: string;
  onChangeInputText: (text: string) => void;
  secureInputTextEntry?: boolean;
  rightIconSource?: any;
  onPressRightIcon?: () => void;
};

export interface DropdownProps {
  value?: string | null;
  placeholder: string;
  options: DropdownOption[];
  onSelect: (value: string) => void;
  height?: number;
}

export interface DropdownOption {
  label: string;
  value: string;
}

export interface ButtonProps {
  buttonTitle: string;
  onPressButton: () => void;
  width?: DimensionValue;
  height?: number;
  disabled?: boolean;
  buttonStyle?: ViewStyle;
  iconSource?: any;           
  iconStyle?: ImageStyle;    
  textStyle?: TextStyle;
}

export interface DateBoxProps {
  label?: string;
  onPress: () => void;
}

export interface FilterMultiSelectOption {
  label: string;
  value: string;
}

export interface FilterMultiSelectProps {
  label: string;
  options: FilterMultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export interface LinkTextProps {
  linkTitle: string;
  onPressLink: () => void;
}

export interface FloatingButtonProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  iconSource?: any; 
}

export interface ActionMenuItemProps {
  icon: any;
  label: string;
  tintColor: string;
  onPress: () => void;
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

export interface EventActionMenuProps {
  onCreate: () => void;
  onEdit: () => void;
  onRemove: () => void;
}

export interface StudentResult {
  id?: number;
  student_id: number;
  subject: string;
  grade?: string;
  score?: number;
  term: string;
  year: number;
  teacher_id: number;
}


// Types
export type TabItem = {
  label: string;
  icon: any;
  route: string;
};

export type ProfileAvatarProps = {
  imageUrl?: string | null;
  containerStyle?: ViewStyle;
  onImageSelected?: (image: ImagePicker.ImagePickerAsset) => void;
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
  events?: CalendarEvent[];
};

export type CalendarEvent = {
  id?: number;
  schoolId?: number;
  date?: string;
  startDate: string; 
  endDate: string;   
  title?: string;
  description?: string;
  venue?: string;
  eventType?: string;
  affectedGroups?: string;
  startTime?: string;
  endTime?: string;
  createdBy?: number;
};

export type Day = {
  dateString: string;
  day: number;
  month: number;
  year: number;
};

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  gender?: string;
  mobile_number?: string;
  profile_image_url?: string;
  role?: string;
  school_id?: number;
};

export type ProfileDetailsFormProps = {
  user: User;
  onUpdate?: (updatedUser: User) => void; 
};

export type EventListCardProps = {
  date: string; 
  title?: string;
  venue?: string;
  startTime?: string;
  endTime?: string;
  onPress?: () => void;
};

export type EventDetailsModalProps = {
  visible: boolean;
  event: CalendarEvent | null;
  onClose: () => void;
};

export interface StudentCardProps {
  id: number;
  firstName: string;
  lastName: string;
  onPress: () => void;
}

export type EditEventModalProps = {
  visible: boolean
  onClose: () => void
  onSelect: (event: CalendarEvent) => void
};

