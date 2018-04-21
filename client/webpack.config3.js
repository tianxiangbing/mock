
let path = require('path')
module.exports = {
    entry: './app/app.js',
    mode:'development',
    output: {
        filename: 'app.js'//,
        // path: __dirname + '/dist',        //真实存放路径
        // publicPath: isDev ?
        //     '/' :                        //开发引用路径
        //     ''  //发布引用路径
    },
    devServer: {
        port: 9000
      }
}