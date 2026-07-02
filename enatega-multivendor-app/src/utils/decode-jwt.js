import { jwtDecode } from 'jwt-decode'

export const decodeJwtToken = (token) => {
  try {
    return jwtDecode(token)
  } catch (error) {
    console.error('Invalid token', error)
    return null
  }
}

export const getJwtExpiryTime = (token) => {
  const decodedToken = decodeJwtToken(token)
  if (!decodedToken?.exp) return null

  return decodedToken.exp * 1000
}

export const isJwtTokenExpired = (token) => {
  const expiryTime = getJwtExpiryTime(token)
  if (!expiryTime) return true

  return expiryTime <= Date.now()
}
