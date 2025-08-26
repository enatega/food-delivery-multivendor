// Interfaces
import { IActionMenuProps } from "@/lib/utils/interfaces";

// Icons
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Prime React
import { Menu } from "primereact/menu";

// Hooks
import { useRef, useEffect } from "react";

const ActionMenu = <T,>({
  items,
  data,
  isOpen,
  onToggle = () => {},
}: IActionMenuProps<T>) => {
  const menuRef = useRef<Menu>(null);

  useEffect(() => {
    if (menuRef.current) {
      if (isOpen) {
        // Create a synthetic event for the show method
        const event = new Event("click") as unknown as React.SyntheticEvent;
        menuRef.current.show(event);
      } else {
        // Create a synthetic event for the hide method
        const event = new Event("click") as unknown as React.SyntheticEvent;
        menuRef.current.hide(event);
      }
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <Menu
        model={items?.map((item) => ({
          label: item.label,
          command: (e) => {
            item.command?.(data);
            menuRef.current?.hide(e.originalEvent);
            onToggle();
          },
        }))}
        popup
        ref={menuRef}
        id="popup_menu"
        onHide={() => {
          // Only trigger onToggle if the menu was actually open
          if (isOpen) {
            onToggle();
          }
        }}
      />
      <button
        aria-controls="popup_menu"
        aria-haspopup="true"
        onClick={(event) => {
          event.stopPropagation();
          menuRef.current?.toggle(event);
          onToggle();
        }}
        className="h-full w-full"
      >
        <FontAwesomeIcon icon={faEllipsisV} />
      </button>
    </div>
  );
};

export default ActionMenu;
