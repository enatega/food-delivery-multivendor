export default function PersonIcon({ lightColor, darkColor }: any) {
  return (
    <svg width="48" height="62" viewBox="0 0 48 62" fill="none">
      {/* light mode */}
      <path
        className="block dark:hidden"
        d="M35.5625 12.5C35.5625 18.8858 30.3858 24.0625 24 24.0625C17.6142 24.0625 12.4375 18.8858 12.4375 12.5C12.4375 6.11421 17.6142 0.9375 24 0.9375C30.3858 0.9375 35.5625 6.11421 35.5625 12.5Z"
        stroke={lightColor}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        className="block dark:hidden"
        d="M0.87851 56.0313C1.09528 43.4471 11.3641 33.3125 24 33.3125C36.6362 33.3125 46.9052 43.4476 47.1215 56.0322C40.0829 59.2619 32.2522 61.0625 24.001 61.0625C15.749 61.0625 7.91763 59.2616 0.87851 56.0313Z"
        stroke={lightColor}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      {/* dark mode */}

      <path
        className=" hidden dark:block"
        d="M35.5625 12.5C35.5625 18.8858 30.3858 24.0625 24 24.0625C17.6142 24.0625 12.4375 18.8858 12.4375 12.5C12.4375 6.11421 17.6142 0.9375 24 0.9375C30.3858 0.9375 35.5625 6.11421 35.5625 12.5Z"
        stroke={darkColor}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        className=" hidden dark:block"
        d="M0.87851 56.0313C1.09528 43.4471 11.3641 33.3125 24 33.3125C36.6362 33.3125 46.9052 43.4476 47.1215 56.0322C40.0829 59.2619 32.2522 61.0625 24.001 61.0625C15.749 61.0625 7.91763 59.2616 0.87851 56.0313Z"
        stroke={darkColor}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
