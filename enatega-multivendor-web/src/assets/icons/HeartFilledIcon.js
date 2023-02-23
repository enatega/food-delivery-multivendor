import { SvgIcon, useTheme } from "@mui/material";
import * as React from "react";

function HeartFilled(props) {
  const theme = useTheme();
  return (
    <SvgIcon
      className="prefix__fl-brand-primary"
      width={24}
      height={24}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
      style={{ color: theme.palette.primary.main }}
    >
      <path
        d="M16.622 6.32c2.015.959 2.927 3.468 2.037 5.604-1.128 2.365-3.234 4.255-6.317 5.67a.84.84 0 01-.59.036l-.094-.036c-3.083-1.416-5.189-3.305-6.317-5.67-.89-2.136.022-4.645 2.037-5.604 1.379-.656 2.79-.23 3.922.623.112.084.256.206.431.365a.4.4 0 00.538 0c.175-.159.319-.28.431-.365 1.134-.854 2.545-1.279 3.922-.623z"
        fillRule="evenodd"
      />
    </SvgIcon>
  );
}

export default HeartFilled;
