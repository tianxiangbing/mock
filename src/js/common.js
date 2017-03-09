let Handlebars = require('handlebars');
let fs = require('fs');
let $ = require('jquery');
const {BrowserWindow} = require('electron').remote;
let path = require('path');
let os = require('os');

let Common = {
    registHelper() {
        Handlebars.registerHelper('toString', function (v) {
            return JSON.stringify(v) || '';
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
    save(json) {
        var deferr = new $.Deferred();
        fs.writeFile(this.getPath(), JSON.stringify(json), function (e) {
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
    openWin(url, ops) {
        let settings = $.extend({ width: screen.availWidth, height: screen.availHeight }, ops);
        this.iWin = new BrowserWindow(settings);
        if (!ops || !ops.width) {
            this.iWin.maximize();
        }
        this.iWin.loadURL(path.join('file://', __dirname, '../' + url));
        // this.iWin.webContents.openDevTools();
        return this.iWin;
    },
    formatString(jsonstr) {
        return jsonstr.replace(/[\n\t\r]/gi, '');
    }
}
module.exports = Common;