"use client"

import { CSSProperties, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IProfileTabsProps, ITabItem } from "@/lib/utils/interfaces";
import { TabItem } from "@/lib/ui/useable-components/profile-tabs";
import { profileDefaultTabs } from "@/lib/utils/constants";

export default function ProfileTabs({ className, tabs }: IProfileTabsProps & { tabs?: ITabItem[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Use the passed tabs or default to profileDefaultTabs
  const tabsToRender = tabs || profileDefaultTabs;

  const scrollableStyles: CSSProperties = {
    msOverflowStyle: "none", // IE and Edge
    scrollbarWidth: "none", // Firefox
    WebkitOverflowScrolling: "touch", // Smooth scrolling
  };

  // Function to scroll active tab into center view
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeTabElement = container.querySelector('.active-tab');
      
      if (activeTabElement) {
        // Calculate positions
        const containerWidth = container.offsetWidth;
        const tabWidth = (activeTabElement as HTMLElement).offsetWidth;
        const tabLeft = (activeTabElement as HTMLElement).offsetLeft;
        
        // Calculate scroll position to center the tab
        const scrollPosition = tabLeft - (containerWidth / 2) + (tabWidth / 2);
        
        // Smooth scroll to position
        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [pathname]);

  return (
    <div className={`w-full md:w-auto max-w-7xl border-b border-gray-200 ${className || ""}`}>
      {/* Mobile View - Horizontally scrollable with centered active tab */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto md:hidden px-1 pb-1 snap-x" 
        style={{ ...scrollableStyles }}
      >
        {tabsToRender.map((tab) => {
          const isActive = pathname === tab.path;
          return (
            <TabItem
              key={tab.path}
              tab={tab}
              isActive={isActive}
              onClick={() => router.push(tab.path)}
              className={`py-1 text-sm font-medium whitespace-nowrap flex-shrink-0 mx-3 snap-center ${
                isActive ? 'active-tab' : ''
              }`}
            />
          );
        })}
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex space-x-8">
        {tabsToRender.map((tab) => (
          <TabItem
            key={tab.path}
            tab={tab}
            isActive={pathname === tab.path}
            onClick={() => router.push(tab.path)}
            className="py-1 px-1 text-lg font-medium"
          />
        ))}
      </div>
    </div>
  );
}