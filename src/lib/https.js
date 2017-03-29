
/**
 * Created with Visual Studio Code
 * github: https://github.com/tianxiangbing/mock
 * homepage:http://www.lovewebgames.com/mock
 * User: 田想兵
 * Date: 2017-03-24
 * Time: 16:27:55
 * Contact: 55342775@qq.com
 * Desc: 模拟http服务
 */
var express = require('express');
let com = require('./common');
const ipc = require('electron').ipcRenderer;
// const path = require('path');

let https = {
    port: 8000,
    path: '',
    init(selectDir, startBtn, portInput) {
        this.selectDir = selectDir;
        this.startBtn = startBtn;
        this.portInput = portInput;
        this.bindEvent();
    }
    , bindEvent() {
        this.startBtn.on('click', () => {
            this.port = this.portInput.val();
            if (!this.path) {
                alert('请选择本地站点目录');
                return false;
            }
            try {
                let app = express();
                app.listen(this.port);
                app.use(express.static(this.path));
                document.getElementById('httpstips').innerHTML = `站点创建成功：<a class="openBower" href="http://localhost:${this.port}" target="_blank">http://localhost:${this.port}</a>`;
            } catch (e) {
                alert(e)
            }
        });
        this.selectDir.on('click', () => {
            ipc.send('open-dir-dialog');
        });
        ipc.on('selected-directory', (event, path) => {
            this.path = path[0];
            document.getElementById('httpstips').innerHTML = `站点目录：${path}`;
        });
    }

}
module.exports = https;