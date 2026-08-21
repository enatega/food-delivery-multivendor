interface TabItemProps {
  active: boolean;
  label: string;
  onClick: () => void;
  Icon: React.FC<{ color: string }>;
}

export default function TabItem({
  active,
  label,
  onClick,
  Icon,
}: TabItemProps) {
  const baseClasses =
    "group relative flex min-h-11 flex-1 items-center justify-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors after:absolute after:inset-x-3 after:bottom-[-1px] after:h-0.5 after:origin-center after:scale-x-0 after:bg-primary-color after:transition-transform after:duration-200 hover:after:scale-x-100 focus-visible:z-10 focus-visible:rounded-lg focus-visible:outline-none sm:min-h-[52px] sm:flex-none sm:px-4 sm:py-0";

  const activeClasses =
    "bg-primary-light text-primary-dark after:scale-x-100 sm:bg-transparent dark:bg-gray-800 dark:text-white sm:dark:bg-transparent";
  const inactiveClasses =
    "text-dispatch-muted hover:text-primary-dark dark:text-gray-300 dark:hover:text-white";

  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
      onClick={onClick}
    >
      <Icon color="currentColor" />
      <span className="font-inter text-xs sm:text-sm">{label}</span>
    </button>
  );
}
