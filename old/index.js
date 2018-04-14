/**
 * Created with Visual Studio Code
 * github: https://github.com/tianxiangbing/mock
 * homepage:http://www.lovewebgames.com/mock
 * User: 田想兵
 * Date: 2017-03-02
 * Time: 16:27:55
 * Contact: 55342775@qq.com
 * Desc: 确保代码最新及时修复bug，请去github上下载最新源码 https://github.com/tianxiangbing/mock
 */
let electron = require('electron');
let path = require('path');
const { app } = electron;
const { BrowserWindow } = electron;
const fs = require('fs');
// const com = require('./js/common');
const os = require('os');
var package = require("../package.json");
let win = null;
function openWindow() {
    const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
    win = new BrowserWindow({ icon: 'icon/favicon.ico', title: 'mock V' + package.version, show: false, backgroundColor: '#ededed', minWidth: 1000 });
    win.maximize();
    win.loadURL(path.join('file://', __dirname, '/index.html'));
    // win.setMenu(null);
    win.on('closed', function () {
        win = null;
    });
    //加快显示速度
    win.once('ready-to-show', () => {
        win.show()
    });
    // win.webContents.openDevTools();
    let p = path.join(os.homedir(), 'config.json');
    fs.exists(p, (ex) => {
        console.log(ex)
        if (!ex) {
            fs.readFile(path.join(__dirname, '/mock/config.json'), 'utf8', (err, data) => {
                console.log(111, err)
                fs.writeFile(p, data, { encoding: 'utf8' });
            })
        }
    });
    let s = path.join(os.homedir(), 'socketconfig.json');
    fs.exists(s, (ex) => {
        console.log(ex)
        if (!ex) {
            fs.readFile(path.join(__dirname, '/mock/socketconfig.json'), 'utf8', (err, data) => {
                console.log(111, err)
                fs.writeFile(s, data, { encoding: 'utf8' });
            })
        }
    });
}
app.on('ready', openWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
const ipc = electron.ipcMain;
const dialog = electron.dialog;

ipc.on('open-dir-dialog', function (event) {
    dialog.showOpenDialog({
        properties: ['openFile', 'openDirectory']
    }, function (files) {
        if (files) event.sender.send('selected-directory', files)
    })
});
ipc.on('open-file-dialog',(event,key,ext)=>{
    ext = ext ||"*";
    dialog.showOpenDialog({
        filters:[{name:ext,extensions:[ext]}],
        properties: ['openFile']
    }, function (files) {
        console.log(key,files);
        if (files) event.sender.send(key, files)
    })
});
ipc.on('go-main', function (event) {
    console.log(event)
    console.log(arguments)
    win.focus();
});
