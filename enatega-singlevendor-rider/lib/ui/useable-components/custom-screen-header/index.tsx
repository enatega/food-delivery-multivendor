import { Text, View } from "react-native";

export default function CustomScreenHeader({ title }: { title: string }) {
  return (
    <View className={`p-1 w-full mx-auto block justify-center items-center`}>
      <Text className="font-bold text-lg">{title}</Text>
    </View>
  );
}
