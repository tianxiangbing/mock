/*
 * @Author: 田想兵
 * @Date: 2024-06-14 17:06:13
 * @LastEditTime: 2024-06-14 17:54:36
 * @github: https://github.com/tianxiangbing
 * @Contact: 55342775@qq.com
 * @vx: tianxiangbing
 * @Desc: 文件描述
 */
/*
 * @Author: 田想兵
 * @Date: 2024-06-14 17:06:13
 * @LastEditTime: 2024-06-14 17:39:27
 * @github: https://github.com/tianxiangbing
 * @Contact: 55342775@qq.com
 * @vx: tianxiangbing
 * @Desc: 文件描述
 */

const electron = require('electron');
 
// // 在某个事件或方法中调用这个函数
// function openSaveDialog() {
//   let win = new electron.BrowserWindow();
//   let content = '这是你要保存的内容';

//   electron.dialog.showSaveDialog(win, {}, function (filename) {
//     if (filename) {
//       fs.writeFile(filename, content, (err) => {
//         if (err) throw err;
//         console.log('文件已被保存');
//       });
//     }
//   });
// }
// const MENUPATH = './datas/menu.json';
const path = require('path');
const fs = require('fs');
let APPLID = 1;//applId
let MenuId = 9900;//菜单起始id
const loginId = 'zh'//桌面登录用户
function generateSQL(treeData, parent = 'NULL') {
  let sql = '';
  let order = 1;
  for (let node of treeData) {
      let id = node.id;
      let applCode = node.applCode;
      let groupId = node.groupId;
      let text = node.text;
      let applId = node.applId || APPLID;
      let img = node.iconCls ||null
      let attributes = JSON.stringify(node.attributes);
      sql += `INSERT INTO ecas_menu (APPLID, MENUID, NAME, MENUORDER, LVL, URL, PARENT, IMG, ISCHILD, GROUPID, \`ATTRIBUTES\`) VALUES ('${applId}','${MenuId}', '${text}','${order}',NULL,NULL,${parent},${img==null?'NULL':"'"+img+"'"},NULL, '${groupId}', '${attributes}' );\n`;

      MenuId++;
      if (node.children) {
          sql += generateSQL(node.children, id);
      }
  }
  return sql;
}

// let treeData = [ /* 你的树形数据 */ ];
// let sql = generateSQL(treeData);
// console.log(sql);
function readFilePromise(file) {
  return new Promise((resolve, reject) => {
      fs.readFile(file, 'utf8', (err, data) => {
          if (err) {
              reject(err);
          } else {
              resolve(data);
          }
      });
  });
}


const tansfer = function(menuPath,applId=1){
  APPLID = applId||1;
  return readFilePromise(path.resolve(menuPath)).then(data=>{
    let menu = JSON.parse(data);
    let sql1 = generateSQL(menu[0].children||[])
    // openSaveDialog(sql1) 
    return sql1;
  })
}
const Transfer = {tansfer:tansfer};

module.exports = Transfer;