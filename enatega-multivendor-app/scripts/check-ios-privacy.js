const { execFileSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const projectRoot = path.resolve(__dirname, '..')
const failures = []

const fail = (message) => failures.push(message)

const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'))
const packageLock = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package-lock.json'), 'utf8'))

const allDeclaredDependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies
}

if (allDeclaredDependencies['expo-tracking-transparency']) {
  fail('Remove expo-tracking-transparency from package.json.')
}

const lockedPackages = Object.keys(packageLock.packages ?? {})
if (lockedPackages.some((entry) => entry.endsWith('node_modules/expo-tracking-transparency'))) {
  fail('Remove expo-tracking-transparency from package-lock.json.')
}

let expoConfig
try {
  const expoCli = require.resolve('expo/bin/cli')
  const configOutput = execFileSync(process.execPath, [expoCli, 'config', '--type', 'public', '--json'], { cwd: projectRoot, encoding: 'utf8' })
  expoConfig = JSON.parse(configOutput)
} catch (error) {
  fail(`Unable to resolve the Expo config: ${error.message}`)
}

if (expoConfig) {
  const pluginNames = (expoConfig.plugins ?? []).map((plugin) => (Array.isArray(plugin) ? plugin[0] : plugin))
  const infoPlist = expoConfig.ios?.infoPlist ?? {}
  const privacyManifest = expoConfig.ios?.privacyManifests ?? {}

  if (pluginNames.includes('expo-tracking-transparency')) {
    fail('Remove the expo-tracking-transparency config plugin.')
  }
  if ('NSUserTrackingUsageDescription' in infoPlist) {
    fail('Remove NSUserTrackingUsageDescription from the resolved Info.plist.')
  }
  if (privacyManifest.NSPrivacyTracking !== false) {
    fail('Set ios.privacyManifests.NSPrivacyTracking to false.')
  }
  if (!Array.isArray(privacyManifest.NSPrivacyTrackingDomains) || privacyManifest.NSPrivacyTrackingDomains.length > 0) {
    fail('Set ios.privacyManifests.NSPrivacyTrackingDomains to an empty array.')
  }
}

const forbiddenNativePatterns = [/AppTrackingTransparency/, /ATTrackingManager/, /ASIdentifierManager/, /NSUserTrackingUsageDescription/, /requestTrackingPermissionsAsync/, /getTrackingPermissionsAsync/]
const sourceRoots = ['src', 'plugins', 'targets']
const sourceExtensions = new Set(['.h', '.js', '.jsx', '.m', '.mm', '.plist', '.swift', '.ts', '.tsx', '.xcprivacy'])

const inspectSourceTree = (directory) => {
  if (!fs.existsSync(directory)) return

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      inspectSourceTree(entryPath)
      continue
    }
    if (!sourceExtensions.has(path.extname(entry.name))) continue

    const contents = fs.readFileSync(entryPath, 'utf8')
    for (const pattern of forbiddenNativePatterns) {
      if (pattern.test(contents)) {
        fail(`Forbidden ATT reference ${pattern} found in ${path.relative(projectRoot, entryPath)}.`)
      }
    }
  }
}

for (const sourceRoot of sourceRoots) {
  inspectSourceTree(path.join(projectRoot, sourceRoot))
}

if (failures.length > 0) {
  console.error('iOS privacy preflight failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`iOS privacy preflight passed for ${expoConfig.version} (${expoConfig.ios.buildNumber}): ATT is absent and tracking is declared false.`)
