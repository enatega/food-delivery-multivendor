import { IDropdownSelectItem } from '../interfaces';

export function getLabelByCode(
  items: IDropdownSelectItem[],
  code: string
): string {
  const foundItem = items.find((item) => item.code === code);
  return foundItem?.label ?? ''; // Return empty string if no item is found
}
