const htmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const entry = {
  2048: {
    path: "./examples/2048/index.ts",
    title: "2024",
  },
  main: {
    path: "./src/index.ts",
    title: "DOM Animation",
  },
  pong: {
    path: "./examples/pong/index.ts",
    title: "Pong",
  },
  noise: {
    path: "./examples/noise/index.ts",
    title: "Perlin noise",
  },
  autonomous: {
    path: "./examples/autonomous path/index.ts",
    title: "Autonomous Path",
  },
};
module.exports = {
  entry: Object.entries(entry).reduce((acc, v) => {
    acc[v[0]] = v[1].path;
    return acc;
  }, {}),
  // entry:{
  //   pong:"./examples/pong/index.ts"
  // },
  output: {
    path: __dirname,
    filename: "dist/[name]/bundle.js",
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader",
      },
    ],
  },
  plugins: [
    ...Object.keys(entry).map((key) => {
      const val = entry[key];
      return new htmlWebpackPlugin({
        meta: { viewport: "width=device-width, initial-scale=1" },
        template: "./index.html",
        title: val.title,
        filename: "./dist/"+key+"/index.html",
        chunks:[key],
      });
    }),

    new MiniCssExtractPlugin(),
  ],
};
