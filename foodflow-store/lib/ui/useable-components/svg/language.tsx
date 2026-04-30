import { FC } from "react";
import { Svg, Path } from "react-native-svg";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

const LanguageIcon: FC<IconProps> = ({
  width = 16,
  height = 16,
  color = "#000",
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 14 14" fill="none">
      <Path
        d="M6 13L9.5 5.5L13 13M7 11H12M1 2.74758C2.31038 2.58417 3.64536 2.5 5 2.5M5 2.5C5.74721 2.5 6.48843 2.52561 7.22285 2.576M5 2.5V1M7.22285 2.576C6.45088 6.1052 4.12579 9.05341 1 10.6682M7.22285 2.576C7.81988 2.61696 8.41241 2.6743 9 2.74758M5.94085 8.41077C4.85703 7.30795 3.9847 5.9966 3.38955 4.54244"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default LanguageIcon;
