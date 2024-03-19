import { SvgIcon, useTheme } from "@mui/material";
import * as React from "react";

function ProfileIcon(props) {
  const theme = useTheme();
  return (
    <SvgIcon
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      className="prefix__svg-stroke-container"
      {...props}
    >
      <g fill="none" fillRule="nonzero">
        <circle cx={12} cy={12} r={12} fill={theme.palette.success.light} />
        <path
          fill={theme.palette.common.white}
          d="M13.182 12.667c2.184 0 3.983 1.667 4.136 3.801l.007.14.008.434a.293.293 0 01-.243.287l-.053.004H6.963a.295.295 0 01-.292-.239l-.004-.052v-.292c0-2.208 1.78-4.007 4.003-4.081l.143-.002h2.369zM12 6a3 3 0 110 6 3 3 0 010-6z"
        />
      </g>
    </SvgIcon>
  );
}

export default ProfileIcon;
