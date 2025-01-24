export interface ISidebarContextProps {
  selectedItem: ISelectedItems | null;
  setSelectedItem: (keys: ISelectedItems) => void;
}

export interface ISelectedItems {
  screenName: string;
}
