import { FC } from "react";
import { Svg, Path } from "react-native-svg";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

const PersonIcon: FC<IconProps> = ({
  width = 16,
  height = 16,
  color = "#000",
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 25 24" fill="none">
      <Path
        d="M16.2498 6C16.2498 8.07107 14.5709 9.75 12.4998 9.75C10.4288 9.75 8.74984 8.07107 8.74984 6C8.74984 3.92893 10.4288 2.25 12.4998 2.25C14.5709 2.25 16.2498 3.92893 16.2498 6Z"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M5.00098 20.1182C5.07128 16.0369 8.40171 12.75 12.4998 12.75C16.5981 12.75 19.9286 16.0371 19.9987 20.1185C17.7159 21.166 15.1762 21.75 12.5002 21.75C9.82384 21.75 7.28394 21.1659 5.00098 20.1182Z"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default PersonIcon;
