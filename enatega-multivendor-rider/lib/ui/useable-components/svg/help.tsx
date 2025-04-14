import { FC } from "react";
import { Svg, Path } from "react-native-svg";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

const HelpIcon: FC<IconProps> = ({
  width = 16,
  height = 16,
  color = "#000",
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 14 14" fill="none">
      <Path
        d="M5.58594 4.01256C6.36699 3.32915 7.63332 3.32915 8.41436 4.01256C9.19541 4.69598 9.19541 5.80402 8.41436 6.48744C8.27842 6.60639 8.12778 6.70463 7.96755 6.78217C7.47043 7.02276 7.00015 7.44772 7.00015 8V8.5M13 7C13 10.3137 10.3137 13 7 13C3.68629 13 1 10.3137 1 7C1 3.68629 3.68629 1 7 1C10.3137 1 13 3.68629 13 7ZM7 10.5H7.005V10.505H7V10.5Z"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default HelpIcon;
