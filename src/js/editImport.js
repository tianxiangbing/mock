const $ = require('jquery');
const Handlebars = require('handlebars');
let com = require('./js/common');
const query = require('jq-query');

let EditImport = {
    config: require('../cache/config.json') || [],
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