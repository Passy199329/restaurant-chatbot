const menu = require("../utils/menuData");


const getWelcomeMessage = () => {

  return `
Welcome to Nnamdi Restaurant 🍽️

Select 1 to Place an order
Select 99 to checkout order
Select 98 to see order history
Select 97 to see current order
Select 0 to cancel order
`;
};


const getMenu = () => {

  let text = "📋 Restaurant Menu\n\n";

  menu.forEach((item) => {

    text +=
`${item.code}. ${item.name} - ₦${item.price}\n`;
  });

  text +=
`\nSelect food number to add to cart`;

  return text;
};


module.exports = {
  getWelcomeMessage,
  getMenu,
};