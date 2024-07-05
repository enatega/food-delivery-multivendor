function isValidEmailAddress(address) {
  return !!address.match(/.+@.+/);
}

const cartItemQuantity = (items) => {
  return items.map((item) => `${item.quantity}x ${item.title}${
    item.variation.title ? `(${item.variation.title})` : ""
  }`).join("\n");
};

function calculatePrice(food) {
  var foodPrice = food.variation.price;
  food.addons.forEach((addons) => {
    addons.options.forEach((addon) => {
      foodPrice += addon.price;
    });
  });
  return foodPrice;
}

function calculateDistance(latS, lonS, latD, lonD) 
{
  var R = 6371; // km
  var dLat = toRad(latD-latS);
  var dLon = toRad(lonD-lonS);
  var lat1 = toRad(latS);
  var lat2 = toRad(latD);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d;
}

// Converts numeric degrees to radians
function toRad(Value) 
{
    return Value * Math.PI / 180;
}

function calculateAmount(costType, deliveryRate, distance) {

  return costType === 'fixed' ? deliveryRate : Math.ceil(distance) * deliveryRate;

}

export { isValidEmailAddress, cartItemQuantity, calculatePrice, calculateDistance, calculateAmount };
