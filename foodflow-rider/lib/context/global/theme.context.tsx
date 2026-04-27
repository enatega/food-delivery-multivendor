// Constants
import { Colors } from "@/lib/utils/constants";

// Interfaces & Types
import { AppThemeContext } from "@/lib/utils/interfaces/app-theme";
import { app_theme } from "@/lib/utils/types/theme";

// React Native AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

// Hooks
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// Core
import { Appearance } from "react-native";

// Context
const ThemeContext = createContext<AppThemeContext>({
  currentTheme: "light",
  toggleTheme: () => {},
  appTheme: Colors.light,
});

export default function AppThemeProvidor({
  children,
}: {
  children: ReactNode;
}) {
  // Color Scheme State
  const colorScheme = Appearance.getColorScheme();

  // States
  const [currentTheme, setCurrentTheme] = useState<app_theme>("light");
  const [appTheme, setAppTheme] = useState(
    colorScheme === "dark"
      ? Colors.dark
      : colorScheme === "light"
        ? Colors.light
        : Colors.light,
  );

  // Methods
  async function getCurrentAppTheme() {
    const systemTheme = Appearance.getColorScheme();
    const localTheme = await AsyncStorage.getItem("app_theme");
    const theme = localTheme || systemTheme || "dark";
    Appearance.setColorScheme(theme as app_theme);
    setCurrentTheme(theme as app_theme);
    setAppTheme(
      theme === "light"
        ? Colors.light
        : theme === "dark"
          ? Colors.dark
          : Colors.light,
    );
  }

  // Handlers
  const toggleTheme = (val: app_theme) => {
    const updatedVal = val === "light" ? "dark" : "light";
    setAppTheme(Colors[updatedVal]);
    setCurrentTheme(updatedVal);
    // Appearance.setColorScheme(val === "light" ? "dark" : "light");
    AsyncStorage.setItem("app_theme", updatedVal);
  };

  useEffect(() => {
    getCurrentAppTheme();
  }, [colorScheme]);

  useEffect(() => {
    Appearance.addChangeListener(({ colorScheme }) => {
      setCurrentTheme(colorScheme as app_theme);
    });
  }, [Appearance]);
  return (
    <ThemeContext.Provider
      value={{ toggleTheme, currentTheme: currentTheme, appTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useApptheme = () => useContext(ThemeContext);
