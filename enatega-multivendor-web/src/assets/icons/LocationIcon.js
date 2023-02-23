import { Button, SvgIcon, useTheme } from "@mui/material";
import * as React from "react";

function LocationIcon({onClick, ...restProps}) {
  const theme = useTheme();
  return (
    <Button onClick={onClick}>
      <SvgIcon
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width={24}
        height={24}
        {...restProps}
      >
        <defs>
          <path
            id="prefix__a"
            d="M11.5 18a5.5 5.5 0 100-11 5.5 5.5 0 000 11zM12 4v2.019A6.501 6.501 0 0117.981 12H20v1h-2.019a6.501 6.501 0 01-5.98 5.981L12 21h-1v-2.019a6.501 6.501 0 01-5.981-5.98L3 13v-1h2.019A6.501 6.501 0 0111 6.02V4h1zm-.5 11a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm0 1a3.5 3.5 0 110-7 3.5 3.5 0 010 7zm0-2.5a1 1 0 100-2 1 1 0 000 2z"
          />
        </defs>
        <use fill={theme.palette.primary.main} xlinkHref="#prefix__a" />
      </SvgIcon>
    </Button>
  );
}

export default LocationIcon;
