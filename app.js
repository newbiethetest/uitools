/**
 * Created by root on 16-4-7.
 */
'use strict';

const electron=require('electron');//引入electron窗口模块;
const app = electron.app;  //建立基于electron的APP应用;
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow; //创建窗口;
const Database = require('./modules/database.js');//数据库初始化;
let mainWindow=null;

app.on('window-all-closed', function() {//app的窗口全部关闭事件
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit();
    }
});


app.on('ready', function() {//加载完成后，生成的窗口大小;
    // Create the browser window.
     mainWindow = new BrowserWindow({width: 1000, height: 600});

    //创建数据库；/
    //var db = new Datastore({ filename: __dirname + '/db0406.json', autoload: true });
    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/view/index.html');
    //mainWindow.webContents.openDevTools()

  //  mainWindow.loadURL("http://qq.com");

    // var webContents = mainWindow.webContents;
    // console.log(webContents.getURL())



    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
    //初始化数据库;
    new Database(electron);

    //清空菜单
    Menu.setApplicationMenu(Menu.buildFromTemplate([]));
    

});

