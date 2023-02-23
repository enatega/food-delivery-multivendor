import { SvgIcon, useTheme } from "@mui/material";
import * as React from "react";

function SearchIcon(props) {
  const theme = useTheme();
  return (
    <SvgIcon
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
    >
      <path
        fill={theme.palette.primary.main}
        d="M20.499 19.785l-.714.714-5.32-5.32a6.055 6.055 0 11.713-.714l5.32 5.32zm-6.084-5.966a5.055 5.055 0 10-.597.597l.326-.278.271-.319z"
      />
    </SvgIcon>
  );
}

export default SearchIcon;
