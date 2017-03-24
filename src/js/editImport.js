const $ = require('jquery');
const Handlebars = require('handlebars');
let com = require('./lib/common');
const query = require('jq-query');

let EditImport = {
    config:require( com.getPath() )|| [],
    url: decodeURIComponent(query.getQuery('url')),
    json: {},
    init() {
        this.json = this.config[this.url];
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
            $.extend(this.json, a);
            this.json.returnvalue = {
                default: com.formatString($('.defaultValue').val())
            }
            this.config[a.url] = this.json;
            com.save(this.config).done(() => {
                alert('ok')
                location.href = "manageImport.html";
            })
        });
    }
}
EditImport.init();