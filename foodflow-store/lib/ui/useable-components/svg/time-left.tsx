import { FC } from "react";
import { Svg, Path, Circle } from "react-native-svg";

interface IconProps {
  width?: number;
  height?: number;
}

const TimeLeftIcon: FC<IconProps> = ({ width = 41, height = 41 }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 41 41" fill="none">
      <Circle
        cx="20.5"
        cy="20.5"
        r="19.8167"
        fill="white"
        stroke="#D1D5DB"
        stroke-width="1.36667"
      />
      <Path
        d="M20.5 0C24.0159 4.19271e-08 27.4728 0.904281 30.5383 2.62595C33.6039 4.34761 36.1751 6.82879 38.005 9.83104C39.8348 12.8333 40.8617 16.2557 40.987 19.7694C41.1123 23.2831 40.3318 26.77 38.7204 29.895L20.5 20.5V0Z"
        fill="#90E36D"
      />
    </Svg>
  );
};

export default TimeLeftIcon;
