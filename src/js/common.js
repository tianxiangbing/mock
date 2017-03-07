let Handlebars = require('handlebars');
let fs = require('fs');
let $ = require('jquery');
const {BrowserWindow} = require('electron').remote;
let path = require('path');

let Common = {
    registHelper() {
        Handlebars.registerHelper('toString', function (v) {
            return JSON.stringify(v) || '';
        });
        Handlebars.registerHelper('toDate', function (v) {
            let d = new Date(v);
            return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
        });
        Handlebars.registerHelper('equal',function(v1, v2, options) {
            if (v1 == v2) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        });
    },
    save(json) {
        var deferr = new $.Deferred();
        fs.writeFile('./cache/config.json', JSON.stringify(json), function (e) {
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
        let settings = $.extend({ width: screen.availWidth, height: screen.availHeight}, ops)
        this.iWin = new BrowserWindow(settings);
        this.iWin.loadURL(path.join('file://', __dirname,'../../'+ url));
    }
}
module.exports = Common;