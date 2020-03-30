const Path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env, argv) => {
    return {
        target: 'web',

        mode: 'development',

        entry: './source/main.ts',

        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
        },

        devServer: {
            compress: true,
            historyApiFallback: true,
            contentBase: Path.resolve(__dirname, './public'),
            port: 8082
        },

        plugins : [
            new HtmlWebpackPlugin({
                template : './index.html',
                inject : 'body'
            })
        ],

        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    loader: 'ts-loader',
                    exclude: '/node_modules/'
                },
                {
                    test: /\.css$/,
                    loader: ['style-loader', 'css-loader']
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        // Creates `style` nodes from JS strings
                        'style-loader',
                        // Translates CSS into CommonJS
                        'css-loader',
                        // Compiles Sass to CSS
                        'sass-loader',
                    ],
                },
            ]
        }
    }
}