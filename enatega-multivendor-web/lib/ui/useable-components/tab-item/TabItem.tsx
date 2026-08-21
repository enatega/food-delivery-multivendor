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
    "group flex min-h-11 flex-1 items-center justify-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors sm:-mb-px sm:min-h-[52px] sm:flex-none sm:px-4 sm:py-0";

  const activeClasses =
    "border-primary-color bg-primary-light text-primary-dark sm:bg-transparent dark:bg-gray-800 dark:text-white";
  const inactiveClasses =
    "border-transparent text-dispatch-muted hover:border-primary-color hover:text-primary-dark dark:text-gray-300";

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
