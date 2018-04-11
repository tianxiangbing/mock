
var $ = require('jquery');
let com = require('./lib/common');
const Clipboard = require('clipboard');

let ImportJson={
    init(){
        this.bindEvent();
    }
    ,bindEvent(){
        $('#btn_toJson').click(e=>{
            let str = $('#import_input').val();
            let json = {};
            this.toJson(str,json);
            console.log(json)
            $('#result').show();
            let wrap = $('#wrap_input').val();
            let output =''
            if(wrap.indexOf('@json')>-1){
                output = wrap .replace( '@json',JSON.stringify(json));
            }else{
                output = JSON.stringify(json);
            }
            wrap.replace()
            $('#json_output').val(com.formatJson(output));
            let h = $('#json_output')[0].scrollHeight//+$('#json_output').height()
            $('#json_output').height(h)
            $(window).scrollTop(999);
        });
        var clipboard = new Clipboard($('#btn_copy')[0],{
            target: function() {
                return $('#json_output')[0];
            }
        });//实例化
        //复制成功执行的回调，可选
        clipboard.on('success', function(e) {
            alert('内容已成功复制进粘贴板中，可以去其他地方粘贴了!')
        });

        //复制失败执行的回调，可选
        clipboard.on('error', function(e) {
            alert('复制失败，请按ctrl+c复制');
            $('#json_output').focus().select();
        });
    }
    ,_toJson(rows,json){
        if(rows.length == 0) return;
        var item = rows.shift();
        let fieldvalue= item.split(/[\t\s]+/);
            console.log(fieldvalue);
            if(fieldvalue[1]){
                switch( fieldvalue[1].toUpperCase()){
                    case 'INT':
                    case 'NUMBER':{
                        json[fieldvalue[0]] = Math.round(Math.random()*100) ;
                        break;
                    }
                    case 'FLOAT':
                    case 'DOUBLE':{
                        json[fieldvalue[0]] = (Math.random()*100).toFixed(2) ;
                        break;
                    }
                    case 'LIST':
                    case 'ARRAY':{
                        json[fieldvalue[0]]=[];
                        let js  = {}
                        this._toJson(rows,js);
                        json[fieldvalue[0]].push(js);
                        break;
                    }
                    default:{
                        json[fieldvalue[0]] = '';
                        break;
                    }
                }
            }else{
                json[fieldvalue[0]] = '';
            }
        this._toJson(rows,json)
    }
    ,toJson(str,json){
        let rows = str.split('\n');
        this._toJson(rows,json)
    }
}
ImportJson.init();