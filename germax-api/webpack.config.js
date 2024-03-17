const path = require('path');

module.exports = {
  entry: './public/js/main.js',
  entry: {
    main: './public/js/main.js',
    addModal: './app/views/dashboard/addModal/addModal.js',
    calendar: './app/views/dashboard/calendar/calendar.js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader', 
          'css-loader',    
        ]
      },
    ],
  },

  output: {
    path: path.resolve(__dirname, 'dist'), 
    filename: '[name].bundle.js',
  },

  devtool: 'inline-source-map',

  devServer: {
    static: './dist', 
    open: true, 
    hot: true
  }
};
