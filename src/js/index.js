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
let com = require('./js/common');
var Index = {
    server: null,
    iWin: null,
    config: [],
    init: function () {
        this.checkUpdate();
        $('#btn_start').click(() => {
            // alert($('#port').val());
            let port = $('#port').val();
            // app.get('/', function (req, res) {
            //     res.send('服务已启动...');
            // });
            this.bindConfig();
            this.server = app.listen(port, () => {
                var host = this.server.address().address;
                var port = this.server.address().port;
                this.showtip('服务已启动...');
                console.log('app listening at http://%s:%s', host, port);
                $('#btn_start').hide();
                $('#btn_stop').show();
            });
        });
        $('#btn_stop').click(() => {
            this.server.close(() => {
                console.log('close :(');
                this.server = null;
                showtip('服务已停止...');
                $('#btn_start').show();
                $('#btn_stop').hide();
            });
            setTimeout(() => {
                location.reload();
            }, 1000);
        });
        $('#btn_addimport').click(() => {
            // this.iWin = new BrowserWindow({ width: 800, height: 600 });
            // this.iWin.loadURL(path.join('file://', __dirname, 'addImport.html'));
            com.openWin('addImport.html', { height: 600, width: 800 });
        });
        $('#btn_browser').click(() => {
            if (this.server) {
                // window.open('http://localhost:'+$('#port').val())
                // setTimeout(() => {
                    // opn('http://localhost:'+$('#port').val())
                    shell.openExternal('http://localhost:' + $('#port').val());
                // }, 1000)
            } else {
                alert('服务没有启动!');
            }
        });
        $('#btn_manageimport').click(() => {
            com.openWin('manageImport.html?port=' + $('#port').val());
        });
        $('#btn_validateJson').click(() => {
            com.openWin('validateJson.html');
        });
        $('.link a').click((e) => {
            let href = $(e.target).attr('href');
            shell.openExternal(href);
            return false;
        });
    },
    showtip: (text) => {
        $('#tips').html(text);
        setTimeout(() => {
            $('#tips').html('');
        }, 1000)
    },
    bindConfig() {
        fs.readFile(com.getPath(), 'utf8', (err, data) => {
            if (err) {
                alert(err);
            } else {
                this.config = JSON.parse(data);
                for (let url in this.config) {
                    let v = this.config[url];
                    app[v.method](url, function (req, res) {
                        res.send(v.returnvalue.default);
                    });
                }
            }
        })
    },
    checkUpdate() {
        var package = require("../package.json");
        $.getJSON('https://raw.githubusercontent.com/tianxiangbing/mock/master/checkUpdate.html', (result) => {
            console.log(package.version)
            if (result.version > package.version) {
                if (confirm('有新的功能出现，是否下载体验？')) {
                    shell.openExternal('http://www.lovewebgames.com/app/mock/mock.exe');
                }
            }
        })
    }
}
Index.init();