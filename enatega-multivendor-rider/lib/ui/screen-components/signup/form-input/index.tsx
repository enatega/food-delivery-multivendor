import { useApptheme } from "@/lib/context/global/theme.context";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, NativeSyntheticEvent, TextInputFocusEventData } from "react-native";

interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  error?: string;
  placeholder: string;
  icon?: keyof typeof FontAwesome.glyphMap;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad";
  inputMode?: "text" | "email" | "tel";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

export default function FormInput({
  label,
  value,
  onChangeText,
  onBlur,
  error,
  placeholder,
  icon,
  secureTextEntry = false,
  keyboardType = "default",
  inputMode = "text",
  autoCapitalize = "sentences",
}: FormInputProps) {
  const { appTheme } = useApptheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View className="mb-4">
      <Text
        className="text-sm font-medium mb-2"
        style={{ color: appTheme.fontMainColor }}
      >
        {label}
      </Text>
      <View
        className="flex-row items-center border rounded-lg px-3"
        style={{
          borderColor: error ? "#ef4444" : appTheme.borderLineColor,
          backgroundColor: appTheme.themeBackground,
        }}
      >
        {icon && (
          <FontAwesome
            name={icon}
            size={16}
            color={appTheme.fontSecondColor}
            style={{ marginRight: 10 }}
          />
        )}
        <TextInput
          className="flex-1 h-12 text-base"
          style={{ color: appTheme.fontMainColor }}
          placeholder={placeholder}
          placeholderTextColor={appTheme.fontSecondColor}
          keyboardType={keyboardType}
          inputMode={inputMode}
          autoCapitalize={autoCapitalize}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            className="ml-2"
          >
            <FontAwesome6
              name={isPasswordVisible ? "eye-slash" : "eye"}
              size={14}
              color={appTheme.fontMainColor}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="mt-1 text-xs text-red-500">{error}</Text>}
    </View>
  );
}
