# Enatega Animated Splash (React Native / Expo component)

Native port of the approved splash video. One component replaces both theme videos:
it reads the system theme at runtime, scales to every screen size and aspect ratio
(phones and tablets), and plays its green outro only when the app is actually ready.

## Contents

```
AnimatedSplash.js        the component (self-contained)
assets/pin.png           Enatega pin logo (transparent, 2x)
assets/wordmarkWhite.png ENATEGA wordmark for dark theme
assets/wordmarkNavy.png  ENATEGA wordmark for light theme
assets/glow.png          radial green glow (shared by orbs + logo glow)
```

Total assets ≈ 250 KB — smaller than a single splash video, shared by both themes.

## Requirements

Already present in the Enatega apps — no new packages:

- `react-native-reanimated` (v2 or v3)
- `expo-linear-gradient`

## Install

Copy the folder into each app (customer / rider / restaurant), e.g. `src/components/AnimatedSplash/`.

## Usage

Replace the current `mobileSplash.mp4` playback with:

```jsx
import { useState } from 'react'
import AnimatedSplash from './src/components/AnimatedSplash/AnimatedSplash'

export default function App() {
  const [appReady, setAppReady] = useState(false)     // fonts, apollo, config loaded
  const [splashDone, setSplashDone] = useState(false)

  // ...set appReady = true when your bootstrap finishes...

  return (
    <>
      {/* your app tree */}
      {!splashDone && (
        <AnimatedSplash ready={appReady} onFinish={() => setSplashDone(true)} />
      )}
    </>
  )
}
```

### Props

| Prop | Default | Meaning |
|---|---|---|
| `ready` | `true` | While `false`, the splash holds its idle loop (logo bob + glow breathing). When it becomes `true`, the outro plays and `onFinish` fires ~0.7s later. |
| `minDuration` | `2400` (ms) | Minimum time on screen so the intro always completes, even if the app is ready instantly. |
| `onFinish` | — | Called after the outro finishes on the green end-frame. Unmount the splash here. |

If the app takes longer than 3s to load, the splash simply keeps breathing — no
frozen last frame, no black gap (an advantage over the fixed-length video).

## Native static splash (the frame before JS loads)

Keep the OS splash theme-correct so it blends into this component's first frame.
In `app.json` (expo-splash-screen):

```json
{
  "userInterfaceStyle": "automatic",
  "plugins": [
    [
      "expo-splash-screen",
      {
        "image": "./assets/splash_static_light.png",
        "backgroundColor": "#f4f8f5",
        "resizeMode": "cover",
        "dark": {
          "image": "./assets/splash_static_dark.png",
          "backgroundColor": "#0b1225"
        }
      }
    ]
  ]
}
```

(`splash_static_dark.png` / `splash_static_light.png` were delivered earlier — they are
the exact first frames of the animation.)

Call `SplashScreen.preventAutoHideAsync()` at startup and `SplashScreen.hideAsync()`
as soon as `AnimatedSplash` mounts, so the static image hands off directly to the
animated component.

## Notes

- The video versions' shimmer/gloss sweeps were intentionally left out — they would
  require an extra dependency (`@react-native-masked-view/masked-view`). The core
  motion (ring pulses, spring-in, glow, wordmark wipe, underline, idle float, green
  outro) is identical. Easy to add later if wanted.
- Timings mirror the approved video: intro ≈ 1.9s, idle loop, outro ≈ 0.7s.
- The green end-frame color is `#5ecf72`, same as the videos, so any existing
  fade-into-app transition behaves identically.
