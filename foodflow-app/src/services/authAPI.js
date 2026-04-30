import axios from 'axios'
import useEnvVars from '../../../environment'

// Create axios instance with base configuration
const createAPI = () => {
  const { API_BASE_URL } = useEnvVars()
  
  const api = axios.create({
    baseURL: API_BASE_URL || 'https://foodflow-2h6z.onrender.com',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      // Add auth token if available
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token')
      }
      return Promise.reject(error)
    }
  )

  return api
}

// Auth API calls
export const authAPI = {
  // Send OTP to email
  sendOTP: async (email) => {
    const api = createAPI()
    try {
      const response = await api.post('/api/auth/send-otp', { email })
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send OTP',
      }
    }
  },

  // Verify OTP
  verifyOTP: async (email, otp) => {
    const api = createAPI()
    try {
      const response = await api.post('/api/auth/verify-otp', { email, otp })
      if (response.data.success) {
        // Store token
        localStorage.setItem('token', response.data.data.token)
      }
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid OTP',
      }
    }
  },

  // Register with email and password
  register: async (email, password, name = '') => {
    const api = createAPI()
    try {
      const response = await api.post('/api/auth/register', {
        email,
        password,
        name,
      })
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token)
      }
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      }
    }
  },

  // Login with email and password
  login: async (email, password, notificationToken = '') => {
    const api = createAPI()
    try {
      const response = await api.post('/api/auth/login', {
        email,
        password,
        notificationToken,
      })
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token)
      }
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      }
    }
  },

  // Check if email exists
  checkEmail: async (email) => {
    const api = createAPI()
    try {
      const response = await api.post('/api/auth/check-email', { email })
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to check email',
      }
    }
  },
}

export default createAPI
