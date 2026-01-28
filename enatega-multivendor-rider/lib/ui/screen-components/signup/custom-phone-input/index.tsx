import { useApptheme } from "@/lib/context/global/theme.context";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from "react-native";

interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

interface CustomPhoneInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  error?: string;
}

const COUNTRIES: Country[] = [
  { code: "AU", name: "Australia", flag: "🇦🇺", dialCode: "+61" },
  { code: "US", name: "United States", flag: "🇺🇸", dialCode: "+1" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", dialCode: "+44" },
  { code: "CA", name: "Canada", flag: "🇨🇦", dialCode: "+1" },
  { code: "IN", name: "India", flag: "🇮🇳", dialCode: "+91" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰", dialCode: "+92" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩", dialCode: "+880" },
  { code: "CN", name: "China", flag: "🇨🇳", dialCode: "+86" },
  { code: "JP", name: "Japan", flag: "🇯🇵", dialCode: "+81" },
  { code: "KR", name: "South Korea", flag: "🇰🇷", dialCode: "+82" },
  { code: "DE", name: "Germany", flag: "🇩🇪", dialCode: "+49" },
  { code: "FR", name: "France", flag: "🇫🇷", dialCode: "+33" },
  { code: "IT", name: "Italy", flag: "🇮🇹", dialCode: "+39" },
  { code: "ES", name: "Spain", flag: "🇪🇸", dialCode: "+34" },
  { code: "BR", name: "Brazil", flag: "🇧🇷", dialCode: "+55" },
  { code: "MX", name: "Mexico", flag: "🇲🇽", dialCode: "+52" },
  { code: "RU", name: "Russia", flag: "🇷🇺", dialCode: "+7" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", dialCode: "+966" },
  { code: "AE", name: "UAE", flag: "🇦🇪", dialCode: "+971" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", dialCode: "+27" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", dialCode: "+234" },
  { code: "EG", name: "Egypt", flag: "🇪🇬", dialCode: "+20" },
  { code: "TR", name: "Turkey", flag: "🇹🇷", dialCode: "+90" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩", dialCode: "+62" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾", dialCode: "+60" },
  { code: "SG", name: "Singapore", flag: "🇸🇬", dialCode: "+65" },
  { code: "TH", name: "Thailand", flag: "🇹🇭", dialCode: "+66" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳", dialCode: "+84" },
  { code: "PH", name: "Philippines", flag: "🇵🇭", dialCode: "+63" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿", dialCode: "+64" },
];

export default function CustomPhoneInput({
  label,
  value,
  onChangeText,
  onBlur,
  error,
}: CustomPhoneInputProps) {
  const { appTheme } = useApptheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const filteredCountries = COUNTRIES.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dialCode.includes(searchQuery)
  );

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setModalVisible(false);
    // Update with new country code (no space)
    onChangeText(`${country.dialCode}${phoneNumber}`);
  };

  const handlePhoneChange = (text: string) => {
    setPhoneNumber(text);
    onChangeText(`${selectedCountry.dialCode}${text}`);
  };

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
          height: 48,
        }}
      >
        {/* Country Selector */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="flex-row items-center mr-2"
          style={{ paddingRight: 8, borderRightWidth: 1, borderRightColor: appTheme.borderLineColor }}
        >
          <Text style={{ fontSize: 24, marginRight: 4 }}>{selectedCountry.flag}</Text>
          <Text style={{ color: appTheme.fontMainColor, fontSize: 16 }}>
            {selectedCountry.dialCode}
          </Text>
          <FontAwesome
            name="chevron-down"
            size={10}
            color={appTheme.fontSecondColor}
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>

        {/* Phone Input */}
        <TextInput
          className="flex-1 h-12 text-base"
          style={{ color: appTheme.fontMainColor }}
          placeholder="000 000 000"
          placeholderTextColor={appTheme.fontSecondColor}
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={handlePhoneChange}
          onBlur={onBlur}
        />
      </View>
      {error && <Text className="mt-1 text-xs text-red-500">{error}</Text>}

      {/* Country Picker Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          className="flex-1 justify-end"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View
            className="rounded-t-3xl p-6"
            style={{
              backgroundColor: appTheme.themeBackground,
              maxHeight: "80%",
            }}
          >
            {/* Header */}
            <View className="flex-row justify-between items-center mb-4">
              <Text
                className="text-lg font-bold"
                style={{ color: appTheme.fontMainColor }}
              >
                Select Country
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <FontAwesome
                  name="times"
                  size={20}
                  color={appTheme.fontMainColor}
                />
              </TouchableOpacity>
            </View>

            {/* Search */}
            <View
              className="flex-row items-center border rounded-lg px-3 mb-4"
              style={{
                borderColor: appTheme.borderLineColor,
                backgroundColor: appTheme.themeBackground,
              }}
            >
              <FontAwesome
                name="search"
                size={16}
                color={appTheme.fontSecondColor}
                style={{ marginRight: 10 }}
              />
              <TextInput
                className="flex-1 h-12 text-base"
                style={{ color: appTheme.fontMainColor }}
                placeholder="Search country..."
                placeholderTextColor={appTheme.fontSecondColor}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Country List */}
            <ScrollView showsVerticalScrollIndicator={false}>
              {filteredCountries.map((country) => (
                <TouchableOpacity
                  key={country.code}
                  onPress={() => handleCountrySelect(country)}
                  className="flex-row items-center p-4 rounded-lg mb-2"
                  style={{
                    backgroundColor:
                      selectedCountry.code === country.code
                        ? `${appTheme.primary}10`
                        : appTheme.themeBackground,
                  }}
                >
                  <Text style={{ fontSize: 28, marginRight: 12 }}>
                    {country.flag}
                  </Text>
                  <View className="flex-1">
                    <Text
                      className="text-base font-medium"
                      style={{
                        color:
                          selectedCountry.code === country.code
                            ? appTheme.primary
                            : appTheme.fontMainColor,
                      }}
                    >
                      {country.name}
                    </Text>
                  </View>
                  <Text
                    className="text-sm"
                    style={{
                      color:
                        selectedCountry.code === country.code
                          ? appTheme.primary
                          : appTheme.fontSecondColor,
                    }}
                  >
                    {country.dialCode}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
