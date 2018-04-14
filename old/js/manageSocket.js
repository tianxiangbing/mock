const Handlebars = require('handlebars');
const $ = require('jquery');
const query = require('jq-query');
// const fs = require('fs');
let com = require('./lib/common');
const {shell} = require('electron');
let ManageImport = {
    config: require(com.getSocketPath()) || [],
    init() {
        com.registHelper();
        this.render();
        this.bindEvent();
    },
    bindEvent() {
        $('.container').on('click', '.edit', (e) => {
            let dom = $(e.target);
            let key = dom.data('key');
            // com.openWin('editImport.html?url='+encodeURIComponent(url),{height:600,width:800});
            location.href = 'editSocket.html?key=' + encodeURIComponent(key);
            return false;
        });
        $('.container').on('click', '.del', (e) => {
            let dom = $(e.target);
            let url = dom.data('key');
            delete this.config[url];
            com.save(this.config,com.getSocketPath()).done(() => {
                alert('ok');
                location.reload();
            });
            return false;
        });
        $('.container').on('click', '.start', (e) => {
            let dom = $(e.target);
            let url = dom.data('key');
            this.config[url].enable = 'true';
            com.save(this.config,com.getSocketPath()).done(() => {
                // location.reload();
                dom.addClass('stop gray').removeClass('start red').text('停用');
            });
            return false;
        });
        $('.container').on('click', '.stop', (e) => {
            let dom = $(e.target);
            let url = dom.data('key');
            this.config[url].enable = 'false';
            com.save(this.config,com.getSocketPath()).done(() => {
                // location.reload();
                dom.addClass('start red').removeClass('stop gray').text('启用');
            });
            return false;
        });
    },
    render() {
        let complete = Handlebars.compile($('#temp').html());
        let _html = complete(this.config);
        $('.container').html(_html);
    }
};

ManageImport.init();