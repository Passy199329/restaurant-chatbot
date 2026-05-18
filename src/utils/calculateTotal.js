const calculateTotal = (items) => {
    return items.reduce((acc, item) => {
      return acc + item.price;
    }, 0);
  };
  
  module.exports = calculateTotal;