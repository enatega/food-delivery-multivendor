export const onFilterObjects = <T>(
  list: T[],
  searchString: string,
  attributes: (keyof T)[]
): T[] => {
  const lowercasedSearchString = searchString.toLowerCase();

  return list
    .filter((item) =>
      attributes.some((attr) => {
        const value = item[attr];
        return (
          typeof value === 'string' &&
          value.toLowerCase().includes(lowercasedSearchString)
        );
      })
    )
    .sort((a: any, b: any) => {
      // Sorting by `_id` (MongoDB default sorting mechanism)
      return parseInt(b._id.substring(0, 8), 16) - parseInt(a._id.substring(0, 8), 16);
    });
};