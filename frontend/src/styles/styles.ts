import {StyleSheet, ViewStyle, TextStyle, ImageStyle, DimensionValue } from "react-native";
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
    color: colors.primary_800,
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
    padding: 16,
  },


});


// Interactions (hover/underline)
export const buttonDefault = (width?: DimensionValue, height: number = 48, disabled: boolean = false): ViewStyle => ({
  width: width ?? "85%",
  height,
  opacity: disabled ? 0.6 : 1,
});

export const buttonHover = ( pressed: boolean, hovered: boolean = false): ViewStyle => ({
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