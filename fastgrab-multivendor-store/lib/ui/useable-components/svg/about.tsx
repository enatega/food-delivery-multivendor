import { FC } from "react";
import { Svg, Path } from "react-native-svg";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

const AboutIcon: FC<IconProps> = ({
  width = 16,
  height = 16,
  color = "#000",
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 14 14" fill="none">
      <Path
        d="M6.5 6.5L6.52766 6.48617C6.90974 6.29513 7.33994 6.64023 7.23634 7.05465L6.76366 8.94535C6.66006 9.35977 7.09026 9.70487 7.47234 9.51383L7.5 9.5M13 7C13 10.3137 10.3137 13 7 13C3.68629 13 1 10.3137 1 7C1 3.68629 3.68629 1 7 1C10.3137 1 13 3.68629 13 7ZM7 4.5H7.005V4.505H7V4.5Z"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default AboutIcon;
