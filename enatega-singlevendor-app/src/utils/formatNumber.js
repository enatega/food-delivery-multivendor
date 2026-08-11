export const formatNumber = (number) => {
    if (number < 10000) {
        return number.toString();
      } else {
        return (number / 1000).toFixed(0) + 'k';
      }
  
  };