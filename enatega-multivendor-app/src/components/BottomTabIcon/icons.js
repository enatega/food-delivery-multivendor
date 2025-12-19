import { Path, Svg } from 'react-native-svg'

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
        stroke={color ?? '#0EA5E9'}
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
        stroke={color ?? '#0EA5E9'}
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
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
        stroke={color ?? '#0EA5E9'}
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <Path
        d='M15.5 22v-4a2 2 0 00-2-2h-2a2 2 0 00-2 2v4M2.5 7h20M22.5 7v3a2 2 0 01-2 2 2.7 2.7 0 01-1.59-.63.7.7 0 00-.82 0 2.7 2.7 0 01-1.59.63 2.7 2.7 0 01-1.59-.63.7.7 0 00-.82 0 2.7 2.7 0 01-1.59.63 2.7 2.7 0 01-1.59-.63.7.7 0 00-.82 0A2.7 2.7 0 018.5 12a2.7 2.7 0 01-1.59-.63.7.7 0 00-.82 0A2.7 2.7 0 014.5 12a2 2 0 01-2-2V7'
        stroke={color ?? '#0EA5E9'}
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
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
        stroke={color ?? '#0EA5E9'}
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
        stroke={color ?? '#0EA5E9'}
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <Path
        d='M12.5 13a3 3 0 100-6 3 3 0 000 6zM7.5 20.662V19a2 2 0 012-2h6a2 2 0 012 2v1.662'
        stroke={color ?? '#0EA5E9'}
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
        stroke={color ?? '#0EA5E9'}
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <Path
        d='M12.5 13a3 3 0 100-6 3 3 0 000 6zM7.5 20.662V19a2 2 0 012-2h6a2 2 0 012 2v1.662'
        stroke={color ?? '#0EA5E9'}
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </Svg>
  ),
  deals: ({ color, size }) => (
    <Svg
    width={size}
    height={size}
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M14.011 7.99521L8.01099 13.9952
         M8.01099 7.99521H8.02099
         M14.011 13.9952H14.021
         M2.86093 7.61521C2.71498 6.95774 2.73739 6.27406 2.92609 5.62755
         C3.1148 4.98105 3.46368 4.39266 3.9404 3.91694
         C4.41712 3.44121 5.00624 3.09356 5.65314 2.90621
         C6.30004 2.71886 6.98377 2.69788 7.64093 2.84521
         C8.00264 2.27952 8.50094 1.81397 9.08989 1.4915
         C9.67883 1.16903 10.3395 1 11.0109 1
         C11.6824 1 12.343 1.16903 12.932 1.4915
         C13.5209 1.81397 14.0192 2.27952 14.3809 2.84521
         C15.0391 2.69724 15.724 2.71812 16.3719 2.90593
         C17.0199 3.09373 17.6098 3.44236 18.0868 3.91937
         C18.5638 4.39638 18.9124 4.98629 19.1002 5.63422
         C19.288 6.28214 19.3089 6.96705 19.1609 7.62521
         C19.7266 7.98692 20.1922 8.48522 20.5146 9.07417
         C20.8371 9.66311 21.0061 10.3238 21.0061 10.9952
         C21.0061 11.6667 20.8371 12.3273 20.5146 12.9163
         C20.1922 13.5052 19.7266 14.0035 19.1609 14.3652
         C19.3083 15.0224 19.2873 15.7061 19.0999 16.353
         C18.9126 16.9999 18.5649 17.589 18.0892 18.0657
         C17.6135 18.5425 17.0251 18.8914 16.3786 19.0801
         C15.7321 19.2688 15.0484 19.2912 14.3909 19.1452
         C14.0297 19.7131 13.531 20.1806 12.9411 20.5045
         C12.3511 20.8284 11.689 20.9983 11.0159 20.9983
         C10.3429 20.9983 9.68076 20.8284 9.09081 20.5045
         C8.50086 20.1806 8.00217 19.7131 7.64093 19.1452
         C6.98377 19.2925 6.30004 19.2716 5.65314 19.0842
         C5.00624 18.8969 4.41712 18.5492 3.9404 18.0735
         C3.46368 17.5978 3.1148 17.0094 2.92609 16.3629
         C2.73739 15.7164 2.71498 15.0327 2.86093 14.3752
         C2.29089 14.0145 1.82135 13.5154 1.49598 12.9244
         C1.17062 12.3335 1 11.6698 1 10.9952
         C1 10.3206 1.17062 9.65696 1.49598 9.066
         C1.82135 8.47504 2.29089 7.97597 2.86093 7.61521Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>

    
  ),
  cart: ({ color, size }) => (
    <Svg
      width={size ?? 22}
      height={size ?? 22}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M0.834961 0.835938H2.83496L5.49496 13.2559C5.59254 13.7108 5.84563 14.1174 6.21067 14.4058C6.57571 14.6942 7.02987 14.8463 7.49496 14.8359H17.275C17.7301 14.8352 18.1714 14.6792 18.526 14.3938C18.8805 14.1083 19.1271 13.7105 19.225 13.2659L20.875 5.83594H3.90496M7.78491 19.7859C7.78491 20.3382 7.3372 20.7859 6.78491 20.7859C6.23263 20.7859 5.78491 20.3382 5.78491 19.7859C5.78491 19.2336 6.23263 18.7859 6.78491 18.7859C7.3372 18.7859 7.78491 19.2336 7.78491 19.7859ZM18.7849 19.7859C18.7849 20.3382 18.3372 20.7859 17.7849 20.7859C17.2326 20.7859 16.7849 20.3382 16.7849 19.7859C16.7849 19.2336 17.2326 18.7859 17.7849 18.7859C18.3372 18.7859 18.7849 19.2336 18.7849 19.7859Z"
        stroke={color ?? '#71717A'}
        strokeWidth={1.67}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  venderprofile: ({ color, size }) => (
    <Svg
      width={size ?? 16}
      height={size ?? 20}
      viewBox="0 0 16 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M15 19V17C15 15.9391 14.5786 14.9217 13.8284 14.1716C13.0783 13.4214 12.0609 13 11 13H5C3.93913 13 2.92172 13.4214 2.17157 14.1716C1.42143 14.9217 1 15.9391 1 17V19M12 5C12 7.20914 10.2091 9 8 9C5.79086 9 4 7.20914 4 5C4 2.79086 5.79086 1 8 1C10.2091 1 12 2.79086 12 5Z"
        stroke={color ?? '#71717A'}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),

}
