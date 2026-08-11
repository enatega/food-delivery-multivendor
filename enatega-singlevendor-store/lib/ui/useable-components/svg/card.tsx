import { FC } from "react";
import { Svg, Path } from "react-native-svg";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

const CardIcon: FC<IconProps> = ({
  width = 16,
  height = 16,
  color = "#000",
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 12" fill="none">
      <Path
        d="M1.5 3.5H14.5M1.5 4H14.5M3.5 7.5H7.5M3.5 9H5.5M3 11H13C13.8284 11 14.5 10.3284 14.5 9.5V2.5C14.5 1.67157 13.8284 1 13 1H3C2.17157 1 1.5 1.67157 1.5 2.5V9.5C1.5 10.3284 2.17157 11 3 11Z"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default CardIcon;
