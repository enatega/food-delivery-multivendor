import { Easing } from 'react-native-reanimated'

export const IMAGE_LINK =
  'https://res.cloudinary.com/do1ia4vzf/image/upload/v1714636036/food/z3woendyhtelzarcmdcm.jpg'

export const SLIDE_UP_RIGHT_ANIMATION = {
  cardStyleInterpolator: ({ current, layouts }) => {
    const translateX = current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [layouts.screen.width, 0]
    })

    const translateY = current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [-layouts.screen.height, 0]
    })

    return {
      cardStyle: {
        transform: [{ translateX }, { translateY }]
      }
    }
  },
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 250,
        easing: Easing.inOut(Easing.ease)
      }
    },
    close: {
      animation: 'timing',
      config: {
        duration: 200
      }
    }
  }
}

export const SLIDE_RIGHT_WITH_CURVE_ANIM = {
  cardStyleInterpolator: ({ current, layouts }) => {
    // Horizontal translation (move from right to left)
    const translateX = current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [layouts.screen.width, 0] // Move from right to left
    })

    // 3D rotation on Y-axis (tilt sideways)
    const rotateY = current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: ['-45deg', '0deg'] // Start with a 45 degree tilt, end at 0 degrees
    })

    // Simulate depth by adjusting perspective (no translateZ, but still using perspective)
    const perspective = 1000 // Perspective for a 3D effect

    // Simulate a curve by scaling (as it approaches, it gets larger, simulating "moving closer")
    const scale = current.progress.interpolate({
      inputRange: [0, 0.3, 0.6, 1],
      outputRange: [1.4, 1.2, 1.05, 1] // Starts zoomed out, zooms in a bit (curved effect), then zooms to normal
    })

    return {
      cardStyle: {
        transform: [
          { translateX }, // Horizontal movement
          { perspective }, // 3D perspective depth effect
          { rotateY }, // 3D rotation on Y-axis (left/right tilt)
          { scale } // Simulating depth using scale (curve effect)
        ]
      }
    }
  },
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 380, // Slowing down the animation (default is around 300ms)
        easing: Easing.inOut(Easing.ease) // Smooth easing for the animation
      }
    },
    close: {
      animation: 'timing',
      config: {
        duration: 200 // Slowing down the closing animation as well
      }
    }
  }
}

export const AIMATE_FROM_CENTER = {
  cardStyleInterpolator: ({ current, layouts }) => {
    // Simulate a curve by scaling (as it approaches, it gets larger, simulating "moving closer")
    const scale = current.progress.interpolate({
      inputRange: [0, 0.3, 0.6, 1],
      outputRange: [0, 0.3, 0.6, 1] // Starts zoomed out, zooms in a bit (curved effect), then zooms to normal
    })

    return {
      cardStyle: {
        transform: [
          { scale } // Simulating depth using scale (curve effect)
        ]
      }
    }
  },
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 200, // Slowing down the animation (default is around 300ms)
        easing: Easing.inOut(Easing.ease) // Smooth easing for the animation
      }
    },
    close: {
      animation: 'timing',
      config: {
        duration: 100 // Slowing down the closing animation as well
      }
    }
  }
}


// NEW: Cart-specific animation - same as SLIDE_UP_RIGHT but with fixed header opacity
export const SLIDE_UP_RIGHT_ANIMATION_FIXED_HEADER = {
  cardStyleInterpolator: ({ current, layouts }) => {
    const translateX = current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [layouts.screen.width, 0]
    })

    const translateY = current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [-layouts.screen.height, 0]
    })

    return {
      cardStyle: {
        transform: [{ translateX }, { translateY }]
      }
    }
  },
  // This is the key addition - prevents header from fading during transition
  headerStyleInterpolator: ({ current }) => ({
    headerStyle: {
      opacity: 1, // Keep header fully opaque throughout the animation
    },
  }),
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 250,
        easing: Easing.inOut(Easing.ease)
      }
    },
    close: {
      animation: 'timing',
      config: {
        duration: 200
      }
    }
  }
}