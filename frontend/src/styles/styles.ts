import { StyleSheet, ViewStyle, TextStyle, ImageStyle, DimensionValue } from "react-native";
import { colors } from "./colors";

export const styles = StyleSheet.create({
  userInputContainer: {
    width: "100%",
    borderColor: colors.gray_300,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: colors.gray_50,
  },

  userInputText: {
    padding: 12,
    fontSize: 14,
    color: colors.primary_850,
  },

  buttonContainer: {
    width: "100%",
    backgroundColor: colors.primary_500,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  buttonIcon: {
    width: 18, 
    height: 18, 
    marginRight: 8, 
    resizeMode: "contain",
    tintColor: colors.gray_50,
  },

  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.gray_50,
  },

  floatingButtonContainer: {
    backgroundColor: colors.primary_700,
    paddingHorizontal: 14,
    height: 42,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    position: "absolute",
    bottom: 16,
    right: 16,
    elevation: 8,
    shadowColor: colors.gray_900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  
  floatingButtonIcon: {
    width: 16, 
    height: 16, 
    marginRight: 6, 
    tintColor: colors.gray_50,
  },

  floatingButtonLabel: {
    color: colors.gray_50, 
    fontWeight: "600", 
    fontSize: 14,
  },

  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.gray_50,
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

  dropdownBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
  },

  dropdownMenu: {
    backgroundColor: colors.gray_50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray_300,
    zIndex: 999,
    overflow: "hidden",
  },

  dropdownMenuOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: colors.gray_200,
  },

  dropdownMenuOptionLast: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },

  dropdownMenuOptionText: {
    fontSize: 14,
    color: colors.primary_850,
  },

  dateBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.gray_300,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.gray_50,
  },

  actionMenuItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 16,
  },

  actionMenuItemIcon: {
    width: 22,
    height: 22,
    marginRight: 12,
  },

  actionMenuItemLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: colors.primary_850,
  },

  filterMultiSelectSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: colors.gray_200,
  },

  filterMultiSelectSearchText: {
    flex: 1,
    height: 40,
    color: colors.primary_850,
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
    overflow: "hidden",
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
    width: "83%",
    maxWidth: 400,
    alignItems: "center",
  },

  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginRight: 4,
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

  eventActionMenuContainer: {
    width: 260,
    backgroundColor: colors.gray_50,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 12,
    shadowColor: colors.gray_900,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },

  eventActionMenuDivider: {
    height: 1,
    backgroundColor: colors.gray_200,
    marginHorizontal: 16,
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
    tintColor: colors.gray_500,
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
    marginTop: 40,
    marginBottom: 20,
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
  },

  childCalendarSectionContainer: {
    width: "95%",
    alignSelf: "center",
    marginTop: 48,
    paddingHorizontal: 16,
  },

  sectionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: 16,
  },

  segmentedToggle: {
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gray_100,
    borderRadius: 8,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.gray_300,
    alignSelf: "flex-start",
  },

  segmentOption: {
    height: "100%",             
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  segmentActive: {
    backgroundColor: colors.primary_700,
    borderRadius: 6,
  },

  segmentText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.gray_600,
  },

  segmentTextActive: {
    color: colors.gray_50,
  },

  listViewPlaceholder: {
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.gray_50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.gray_100,
  },

  listViewPlaceholderText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.gray_500,
  },

  screenTopHeader: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: colors.gray_50,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray_200,
  },

  screenTopHeaderLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 32,
  },

  createEventScrollContent: {
    paddingTop: 28,
    paddingHorizontal: 28,
    paddingBottom: 12,
  },

  createEventFormFieldLabel: {
    marginBottom: 6,
    marginLeft: 2,
    fontWeight: "500",
    color: colors.primary_850,
  },

  modalCenteredOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },

  eventListLabel: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 8,
    marginLeft: 4,
    color: colors.gray_800,
  },

  notAvailableOption: {
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 24,
  },

  notAvailableText: {
    fontSize: 12, 
    fontWeight: "500", 
    color: colors.gray_700,
  },

  mandatoryField: {
    color: colors.error, 
    marginLeft: 4, 
    fontSize: 16,
  },

  eventListCardContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gray_50,
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    marginHorizontal: 4,
    shadowColor: colors.gray_800,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  eventListCardDateBox: {
    width: 56,
    height: 56,
    backgroundColor: colors.gray_100,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  eventListCardDateBoxDay: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.gray_900,
  },

  eventListCardDateBoxMonth: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.gray_500,
  },

  eventListCardContent: {
    flex: 1,
    justifyContent: "center",
  },

  eventListCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.gray_900,
    marginBottom: 2,
  },

  eventListCardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },

  eventListCardIcon: {
    width: 12,
    height: 12,
    marginRight: 4,
    tintColor: colors.gray_400,
  },

  eventListCardText: {
    fontSize: 12,
    color: colors.gray_500,
  },

  eventListCardChevron: {
    width: 16,
    height: 16,
    marginRight: 4,
    tintColor: colors.gray_400,
  },

  eventDetailsModalView: {
    flex: 1, 
    justifyContent: "flex-end", 
    backgroundColor: "transparent",
  },

  eventDetailsModalContainer: {
    backgroundColor: colors.gray_50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    maxHeight: "80%",
  },

  eventDetailsModalDragIcon: {
    width: 48, 
    height: 12, 
    tintColor: colors.gray_300, 
    borderRadius: 3,
  },

  eventDetailsModalTitle: {
    fontSize: 20, 
    fontWeight: "700", 
    color: colors.gray_900, 
    marginBottom: 16,
  },

  eventDetailsModalLabel: {
    fontSize: 12, 
    fontWeight: "600", 
    color: colors.gray_500, 
    marginBottom: 4,
  },

  eventDetailsModalText: {
    fontSize: 14, 
    color: colors.gray_800,
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
