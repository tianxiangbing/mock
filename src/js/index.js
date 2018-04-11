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
const { shell } = require('electron');
let com = require('./lib/common');
let httpserver = require('./lib/httpserver');
let https = require('./lib/https');
let Socket = require('./lib/socket');
const crypto = require('crypto');
const fs = require('fs');
var Index = {
    server: null,
    iWin: null,
    init: function () {
        this.checkUpdate();
        $('#btn_start').click(() => {
            let port = $('#port').val();
            this.server = httpserver.init(port);
        });
        //socket.io服务
        $('#btn_start_socket').click(() => {
            Socket.start();
        });
        //websocket服务
        $('#btn_start_ws').click(() => {
            Socket.startws();
        });
        //测试ws服务
        $('#btn_test_ws').click(() => {
            Socket.testws();
        })
        $('#btn_test_socket').click(() => {
            Socket.test();
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
        $('#btn_icon').click(()=>{
            com.openWin('editIcon.html');
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
        //接口报文生成
        $('#btn_impotJson').click(()=>{
            com.openWin('importJson.html');
        })
        //本地目录建站点
        https.init($('#btn_selectdir'), $('#btn_https'), $('#httpport'));
        //md5加密
        const holder = document.getElementById('holder')
        holder.ondragover = () => {
            return false;
        }
        holder.ondragleave = holder.ondragend = () => {
            return false;
        }
        holder.ondrop = (e) => {
            e.preventDefault()
            html = '';
            for (let f of e.dataTransfer.files) {
                console.log('File(s) you dragged here: ', f.path)
                md5File(f.path,  (err, hash)=> {
                    if(!err){
                        html += hash
                        holder.innerHTML = html;
                    }else{
                        throw(err)
                    }
                })
            }
            return false;
        }
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
            // console.log(package.version)
            if (result.version > package.version) {
                if(result.force){
                    alert('有重大功能更新，请前往下载！')
                    //强制更新
                    shell.openExternal('https://tianxiangbing.github.io/mock/download');
                }else
                if (confirm('有新的功能出现，是否下载体验？')) {
                    shell.openExternal('https://tianxiangbing.github.io/mock/download');
                }
            }
        })
    }
}

//md5加密
function md5File(filename, cb) {
    if (typeof cb !== 'function') throw new TypeError('Argument cb must be a function')

    var output = crypto.createHash('md5')
    var input = fs.createReadStream(filename)

    input.on('error', function (err) {
        cb(err)
    })

    output.once('readable', function () {
        cb(null, output.read().toString('hex'))
    })

    input.pipe(output)
}
Index.init();