let $ = require('jquery');
// const fs = require('fs');
// const path = require('path');
const query = require('jq-query');
const com = require('./lib/common');

let AddImport = {
    config: require(com.getPath()),
    json: {},
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
        $('.condition-list').on('click', '.minus', function () {
            let current = $(this).closest('.condition');
            current.remove();
        });
        // $.getJSON('../cache/config.json').done((js)=>{
        //     console.log(js)
        // })
        $('#btn_add').click(() => {
            let a = query.getForm($('#myForm'));
            console.log(a)
            $.extend(this.json, a);
            this.json.returnvalue = {
                default: com.formatString($('.defaultValue').val())
            }
            $('.condition-list').children().each((index, item) => {
                if ($.trim($(item).find('.paramname').val()) == "") return true;
                let condition = $(item).find('.paramname').val() + $(item).find('.sel-condition').val() +"'"+ ($(item).find('.txt_condition').val() || '')+"'";
                this.json.returnvalue[escape(condition)] = $(item).find('.returnValue').val();
            });
            this.json.key = +new Date();
            this.config[a.url] = this.json;
            console.log(this.config)
            com.save(this.config).done(() => {
                alert('ok')
                location.href = "manageImport.html";
            })
            return false;
        });
        $('#btn_format').click(() => {
            $('textarea').each((index, elem) => {
                $(elem).val(com.formatJson($(elem).val()));
            });
        });
        $('.add_condition').click((e) => {
            let html = $('#tpl-condition').html();
            $(e.target).before(html);
        });
    }
}
AddImport.init();