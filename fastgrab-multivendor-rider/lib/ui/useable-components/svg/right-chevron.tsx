import { FC } from "react";
import { Svg, Path } from "react-native-svg";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

const ChatIcon: FC<IconProps> = ({
  width = 24,
  height = 24,
  color = "#000",
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8.25 4.5L15.75 12L8.25 19.5"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default ChatIcon;
