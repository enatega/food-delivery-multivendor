# App Store ATT Resolution

The iOS build does not track users across apps or websites owned by other
companies and does not use advertising identifiers. App Tracking Transparency
was previously included unnecessarily and has been removed.

## Rejection root cause

Apple's August 22 review identifies the submitted binary as version `1.1.36`
build `139`. The repository history for version `1.1.36` still contained both
`expo-tracking-transparency` and `NSUserTrackingUsageDescription`. This branch
now resolves to version `1.1.38`, and the next iOS archive is build `140`.

The release now also declares `NSPrivacyTracking = false`, aggregates native
dependency privacy manifests, runs an automated ATT preflight during EAS builds,
and clears the EAS native cache for production iOS builds.

## App Store Connect checklist

- Remove every "Used to Track You" selection from App Privacy.
- Continue to disclose data collected for app functionality, product analytics,
  diagnostics, authentication, location, and order fulfilment.
- Disclose Amplitude's product interaction and identifiers for **Analytics**, not
  tracking. Advertising ID, IDFV, device metadata, carrier, IP enrichment, and
  legacy identifier migration are disabled in Enatega's SDK configuration.
- Disclose Microsoft Clarity's coarse location, product interaction, and
  performance data as unlinked analytics, following Microsoft's iOS guidance.
- Disclose Sentry crash diagnostics. Enatega disables default PII and performance
  tracing in its Sentry configuration.
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

1. Run `npm run check:ios-privacy` and confirm that the preflight passes.
2. Build with `npm run build:production:ios`.
3. Inspect the archived app's `Info.plist`, linked frameworks, and privacy
   manifests for unexpected tracking declarations or advertising identifier use.
4. Test a fresh install on physical iPhone and iPad devices. Confirm there is no
   ATT prompt and that authentication, both vendor modes, location, notifications,
   analytics, checkout, and crash reporting continue to work.
5. Confirm the archive reports version `1.1.38` and build `140` before upload.
6. In App Store Connect, remove every **Data Used to Track You** selection. Keep
   accurate disclosures for data used for app functionality, product analytics,
   and diagnostics.
