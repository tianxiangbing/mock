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
    io: null,
    config: [],
    timer: {},//socket的定时器
    init: function () {
        this.checkUpdate();
        $('#btn_start').click(() => {
            // alert($('#port').val());
            let port = $('#port').val();
            // app.get('/', function (req, res) {
            //     res.send('服务已启动...');
            // });
            this.bindConfig();
            this.server = require('http').createServer(app);
            // this.server = app.listen(port, () => {
            //     var host = this.server.address().address;
            //     var port = this.server.address().port;
            //     this.showtip('服务已启动...');
            //     console.log('app listening at http://%s:%s', host, port);
            //     $('#btn_start').hide();
            //     $('#btn_stop').show();
            // });
            // this.startSocket();
            this.server.listen(port, () => {
                var host = this.server.address().address;
                var port = this.server.address().port;
                this.showtip('服务已启动...');
                console.log('app listening at http://%s:%s', host, port);
                $('#btn_start').hide();
                $('#btn_stop').show();
            });
        });
        $('#btn_start_socket').click(() => {
            if (this.server) {
                this.startSocket();
            } else {
                alert('请先启动http服务.');
            }
        });
        $('#btn_test_socket').click(() => {
            socket = io.connect('http://localhost:' + $('#port').val());
            socket.emit('message', '测试成功!');
            socket.on('message', function (data) {
                $('#sctips').html(data);
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
            com.openWin('addImport.html');
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
        $('#btn_auto_socket').click(() => {
            // this.autoSocket();//自动推送消息
            com.openWin('socket.html');
        });
        $('#btn_manageSocket').click(() => {
            com.openWin('manageSocket.html');
        });
    },
    //开始socket服务
    startSocket() {
        try {
            if (this.io) {
                this.io.close();
            }
            this.io = require('socket.io')(this.server);
            this.io.on('connection', (sc) => {
                console.log('有连接来了');
                sc.on('disconnect', function () {
                    console.log('user disconnected.');
                });
                sc.on('message', (msg) => {
                    console.log('message: ' + msg);
                    this.io.emit('message', msg);
                });
            });
            this.io.emit('some event', {
                for: "everyone"
            });
            this.autoSocket();
            $('#btn_start_socket').val('重启socket服务');
            alert('开启成功!')
        } catch (e) {
            alert(e);
        }
    },
    //自动推送消息
    autoSocket() {
        fs.readFile(com.getSocketPath(), 'utf8', (err, data) => {
            if (err) {
                alert(err);
            } else {
                let config = JSON.parse(data);
                for (var k in config) {
                    let v = config[k];
                    let frequency = v.frequency;
                    if(v.enable==false)continue;
                    let i = 0;
                    this.timer[k] && clearInterval(this.timer[k]);
                    this.timer[k] = setInterval(() => {
                        if (i >= v.list.length) {
                            i = 0;
                        }
                        let content = v.list[i].content;
                        let random = v.random;
                        content = content.replace(/@random/g, function () {
                            return eval(random);
                        })
                        console.log(content);
                        this.io.emit('message', content);
                        i++;
                    }, 1000 / frequency);
                }
            }
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
        $.getJSON('https://tianxiangbing.github.io/mock/checkUpdate.html', (result) => {
            console.log(package.version)
            if (result.version > package.version) {
                if (confirm('有新的功能出现，是否下载体验？')) {
                    shell.openExternal('https://tianxiangbing.github.io/mock/updates/mock.exe');
                }
            }
        })
    }
}
Index.init();