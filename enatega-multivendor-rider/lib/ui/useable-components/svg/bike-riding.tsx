import { FC } from "react";
import { Svg, Path } from "react-native-svg";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

const BikeRidingIcon: FC<IconProps> = ({
  width = 16,
  height = 16,
  color = "#000",
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
      <Path
        d="M12.3333 13.9997C13.622 13.9997 14.6667 12.955 14.6667 11.6663C14.6667 10.3777 13.622 9.33301 12.3333 9.33301C11.0447 9.33301 10 10.3777 10 11.6663C10 12.955 11.0447 13.9997 12.3333 13.9997Z"
        stroke={color}
        stroke-width="1.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M3.66683 13.9997C4.95549 13.9997 6.00016 12.955 6.00016 11.6663C6.00016 10.3777 4.95549 9.33301 3.66683 9.33301C2.37816 9.33301 1.3335 10.3777 1.3335 11.6663C1.3335 12.955 2.37816 13.9997 3.66683 13.9997Z"
        stroke={color}
        stroke-width="1.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M10.0002 4.00033C10.3684 4.00033 10.6668 3.70185 10.6668 3.33366C10.6668 2.96547 10.3684 2.66699 10.0002 2.66699C9.63197 2.66699 9.3335 2.96547 9.3335 3.33366C9.3335 3.70185 9.63197 4.00033 10.0002 4.00033Z"
        stroke={color}
        stroke-width="1.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M8 11.6663V9.33301L6 7.33301L8.66667 5.33301L10 7.33301H11.3333"
        stroke={color}
        stroke-width="1.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default BikeRidingIcon;
