import { useApptheme } from "@/lib/context/theme.context";
import type { PropsWithChildren } from "react";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

type AccordionItemPros = PropsWithChildren<{
  title: string;
}>;

export default function AccordionItem({
  children,
  title,
}: AccordionItemPros): JSX.Element {
  // Hooks
  const { appTheme } = useApptheme();

  // States
  const [expanded, setExpanded] = useState(false);

  function toggleItem() {
    setExpanded(!expanded);
  }

  return (
    <View>
      <TouchableOpacity
        className="bg-transparent flex-1 flex-row justify-between"
        style={{ backgroundColor: appTheme.fontMainColor }}
        onPress={toggleItem}
      >
        <Text
          className="font-[Inter] text-[14px] font-semibold text-left"
          style={{ color: appTheme.fontSecondColor }}
        >
          {title}
        </Text>
        <Icon
          name={expanded ? "expand-less" : "expand-more"}
          size={30}
          color={appTheme.primary}
        />
      </TouchableOpacity>
      {expanded && children}
    </View>
  );
}
