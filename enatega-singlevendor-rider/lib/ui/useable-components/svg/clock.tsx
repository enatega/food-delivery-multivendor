import { FC } from "react";
import { Svg, Path, G, Defs, Rect, ClipPath } from "react-native-svg";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

const ClockIcon: FC<IconProps> = ({
  width = 16,
  height = 16,
  color = "#000",
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
      <G clip-path="url(#clip0_1008_2461)">
        <Path
          d="M8.00016 14.6663C11.6821 14.6663 14.6668 11.6816 14.6668 7.99967C14.6668 4.31778 11.6821 1.33301 8.00016 1.33301C4.31826 1.33301 1.3335 4.31778 1.3335 7.99967C1.3335 11.6816 4.31826 14.6663 8.00016 14.6663Z"
          stroke={color}
          stroke-width="1.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <Path
          d="M8 4V8L10.6667 9.33333"
          stroke={color}
          stroke-width="1.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_1008_2461">
          <Rect width="16" height="16" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default ClockIcon;
