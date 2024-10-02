const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const fs = require("fs");

function generateTemplateChilds(folderPath) {
	const templates = [];
	const folders = fs.readdirSync(folderPath, { withFileTypes: true });

	folders.forEach((folder) => {
		if (folder.isDirectory()) {
			const folderName = folder.name;
			const subFolderPath = path.join(folderPath, folderName);
			const files = fs.readdirSync(subFolderPath);

			const indexHtml = files.includes("index.html");
			const indexCss = files.includes("index.css");
			const indexJs = files.includes("index.js");

			if (indexHtml && indexCss && indexJs) {
				templates.push({
					html: path.join(subFolderPath, "index.html"),
					css: path.join(subFolderPath, "index.css"),
					js: path.join(subFolderPath, "index.js"),
					componentName: folderName,
				});
			}
		}
	});

	return templates;
}

// [
//   {
//     "html": "/germaloc-frontend/src/templates/components/header/index.html",
//     "css": "/germaloc-frontend/src/templates/components/header/index.css",
//     "js": "/germaloc-frontend/src/templates/components/header/index.js",
//     "componentName": "header"
//   },
//   {
//     "html": "/germaloc-frontend/src/templates/components/footer/index.html",
//     "css": "/germaloc-frontend/src/templates/components/footer/index.css",
//     "js": "/germaloc-frontend/src/templates/components/footer/index.js",
//     "componentName": "footer"
//   }
// ]


function generateTemplates(pathDir) {
	const componentsDir = path.join(__dirname, pathDir);

	if (!fs.existsSync(componentsDir)) {
		console.error('Directory "components" not found in templates folder.');
		return;
	}

	const templates = [...generateTemplateChilds(componentsDir)];

	return templates;
}

// [
//   {
//     "html": "/germaloc-frontend/src/templates/components/header/index.html",
//     "css": "/germaloc-frontend/src/templates/components/header/index.css",
//     "js": "/germaloc-frontend/src/templates/components/header/index.js",
//     "componentName": "header"
//   },
//   {
//     "html": "/germaloc-frontend/src/templates/components/footer/index.html",
//     "css": "/germaloc-frontend/src/templates/components/footer/index.css",
//     "js": "/germaloc-frontend/src/templates/components/footer/index.js",
//     "componentName": "footer"
//   }
// ]


const createEntriesObj = (templates) => {
	return templates.reduce((acc, { componentName, js }) => {
		acc[componentName] = js;
		return acc;
	}, {});
};

// {
//   "header": "/germaloc-frontend//src/templates/components/index.js",
//   "footer": "/germaloc-frontend//src/templates/components/index.js"
// }


const createHtmlPluginsArr = (templates) => {
	return templates.map(({ js, css, html, componentName }) => {
		return new HtmlWebpackPlugin({
			filename: `${componentName}.html`,
			template: html,
			chunks: [componentName],
			inject: "body",
		});
	});
};

// [
//   new HtmlWebpackPlugin({
//     filename: "header.html",
//     template: "/germaloc-frontend/src/templates/header/index.html",
//     chunks: ["header"],
//     inject: "body"
//   }),
//   new HtmlWebpackPlugin({
//     filename: "footer.html",
//     template: "/germaloc-frontend/src/templates/footer/index.html",
//     chunks: ["footer"],
//     inject: "body"
//   })
// ]


const createConfig = (configDefault) => {
	const components = generateTemplates("src/components");
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
		})
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
								import: true,
								url: true,
							},
						},
					],
				},
				{
					test: /\.html$/,
					use: [
						{
							loader: "html-loader",
							options: {
								sources: {
									list: [
										{
											tag: "img",
											attribute: "src",
											type: "src",
										},
									],
								},
							},
						},
						path.resolve(__dirname, 'src/utils/loaders/ignore-empty-html-loader.js')
					],
				},
				{
					test: /\.(png|svg|jpg|jpeg|gif)$/i,
					type: 'asset/resource',
					generator: {
					  filename: 'assets/img/[name][ext][query]', // Сохранение изображений в папку assets/images
					},
				},
			],
		},
		devtool: 'source-map',
		plugins: plugins,
		output: {
			filename: "[name].[contenthash].js",
			path: path.resolve(__dirname, "php-layouts/dist"),
			publicPath: "/dist/",
		},
	};

	return resultConfig;
};

const configDefault = {
	mode: "development",
	devServer: {
		host: 'germaloc-frontend',
		port: 3000,
		compress: true,
		historyApiFallback: true,
		hot: true,
		static: true,
		devMiddleware: {
			writeToDisk: true,
		}
	},
};

const config = createConfig(configDefault);

module.exports = config;
