import { SvgIcon, useTheme } from "@mui/material";
import * as React from "react";

function DustbinIcon(props) {
  const theme = useTheme();
  return (
    <SvgIcon
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 74 74"
      width={512}
      height={512}
      {...props}
    >
      <path fill={theme.palette.primary.main} d="M50.532 71H23.468a6.267 6.267 0 01-6.22-5.524l-4-41.38a1 1 0 011-1.1h45.511a1 1 0 011 1.1l-4 41.358A6.271 6.271 0 0150.532 71zM15.343 25l3.893 40.262A4.262 4.262 0 0023.468 69h27.064a4.266 4.266 0 004.234-3.76L58.657 25z" />
      <path fill={theme.palette.primary.main} d="M63.613 25H9.387A2.39 2.39 0 017 22.613v-8.226A2.39 2.39 0 019.387 12h54.226A2.39 2.39 0 0166 14.387v8.227A2.39 2.39 0 0163.613 25zM9.387 14a.387.387 0 00-.387.387v8.227a.387.387 0 00.387.386h54.226a.387.387 0 00.387-.387v-8.226a.387.387 0 00-.387-.387z" />
      <path fill={theme.palette.primary.main} d="M47 14H27a1 1 0 01-1-1V6.395A3.4 3.4 0 0129.395 3h15.21A3.4 3.4 0 0148 6.395V13a1 1 0 01-1 1zm-19-2h18V6.395A1.4 1.4 0 0044.605 5h-15.21A1.4 1.4 0 0028 6.395zM27.181 57a1 1 0 01-.994-.9l-2.182-21a1 1 0 111.989-.207l2.182 21a1 1 0 01-.891 1.1.948.948 0 01-.104.007zM37 57a1 1 0 01-1-1V35a1 1 0 012 0v21a1 1 0 01-1 1zM46.819 57a.948.948 0 01-.1-.005 1 1 0 01-.891-1.1l2.182-21a1 1 0 111.989.207l-2.182 21a1 1 0 01-.998.898z" />
    </SvgIcon>
  );
}

export default DustbinIcon;
