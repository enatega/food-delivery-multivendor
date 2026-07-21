const { getDefaultConfig } = require('@expo/metro-config')
const defaultConfig = getDefaultConfig(__dirname)
defaultConfig.resolver.sourceExts.push('cjs')
defaultConfig.useWatchman = false
module.exports = defaultConfig
