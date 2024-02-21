import { SvgIcon, useTheme } from "@mui/material";
import * as React from "react";

function GoogleIcon(props) {
  const theme = useTheme();
  return (
    <SvgIcon
      width={20}
      height={20}
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color: theme.palette.common.white }}
      {...props}
    >
      <title>{"google [theme.palette.shadows.contrastText]"}</title>
      <path
        d="M19.822 8.004h-9.61c0 1 0 2.998-.007 3.998h5.569c-.213.999-.97 2.398-2.039 3.103-.001-.001-.002.006-.004.005-1.421.938-3.297 1.151-4.69.871-2.183-.433-3.91-2.016-4.612-4.027.004-.003.007-.031.01-.033C4 10.673 4 9.003 4.44 8.004c.565-1.837 2.345-3.513 4.53-3.972 1.759-.373 3.743.031 5.202 1.396.194-.19 2.685-2.622 2.872-2.82C12.058-1.907 4.077-.318 1.09 5.51l-.006.011a9.767 9.767 0 00.01 8.964l-.01.008a10.18 10.18 0 006.48 5.165c3.01.79 6.843.25 9.41-2.072l.003.003c2.175-1.958 3.529-5.296 2.845-9.586"
        fillRule="evenodd"
      />
    </SvgIcon>
  );
}

export default GoogleIcon;
