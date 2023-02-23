export function transformPolygon(coordinate) {
  return coordinate.slice(0, coordinate.length - 1).map(item => {
    return { lat: item[1], lng: item[0] }
  })
}
export function transformPath(path) {
  const geometry = path.map(coordinates => {
    return [coordinates.lng, coordinates.lat]
  })
  geometry.push(geometry[0])
  return [geometry]
}
