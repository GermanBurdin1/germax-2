const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const fs = require("fs");

function generateTemplateObject(folderPath) {
    const templates = {};

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
                templates[folderName] = {
                    js: path.join(subFolderPath, 'index.js'),
                    css: path.join(subFolderPath, 'index.css'),
                    html: path.join(subFolderPath, 'index.html')
                };
            }
        }
    });

    return templates;
}

function generateTemplates(templatesDir) {
    const pagesDir = path.join(__dirname, templatesDir, 'pages');
    const componentsDir = path.join(__dirname, templatesDir, 'components');

    if (!fs.existsSync(pagesDir)) {
        console.error('Directory "pages" not found in templates folder.');
        return;
    }

    if (!fs.existsSync(componentsDir)) {
        console.error('Directory "components" not found in templates folder.');
        return;
    }

    const templates = {
		...generateTemplateObject(pagesDir),
		...generateTemplateObject(componentsDir)
	};

    return templates;
}

const templates = generateTemplates('src/templates');

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
			inject: 'body',
		});
	});
};

const createConfig = (configDefault) => {
	const entryObj = createEntriesObj(templates);
	const htmlPlugins = createHtmlPluginsObj(templates);

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
			],
		},
		plugins: plugins,
		output: {
			filename: "[name].[contenthash].js",
			path: path.resolve(__dirname, "dist"),
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
