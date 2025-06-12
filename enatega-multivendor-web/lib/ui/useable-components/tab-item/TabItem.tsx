interface TabItemProps {
    active: boolean;
    label: string;
    onClick: () => void;
    Icon: React.FC<{ color: string }>;
  }
  
  export default function TabItem({ active, label, onClick, Icon }: TabItemProps) {
    const baseClasses =
      "flex flex-col sm:flex-row items-center justify-center w-24 sm:w-36 gap-x-1 p-2 md:pt-2 md:pb-2 md:pl-4 md:pr-4 rounded-full cursor-pointer transition-all duration-300 whitespace-nowrap";
  
    const activeClasses = "text-sky-500 sm:bg-sky-500 sm:text-white";
    const inactiveClasses = "bg-gray-100 sm:hover:bg-gray-200 text-gray-500";
  
    return (
      <div
        className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
        onClick={onClick}
      >
        <Icon color="currentColor" />
        <span className="font-inter font-medium text-[12px] md:text-sm sm:inline">
          {label}
        </span>
      </div>
    );
  }
  