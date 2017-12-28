const ipc = require('electron').ipcRenderer;
const $ = require('jquery');
const nodercedit = require('rcedit');
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
            // var options={
            //     'version-string':{
            //         CompanyName:'erayt Inc.',//公司名称
            //         ProductName:'TitanOne',//产品名称
            //         OriginalFilename:'TitanOne.exe',//原始文件名
            //         FileDescription:'TitanOne App For Windows',//文件描述
            //         LegalCopyright:'Copyright © 2016-2017 TitanOne project'//版权
            //     },
            //     'file-version':'1.0.0',
            //     'product-version':'1.6.11',
            //     'icon':path.join('./icon','logo.ico')//更换的图标路径
            // };
            let options = {};
            options = JSON.parse($('#otherInfo').val()) || {};
            options.icon = this.iconpath;
            nodercedit(this.filepath, options,  (error)=> {
                if (error) {
                    alert(error);
                }else {
                    alert('修改成功!');
                    shell.showItemInFolder(this.filepath);
                }
            });
        })
    }
}
EditIcon.init();