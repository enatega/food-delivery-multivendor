export const onFilterObjects = <T>(
  list: T[],
  searchString: string,
  attributes: (keyof T)[]
): T[] => {
  const lowercasedSearchString = searchString.toLowerCase();

  return list.filter((item) =>
    attributes.some((attr) => {
      const value = item[attr];
      return (
        typeof value === 'string' &&
        value.toLowerCase().includes(lowercasedSearchString)
      );
    })
  );
};
