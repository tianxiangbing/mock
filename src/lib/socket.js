/**
 * Created with Visual Studio Code
 * github: https://github.com/tianxiangbing/mock
 * homepage:http://www.lovewebgames.com/mock
 * User: 田想兵
 * Date: 2017-03-24
 * Time: 16:27:55
 * Contact: 55342775@qq.com
 * Desc: 模拟socket服务
 */
let com = require('./common');
let $ = require('jquery');
const WebSocket = require('ws');
var fs = require('fs');
const Socket = {
    io: null,
    timer: {},//socket的定时器
    wss: null,
    ws: null,
    start() {
        try {
            if (this.io) {
                this.stop();
                return false;
            }
            this.io = require('socket.io')();
            this.io.listen($('#siport').val());
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
            $('#btn_start_socket').val('停止socket').removeClass('red').addClass('gray');
            $('#sctips').html('开启成功,连接地址：http://localhost:' + $('#siport').val());
        } catch (e) {
            alert(e);
        }
        return false;
    },
    stop() {
        this.io.close();
        this.io = null;
        $('#btn_start_socket').val('开启socket').addClass('red').removeClass('gray');
        $('#sctips').html('');
    },
    stopws() {
        this.wss.close();
        this.wss = null;
        $('#btn_start_ws').val('开启ws服务').addClass('red').removeClass('gray');
        $('#wstips').html('');
    },
    startws() {
        try {
            if (this.wss) {
                this.stopws();
                return false;
            }
            this.wss = new WebSocket.Server({ port: $('#wsport').val() });
            this.wss.on('connection', (ws) => {
                ws.on('message', function incoming(message) {
                    console.log('received: %s', message);
                    ws.send(message);
                });
                this.ws = ws;
            });
            $('#btn_start_ws').val('停止ws服务').removeClass('red').addClass('gray');
            $('#wstips').html('开启成功请求地址：ws://localhost:' + $('#wsport').val() + '/ws');
            this.autoSocket();
        } catch (e) {
            alert(e);
        }
        return false;
    },
    test() {
        let socket = io.connect('http://localhost:' + $('#siport').val());
        socket.emit('message', '测试成功!');
        socket.on('message', function (data) {
            $('#sctips').html(data);
        });
    },
    testws() {
        const ws = new WebSocket('ws://localhost:' + $('#wsport').val() + '/ws');
        ws.on('open', function open() {
            ws.send('测试ws成功!')
        });
        ws.on('message', function incoming(data, flags) {
            $('#wstips').html(data)
        });
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
                    if (v.enable == "false") continue;
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
    }
}
module.exports = Socket;