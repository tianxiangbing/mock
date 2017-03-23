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
const {app} = electron;
const {BrowserWindow} = electron;
const fs = require('fs');
// const com = require('./js/common');
const os = require('os')
let win = null;

function openWindow() {
    win = new BrowserWindow({ width: 800, height: 600 ,icon:'icon/favicon.ico'});
    win.loadURL(path.join('file://', __dirname, '/index.html'));
    // win.setMenu(null);
    win.on('closed', function () {
        win = null;
    });
    // win.webContents.openDevTools();
    let p = path.join(os.homedir(), 'config.json');
    fs.exists(p,(ex)=>{
        console.log(ex)
        if(!ex){
            fs.writeFile(p, '{}', { encoding: 'utf8' });
        }
    });
    let s = path.join(os.homedir(), 'socketconfig.json');
    fs.exists(s,(ex)=>{
        console.log(ex)
        if(!ex){
            fs.writeFile(s, '[]', { encoding: 'utf8' });
        }
    });
}
app.on('ready', openWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})