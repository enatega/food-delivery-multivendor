import * as React from "react";
import { useTheme } from "@mui/material";

function RightIcon(props) {
  const theme = useTheme();
  return (
    <svg
      width={20}
      height={19}
      viewBox="0 0 20 19"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>{"A72C3084-0C79-41AF-9C67-DF8BFD378C1D"}</title>
      <path
        d="M11.284 18.782a.715.715 0 01-1.03-.003.765.765 0 01.003-1.06l7.266-7.438H.726A.809.809 0 010 9.487c0-.413.326-.748.728-.76h16.795l-7.25-7.45a.764.764 0 01.003-1.059.713.713 0 011.03.003l8.463 8.753a.74.74 0 01.123.17.765.765 0 01-.106.923l-8.502 8.715z"
        fill={theme.palette.common.black}
        fillRule="evenodd"
      />
    </svg>
  );
}

export default RightIcon;
