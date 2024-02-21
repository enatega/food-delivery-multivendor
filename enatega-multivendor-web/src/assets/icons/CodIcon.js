import * as React from "react";
import { useTheme } from "@mui/material";

function CodIcon(props) {
  const theme = useTheme();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={32}
      height={24}
      viewBox="0 0 32 24"
      {...props}
    >
      <defs>
        <path
          id="prefix__a"
          d="M2 0h28a2 2 0 012 2v20a2 2 0 01-2 2H2a2 2 0 01-2-2V2a2 2 0 012-2z"
        />
      </defs>
      <g fill="none" fillRule="evenodd">
        <use fill={theme.palette.warning.lightest} xlinkHref="#prefix__a" />
        <path
          stroke={theme.palette.warning.dark}
          d="M2 .5A1.5 1.5 0 00.5 2v20A1.5 1.5 0 002 23.5h28a1.5 1.5 0 001.5-1.5V2A1.5 1.5 0 0030 .5H2z"
        />
        <path
          fill={theme.palette.warning.darkest}
          fillRule="nonzero"
          d="M4 5h24v14H4z"
        />
        <path
          fill={theme.palette.error.lightest}
          fillRule="nonzero"
          d="M6.795 6h18.307c-.02.568.115.948.509 1.364C26.005 7.779 27 8 27 8v10H7c.02-.682-.341-1.165-.673-1.449-.332-.284-.774-.448-1.327-.492V8a1.931 1.931 0 001.327-.636c.304-.341.46-.796.468-1.364z"
        />
        <circle
          cx={16.138}
          cy={11.989}
          r={4.23}
          fill={theme.palette.error.darkest}
          fillRule="nonzero"
        />
        <path
          fill={theme.palette.warning.darkest}
          fillRule="nonzero"
          d="M22.207 11.621h3.31v1h-3.31zm-15.448 0h3v1h-3z"
        />
        <path
          fill={theme.palette.error.lightest}
          fillRule="nonzero"
          d="M26.897 21c-1.778 0-3.219-.7-3.219-1.563 0-.864 1.441-1.563 3.219-1.563 1.777 0 3.218.7 3.218 1.563S28.674 21 26.897 21z"
        />
        <path
          fill={theme.palette.warning.darkest}
          fillRule="nonzero"
          d="M29.926 18.793h-6.247v-.368h.367v1.031c0 .576 1.251 1.176 2.85 1.176 1.6 0 2.851-.6 2.851-1.176v-.677l.179.014zM26.896 21c-1.777 0-3.218-.691-3.218-1.544v-1.03h6.437v1.03c0 .853-1.441 1.544-3.218 1.544z"
        />
        <path
          fill={theme.palette.error.lightest}
          fillRule="nonzero"
          d="M26.897 20.08c-1.778 0-3.219-.7-3.219-1.563s1.441-1.563 3.219-1.563c1.777 0 3.218.7 3.218 1.563 0 .864-1.441 1.563-3.218 1.563z"
        />
        <path
          fill={theme.palette.warning.darkest}
          fillRule="nonzero"
          d="M29.926 17.874h-6.247v-.368h.367v1.03c0 .577 1.251 1.177 2.85 1.177 1.6 0 2.851-.6 2.851-1.176V17.859l.179.015zm-3.03 2.206c-1.777 0-3.218-.69-3.218-1.543v-1.031h6.437v1.03c0 .853-1.441 1.544-3.218 1.544z"
        />
        <path
          fill={theme.palette.error.lightest}
          fillRule="nonzero"
          d="M26.897 19.16c-1.778 0-3.219-.699-3.219-1.562 0-.864 1.441-1.564 3.219-1.564 1.777 0 3.218.7 3.218 1.564 0 .863-1.441 1.563-3.218 1.563z"
        />
        <path
          fill={theme.palette.warning.darkest}
          fillRule="nonzero"
          d="M26.897 19.16c-1.778 0-3.219-.699-3.219-1.562 0-.864 1.441-1.564 3.219-1.564 1.777 0 3.218.7 3.218 1.564 0 .863-1.441 1.563-3.218 1.563zm0-.367c1.6 0 2.85-.607 2.85-1.195 0-.588-1.25-1.196-2.85-1.196s-2.851.608-2.851 1.196 1.25 1.195 2.85 1.195z"
        />
      </g>
    </svg>
  );
}

export default CodIcon;
