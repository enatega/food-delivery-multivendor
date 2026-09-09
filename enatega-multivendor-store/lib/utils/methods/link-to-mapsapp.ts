import { Linking, Platform } from "react-native";

interface IMapCoordinates {
  latitude: number;
  longitude: number;
}

export function linkToMapsApp(
  { latitude, longitude }: IMapCoordinates,
  label: string,
) {
  const latLng = `${latitude},${longitude}`;
  const url =
    Platform.OS === "ios"
      ? `maps:0,0?q=${encodeURIComponent(label)}@${latLng}`
      : `geo:0,0?q=${latLng}(${encodeURIComponent(label)})`;

  void Linking.openURL(url);
}
