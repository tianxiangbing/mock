/**
 * Created with Visual Studio Code
 * github: https://github.com/tianxiangbing/mock
 * homepage:http://www.lovewebgames.com/mock
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
var fs = require('fs');
const {shell} = require('electron');
// const {BrowserWindow} = require('electron').remote;
let com = require('./src/js/common');

var Index = {
    server: null,
    iWin: null,
    config: [],
    init: function () {
        $('#btn_start').click(() => {
            // alert($('#port').val());
            let port = $('#port').val();
            app.get('/', function (req, res) {
                res.send('服务已启动...');
            });
            this.server = app.listen(port, () => {
                var host = this.server.address().address;
                var port = this.server.address().port;
                this.showtip('服务已启动...');
                console.log('app listening at http://%s:%s', host, port);
                $('#btn_start').hide();
                $('#btn_stop').show();
            });
            this.bindConfig();
        });
        $('#btn_stop').click(() => {
            this.server.close(() => {
                console.log('close :(');
                this.server = null;
                showtip('服务已停止...');
                $('#btn_start').show();
                $('#btn_stop').hide();
            });
        });
        $('#btn_addimport').click(() => {
            // this.iWin = new BrowserWindow({ width: 800, height: 600 });
            // this.iWin.loadURL(path.join('file://', __dirname, 'src/addImport.html'));
            com.openWin('src/addImport.html', { height: 600, width: 800 });
        });
        $('#btn_browser').click(function () {
            if (server) {
                // window.open('http://localhost:'+$('#port').val())
                setTimeout(() => {
                    // opn('http://localhost:'+$('#port').val())
                    shell.openExternal('http://localhost:' + $('#port').val());
                }, 1000)
            } else {
                alert('服务没有启动!');
            }
        });
        $('#btn_manageimport').click(() => {
            com.openWin('src/manageImport.html');
        })
    },
    showtip: (text) => {
        $('#tips').html(text);
        setTimeout(() => {
            $('#tips').html('');
        }, 1000)
    },
    bindConfig() {
        fs.readFile('cache/config.json', 'utf8', (err, data) => {
            if (err) {
                alert(err);
            } else {
                this.config = JSON.parse(data);
                this.config.forEach((v) => {
                    app[v.method](v.url, function (req, res) {
                        res.send(v.returnvalue)
                    })
                });
            }
        })
    }
}
Index.init();