import { ORDER_STATUS_ENUM } from "./enums"

function calculateDistance(latS, lonS, latD, lonD) {
  var R = 6371 // km
  var dLat = toRad(latD - latS)
  var dLon = toRad(lonD - lonS)
  var lat1 = toRad(latS)
  var lat2 = toRad(latD)

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  var d = R * c
  return d
}

// Converts numeric degrees to radians
function toRad(Value) {
  return (Value * Math.PI) / 180
}

const calulateRemainingTime = (order) => {
  const expectedTime = [ORDER_STATUS_ENUM.ACCEPTED, ORDER_STATUS_ENUM.ASSIGNED].includes(order.orderStatus)
    ? order.preparationTime : order.completionTime
  const remainingTime = Math.floor((new Date(expectedTime) - Date.now()) / 1000 / 60)
  return remainingTime > 0 ? remainingTime : 0
}

export { calculateDistance, calulateRemainingTime }

