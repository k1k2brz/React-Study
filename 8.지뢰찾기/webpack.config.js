const path = require("path");
const RefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = {
  name: "minesearch-setting",
  mode: "development", //실서비스 production
  devtool: "eval",
  // 파일명 찾기
  resolve: {
    extensions: [".js", ".jsx"],
  },

  // 파일합치기
  entry: {
    //"WordRelay.jsx"는 client안에서 이미 불러옴
    app: ["./client"],
  }, // 입력

  module: {
    rules: [
      {
        test: /\.jsx?/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
          plugins: [
            "@babel/plugin-proposal-class-properties",
            "react-refresh/babel",
          ],
        },
      },
    ],
  },
  plugins: [new RefreshWebpackPlugin()],

  output: {
    //경로
    path: path.join(__dirname, "dist"),
    // 파일이름
    filename: "app.js",
  }, // 출력
  devServer: {
    devMiddleware: { publicPath: "/dist/" },
    static: { directory: path.resolve(__dirname) },
    hot: true,
  },
};
