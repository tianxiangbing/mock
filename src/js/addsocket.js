let $ = require('jquery');
// const fs = require('fs');
// const path = require('path');
const query = require('jq-query');
const com = require('./lib/common');

let AddImport = {
    config: require(com.getSocketPath()),
    init() {
        $('.paramlist').on('click', '.add', function () {
            let current = $(this).closest('tr');
            // current.index()>0?$(this).removeClass('add').addClass('minus').val('-'):$(this).removeClass('minus').addClass('add').val('+');
            let clone = current.clone();
            clone.find('.add').removeClass('add').addClass('minus').val('-');
            current.after(clone);
        });
        $('.paramlist').on('click', '.minus', function () {
            let current = $(this).closest('tr');
            current.remove();
        });
        // $.getJSON('../cache/config.json').done((js)=>{
        //     console.log(js)
        // })
        $('#btn_save').click(() => {
            let a = query.getForm($('#myForm'));
            console.log(a)
            this.config[+new Date()] = $.extend({}, a);
            com.save(this.config, com.getSocketPath()).done(() => {
                alert('保存成功！');
                location.href="manageSocket.html";
            })
            return false;
        });
        $('#btn_format').click(() => {
            $('textarea').each((index, elem) => {
                $(elem).val(com.formatJson($(elem).val()));
            });
        });
    }
}
AddImport.init();