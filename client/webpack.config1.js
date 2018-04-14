var path = require("path");
var webpack = require('webpack');
// var ExtractTextPlugin = require("extract-text-webpack-plugin");
console.log("+++++++++++" + process.env.NODE_ENV + "***********")
var TEST = process.env.NODE_ENV == "development";
console.log(TEST)
var filename = TEST ? "[name]" : "[chunkhash:8].[name]";
console.log(filename)
// var extractCSS = new ExtractTextPlugin('' + filename + '.css');

//动态创建html
// var HtmlWebpackPlugin = require('html-webpack-plugin');
// var htmlPlugin = new HtmlWebpackPlugin({
//     title: "首页",
//     filename: '../index.html',
//     template: "template.html"
// });
var modulesDirectories = ["web_modules", "node_modules", "bower_components", "app/config", "app"];

var config = {
    entry: {
        app: ["./app/main.js"]
        ,vendor: ["vue", "vuex", 'vue-router']
    },
    // output: {
    //     path: path.resolve(__dirname, "docs/build"),
    //     //publicPath: "/data/assets/build/",
    //     publicPath: "/build/",
    //     filename: filename + ".js"
    // },
    output: {
        path: path.resolve(__dirname, './dist'),        //真实存放路径
        publicPath: TEST ?
            path.resolve(__dirname, './dist') : //发布引用路径
            '/dist/',                           //开发引用路径
        filename: 'build.js'
    },
    resolve: {
        modulesDirectories: modulesDirectories,
        extensions: ['', '.js', '.vue', 'css', 'scss']
    },
    module: {
        rules: [{
            test: /\.(js)$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }, {
            test: /\.(vue)$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'vue-loader',
            query: {
                presets: ['es2015']
            }
            // ,
            // option: {
            //     loaders: {
            //         css: 'style-loader!css-loader!sass-loader'
            //         // ExtractTextPlugin.extract({
            //         //     use: ['css-loader', 'less-loader'],
            //         //     fallback: 'vue-style-loader'
            //         // })
            //     }
            // }
        }, {
            test: /\.(eot|woff|ttf|svg)/,
            loader: 'file-loader?name=[name].[ext]'
        }, {
            test: /\.scss$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'style-loader!css-loader!sass-loader'
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader!sass-loader'
        }, {
            test: /\.html$/,
            loader: "html-loader"
        }, {
            test: /\.png$/,
            loader: "file-loader?name=[hash:8].[name].[ext]"
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        })
        // extractCSS,
        //ignoreFiles
        ,new webpack.optimize.CommonsChunkPlugin("vendor", "base.js")
        //, htmlPlugin
    ]
};
if (TEST) {
    config.devtool = "source-map";
    config.output.publicPath = "/";
}
module.exports = config;