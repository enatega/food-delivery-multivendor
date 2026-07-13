import { gql, useMutation } from '@apollo/client'

import { emailExist } from '../../apollo/mutations'

const EMAIL = gql`
  ${emailExist}
`
const useEmailExist = () => {
  const [executeMutation, { loading, data, error, called }] = useMutation(EMAIL, {
    // Don't run on mount
  })

  /**
   * Check if email exists
   * @param {string} email - Email to check
   * @param {Object} options - Optional callbacks
   * @param {Function} options.onCompleted - Callback when mutation completes
   * @param {Function} options.onError - Callback when mutation errors
   * @returns {Promise<{exists: boolean, user: any, data: any, error: any}>}
   */
  const checkEmailExist = async (email, options = {}) => {
    const { onCompleted, onError } = options
    
    try {
      const result = await executeMutation({
        variables: { email },
      })
      
      const emailExist = result?.data?.emailExist
      const exists = !!(emailExist && emailExist._id)
      
      // Execute the onCompleted callback if provided
      if (onCompleted && typeof onCompleted === 'function') {
        onCompleted({ emailExist })
      }
      
      return {
        exists,
        user: emailExist,
        data: result.data,
        error: null
      }
    } catch (err) {
      // Execute the onError callback if provided
      if (onError && typeof onError === 'function') {
        onError(err)
      }
      
      return {
        exists: false,
        user: null,
        data: null,
        error: err
      }
    }
  }

  /**
   * Reset the hook state (useful for clearing previous results)
   */
  const reset = () => {
    // Note: Mutations don't have a reset method, but we can track state manually
    // You might need to handle this differently based on your needs
  }

  return {
    // Main method
    checkEmailExist,
    
    // State
    loading,
    data,
    error,
    called,
    
    // Derived properties
    isEmailExist: !!(data?.emailExist && data.emailExist._id),
    user: data?.emailExist,
    
    // Aliases for convenience
    isLoading: loading,
    hasError: !!error,
    hasBeenCalled: called,
  }
}

export default useEmailExist