export default function PhoneIcon() {
  return (
    <svg
      width="40"
      height="68"
      viewBox="0 0 40 68"
      fill="none"
    >
      {/* Light mode */}
      <path
      className="block dark:hidden"
        d="M15.375 1.625H8.4375C4.60602 1.625 1.5 4.73103 1.5 8.5625V59.4375C1.5 63.269 4.60602 66.375 8.4375 66.375H31.5625C35.394 66.375 38.5 63.269 38.5 59.4375V8.5625C38.5 4.73102 35.394 1.625 31.5625 1.625H24.625M15.375 1.625V6.25H24.625V1.625M15.375 1.625H24.625M15.375 59.4375H24.625"
        stroke="#111827"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      {/* Dark mode */}
      <path
      className="hidden dark:block"
        d="M15.375 1.625H8.4375C4.60602 1.625 1.5 4.73103 1.5 8.5625V59.4375C1.5 63.269 4.60602 66.375 8.4375 66.375H31.5625C35.394 66.375 38.5 63.269 38.5 59.4375V8.5625C38.5 4.73102 35.394 1.625 31.5625 1.625H24.625M15.375 1.625V6.25H24.625V1.625M15.375 1.625H24.625M15.375 59.4375H24.625"
        stroke="#ffffff"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
