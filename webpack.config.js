module.exports = {
  mode: "development",

  entry: "./src/asset/js/bundle.js",
  output: {
    filename: "./dist/asset/js/bundle.js"
  },

  module: {
    rules: [
      {
        // 拡張子 .js の場合
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env"
              ]
            }
          }
        ]
      }
    ]
  }

}