const webpack = require('webpack');
const path = require('path');
let config = require("./webpack.config.js");
let compiler = webpack(config);
compiler.run(e=>{
    console.log(e)
});