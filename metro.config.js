const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Configure resolver to handle platform-specific extensions
config.resolver = {
  ...config.resolver,
  sourceExts: [...(config.resolver?.sourceExts || []), 'ts', 'tsx', 'js', 'jsx'],
  platforms: ['ios', 'android', 'web', 'native'],
};

module.exports = withNativeWind(config, { input: './global.css' });
