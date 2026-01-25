import { StyleSheet, ViewStyle, TextStyle, ImageStyle, DimensionValue } from "react-native";
import { colors } from "./colors";

export const styles = StyleSheet.create({
  userInputContainer: {
    width: "85%",
    borderColor: colors.gray_300,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },

  userInputText: {
    padding: 12,
    fontSize: 14,
    color: colors.primary_850,
  },

  buttonContainer: {
    width: "85%",
    backgroundColor: colors.primary_500,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.gray_50,
  },

  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 8,
  },

  dropdownIcon: {
    width: 16,
    height: 16,
    tintColor: colors.gray_500,
  },

  dropdownIconOpen: {
    transform: [{ rotate: "180deg" }],
  },

  dropdownSelectedText: {
    fontSize: 14,
    color: colors.primary_850,
  },

  dropdownPlaceholderText: {
    color: colors.gray_400
  },

  dropdownMenu: {
    borderWidth: 1,
    borderColor: colors.gray_200,
    maxHeight: 200,
  },

  dropdownMenuOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: colors.gray_200,
  },

  dropdownMenuOptionText: {
    fontSize: 14,
    color: colors.primary_850,
  },

  menuOptionDivider: {
    height: 1,
    backgroundColor: colors.gray_100,
  },

  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 999,
    backgroundColor: colors.gray_100,
    elevation: 12,
    shadowColor: colors.gray_900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -12,
  },

  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 999,
  },

  loginFormContainer: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },

  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginRight: 28,
    marginBottom: 16,
  },

  linkText: {
    color: colors.primary_500,
    fontSize: 10,
    fontWeight: "500",
  },

  errorText: {
    color: colors.error,
    fontSize: 10,
    marginBottom: 4,
  },

  loginPageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: colors.background_color,
  },

  logoImageSize: {
    width: 230,
    height: 230,
    marginBottom: 24,
  },

  navBarContainer: {
    width: "100%",
    height: 66,
    flexDirection: "row",
    backgroundColor: colors.gray_50,
    borderTopWidth: 1,
    borderTopColor: colors.gray_200,
    alignItems: "center",
    justifyContent: "center",
  },

  navBarTab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  pageContainer: {
    flex: 1,
    backgroundColor: colors.background_color,
  },

  settingOptionWrapper: {
    width: "94%",
    paddingHorizontal: 16,
    alignSelf: "center",
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 22,
  },

  optionRowCompact: {
    paddingVertical: 20,
  },

  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  optionIcon: {
    width: 20,
    height: 20,
    marginRight: 14,
    resizeMode: "contain",
  },

  optionLabel: {
    fontSize: 16,
    color: colors.primary_850,
    fontWeight: "400",
  },

  chevronIcon: {
    width: 14,
    height: 14,
    marginRight: 8,
    resizeMode: "contain",
    tintColor: colors.primary_850,
  },

  dividerLine: {
    height: 1,
    backgroundColor: colors.gray_200,
  },

  customSwitch: {
    width: 42,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.7,
    borderColor: colors.primary_800,
    padding: 3,
    marginRight: 4,
    justifyContent: "center",
  },

  customSwitchOn: {
    backgroundColor: colors.primary_100,
    borderColor: colors.primary_600,
  },

  customThumb: {
    width: 16,
    height: 16,
    borderRadius: 10,
    backgroundColor: colors.primary_800,
    alignSelf: "flex-start",
  },

  customThumbOn: {
    alignSelf: "flex-end",
    backgroundColor: colors.primary_600,
  },

  profileHeaderBackground: {
    height: 165,
    backgroundColor: colors.primary_200,
  },

  headerContent: {
    alignItems: "center",
    marginTop: -48,
    paddingHorizontal: 16,
  },

  displayName: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
    color: colors.primary_850,
  },

  contactContainer: {
    marginTop: 16,
    width: "94%",
  },

  contactRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },

  contactLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.gray_400,
  },

  contactValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary_850,
  },

  settingListContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 32,
  },

  editProfileContainer: {
    flex: 1,
    backgroundColor: colors.background_color,
    paddingTop: 36,
  },

  editProfileHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 4,
  },

  editProfileTitleContainer: {
    flex: 1, 
    justifyContent: "center",
    alignItems: "center",
    marginRight: 52,
  },

  editProfileTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.primary_850,
    marginLeft: 2,
    paddingBottom: 2,
  },

  backAction: {
    width: 36,
    height: 36,
    marginLeft: 12,
    justifyContent: "center",
  },

  backIcon: {
    width: 18,
    height: 18,
    resizeMode: "contain",
    alignSelf: "center",
  },

  scrollContent: {
    paddingHorizontal: 24,
  },

  editProfileAvatar: {
    alignSelf: "center",
    marginTop: 24,
    marginBottom: 24,
    position: "relative",
  },

  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 16,
    backgroundColor: colors.gray_50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: colors.gray_800,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  editAvatarIcon: {
    width: 19,
    height: 19,
    resizeMode: "contain",
    alignItems: "center",
    tintColor: colors.gray_500,
  },

  editProfileFormContainer: {
    width: "95%",
    alignSelf: "center",
  },

  editProfileFieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.gray_700,
    marginBottom: 4,
    marginTop: 12,
    marginLeft: 2,
  },

  saveChangesButton: {
    width: "95%",
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 24,
  },
});


// Interactions (hover/underline)
export const buttonDefault = (width?: DimensionValue, height: number = 48, disabled: boolean = false): ViewStyle => ({
  width: width ?? "85%",
  height,
  opacity: disabled ? 0.6 : 1,
});

export const buttonHover = (pressed: boolean, hovered: boolean = false): ViewStyle => ({
  backgroundColor: hovered ? colors.primary_600 : colors.primary_500,
  opacity: pressed ? 0.85 : 1,
});

export const forgotLinkTextPressed = (pressed: boolean): TextStyle => ({
  color: pressed ? colors.primary_650 : colors.primary_500,
  fontSize: 10,
  fontWeight: "500",
  textDecorationLine: "underline",
});

export const navBarTabIcon = (active: boolean = false): ImageStyle => ({
  width: 22,
  height: 22,
  marginBottom: 4,
  opacity: active ? 1 : 0.4,
  tintColor: active ? colors.primary_700 : undefined,
});

export const navBarTabLabel = (active: boolean = false): TextStyle => ({
  fontSize: 10,
  color: active ? colors.primary_700 : colors.gray_400,
  fontWeight: active ? "600" : "400",
});
