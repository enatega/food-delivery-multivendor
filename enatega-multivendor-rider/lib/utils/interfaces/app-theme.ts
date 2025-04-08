import { ColorSchemeName } from "react-native";
import { app_theme } from "../types/theme";

export interface AppThemeContext {
  currentTheme: ColorSchemeName;
  toggleTheme: (val: app_theme) => void;
  appTheme: AppTheme;
}

export interface AppTheme {
  primary: string;
  themeBackground: string;
  iconColor: string;
  tagColor: string;
  iconPink: string;
  radioColor: string;
  radioOuterColor: string;
  spinnerColor: string;
  orderComplete: string;
  orderUncomplete: string;
  horizontalLine: string;
  buttonBackground: string;
  buttonText: string;
  buttonBackgroundPink: string;
  buttonTextPink: string;
  textErrorColor: string;
  headerBackground: string;
  headerText: string;
  fontMainColor: string;
  fontSecondColor: string;
  cartContainer: string;
  startColor: string;
  white: string;
  black: string;
  tabNaviatorBackground: string;
  secondaryTextColor: string;
  lowOpacityPrimaryColor: string;
  mainTextColor: string;
  switchButtonColor: string;
  sidebarIconBackground: string;
  borderLineColor: string;
  gray: string;
  screenBackground: string;
  mapBackground: string;
}
