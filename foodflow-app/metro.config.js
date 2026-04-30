const { getDefaultConfig } = require('@expo/metro-config')

const config = getDefaultConfig(__dirname)

if (!config.resolver.sourceExts.includes('cjs')) {
  config.resolver.sourceExts.push('cjs')
}

module.exports = config
