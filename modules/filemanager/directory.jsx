/**
 * Created by root on 16-4-7.
 */
'use strict';
class Directory {//左边文件目录管理;

    constructor(cell, manager) {
        // cell是dhtmlx的Layout划开的单元,这里其实是celle("a")
        //console.log(cell);//这里输出null表示没有进来哦;
        cell.setWidth("222");
        cell.setText("目录")
        cell.fixSize(1, 0);//禁止左右拉;



    // 初始化toolbar

    const toolbar = cell.attachToolbar();


    toolbar.loadStruct([
        { id: 'add', type: 'button', text: "新建",img:"./imgs/16/new.gif" },
        { id: 'delete', type: 'button', text: "删除",img:"./imgs/16/close.gif" ,disabled: true},
        { id: 'rename', type: 'button', text: "重命名",img:"./imgs/16/rename.png" ,disabled: true},

                        ]);

    //左边的toolbar点击事件;

    toolbar.attachEvent('onClick', (id) => {
    switch(id) {

    case   'add' :

        // 添加分类
        layer.prompt({
            title: `<B id="newdir" class="fa fa-plus-circle "></B> 新建目录`,
            value: "新建文件夹",
        }, (value, index, ele) => {
            layer.close(index);
            sidebar.callEvent('onSelect', [value]);//使用sidebar的onslect事件来处理;
        });
        break;
    case
        'rename':

        // 重命名目录分类
        const _category = sidebar.getActiveItem();//获取已经激活的目录;
        layer.prompt({
            title: `<i class="fa fa-font"></i>  重命名目录`,
            value: _category
        }, (value, index, ele) => {
            // 禁止的分类名
            if (value === 'default') {
                return toastr.warning("重命名目录失败");
            }
            ;
            // 判断分类是否存在
            if (sidebar.items(value)) {
                return toastr.warning("该目录已经有了");
            }
            ;
            layer.close(index);
            // 更新数据库
            const ret = uiTools['ipcRenderer'].sendSync('renameCategory', {//如果没有问题,则执行数据库;
                oldName: _category,
                newName: value
            });
            if (typeof ret === 'number') {
                // 更新成功
                toastr.success("重命名ok", 'success');
                // 删除旧分类
                sidebar.items(_category).remove();
                // 添加新分类
                sidebar.addItem({
                    id: value,
                    bubble: ret,
                    text: `<i class="fa fa-folder-o"></i> ${value}`
                });
                // 跳转分类
                setTimeout(() => {
                    sidebar.items(value).setActive();
                }, 233);
            } else {
                toastr.error("重命名失败", '错误');
            }
        });
        break;
    case 'delete':

        // 删除分类
        const category = sidebar.getActiveItem();
        layer.confirm(
            "删除该目录不可逆,会删除该目录下的所有文件", {
                icon: 2, shift: 6,
                // skin: 'layui-layer-molv',
                title: `<i class="fa fa-trash"></i> 删除目录`,
            }, (_) => {
                layer.close(_);
                // 1. 删除分类数据
                const ret = uiTools['ipcRenderer'].sendSync('file-clear', category);
                if (typeof(ret) === 'number') {
                    toastr.success("删除成功", "success");//原来的调用是(category)
                    // 2. 跳转到默认分类
                    sidebar.callEvent('onSelect', ['default']);
                    // 3. 删除侧边栏
                    sidebar.items(category).remove();
                    setTimeout(this::this.updateTitle, 100);
                } else {
                    return toastr.error("删除错误", "error");//(category, ret.toString())原来是这里;
                }
            });
        break;
    }

});
        // 初始化sidebar
        const sidebar = cell.attachSidebar({
            template: 'text',
            width: 222
        });
        // 默认分类
        sidebar.addItem({
            id: 'default',
            bubble: 0,
            selected: true,
            text: `<i class="fa fa-folder-o"></i> default</i>`
        });
        // sidebar点击事件
        sidebar.attachEvent('onSelect', (id) => {
          // console.log(id);//这个ID是(0传送过来的文件名哦;
            // 更改删除按钮状态
            if(id !=='default'){
                toolbar.enableItem('delete')
                toolbar.enableItem('rename')
            }
            // toolbar[(id === 'default') ? disable : enable]('del');
            // toolbar[(id === 'default') ? disable : enable]('rename');
            manager.loadData({
                category: id
            });
        });

        this.cell = cell;
        this.toolbar = toolbar;
        this.sidebar = sidebar;
        }

        // 更新标题
        updateTitle() {
            const num = this.sidebar.getAllItems().length;
            this.cell.setText(`<i class="fa fa-folder"></i> 目录 (${num})`);
        }



//类结束

}

export default Directory;


