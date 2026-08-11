const { withDangerousMod } = require('@expo/config-plugins')
const fs = require('fs')
const path = require('path')

// Fixes the Xcode 26 / newer Apple-clang iOS build error:
//
//   call to consteval function 'fmt::basic_format_string<...>::basic_format_string<...>'
//   is not a constant expression
//
// React Native 0.79 pins fmt 11.0.2 (via RCT-Folly.podspec). In that version the
// `FMT_USE_CONSTEVAL` cascade in fmt/base.h is NOT guarded by `#ifndef`, so simply
// passing `-DFMT_USE_CONSTEVAL=0` is redefined back to 1 by the header. The reliable
// fix is to force the enabling branch to 0 in the vendored header so fmt does
// runtime (not consteval) format-string checking, which compiles cleanly.
//
// This runs in the generated Podfile's `post_install`, so it survives
// `expo prebuild` and re-applies every `pod install`.

const MARKER = 'withFmtConstevalFix'

const POST_INSTALL_SNIPPET = `
    # >>> ${MARKER}: Xcode 26 / clang fmt consteval fix
    installer.pods_project.targets.each do |__fmt_target|
      __fmt_target.build_configurations.each do |__fmt_cfg|
        __defs = __fmt_cfg.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] || ['$(inherited)']
        __defs = [__defs] unless __defs.is_a?(Array)
        __defs << 'FMT_USE_CONSTEVAL=0' unless __defs.include?('FMT_USE_CONSTEVAL=0')
        __fmt_cfg.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] = __defs
      end
    end
    __fmt_base = File.join(installer.sandbox.root, 'fmt', 'include', 'fmt', 'base.h')
    if File.exist?(__fmt_base)
      __src = File.read(__fmt_base)
      __patched = __src.gsub(/#\\s*define\\s+FMT_USE_CONSTEVAL\\s+1/, '#  define FMT_USE_CONSTEVAL 0')
      File.write(__fmt_base, __patched) if __patched != __src
    end
    # <<< ${MARKER}
`

module.exports = function withFmtConstevalFix(config) {
  return withDangerousMod(config, [
    'ios',
    (cfg) => {
      const podfilePath = path.join(
        cfg.modRequest.platformProjectRoot,
        'Podfile'
      )
      let contents = fs.readFileSync(podfilePath, 'utf8')
      if (!contents.includes(MARKER)) {
        contents = contents.replace(
          /post_install do \|installer\|\n/,
          (match) => match + POST_INSTALL_SNIPPET + '\n'
        )
        fs.writeFileSync(podfilePath, contents)
      }
      return cfg
    }
  ])
}
