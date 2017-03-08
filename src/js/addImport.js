let $ = require('jquery');
// const fs = require('fs');
// const path = require('path');
const query = require('jq-query');
const com = require('./js/common');

let AddImport = {
    config: require('../cache/config.json') || {},
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
        // $.getJSON('../cache/config.json').done((js)=>{
        //     console.log(js)
        // })
        $('#btn_add').click(() => {
            let a = query.getForm($('#myForm'));
            console.log(a)
            $.extend(this.json, a);
            this.json.returnvalue = {
                default:com.formatString($('.defaultValue').val()) 
            }
            this.json.key = +new Date();
            this.config[a.url] = this.json;
            com.save(this.config).done(()=>{
                alert('ok')
                location.href="manageImport.html";
            })
            return false;
        });
    }
}
AddImport.init();