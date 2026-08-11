import { FC } from "react";
import { Svg, Path } from "react-native-svg";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

const UserIcon: FC<IconProps> = ({
  width = 16,
  height = 16,
  color = "#000",
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 12 16" fill="none">
      <Path
        d="M8.50022 4C8.50022 5.38071 7.38093 6.5 6.00022 6.5C4.61951 6.5 3.50022 5.38071 3.50022 4C3.50022 2.61929 4.61951 1.5 6.00022 1.5C7.38093 1.5 8.50022 2.61929 8.50022 4Z"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M1.00098 13.4122C1.04785 10.6913 3.26813 8.5 6.00022 8.5C8.73237 8.5 10.9527 10.6914 10.9995 13.4124C9.4776 14.1107 7.78448 14.5 6.00043 14.5C4.21622 14.5 2.52295 14.1106 1.00098 13.4122Z"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default UserIcon;
