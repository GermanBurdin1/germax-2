const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const templates = {
	index: {
		js: "./src/pages/index/index.js",
		css: "./src/pages/index/index.css",
		html: "./src/pages/index/index.html",
	},
	page1: {
		js: "./src/pages/page1/index.js",
		css: "./src/pages/page1/index.css",
		html: "./src/pages/page1/index.html",
	},
	header: {
		js: "./src/components/header/index.js",
		css: "./src/components/header/index.css",
		html: "./src/components/header/index.html",
	},
	footer: {
		js: "./src/components/footer/index.js",
		css: "./src/components/footer/index.css",
		html: "./src/components/footer/index.html",
	}
};

const createEntriesObj = (templatesObj) => {
	return Object.entries(templatesObj).reduce((acc, [key, value]) => {
		acc[key] = value.js; // Сохраняем только JS файлы
		return acc;
	}, {});
};

const createHtmlPluginsObj = (templatesObj) => {
	return Object.entries(templatesObj).map(([key, { js, css, html }]) => {
		return new HtmlWebpackPlugin({
			filename: `${key}.html`,
			template: html,
			chunks: [key],
			templateParameters: {
				css: `<link rel="stylesheet" href="${css.split("/").pop()}">`,
			},
		});
	});
};

const createConfig = (configDefault) => {
	const entryObj = createEntriesObj(templates);

	const plugins = [
		new MiniCssExtractPlugin({
			filename: "[name].css",
		}),
		...createHtmlPluginsObj(templates),
		new CleanWebpackPlugin({
			cleanOnceBeforeBuildPatterns: ["**/*", "!assets/**"],
		}),
		new CopyWebpackPlugin({
			patterns: [{ from: "src/assets", to: "assets" }],
		}),
	];

	const resultConfig = {
		...configDefault,
		entry: entryObj,
		module: {
			rules: [
				{
					test: /\.css$/,
					use: [MiniCssExtractPlugin.loader, "css-loader"],
				},
			],
		},
		plugins: plugins,
	};

	return resultConfig;
};

const configDefault = {
	output: {
		filename: "[name].[contenthash].js",
		path: path.resolve(__dirname, "dist"),
	},
	mode: "development",
};

const config = createConfig(configDefault);

module.exports = config;
