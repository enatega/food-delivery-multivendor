import { ICategoryDetailsResponse } from "../interfaces";

export const transformCategoryDetailsResponse = (
  backendData: ICategoryDetailsResponse[]
) => {
  return backendData.map((item) => ({
    label: item.label,
    url: item.url,
    // Add default icon if needed
    // icon: "",
    items:
      item.items?.map((subItem) => ({
        label: subItem.label,
        url: subItem.url,
        // icon: "",
      })) || [],
  }));
};
