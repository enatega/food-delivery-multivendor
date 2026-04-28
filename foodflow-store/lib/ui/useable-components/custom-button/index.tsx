import { ReactNode } from "react";
import { Pressable, PressableProps } from "react-native";

export default function CustomButton({
  children,
  ...props
}: { children: ReactNode } & PressableProps) {
  return <Pressable {...props}>{children}</Pressable>;
}
