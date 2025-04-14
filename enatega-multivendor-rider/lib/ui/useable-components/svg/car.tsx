import { FC } from "react";
import { Path, Rect, Svg } from "react-native-svg";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

const MotorbikeIcon: FC<IconProps> = ({
  width = 24,
  height = 24,
  color = "#000",
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16,6l3,4h2c1.11,0,2,0.89,2,2v3h-2c0,1.66-1.34,3-3,3s-3-1.34-3-3H9c0,1.66-1.34,3-3,3s-3-1.34-3-3H1v-3c0-1.11,0.89-2,2-2l3-4H16 M10.5,7.5H6.75L4.86,10h5.64V7.5 M12,7.5V10h5.14l-1.89-2.5H12 M6,13.5c-0.83,0-1.5,0.67-1.5,1.5s0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5S6.83,13.5,6,13.5 M18,13.5c-0.83,0-1.5,0.67-1.5,1.5s0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5S18.83,13.5,18,13.5z"
        fill={color}
      />
      <Rect fill="none" width="24" height="24" />
    </Svg>
  );
};

export default MotorbikeIcon;
