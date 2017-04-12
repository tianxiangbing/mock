
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
var app = express();
let com = require('./common');
var fs = require('fs');

let httpserver = {
    port: 8080,
    config: {},
    init(port) {
        this.port = port;
        this.bindConfig();
        this.server = require('http').createServer(app);
        this.server.listen(port, () => {
            var host = this.server.address().address;
            var port = this.server.address().port;
            this.showtip('服务已启动...');
            console.log('app listening at http://%s:%s', host, port);
            $('#btn_start').hide();
            $('#btn_stop').show();
        });
        return this.server;
    },
    showtip: (text) => {
        $('#tips').html(text);
        setTimeout(() => {
            $('#tips').html('');
        }, 1000)
    },
    bindConfig() {
        fs.readFile(com.getPath(), 'utf8', (err, data) => {
            if (err) {
                alert(err);
            } else {
                this.config = JSON.parse(data);
                for (let url in this.config) {
                    let v = this.config[url];
                    app[v.method](url, function (req, res) {
                        let obj = v.returnvalue;
                        console.log(req.query)
                        let temp = {};
                        for (let key in req.query) {
                            temp[key] = req.query[key];
                            //存入变量中
                        }
                        let returnvalue = v.returnvalue.default;
                        try {
                            //执行所有的表达式，判断满足条件的返回
                            for (let k in obj) {
                                if (k != 'default') {
                                    if (eval(unescape(k))) {
                                        returnvalue = obj[k];
                                        break;
                                    }
                                }
                            }
                        } catch (e) {
                            console.log(e)
                        }
                        res.send(returnvalue);
                        res.end();
                    });
                }
            }
        })
    }
}
module.exports = httpserver;