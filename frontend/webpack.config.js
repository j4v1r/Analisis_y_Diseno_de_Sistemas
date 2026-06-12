const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/Application.jsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
        clean: true
    },

module: {
    rules: [
        {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        },

        {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader'
            ]
        },

        {
            test: /\.(png|jpg|jpeg|gif|svg)$/i,
            type: 'asset/resource'
        }
    ]
},

    resolve: {
        extensions: ['.js', '.jsx']
    },

    plugins: [ 
        new HtmlWebpackPlugin({
            template: './plantilla/index.html',
            path: path.join(__dirname, 'dist'),
            filename: 'index.html'
        })
    ],

    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        port: 3000, //Puerto del servidor
        historyApiFallback: true, //Activa el modo de historial para aplicaciones de una sola página
        open: true, //Abre el navegador automáticamente al iniciar el servidor
        hot: true, //Habilita el reemplazo en caliente de módulos (Hot Module Replacement)
    }
};