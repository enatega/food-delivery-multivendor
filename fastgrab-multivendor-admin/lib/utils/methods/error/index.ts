export const onErrorMessageMatcher = <T extends string>(
  type: T | undefined,
  message: string | undefined | string[],
  errorMessages: Record<T, string[]>
): boolean => {
  if (!type) return true;
  return errorMessages[type]?.some((emessage) => emessage === message) ?? false;
};
