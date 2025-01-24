import { IActionMenuProps } from '@/lib/utils/interfaces/action-menu.interface';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu } from 'primereact/menu';
import { useRef } from 'react';

const ActionMenu = <T,>({ items, data }: IActionMenuProps<T>) => {
  const menu = useRef<Menu>(null);

  return (
    <div>
      <Menu
        model={items?.map((item) => ({
          label: item.label,
          command: () => {
            item.command?.(data);
          },
        }))}
        popup
        ref={menu}
        id="popup_menu"
      />
      <button
        aria-controls="popup_menu"
        aria-haspopup="true"
        onClick={(event) => {
          event.stopPropagation();
          menu.current?.toggle(event);
        }}
        className="h-full w-full"
      >
        <FontAwesomeIcon icon={faEllipsisV} />
      </button>
    </div>
  );
};

export default ActionMenu;
