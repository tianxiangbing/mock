const $ = require('jquery');
const Handlebars = require('handlebars');
let com = require('./js/common');
const Query = require('jq-query');

let EditImport = {
    config: require('../cache/config.json') || [],
    init(){
        com.registHelper();
        this.render();
    },
    render(){
        let complete = Handlebars.compile($('#temp').html());
        let _html = complete( this.config[decodeURIComponent( Query.getQuery('url'))] );
        $('.container').html(_html);
    }
}
EditImport.init();