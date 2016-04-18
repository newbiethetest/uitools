/**
 * Created by root on 16-4-7.
 */
const path=global.require('path')
const fs = global.require("fs");
const exec = global.require('child_process').exec;
class List {

    constructor(cell, manager) {

       document.getElementsByClassName('dhxlayout_arrow dhxlayout_arrow_vb')[0].remove();

        // 初始化工具栏
        // const toolbar = cell.attachToolbar();
        // toolbar.loadStruct([
        //   { id: 'add', type: 'button', text: `<i class="fa fa-plus-circle"></i> ${LANG.list.toolbar['add']}` },
        //   { type: 'separator' },
        //   { id: 'edit', type: 'button', text: `<i class="fa fa-edit"></i> ${LANG.list.toolbar['edit']}` }
        // ]);

        // 初始化数据表格
        cell.setText("文件管理");
        cell.expand();
        const grid = cell.attachGrid();

        grid.setHeader("文件,路径,描述,类型");
        grid.setColTypes("ro,ro,ro,ro");
        grid.setColSorting('str,str,str,str');
        grid.setInitWidthsP("20,30,30,20");
        grid.setColAlign("left,left,left,center");
        grid.enableMultiselect(true);
//下面用来检查是否存在目录;
        function checkExsitFile(file) {
            try {
                const stat=fs.statSync(file)

                return  stat.isDirectory()

            } catch(err) {
                toastr.error(file+"不是有效的文件或路径","error");
                return

            }
        }

//下面点击时用来判断是否是http网址;
        function IsURL(str_url){
            var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
                + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
                + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
                + "|" // 允许IP和DOMAIN（域名）
                + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
                + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
                + "[a-z]{2,6})" // first level domain- .com or .museum
                + "(:[0-9]{1,4})?" // 端口- :80
                + "((/?)|" // a slash isn't required if there is no file name
                + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
            var re=new RegExp(strRegex);
            //re.test()
            if (re.test(str_url)){
                return (true);
            }else{
                return (false);
            }
        }


        // 右键
        grid.attachEvent('onRightClick', (id, lid, event) => {
            // 获取选中ID列表
            let ids = (grid.getSelectedId() || '').split(',');

            // 如果没有选中？则选中右键对应选项
            if (ids.length === 1) {
                grid.selectRowById(id);
                ids = [id];
            }

            // 获取选中的单条数据
            let info = {};
            if (id && ids.length === 1) {
                info = uiTools['ipcRenderer'].sendSync('file-findOne', id);

            };

            bmenu([


                { text: "新建", icon: 'fa fa-plus-circle', action: manager::manager.addData },

                { text: "编辑", icon: 'fa fa-edit', disabled: !id || ids.length !== 1, action: () => {
                    manager.editData(id);
                } },
                { text: "删除", icon: 'fa fa-remove', disabled: !id, action: () => {
                    manager.delData(ids);
                } },
                { divider: true },
                { text: "移动", icon: 'fa fa-share-square', disabled: !id, subMenu: (() => {
                    const items = manager.category.sidebar.getAllItems();
                    const category = manager.category.sidebar.getActiveItem();
                    let ret = [];
                    items.map((_) => {
                        ret.push({
                            text: _ === 'default' ? "默认目录" : _,
                            icon: 'fa fa-folder-o',
                            disabled: category === _,
                            action: ((c) => {
                                return () => {
                                    const ret = uiTools['ipcRenderer'].sendSync('file-move', {
                                        ids: ids,
                                        category: c
                                    });
                                    if (typeof(ret) === 'number') {
                                        toastr.success("移动"+ret+'条数据成功', "success");
                                        manager.loadData();
                                        manager.category.sidebar.callEvent('onSelect', [c]);
                                    }else{
                                        toastr.error("移动失败"+ret,"error");
                                    }
                                }
                            })(_)
                        });
                    });
                    return ret;
                })() },
                { divider: true },
                //{ text: "查找", icon: 'fa fa-search', action: manager::manager.searchData, disabled: true },
                { text: "终端", icon: 'fa fa-terminal',disabled: !id,  action: () => {

                    //const itemfilename=info['filename'];
                    const itemaddress=info['fileaddress'];
                    const itempathdir=path.dirname(itemaddress);
                    //判断文件路劲是否目录;
                    const AddressIsDir = checkExsitFile(itemaddress);//判断文件信息;

                   // const cdPath=false;
                    //判断确实存在,再来判断是否目录;

                    //console.log(PathIsDir!==undefined);
                    if(AddressIsDir!==undefined){
                        const cdPath=AddressIsDir===1?itemaddress:itempathdir
                        if (cdPath){
                            //如果是目录则打开所在的路径;
                            const cmdStr = 'cd ' +cdPath+' &&x-terminal-emulator';
                            exec(cmdStr, function(err,stdout,stderr) {
                                if (err) {
                                    console.log('get error:' + stderr);
                                } else {
                                    console.log(stdout)
                                }
                            })
                        }
                    }
                   // console.log(cdPath)


                } },

                { text: "浏览", icon: 'fa fa-firefox',disabled: !id, action: () => {                  //获取地址;
                    const itmeHttp=info['fileaddress'];
                    //使用正则判断是否是网址;如果是则使用iceweasel打开
                    if(IsURL(itmeHttp)){
                        const cmdHttp = 'iceweasel ' +itmeHttp;
                        exec(cmdHttp, function(err,stdout,stderr) {
                            if(err){
                                toastr.error(itmeHttp+"无法用iceweasel打开","error");
                            }

                        }
                        )}
                }
                },
                { text: "文管", icon: 'fa fa-desktop',disabled: !id,  action: () => {


                    const itemaddress=info['fileaddress'];
                    const itempathdir=path.dirname(itemaddress);
                    //console.log(itempathdir);
                    //判断文件路劲是否目录;
                    const AddressIsDir = checkExsitFile(itemaddress);//判断文件信息;

                    // const cdPath=false;
                    //判断确实存在,再来判断是否目录;

                    //console.log(PathIsDir!==undefined);
                    if(AddressIsDir!==undefined){
                        const cdPath=AddressIsDir===1?itemaddress:itempathdir
                        if (cdPath){
                            //如果是目录则打开所在的路径;
                            const cmdStr = 'xdg-open ' +cdPath;
                            exec(cmdStr, function(err,stdout,stderr) {
                                if (err) {
                                    console.log('get error:' + stderr);
                                } else {
                                    console.log(stdout)
                                }
                            })
                        }
                    }
                    // console.log(cdPath)


                } },



//这是后面的分隔开面的混淆;
            ], event);

            return true;
        });

        // 双击
        grid.attachEvent('onRowDblClicked', (id) => {
            const info = uiTools['ipcRenderer'].sendSync('file-findOne', id);
            new FileManager(info);
        });

        // 隐藏右键菜单
        grid.attachEvent('onRowSelect', bmenu.hide);
        $('.objbox').on('click', bmenu.hide);
        $('.objbox').on('contextmenu', (e) => {
            (e.target.nodeName === 'DIV' && grid.callEvent instanceof Function) ? grid.callEvent('onRightClick', [grid.getSelectedRowId(), '', e]) : 0;
        });

        grid.init();//初始化表格

        // 变量赋值
        this.grid = grid;
        this.cell = cell;
        this.toolbar = toolbar;
    }

    // 更新标题
    updateTitle(num) {
        this.cell.setText(`<i class="fa fa-list-ul"></i> 文件 (${num})`);
    }
}

export default List;