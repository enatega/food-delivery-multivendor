import { FC } from "react";
import Svg, { Circle, Path, ClipPath, Defs, Rect, G } from "react-native-svg";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

const ScheduleIcon: FC<IconProps> = ({
  width = 40,
  height = 40,
  color = "#111827",
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 40 40" fill="none">
      <Circle cx="20" cy="20" r="20" fill="#E5E7EB" />
      <G clipPath="url(#clip0)">
        <Path
          d="M20.0002 26.6663C23.6821 26.6663 26.6668 23.6816 26.6668 19.9997C26.6668 16.3178 23.6821 13.333 20.0002 13.333C16.3183 13.333 13.3335 16.3178 13.3335 19.9997C13.3335 23.6816 16.3183 26.6663 20.0002 26.6663Z"
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M20 16V20L22.6667 21.3333"
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0">
          <Rect
            width="32"
            height="32"
            fill="white"
            transform="translate(12 12)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default ScheduleIcon;
