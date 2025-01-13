// src/components/CustomSVG.tsx
import React from 'react';
import { IGlobalSVGProps } from '../../interfaces/svg.interface';

export function NoRecordSVG({
  width = '227.714',
  height = '70.5714',
  strokeColor = 'none',
  ...props
}: IGlobalSVGProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 500 500" // Adjust based on your SVG's viewBox if needed
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter="url(#filter0_d_975_31147)">
        <path d="M150 100L250 200L150 300" stroke={strokeColor} />{' '}
        {/* Add your SVG path here */}
      </g>
      <defs>
        <filter
          id="filter0_d_975_31147"
          x="123.926"
          y="9.14816"
          width="227.714"
          height="70.5714"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="5.14286" />
          <feGaussianBlur stdDeviation="5.14286" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.161 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_975_31147"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_975_31147"
            result="shape"
          />
        </filter>
        <filter
          id="filter1_d_975_31147"
          x="185.36"
          y="70.5661"
          width="227.714"
          height="70.5714"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="5.14286" />
          <feGaussianBlur stdDeviation="5.14286" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.161 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_975_31147"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_975_31147"
            result="shape"
          />
        </filter>
        <filter
          id="filter2_d_975_31147"
          x="123.926"
          y="131.984"
          width="227.714"
          height="70.5714"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="5.14286" />
          <feGaussianBlur stdDeviation="5.14286" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.161 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_975_31147"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_975_31147"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
