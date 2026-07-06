// eslint-disable-next-line no-undef
module.exports = function (api) {
  api.cache(true);
  const isProduction = process.env.NODE_ENV === "production";

  return {
    presets: [
      [
        "babel-preset-expo",
        { jsxImportSource: "nativewind" },
        "module:metro-react-native-babel-preset",
      ],
      "nativewind/babel",
    ],
    plugins: isProduction ? ["transform-remove-console"] : [],
  };
};
