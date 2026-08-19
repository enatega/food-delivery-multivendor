# App Store ATT Resolution

The iOS build does not track users across apps or websites owned by other
companies and does not use advertising identifiers. App Tracking Transparency
was previously included unnecessarily and has been removed.

## App Store Connect checklist

- Remove every "Used to Track You" selection from App Privacy.
- Continue to disclose data collected for app functionality, product analytics,
  diagnostics, authentication, location, and order fulfilment.
- Verify whether each disclosed data type is linked to the user based on the
  production behavior of Amplitude, Microsoft Clarity, Sentry, and Enatega.
- Upload a new native iOS binary. This change cannot be delivered through an
  Expo OTA update.

## App Review response

> Enatega does not track users across apps or websites owned by other companies,
> does not access IDFA, and does not use collected data for targeted advertising,
> advertising attribution, retargeting, or data-broker sharing. The
> AppTrackingTransparency dependency and NSUserTrackingUsageDescription were
> included unnecessarily and have now been removed. We have also updated the App
> Privacy information in App Store Connect to accurately declare our first-party
> analytics and diagnostic data practices. Therefore, an ATT prompt is no longer
> expected in this build.

## Release verification

1. Run `npx expo config --type public --json` and confirm that neither
   `expo-tracking-transparency` nor `NSUserTrackingUsageDescription` is present.
2. Build with `npm run build:production:ios`.
3. Inspect the archived app's `Info.plist`, linked frameworks, and privacy
   manifests for unexpected tracking declarations or advertising identifier use.
4. Test a fresh install on physical iPhone and iPad devices. Confirm there is no
   ATT prompt and that authentication, both vendor modes, location, notifications,
   analytics, checkout, and crash reporting continue to work.
5. Increment `ios.buildNumber` again if build 137 has already been uploaded to
   App Store Connect.
