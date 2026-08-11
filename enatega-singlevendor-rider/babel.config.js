module.exports = function (api) {
  const isProduction = api.env("production");
  const plugins = [];

  if (isProduction) {
    plugins.unshift(["transform-remove-console", { exclude: [] }]);
  }

  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins,
  };
};
