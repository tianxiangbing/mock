const $ = require('jquery');
const Handlebars = require('handlebars');
let com = require('./lib/common');
const query = require('jq-query');

let EditImport = {
    config:require( com.getSocketPath() )|| [],
    key: decodeURIComponent(query.getQuery('key')),
    json: {},
    init() {
        this.json = this.config[this.key];
        com.registHelper();
        this.render();
        this.bindEvent();
    },
    render() {
        let complete = Handlebars.compile($('#temp').html());
        let _html = complete(this.json);
        $('.container').html(_html);
    },
    bindEvent() {
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
        $('#btn_save').click(() => {
             let a = query.getForm($('#myForm'));
            console.log(a)
            this.config[this.key] = $.extend({}, a);
            com.save(this.config, com.getSocketPath()).done(() => {
                alert('保存成功！');
                location.href="manageSocket.html";
            })
            return false;
        });
    }
}
EditImport.init();