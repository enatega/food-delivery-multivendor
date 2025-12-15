const { withAppDelegate } = require('@expo/config-plugins');

const withFixedAppDelegate = (config) => {
  return withAppDelegate(config, (config) => {
    if (config.modResults.language === 'swift') {
      let contents = config.modResults.contents;
      
      // Remove any sourceURL method variations that cause RCTBridge issues
      contents = contents.replace(
        /override func sourceURL\(for bridge: .*?\) -> URL\? \{[\s\S]*?\n  \}/g,
        ''
      );
      
      // Remove RCTBridge imports and references
      contents = contents.replace(/import React\.RCTBridge\n?/g, '');
      contents = contents.replace(/: RCTBridge/g, ': Any');
      
      config.modResults.contents = contents;
    }
    
    return config;
  });
};

module.exports = withFixedAppDelegate;