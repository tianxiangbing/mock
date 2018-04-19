
var $ = require('jquery');
let com = require('./lib/common');
const Clipboard = require('clipboard');

let DictionariesJson = {
    field: [],
    jsonArr: [],
    init() {
        this.bindEvent();
    }
    , bindEvent() {
        $('#btn_toJson').click(e => {
            let fieldvalue = $('#field_input').val();
            this.field = fieldvalue.split(/[\t\s]+/);
            let str = $('#import_input').val();
            this.toJson(str);
            $('#result').show();
            $('#json_output').height(100);
            $('#json_output').val(com.formatJson(JSON.stringify(this.jsonArr) ));
            this.jsonArr =[];
            let h = $('#json_output')[0].scrollHeight//+$('#json_output').height()
            $('#json_output').height(h)
            $(window).scrollTop(999);
        });
        var clipboard = new Clipboard($('#btn_copy')[0], {
            target: function () {
                return $('#json_output')[0];
            }
        });//实例化
        //复制成功执行的回调，可选
        clipboard.on('success', function (e) {
            alert('内容已成功复制进粘贴板中，可以去其他地方粘贴了!')
        });

        //复制失败执行的回调，可选
        clipboard.on('error', function (e) {
            alert('复制失败，请按ctrl+c复制');
            $('#json_output').focus().select();
        });
    }
    , _toJson(rows) {
        if (rows.length == 0) return;
        var item = rows.shift();
        if(item.replace(/[\t\s]+/,'')==''){
            return;
        }
        let fieldvalue = item.split(/[\t\s]+/);
        let json = {};
        this.field.forEach((obj, index) => {
            if (obj != '') {
                json[obj] = fieldvalue[index] || "";
            }
        });
        this.jsonArr.push(json);
        this._toJson(rows)
    }
    , toJson(str) {
        let rows = str.split('\n');
        this._toJson(rows)
    }
}
DictionariesJson.init();