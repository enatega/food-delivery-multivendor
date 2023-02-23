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

export { calculateDistance }
