import moment from 'moment';

export const getIsAcceptButtonVisible = (orderDate) => {
  const mockCurrentTime = moment().add(5, 'minutes'); // Add 5 minutes as a grace period
  return !mockCurrentTime.isBefore(orderDate);
};
