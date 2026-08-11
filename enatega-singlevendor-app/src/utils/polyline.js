export function decodePolyline(encoded = '') {
  if (typeof encoded !== 'string' || encoded.length === 0) return []

  const coordinates = []
  let index = 0
  let latitude = 0
  let longitude = 0

  while (index < encoded.length) {
    let result = 0
    let shift = 0
    let byte
    do {
      if (index >= encoded.length || shift > 30) return []
      byte = encoded.charCodeAt(index++) - 63
      if (byte < 0) return []
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)
    latitude += result & 1 ? ~(result >> 1) : result >> 1

    result = 0
    shift = 0
    do {
      if (index >= encoded.length || shift > 30) return []
      byte = encoded.charCodeAt(index++) - 63
      if (byte < 0) return []
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)
    longitude += result & 1 ? ~(result >> 1) : result >> 1

    coordinates.push({
      latitude: latitude / 1e5,
      longitude: longitude / 1e5
    })
  }

  return coordinates
}

export function trimPolylineToRider(coordinates, riderLocation) {
  if (!coordinates?.length || !riderLocation) return coordinates || []
  let nearestIndex = 0
  let nearestDistance = Infinity
  coordinates.forEach((coordinate, index) => {
    const latitudeDelta = coordinate.latitude - riderLocation.latitude
    const longitudeDelta = coordinate.longitude - riderLocation.longitude
    const squaredDistance = latitudeDelta ** 2 + longitudeDelta ** 2
    if (squaredDistance < nearestDistance) {
      nearestDistance = squaredDistance
      nearestIndex = index
    }
  })
  return [riderLocation, ...coordinates.slice(nearestIndex)]
}
