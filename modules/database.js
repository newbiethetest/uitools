/**
 * Created by root on 16-4-7.
 */
'use strict';



const Datastore = require('nedb');
const log4js = require('log4js');
const path = require('path');
const fs = require('fs');
const logger = log4js.getLogger('Database');//用于输出调试;
//const electron=global.require('electron');
class Database {

    constructor(electron) {
        this.cursor = this.createDB();
        // 监听数据请求
        const ipcMain = electron.ipcMain;
        this.listenHandle(ipcMain);
    }

    createDB() {
        // 创建数据库
        // 获取用户保存目录（mac&&*unix=/home/path/,win=c:/path/appdata
        let dbPath = '';
        if (process.env.HOME) {
            dbPath = path.join(process.env.HOME, '.uitools');
            //console.log(dbPath)
        } else if (process.env.LOCALAPPPATH) {
            dbPath = path.join(process.env.LOCALAPPPATH, '.uitools');
            //console.log(dbPath);
        } else {
            dbPath = 'database';
        }
        ;
        // 创建目录
        if (!fs.existsSync(dbPath)) {
            fs.mkdirSync(dbPath);
        }
        ;
        // 创建数据库
        // dbPath=__dirname;
        return new Datastore({
            filename: path.join(dbPath, 'uitools.db'),
            autoload: true
        });
    }

    //监听数据实现;// 查询数据数据,arg=find条件,比如arg={category:'test'}
    listenHandle(ipcMain) {
        ipcMain
            .on('file-find', (event, arg) => {
            logger.debug('file-find', arg);
             this.cursor
            .find(arg || {})
            .sort({
                utime: -1
            })
            .exec((err, ret) => {
            event.returnValue = ret || [];
             });
    })
            //查找一条信息；
        .on('file-findOne', (event, id) => {
                logger.debug('file-findOne', id);
            this.cursor.findOne({
                _id: id
            }, (err, ret) => {
                event.returnValue = err || ret;
        });
        })

        //查找一条信息的地址；
        // .on('file-findOneItem', (event, id) => {
        //         logger.debug('file-findOneItem', id);
        //     this.cursor.findOne({
        //         _id: id
        //     }, (err, ret) => {
        //         event.returnValue = err || ret;
        // });
        // })

            //添加一个文件;
    .on('file-add', (event, arg) => {
            logger.info('file-add\n', arg);
        this.cursor.insert({
            category: arg['category'] || 'default',
            filename: arg['filename'],
            fileaddress:arg['fileaddress'],
            filedescribe: arg['filedescribe'],
            filetype: arg['filetype']

        }, (err, ret) => {
            event.returnValue = err || ret;
    });

    })
        //文件更新;
    .on('file-edit', (event, arg) => {
            logger.info('file-edit\n', arg);
        this.cursor.update({
            _id: arg['_id']
        }, {
            $set: {
                category: arg['category'] || 'default',
                filename: arg['filename'],
                fileaddress: arg['fileaddress'],
                filedescribe: arg['filedescribe'],
                filetype: arg['filetype']
            }

        }, (err, ret) => {
            event.returnValue = err || ret;
    });

    })
        //文件删除，需要传入id或者删除多个id 使用in查询
    .on('file-del', (event, ids) => {
            logger.warn('file-del\n', ids);
        this.cursor.remove({
            _id: {
                $in: ids
            }
        }, {
            multi: true
        }, (err, num) => {
            event.returnValue = err || num;
    });

    })

        /*
        * 目录操作方法;
        * */


    .on('file-clear', (event, category) => {
            logger.fatal('file-clear', category);
        this.cursor.remove({
            category: category
        }, {
            multi: true
        }, (err, num) => {
            event.returnValue = err || num;
    })
    })

        //重命名目录;
    .on('renameCategory', (event, arg) => {
            logger.warn('renameCategory', arg);
        this.cursor.update({
            category: arg['oldName']
        }, {
            $set: {
                category: arg['newName']
            }
        }, {
            multi: true
        }, (err, num) => {
            event.returnValue = err || num;
    });
    })
        //移动目录;
    .on('file-move', (event, arg) => {
            logger.info('file-move', arg);
        this.cursor.update({
            _id: {
                $in: arg['ids'] || []
            }
        }, {
            $set: {
                category: arg['category'] || 'default',

            }
        }, {
            multi: true
        }, (err, num) => {
            event.returnValue = err || num;
    });
    })
        //新增目录;这个直接在sidebar进行;







    }
}
module.exports = Database;