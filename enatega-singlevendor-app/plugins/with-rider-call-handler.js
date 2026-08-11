const { withAppDelegate } = require('@expo/config-plugins')

const helperMethods = `
  // Opens Live Activity rider calls without passing them to Expo Router.
  private static func riderPhoneURL(from url: URL) -> URL? {
    guard
      url.scheme?.lowercased() == "enategamultivendor",
      url.host?.lowercased() == "call-rider",
      let components = URLComponents(url: url, resolvingAgainstBaseURL: false),
      let rawPhone = components.queryItems?.first(where: { $0.name == "phone" })?.value
    else {
      return nil
    }

    let trimmedPhone = rawPhone.trimmingCharacters(in: .whitespacesAndNewlines)
    let digits = trimmedPhone.filter { $0.isNumber }
    guard digits.count >= 5 else { return nil }

    let dialNumber = trimmedPhone.hasPrefix("+") ? "+\\(digits)" : digits
    return URL(string: "tel:\\(dialNumber)")
  }

  private static func openRiderDialer(
    from url: URL,
    using application: UIApplication,
    delay: TimeInterval = 0
  ) -> Bool {
    guard let phoneURL = riderPhoneURL(from: url) else { return false }

    DispatchQueue.main.asyncAfter(deadline: .now() + delay) {
      application.open(phoneURL, options: [:])
    }
    return true
  }
`

function replaceRequired(source, target, replacement, label) {
  if (!source.includes(target)) {
    throw new Error(`Unable to install rider call handler: ${label} was not found in AppDelegate.swift`)
  }
  return source.replace(target, replacement)
}

function addRiderCallHandler(source) {
  if (source.includes('private static func riderPhoneURL(from url: URL)')) {
    return source
  }

  let updated = replaceRequired(
    source,
    '  var reactNativeFactory: RCTReactNativeFactory?\n',
    `  var reactNativeFactory: RCTReactNativeFactory?\n${helperMethods}`,
    'React Native factory declaration'
  )

  updated = replaceRequired(
    updated,
    '  ) -> Bool {\n    let delegate = ReactNativeDelegate()',
    `  ) -> Bool {
    var reactLaunchOptions = launchOptions
    if
      let incomingURL = launchOptions?[.url] as? URL,
      Self.openRiderDialer(from: incomingURL, using: application, delay: 0.15)
    {
      reactLaunchOptions?[.url] = nil
    }

    let delegate = ReactNativeDelegate()`,
    'application launch handler'
  )

  updated = replaceRequired(
    updated,
    '      launchOptions: launchOptions)',
    '      launchOptions: reactLaunchOptions)',
    'React Native launch options'
  )

  updated = replaceRequired(
    updated,
    '    return super.application(application, didFinishLaunchingWithOptions: launchOptions)',
    '    return super.application(application, didFinishLaunchingWithOptions: reactLaunchOptions)',
    'Expo launch options'
  )

  updated = replaceRequired(
    updated,
    '  ) -> Bool {\n    return super.application(app, open: url, options: options)',
    `  ) -> Bool {
    if Self.openRiderDialer(from: url, using: app) {
      return true
    }

    return super.application(app, open: url, options: options)`,
    'URL open handler'
  )

  return updated
}

module.exports = function withRiderCallHandler(config) {
  return withAppDelegate(config, (appDelegateConfig) => {
    if (appDelegateConfig.modResults.language !== 'swift') {
      throw new Error('The rider call handler requires a Swift AppDelegate.')
    }
    appDelegateConfig.modResults.contents = addRiderCallHandler(appDelegateConfig.modResults.contents)
    return appDelegateConfig
  })
}

module.exports.addRiderCallHandler = addRiderCallHandler
