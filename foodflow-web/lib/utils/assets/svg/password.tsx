export default function PasswordIcon() {
  return (
    <svg width="60" height="78" viewBox="0 0 40 68" fill="none">
      {/* Light mode */}
      <path
        className="block dark:hidden"
        d="M10 28V21C10 15.4772 14.4772 11 20 11C25.5228 11 30 15.4772 30 21V28"
        stroke="#111827"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        className="block dark:hidden"
        x="8"
        y="28"
        width="24"
        height="20"
        rx="2"
        stroke="#111827"
        strokeWidth="1.5"
      />
      <circle
        className="block dark:hidden"
        cx="20"
        cy="38"
        r="2"
        fill="#111827"
      />
      <line
        className="block dark:hidden"
        x1="20"
        y1="40"
        x2="20"
        y2="44"
        stroke="#111827"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Dark mode */}
      <path
        className="hidden dark:block"
        d="M10 28V21C10 15.4772 14.4772 11 20 11C25.5228 11 30 15.4772 30 21V28"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
       className="hidden dark:block"
        x="8"
        y="28"
        width="24"
        height="20"
        rx="2"
        stroke="#ffffff"
        strokeWidth="1.5"
      />
      <circle
       className="hidden dark:block"
        cx="20"
        cy="38"
        r="2"
        fill="#ffffff"
      />
      <line
        className="hidden dark:block"
        x1="20"
        y1="40"
        x2="20"
        y2="44"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
