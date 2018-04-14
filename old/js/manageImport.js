const Handlebars = require('handlebars');
const $ = require('jquery');
const query = require('jq-query');
// const fs = require('fs');
let com = require('./lib/common');
const {shell} = require('electron');
let ManageImport = {
    config: require(com.getPath()) || [],
    init() {
        com.registHelper();
        this.render();
        this.bindEvent();
    },
    bindEvent() {
        $('.container').on('click', '.edit', (e) => {
            let dom = $(e.target);
            let url = dom.data('key');
            // com.openWin('editImport.html?url='+encodeURIComponent(url),{height:600,width:800});
            location.href = 'editImport.html?url=' + encodeURIComponent(url);
            return false;
        });
        $('.container').on('click', '.del', (e) => {
            let dom = $(e.target);
            let url = dom.data('key');
            delete this.config[url];
            com.save(this.config).done(() => {
                alert('ok');
                location.reload();
            });
            return false;
        });
        $('.container').on('click', '.preview', (e) => {
            let dom = $(e.target);
            let url = dom.data('key');
            let port = query.getQuery('port');
            shell.openExternal('http://localhost:' + port + url);
        });
    },
    render() {
        let complete = Handlebars.compile($('#temp').html());
        let _html = complete({ list: this.config });
        $('.container').html(_html);
    }
};

ManageImport.init();