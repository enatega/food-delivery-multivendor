/* eslint-disable @typescript-eslint/no-explicit-any */
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
      try {
        if (typeof a._id !== 'string' || typeof b._id !== 'string') return 0;
        if (a._id.length < 8 || b._id.length < 8) return 0;
        return parseInt(b._id.substring(0, 8), 16) - parseInt(a._id.substring(0, 8), 16);
      } catch (error) {
        console.error('Error sorting by _id:', error);
        return 0;
      }
    });
};
/* eslint-enable @typescript-eslint/no-explicit-any */
