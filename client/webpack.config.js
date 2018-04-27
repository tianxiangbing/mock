const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
let extractCSS = new ExtractTextPlugin({ filename: 'app.css', allChunks: true });
// __webpack_public_path__ = '/dist/';
let isDev = process.env.NODE_ENV == "development";
console.log(isDev)

//动态创建html
var HtmlWebpackPlugin = require('html-webpack-plugin');
var htmlPlugin = new HtmlWebpackPlugin({
    title: "首页",
    filename: '../index.html',
    template: "template.html"
});
const config = {
    entry: {
        app: ['./app/main.js'],
        vendor: ["vue", "vuex", 'vue-router']
    },
    mode: isDev ? 'development' : 'production',
    context: __dirname,
    output: {
        filename: '[name].js',
        path: __dirname + '/dist/assets',        //真实存放路径
        publicPath: isDev ?
            '/dist/' :                        //开发引用路径
            ''  //发布引用路径
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015']
                    }
                }
            },
            {
                test: /\.vue$/,
                use: {
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            css: ExtractTextPlugin.extract({
                                use: 'css-loader',
                                fallback: 'vue-style-loader' // <- 这是vue-loader的依赖，所以如果使用npm3，则不需要显式安装
                            })
                        }
                    }
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 100,
                    name: '[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.css$/,
                use: extractCSS.extract({
                    use: ['css-loader']
                })
            }
        ]
    },
    plugins: [
        extractCSS,
        htmlPlugin
    ]
};

module.exports = config