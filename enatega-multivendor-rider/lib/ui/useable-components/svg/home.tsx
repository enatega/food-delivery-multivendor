import { FC } from "react";
import { Svg, Path } from "react-native-svg";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

const HomeIcon: FC<IconProps> = ({
  width = 16,
  height = 16,
  color = "#000",
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 22 21" fill="none">
      <Path
        d="M1.25 10.9998L10.2045 2.04533C10.6438 1.60599 11.3562 1.60599 11.7955 2.04532L20.75 10.9998M3.5 8.74983V18.8748C3.5 19.4961 4.00368 19.9998 4.625 19.9998H8.75V15.1248C8.75 14.5035 9.25368 13.9998 9.875 13.9998H12.125C12.7463 13.9998 13.25 14.5035 13.25 15.1248V19.9998H17.375C17.9963 19.9998 18.5 19.4962 18.5 18.8748V8.74983M7.25 19.9998H15.5"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default HomeIcon;
