const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const templates = {
	index: {
		js: "./src/templates/index/index.js",
		css: "./src/templates/index/index.css",
		html: "./src/templates/index/index.html",
	},
	page1: {
		js: "./src/templates/page1/index.js",
		css: "./src/templates/page1/index.css",
		html: "./src/templates/page1/index.html",
	},
};

const getTemplateFile = (nameTemplate, extensionFile) => {
	return templates[nameTemplate][extensionFile];
};

const createEntriesObj = (templatesObj) => {
	return Object.entries(originalObject).reduce((acc, [key, value]) => {
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

const config = {
	entry: {
		index: getTemplateFile("index", "js"),
		page1: getTemplateFile("page1", "js"),
		// Добавьте сюда другие страницы, если они есть
	},
	output: {
		filename: "[name].[contenthash].js",
		path: path.resolve(__dirname, "dist"),
	},
	mode: "development",
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, "css-loader"],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "[name].css",
		}),
		new HtmlWebpackPlugin({
			filename: "page1.html",
			template: getTemplateFile("index", "html"),
			chunks: ["page1"],
			templateParameters: {
				css: '<link rel="stylesheet" href="page2.css">',
			},
		}),
		new HtmlWebpackPlugin({
			filename: "page2.html",
			template: getTemplateFile("page1", "html"),
			chunks: ["page2"],
			templateParameters: {
				css: '<link rel="stylesheet" href="page2.css">',
			},
		}),
		// Добавьте сюда другие страницы, если они есть
	],
};

module.exports = config;
