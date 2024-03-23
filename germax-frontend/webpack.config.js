const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const fs = require("fs");

function generateTemplateChilds(folderPath) {
	const templates = [];
	const folders = fs.readdirSync(folderPath, { withFileTypes: true });

	folders.forEach(folder => {
		if (folder.isDirectory()) {
			const folderName = folder.name;
			const subFolderPath = path.join(folderPath, folderName);
			const files = fs.readdirSync(subFolderPath);

			const indexHtml = files.includes('index.html');
			const indexCss = files.includes('index.css');
			const indexJs = files.includes('index.js');

			if (indexHtml && indexCss && indexJs) {
				templates.push({
					html: path.join(subFolderPath, 'index.html'),
					css: path.join(subFolderPath, 'index.css'),
					js: path.join(subFolderPath, 'index.js'),
					componentName: folderName
				});
			}
		}
	});

	return templates;
}

function generateTemplates(pathDir) {
	const componentsDir = path.join(__dirname, pathDir);

	if (!fs.existsSync(componentsDir)) {
		console.error('Directory "components" not found in templates folder.');
		return;
	}

	const templates = [
		...generateTemplateChilds(componentsDir)
	];

	return templates;
}

const createEntriesObj = (templates) => {
	return templates.reduce((acc, { componentName, js }) => {
		acc[componentName] = js; // Сохраняем только JS файлы
		return acc;
	}, {});
};

const createHtmlPluginsArr = (templates) => {
	return templates.map(({ js, css, html, componentName }) => {

		return new HtmlWebpackPlugin({
			filename: `${componentName}.html`,
			template: html,
			chunks: [componentName],
			inject: 'body',
		});
	});
};

const createConfig = (configDefault) => {
	const components = generateTemplates('src/templates/components');
	const entryObj = createEntriesObj(components);
	const htmlPlugins = createHtmlPluginsArr(components);

	const plugins = [
		new MiniCssExtractPlugin({
			filename: "[name].[contenthash].css",
		}),
		...htmlPlugins,
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
					use: [
						MiniCssExtractPlugin.loader,
						{
							loader: "css-loader",
							options: {
								modules: true, // Включаем поддержку CSS модулей
							},
						},
					],
				},
				{
					test: /\.hbs$/,
					loader: 'handlebars-loader',
				}
			],
		},
		plugins: plugins,
		output: {
			filename: "[name].[contenthash].js",
			path: path.resolve(__dirname, "php/dist"),
			publicPath: './dist'
		},
	};

	return resultConfig;
};

const configDefault = {
	mode: "development",
	devServer: {
		port: 3000,
		compress: true,
		historyApiFallback: true,
		hot: true,
		static: true
	},
};

const config = createConfig(configDefault);

module.exports = config;
