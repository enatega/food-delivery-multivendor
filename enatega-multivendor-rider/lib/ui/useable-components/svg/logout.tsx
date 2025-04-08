import { FC } from "react";
import { Svg, Path } from "react-native-svg";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

const LogoutIcon: FC<IconProps> = ({
  width = 16,
  height = 16,
  color = "#000",
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 14 14" fill="none">
      <Path
        d="M8.5 5V2.5C8.5 1.67157 7.82843 1 7 1L3 1C2.17157 1 1.5 1.67157 1.5 2.5L1.5 11.5C1.5 12.3284 2.17157 13 3 13H7C7.82843 13 8.5 12.3284 8.5 11.5V9M10.5 9L12.5 7M12.5 7L10.5 5M12.5 7L4 7"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default LogoutIcon;
