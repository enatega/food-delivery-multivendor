import { FC } from "react";
import { Svg, Path } from "react-native-svg";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

const PrivacyIcon: FC<IconProps> = ({
  width = 16,
  height = 16,
  color = "#000",
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 14 14" fill="none">
      <Path
        d="M5 7.50006L6.5 9.00006L9 5.50006M7 0.80957C5.56634 2.16732 3.63042 3.00007 1.5 3.00007C1.46615 3.00007 1.43235 2.99986 1.3986 2.99944C1.13993 3.78618 1 4.6268 1 5.5001C1 9.22778 3.54955 12.36 7 13.2481C10.4505 12.36 13 9.22778 13 5.5001C13 4.6268 12.8601 3.78618 12.6014 2.99944C12.5677 2.99986 12.5339 3.00007 12.5 3.00007C10.3696 3.00007 8.43366 2.16732 7 0.80957Z"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default PrivacyIcon;
