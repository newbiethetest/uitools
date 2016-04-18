/**
 * Created by root on 16-4-7.
 */
//载入点;需要做的就是划出表格出来;
'use strict';
const path = global.require('path');
const electron = global.require('electron');
const remote = electron.remote;

const ipcRenderer = electron.ipcRenderer;

const uiTools = window.uiTools = {
            noxss: (html) => {
            return String(html).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
},
modules: {}
};

uiTools['ipcRenderer'] = ipcRenderer;


uiTools['myLayout'] = new dhtmlXLayoutObject(document.body,"2U");//先把layout划开;

// 加载模块列表

const  FileManager = require('./modules/filemanager/index.jsx');
const myFileManger=new FileManager.default();//导出为default;



//console.log(FileManager);
//加载拖拽方法列表;
//开始拖拽

var holder = document.body;

holder.ondragover = function () {
    return false;
};
holder.ondragleave = holder.ondragend = function () {
    return false;
};
holder.ondrop = function (e) {
    e.preventDefault();
    var file = e.dataTransfer.files[0];
    var dragdata=[];
    dragdata['filename']=file.name;
    dragdata['fileaddress']=file.path;
    dragdata['filetype']=file.type;
    myFileManger.DragaddData(dragdata);

    return false;
};
//结束拖拽
//搞定收工


