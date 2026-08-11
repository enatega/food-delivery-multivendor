import { FC } from "react";
import { Svg, Path } from "react-native-svg";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

const SendIcon: FC<IconProps> = ({
  width = 16,
  height = 16,
  color = "#000",
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5.99996 12L3.26904 3.12451C9.88417 5.04617 16.0278 8.07601 21.4857 11.9997C16.0279 15.9235 9.88425 18.9535 3.26913 20.8752L5.99996 12ZM5.99996 12L13.5002 12"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default SendIcon;
