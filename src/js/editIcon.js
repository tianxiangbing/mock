const ipc = require('electron').ipcRenderer;
const $ = require('jquery');
const nodercedit = require('../../app.asar.unpacked/node_modules/rcedit');
const path = require('path');
const {shell} = require('electron');

const EditIcon = {
    key: null,
    filepath: '',
    iconpath: '',
    init() {
        $('#btn_selectfile').click((e) => {
            this.key = String(+new Date());
            ipc.send('open-file-dialog', this.key,'exe');
            ipc.on(this.key, (event, path) => {
                this.filepath = path[0];
                $('#sp_filepath').html(this.filepath);
            });
        });
        $('#btn_selecticon').click(e => {
            this.key = String(+new Date());
            ipc.send('open-file-dialog', this.key,'ico');
            ipc.on(this.key, (event, path) => {
                this.iconpath = path[0];
                $('#sp_iconpath').html(this.iconpath);
            });
        });
        $('#btn_saveicon').click(e => {
            let options = {};
            options = JSON.parse($('#otherInfo').val()) || {};
            options.icon = this.iconpath;
            nodercedit(this.filepath, options,  (error)=> {
                if (error) {
                    alert(JSON.stringify(error));
                }else {
                    alert('修改成功!');
                    shell.showItemInFolder(this.filepath);
                }
            });
        })
    }
}
EditIcon.init();