import React from 'react'
import { Circle, Path, Svg } from 'react-native-svg'
import { ENATEGA_BRAND_COLORS } from '../../utils/themeColors'

export const Icons = {
  discovery: ({ color, size }) => (
    <Svg
      width={size ?? 24}
      height={size ?? 24}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <Path
        d='M2.25 12l8.954-8.954c.44-.44 1.152-.44 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
        stroke={color ?? ENATEGA_BRAND_COLORS.foregroundLight}
        strokeWidth={1.5}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </Svg>
  ),
  restaurants: ({ color, size }) => (
    <Svg
      width={size ?? 24}
      height={size ?? 24}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <Path
        d='M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7'
        stroke={color ?? ENATEGA_BRAND_COLORS.foregroundLight}
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </Svg>
  ),
  deals: ({ color, size }) => (
    <Svg
      width={size ?? 24}
      height={size ?? 24}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <Path
        d='M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L3.41 13.4A2 2 0 013 12V5a2 2 0 012-2h7a2 2 0 011.41.59l7.18 7.18a2 2 0 010 2.64z'
        stroke={color ?? ENATEGA_BRAND_COLORS.foregroundLight}
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <Circle
        cx={8.5}
        cy={8.5}
        r={1}
        fill={color ?? ENATEGA_BRAND_COLORS.foregroundLight}
      />
    </Svg>
  ),
  store: ({ color, size }) => (
    <Svg
      width={size ?? 25}
      height={size ?? 24}
      viewBox='0 0 25 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <Path
        d='M2.5 7l4.41-4.41A2 2 0 018.33 2h8.34a2 2 0 011.42.59L22.5 7M4.5 12v8a2 2 0 002 2h12a2 2 0 002-2v-8'
        stroke={color ?? ENATEGA_BRAND_COLORS.foregroundLight}
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <Path
        d='M15.5 22v-4a2 2 0 00-2-2h-2a2 2 0 00-2 2v4M2.5 7h20M22.5 7v3a2 2 0 01-2 2 2.7 2.7 0 01-1.59-.63.7.7 0 00-.82 0 2.7 2.7 0 01-1.59.63 2.7 2.7 0 01-1.59-.63.7.7 0 00-.82 0 2.7 2.7 0 01-1.59.63 2.7 2.7 0 01-1.59-.63.7.7 0 00-.82 0A2.7 2.7 0 018.5 12a2.7 2.7 0 01-1.59-.63.7.7 0 00-.82 0A2.7 2.7 0 014.5 12a2 2 0 01-2-2V7'
        stroke={color ?? ENATEGA_BRAND_COLORS.foregroundLight}
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </Svg>
  ),
  cart: ({ color, size }) => (
    <Svg
      width={size ?? 24}
      height={size ?? 24}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <Path
        d='M3 3h2l2.4 10.39a2 2 0 001.95 1.55h7.88a2 2 0 001.95-1.55L21 6H6'
        stroke={color ?? ENATEGA_BRAND_COLORS.foregroundLight}
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <Circle
        cx={10}
        cy={20}
        r={1.25}
        fill={color ?? ENATEGA_BRAND_COLORS.foregroundLight}
      />
      <Circle
        cx={18}
        cy={20}
        r={1.25}
        fill={color ?? ENATEGA_BRAND_COLORS.foregroundLight}
      />
    </Svg>
  ),
  search: ({ color, size }) => (
    <Svg
      width={size ?? 25}
      height={size ?? 24}
      viewBox='0 0 25 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <Path
        d='M11.5 19a8 8 0 100-16 8 8 0 000 16zM21.5 21l-4.3-4.3'
        stroke={color ?? ENATEGA_BRAND_COLORS.foregroundLight}
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </Svg>
  ),
  profile: ({ color, size }) => (
    <Svg
      width={size ?? 25}
      height={size ?? 24}
      viewBox='0 0 25 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <Path
        d='M12.5 22c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10z'
        stroke={color ?? ENATEGA_BRAND_COLORS.foregroundLight}
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <Path
        d='M12.5 13a3 3 0 100-6 3 3 0 000 6zM7.5 20.662V19a2 2 0 012-2h6a2 2 0 012 2v1.662'
        stroke={color ?? ENATEGA_BRAND_COLORS.foregroundLight}
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </Svg>
  ),
  login: ({ color, size }) => (
    <Svg
      width={size ?? 25}
      height={size ?? 24}
      viewBox='0 0 25 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <Path
        d='M12.5 22c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10z'
        stroke={color ?? ENATEGA_BRAND_COLORS.foregroundLight}
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <Path
        d='M12.5 13a3 3 0 100-6 3 3 0 000 6zM7.5 20.662V19a2 2 0 012-2h6a2 2 0 012 2v1.662'
        stroke={color ?? ENATEGA_BRAND_COLORS.foregroundLight}
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </Svg>
  )
}
