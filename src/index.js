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
let win = null;
function openWindow() {
    win = new BrowserWindow({ width: 800, height: 600 });
    win.loadURL(path.join('file://', __dirname, '/index.html'));
    // win.setMenu(null);
    win.on('closed', function () {
        win = null;
    });
    win.webContents.openDevTools();
}
app.on('ready', openWindow);

app.on('window-all-closed',function(){
    if (process.platform !== 'darwin') {
        app.quit();
    }
})