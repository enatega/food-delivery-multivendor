import { FC } from "react";
import { Svg, Path } from "react-native-svg";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

const PageIcon: FC<IconProps> = ({
  width = 16,
  height = 16,
  color = "#000",
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 14 14" fill="none">
      <Path
        d="M1 4.5V11C1 11.8284 1.67157 12.5 2.5 12.5H11.5C12.3284 12.5 13 11.8284 13 11V4.5M1 4.5V3C1 2.17157 1.67157 1.5 2.5 1.5H11.5C12.3284 1.5 13 2.17157 13 3V4.5M1 4.5H13M2.5 3H2.505V3.005H2.5V3ZM4 3H4.005V3.005H4V3ZM5.5 3H5.505V3.005H5.5V3Z"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default PageIcon;
