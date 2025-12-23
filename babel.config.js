module.exports = function (api) {
  api.cache(true);

  const isProduction = process.env.NODE_ENV === 'production';

  const plugins = [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './',
        },
      },
    ],
    'react-native-reanimated/plugin', // Must be last
  ];

  // Remove console.* calls in production builds
  if (isProduction) {
    plugins.unshift([
      'transform-remove-console',
      {
        exclude: ['error', 'warn'], // Keep error and warn for debugging production issues
      },
    ]);
  }

  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins,
  };
};
