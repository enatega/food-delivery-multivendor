# Google Play background-location submission

Use this copy for the Enatega Multivendor Rider (`com.enatega.multirider`) background-location declaration. Replace bracketed reviewer-access placeholders before submission.

## App purpose

Enatega Multivendor Rider helps delivery riders accept assigned food-delivery orders, navigate to pickup and drop-off locations, and share delivery progress with customers and dispatchers.

## Location access: one background-location feature

Live delivery tracking is the one feature that needs background location. After a rider accepts an active delivery, the app transmits the rider's precise location to the delivery server so the customer and dispatcher can follow delivery progress while the app is not in use or the screen is locked. Tracking stops when the delivery ends or the rider logs out. Without background access, live tracking would stop when the rider uses navigation or locks the screen.

## Prominent in-app disclosure

Enatega Multivendor Rider collects and transmits your precise location to the delivery server to enable live delivery tracking for customers and dispatchers during an active delivery, even when the app is not in use. Location sharing starts only after you accept a delivery and stops when the delivery ends or you log out.

Consent actions:

- Allow delivery tracking
- Not now

## Video recording checklist

Record the Android build submitted to Google Play. Keep the video concise while making every required step readable.

1. Open the rider app and sign in with the reviewer account.
2. Open or accept the assigned test delivery.
3. Show the complete background-location disclosure long enough to read it.
4. Tap **Allow delivery tracking**.
5. Show the Android location permission prompt or the Android Settings page opened by the app, and grant **Allow all the time** access.
6. Return to the active delivery screen.
7. Put the rider app in the background and show the persistent **Enatega delivery tracking** notification.
8. Show the corresponding customer or dispatcher view receiving the rider's updated position, if available.
9. Optionally record the **Not now** path and reopen the app during the active delivery to demonstrate that declining does not grant permission.

Upload the video to YouTube as **Unlisted**. Verify the URL in a signed-out/incognito browser and make sure it has no age or regional restriction. A Google Drive MP4 link with **Anyone with the link: Viewer** is an acceptable fallback. Do not use a temporary or sign-in-protected OneDrive URL.

## Reviewer access instructions

The app requires authentication and an assigned delivery to display the declared feature.

- Rider account: `[REVIEWER_EMAIL_OR_PHONE]`
- Password or OTP instructions: `[REVIEWER_PASSWORD_OR_FIXED_OTP]`
- Server mode, if prompted: `[MULTI_VENDOR_OR_SINGLE_VENDOR]`
- Test order: `[ORDER_ID]`
- Steps: Sign in, open **New Orders** or **Processing**, and accept/open the assigned test order. The background-location disclosure appears when the order becomes an active delivery.
- Keep this account and test order available throughout the review period.

## Store listing description

Include this sentence in the full Play Store description:

> During an active delivery, Enatega Multivendor Rider can share the rider's location with customers and dispatchers even when the app is not in use, allowing them to follow delivery progress.

## Privacy policy and Data safety

Before submission, make sure the in-app and Play Console privacy-policy URL is public, non-editable, and names Enatega Multivendor Rider or the same developer entity as the store listing. The policy and Data safety form must accurately disclose:

- collection and transmission of precise location;
- collection while an active delivery continues in the background;
- live delivery tracking as the purpose;
- the actual recipients of the data, such as the delivery server, customer, and dispatcher;
- the real retention and deletion practices used by the service;
- whether Google Play's Data safety definitions classify any transfer as sharing.

Do not claim that location is never shared if customers or dispatchers can view the rider's live position.

Current blocker: `https://multivendor.enatega.com/privacy` was checked on August 21, 2026. The live rendered policy did not contain a location, GPS, geolocation, or background-location disclosure. Update and deploy that policy before resubmitting. Its retention/deletion wording must match the backend's real behavior; do not invent a retention period solely for the review.

## Release checklist

- Build app version `1.1.93`, Android version code `93`, or a higher unused version code.
- Upload the compliant AAB to every active track that needs an update and deactivate obsolete noncompliant releases where appropriate.
- Paste the **App purpose** and **Location access** text above into **Policy and programs > App content > Location permissions**.
- Replace the expired URL with the verified unlisted YouTube URL.
- Complete **App access** using the reviewer credentials and instructions above.
- Reconcile the privacy policy, Data safety form, and store listing with the declaration.
- Submit the updated declaration and release for review.

Official reference: [Understanding location in the background permissions](https://support.google.com/googleplay/android-developer/answer/9799150)
