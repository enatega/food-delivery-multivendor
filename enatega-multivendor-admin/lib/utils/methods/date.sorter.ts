// Date sorter
export default function sortDate(
  state: string,
  startDate?: string,
  endDate?: string
): { startDate: Date; endDate: Date } {
  const today = new Date();
  if (state == 'Today') {
    const startDate = new Date(today.setHours(0, 0, 0, 0));
    const endDate = new Date(today.setHours(23, 59, 59, 999));
    return {
      startDate,
      endDate,
    };
  } else if (state == 'Week') {
    const endOfWeek = new Date(today);
    endOfWeek.setHours(23, 59, 59, 999);

    const startOfWeek = new Date(today);

    startOfWeek.setDate(today.getDate() - 7 - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    return {
      startDate: startOfWeek,
      endDate: endOfWeek,
    };
  } else if (state == 'Month') {
    const startOfMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1); // previous month
    const endOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      0,
      23,
      59,
      59,
      999 + 1
    );
    return {
      startDate: startOfMonth,
      endDate: endOfMonth,
    };
  } else if (state == 'Custom') {
    return {
      startDate: new Date(startDate ?? new Date()),
      endDate: new Date(endDate ?? new Date()),
    };
  } else {
    return {
      startDate: today,
      endDate: today,
    };
  }
}
