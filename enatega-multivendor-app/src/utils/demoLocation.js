export const calculateZoneCentroid = (coordinates) => {
  const points = coordinates?.[0]

  if (!points?.length) return null

  let x = 0
  let y = 0
  let area = 0

  for (let i = 0; i < points.length - 1; i++) {
    const x0 = points[i][0]
    const y0 = points[i][1]
    const x1 = points[i + 1][0]
    const y1 = points[i + 1][1]
    const a = x0 * y1 - x1 * y0
    area += a
    x += (x0 + x1) * a
    y += (y0 + y1) * a
  }

  area /= 2

  if (!area) {
    const [longitude, latitude] = points[0] || []
    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
      return { latitude, longitude }
    }
    return null
  }

  return {
    latitude: y / (6 * area),
    longitude: x / (6 * area)
  }
}

export const buildDemoLocationFromZone = (zone) => {
  if (!zone?._id) return null

  const centroid = calculateZoneCentroid(zone?.location?.coordinates)
  if (!centroid) return null

  return {
    _id: `demo-zone:${zone._id}`,
    label: 'Demo Address',
    deliveryAddress: `${zone.title || 'Demo'} delivery zone`,
    details: 'Customer demo mode default address',
    city: zone.title || 'Demo',
    latitude: centroid.latitude,
    longitude: centroid.longitude,
    isDemoDefaultLocation: true,
    demoZoneId: zone._id
  }
}
