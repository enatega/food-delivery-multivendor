import { useApptheme } from "@/lib/context/theme.context";
import { IconProps } from "@/lib/utils/interfaces/icon.interface";
import { FC } from "react";
import Svg, { Path } from "react-native-svg";

const NoDataIcon: FC<IconProps> = ({ width = 16, height = 16 }) => {
  const { appTheme } = useApptheme();

  return (
    <Svg
      // className="mx-auto mb-4 text-gray-400"
      width={width}
      height={height}
      fill="none"
      stroke={appTheme.fontMainColor}
      viewBox="0 0 24 24"
    >
      <Path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      ></Path>
    </Svg>
  );
};

export default NoDataIcon;
