let Handlebars = require('handlebars');
let fs = require('fs');
let $ = require('jquery');
const { BrowserWindow } = require('electron').remote;
let path = require('path');
let os = require('os');
const { shell } = require('electron');
const ipc = require('electron').ipcRenderer;

let Common = {
    registHelper() {
        Handlebars.registerHelper('toString', function (v) {
            return Common.formatString(JSON.stringify(v)) || '';
        });
        Handlebars.registerHelper('toDate', function (v) {
            let d = new Date(v);
            return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
        });
        Handlebars.registerHelper('equal', function (v1, v2, options) {
            if (v1 == v2) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        });
        Handlebars.registerHelper('formatJson', (v) => {
            return this.formatJson(v);
        });
    },
    getPath() {
        return path.join(os.homedir(), 'config.json');
    },
    getSocketPath() {
        return path.join(os.homedir(), 'socketconfig.json');
    },
    formatJson(v, callback) {
        let json = v
        try {
            json = JSON.stringify(JSON.parse(v), null, "    ");
            callback && callback(true, json);
        } catch (e) {
            json = v;
            callback && callback(false, e);
        }
        return json;
    },
    save(json, path) {
        var deferr = new $.Deferred();
        fs.writeFile(path || this.getPath(), JSON.stringify(json), function (e) {
            if (e) {
                alert(e)
                deferr.reject()
            } else {
                // window.close();
                deferr.resolve()
            }
        });
        return deferr;
    },
    parentWin: null,
    openWin(url, ops) {
        let settings = $.extend({ width: screen.availWidth - 40, height: screen.availHeight - 50 }, ops);
        let iWin = new BrowserWindow(settings);
        // if (!ops || !ops.width) {
        //     this.iWin.maximize();
        // }
        iWin.loadURL(path.join('file://', __dirname, '../' + url));

        // this.iWin.webContents.openDevTools();
        return iWin;
    },
    formatString(jsonstr) {
        return jsonstr.replace(/[\n\t\r]/gi, '');
    }
}
$('body').on('click', 'a.openBower', (e) => {
    shell.openExternal($(e.target).attr('href'));
    return false;
});
$('body').on('click','.goMain',(e)=>{
    ipc.send('go-main')
    return false;
});
module.exports = Common;