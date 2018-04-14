const $ = require('jquery');
const Handlebars = require('handlebars');
let com = require('./lib/common');
const query = require('jq-query');

let EditImport = {
    config: require(com.getPath()) || [],
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
            $('.condition-list').children('.condition').each((index, item) => {
                if (($.trim($(item).find('.paramname').val()) == "" && $(item).find('.paramname').length ) || ($(item).find('.txtkey').length && $.trim($(item).find('.txtkey').val()) == "")) return true;
                let condition = $(item).find('.txtkey').length ? $(item).find('.txtkey').val() : ($(item).find('.paramname').val() + $(item).find('.sel-condition').val() +"'"+  ($(item).find('.txt_condition').val()+"'") || '');
                this.json.returnvalue[escape(condition)] = $(item).find('.returnValue').val();
            });
            console.log(this.json)
            this.config[a.url] = this.json;
            com.save(this.config).done(() => {
                alert('ok')
                location.href = "manageImport.html";
            })
        });
        $('#btn_format').click(() => {
            $('textarea').each((index, elem) => {
                $(elem).val(com.formatJson($(elem).val()));
            });
        });
        $('.condition-list').on('click', '.minus', function () {
            let current = $(this).closest('.condition');
            current.remove();
        });
        $('.add_condition').click((e) => {
            let html = $('#tpl-condition').html();
            $(e.target).before(html);
        });
    }
}
EditImport.init();