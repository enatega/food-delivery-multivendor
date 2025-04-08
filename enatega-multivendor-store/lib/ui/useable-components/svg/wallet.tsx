import { FC } from "react";
import { Svg, Path } from "react-native-svg";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

const WalletIcon: FC<IconProps> = ({
  width = 16,
  height = 16,
  color = "#111827",
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 25 24" fill="none">
      <Path
        d="M21.75 12C21.75 10.7574 20.7426 9.75 19.5 9.75H15.75C15.75 11.4069 14.4069 12.75 12.75 12.75C11.0931 12.75 9.75 11.4069 9.75 9.75H6C4.75736 9.75 3.75 10.7574 3.75 12M21.75 12V18C21.75 19.2426 20.7426 20.25 19.5 20.25H6C4.75736 20.25 3.75 19.2426 3.75 18V12M21.75 12V9M3.75 12V9M21.75 9C21.75 7.75736 20.7426 6.75 19.5 6.75H6C4.75736 6.75 3.75 7.75736 3.75 9M21.75 9V6C21.75 4.75736 20.7426 3.75 19.5 3.75H6C4.75736 3.75 3.75 4.75736 3.75 6V9"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default WalletIcon;
