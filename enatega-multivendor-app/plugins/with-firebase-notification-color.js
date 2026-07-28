const { withAndroidManifest } = require('@expo/config-plugins')

module.exports = function withFirebaseNotificationColor(config) {
  return withAndroidManifest(config, (mod) => {
    const application = mod.modResults.manifest.application?.[0]
    const metadata = application?.['meta-data'] ?? []
    const notificationColor = metadata.find(
      (entry) =>
        entry.$?.['android:name'] ===
        'com.google.firebase.messaging.default_notification_color'
    )

    if (notificationColor?.$) {
      notificationColor.$['tools:replace'] = 'android:resource'
    }

    return mod
  })
}
