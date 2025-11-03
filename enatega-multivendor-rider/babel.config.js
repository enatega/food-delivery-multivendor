// // eslint-disable-next-line no-undef
// module.exports = function (api) {
//   api.cache(true);
//   return {
//     presets: [
//       [
//         "babel-preset-expo",
//         { jsxImportSource: "nativewind" },
//         "module:metro-react-native-babel-preset",
//       ],
//       "nativewind/babel",
//     ],
//   };
// };


module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-worklets-core/plugin', // Add this line
      require.resolve('expo-router/babel'),
      ...(api.caller?.isDev ? ['expo-router/babel'] : []),
      // ... other plugins
    ],
  };
};