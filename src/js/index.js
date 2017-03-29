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
var fs = require('fs');
const { shell } = require('electron');
const WebSocket = require('ws');
let com = require('./lib/common');
let httpserver = require('./lib/httpserver');
let https = require('./lib/https');
var Index = {
    server: null,
    iWin: null,
    io: null,
    timer: {},//socket的定时器
    wss: null,
    ws: null,
    init: function () {
        this.checkUpdate();
        $('#btn_start').click(() => {
            let port = $('#port').val();
            this.server = httpserver.init(port);
        });
        //socket.io服务
        $('#btn_start_socket').click(() => {
            if (this.server) {
                this.startSocket();
            } else {
                alert('请先启动http服务.');
            }
        });
        //websocket服务
        $('#btn_start_ws').click((e) => {
            try {
                this.wss && this.wss.close();
                this.wss = new WebSocket.Server({ port: $('#wsport').val() });
                this.wss.on('connection', (ws) => {
                    ws.on('message', function incoming(message) {
                        console.log('received: %s', message);
                        ws.send(message);
                    });
                    this.ws = ws;
                    // ws.send('something');
                });
                $(e.target).val('重启ws服务');
                $('#wstips').html('开启成功请求地址：ws://localhost:' + $('#wsport').val() + '/ws');
                this.autoSocket();
            } catch (e) {
                alert(e);
            }
        });
        //测试ws服务
        $('#btn_test_ws').click(() => {
            const ws = new WebSocket('ws://localhost:' + $('#wsport').val() + '/ws');
            ws.on('open', function open() {
                ws.send('测试ws成功!')
            });
            ws.on('message', function incoming(data, flags) {
                $('#wstips').html(data)
            });
        })
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
        //本地目录建站点
        https.init($('#btn_selectdir'), $('#btn_https'), $('#httpport'));
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
            $('#sctips').html('开启成功,连接地址：http://localhost:' + $('#port').val());
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
                //清空所有的定时器
                for (let j in this.timer) {
                    this.timer[j] && clearInterval(this.timer[j]);
                }
                let config = JSON.parse(data);
                for (var k in config) {
                    let v = config[k];
                    let frequency = v.frequency;
                    if (v.enable == false) continue;
                    let i = 0;
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
                        this.io && this.io.emit('message', content);
                        this.ws && this.ws.send(content);
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