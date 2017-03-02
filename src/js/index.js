/**
 * Created with Visual Studio Code
 * github: https://github.com/tianxiangbing/node-mock
 * homepage:http://www.lovewebgames.com/node-mock
 * User: 田想兵
 * Date: 2017-03-02
 * Time: 16:27:55
 * Contact: 55342775@qq.com
 * Desc: 主界面功能：开启http服务
 */

var $ = require('jquery');
var path = require('path');
var express = require('express');
var app = express();
// var opn = require('opn');
let server;
$('#btn_start').click(function () {
    // alert($('#port').val());
    let port = $('#port').val();
    app.get('/', function (req, res) {
        res.send('服务已启动...');
    });
    server = app.listen(port, function () {
        var host = server.address().address;
        var port = server.address().port;
        showtip('服务已启动...');
        console.log('app listening at http://%s:%s', host, port);
        $('#btn_start').hide();
        $('#btn_stop').show();
    });
});
$('#btn_stop').click(function () {
    server.close(function () {
        console.log('close :(');
        server = null;
        showtip('服务已停止...');
        $('#btn_start').show();
        $('#btn_stop').hide();
    });
});
$('#btn_addimport').click(function () {
    const {BrowserWindow} = require('electron').remote
    let win = new BrowserWindow({ width: 800, height: 600 });
    win.loadURL(path.join('file://', __dirname, 'src/addImport.html'));
});
function showtip(text) {
    $('#tips').html(text);
    setTimeout(() => {
        $('#tips').html('');
    }, 1000)
}
// $('#btn_browser').click(function(){
//     if(server){
//         // window.open('http://localhost:'+$('#port').val())
//         setTimeout(()=>{
//             opn('http://localhost:'+$('#port').val())
//         },1000)
//     }else{
//         alert('服务没有启动!');
//     }
// })