module.exports = {
  mode: "development",

  entry: "./src/asset/js/bundle.js",
  output: {
    filename: "./dist/asset/js/bundle.js"
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              exclude: /node_modules/,
              presets: [
                ["@babel/preset-env",
                  {
                    "useBuiltIns": "usage",
                    "corejs": 3
                  }
                ]
              ]
            }
          }
        ]
      }
    ]
  }

}
