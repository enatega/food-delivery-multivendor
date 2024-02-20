import * as React from "react";
import { useTheme } from "@mui/material";

function MastercardIcon(props) {
  const theme = useTheme();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={24}
      viewBox="0 0 32 24"
      {...props}
    >
      <g fill="none" fillRule="evenodd">
        <path
          d="M2 0h28a2 2 0 012 2v20a2 2 0 01-2 2H2a2 2 0 01-2-2V2a2 2 0 012-2z"
          fill={theme.palette.common.black}
        />
        <path
          fill={theme.palette.borders.main}
          fillRule="nonzero"
          d="M12.094 5.24h7.702v12.795h-7.702z"
        />
        <path
          fill={theme.palette.borders.light}
          fillRule="nonzero"
          d="M28.123 16.681v-.262h.111v-.054h-.264v.054h.104v.262zm.514 0v-.316h-.08l-.094.226-.093-.226h-.08v.316h.058v-.24l.086.207h.06l.087-.206v.24z"
        />
        <path
          d="M12.888 11.639a8.175 8.175 0 013.055-6.397 7.904 7.904 0 00-10.82.878c-2.83 3.117-2.83 7.923 0 11.04a7.904 7.904 0 0010.82.878 8.175 8.175 0 01-3.055-6.4z"
          fill={theme.palette.borders.dark}
          fillRule="nonzero"
        />
        <path
          d="M28.888 11.639c0 3.115-1.75 5.957-4.504 7.318a7.89 7.89 0 01-8.44-.922A8.188 8.188 0 0019 11.638a8.188 8.188 0 00-3.057-6.398 7.89 7.89 0 018.44-.922c2.756 1.361 4.505 4.203 4.505 7.319v.002z"
          fill={theme.palette.borders.main}
          fillRule="nonzero"
        />
      </g>
    </svg>
  );
}

export default MastercardIcon;
