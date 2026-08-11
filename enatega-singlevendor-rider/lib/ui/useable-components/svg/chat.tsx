import { FC } from "react";
import { Svg, Path } from "react-native-svg";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

const ChatIcon: FC<IconProps> = ({
  width = 16,
  height = 16,
  color = "#000",
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 25" fill="none">
      <Path
        d="M12 21.1591C16.9706 21.1591 21 17.4654 21 12.9091C21 8.35274 16.9706 4.65909 12 4.65909C7.02944 4.65909 3 8.35274 3 12.9091C3 15.0127 3.85891 16.9324 5.2728 18.3897C5.70538 18.8355 6.01357 19.4283 5.85933 20.03C5.68829 20.6974 5.368 21.3049 4.93579 21.8151C5.0918 21.843 5.25 21.8649 5.40967 21.8804C5.60376 21.8994 5.80078 21.9091 6 21.9091C7.28201 21.9091 8.47016 21.507 9.44517 20.822C10.2551 21.0413 11.1125 21.1591 12 21.1591Z"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default ChatIcon;
