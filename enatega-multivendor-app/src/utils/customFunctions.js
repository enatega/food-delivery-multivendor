import { ORDER_STATUS_ENUM } from './enums'

function calculateDistance(latS, lonS, latD, lonD) {
  var R = 6371 // km
  var dLat = toRad(latD - latS)
  var dLon = toRad(lonD - lonS)
  var lat1 = toRad(latS)
  var lat2 = toRad(latD)

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  var d = R * c
  return d
}

// Converts numeric degrees to radians
function toRad(Value) {
  return (Value * Math.PI) / 180
}

/* const calulateRemainingTime = (order) => {



  // console.log({id: order?._id, preparationTime: order.preparationTime, completionTime: order?.completionTime})

  const expectedTime = [ORDER_STATUS_ENUM.PENDING].includes(order?.orderStatus)
    ? order?.preparationTime : order?.completionTime

  console.log({local: new Date(order?.preparationTime)})

  const remainingTime = Math.floor((new Date(expectedTime) - Date.now()) / 1000 / 60)
  return remainingTime > 0 ? remainingTime : 0
} */

const calulateRemainingTime = (order) => {
  // pick preparation or completion
  const expectedTimeUTC = [ORDER_STATUS_ENUM.PENDING].includes(order?.orderStatus) ? order?.preparationTime : order?.completionTime

  // convert UTC string → Date object → Local time
  const targetLocal = new Date(expectedTimeUTC) // JS automatically shifts this to local tz

  // difference in ms (uses local epoch under the hood)
  const diffMs = targetLocal.getTime() - Date.now()

  // convert ms → minutes
  const remainingTime = Math.floor(diffMs / 1000 / 60)

  return remainingTime > 0 ? remainingTime : 0
}

const calculateDaysAgo = (timestamp) => {
  const currentDate = new Date()
  const pastDate = new Date(Number(timestamp)) // Convert timestamp to Date
  const timeDifference = currentDate - pastDate

  const seconds = Math.floor(timeDifference / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(months / 12)

  if (seconds < 60) return 'Just now'
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`
  return `${years} year${years > 1 ? 's' : ''} ago`
}

function groupAndCount(array = [], key) {
  const result = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  }
  return array.reduce((updated, item) => {
    const propertyValue = item[key]

    if (!result[propertyValue === 0 ? 1 : propertyValue]) {
      updated[propertyValue === 0 ? 1 : propertyValue] = 1
    } else {
      updated[propertyValue === 0 ? 1 : propertyValue]++
    }

    return updated
  }, result)
}

function sortReviews(reviews, sortBy) {
  if (sortBy === 'newest') {
    return reviews.sort((a, b) => b.createdAt - a.createdAt)
  } else if (sortBy === 'highest') {
    return reviews.sort((a, b) => b.rating - a.rating)
  } else if (sortBy === 'lowest') {
    return reviews.sort((a, b) => a.rating - b.rating)
  }
}

function calculateAmount(costType, deliveryRate, distance) {
  return costType === 'fixed' ? deliveryRate : Math.ceil(distance) * deliveryRate
}

const isOpen = (restaurant) => {
  if (restaurant?.openingTimes?.length < 1 || !restaurant?.isAvailable) return false
  const date = new Date()
  const day = date.getDay()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const todaysTimings = restaurant?.openingTimes?.find((o) => o.day === ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][day])
  if (!todaysTimings) return false

  // Check all time slots for today's timings
  return todaysTimings.times.some((t) => {
    const startHour = Number(t.startTime[0])
    const startMinute = Number(t.startTime[1])
    const endHour = Number(t.endTime[0])
    const endMinute = Number(t.endTime[1])

    const startTime = startHour * 60 + startMinute // Convert to minutes
    const endTime = endHour * 60 + endMinute // Convert to minutes
    const currentTime = hours * 60 + minutes // Convert to minutes

    return currentTime >= startTime && currentTime <= endTime
  })
}

// Function to sort restaurants based on their open status
const sortRestaurantsByOpenStatus = (restaurants) => {
  return [...restaurants].sort((a, b) => {
    const isOpenA = isOpen(a) ? 1 : 0 // 1 if open, 0 if closed
    const isOpenB = isOpen(b) ? 1 : 0 // 1 if open, 0 if closed
    return isOpenB - isOpenA // Sort open restaurants to the top
  })
}


const truncateText = (limit, text) => {
  if (typeof text !== "string") return "";
  if (text.length <= limit) return text;
  return text.slice(0, limit) + "...";
}
export { calculateDistance, calulateRemainingTime, calculateDaysAgo, groupAndCount, sortReviews, calculateAmount, isOpen, sortRestaurantsByOpenStatus, truncateText }
