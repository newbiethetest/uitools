/**
 * Created by root on 16-4-7.
 */
import List from './list.jsx';
import Directory from './directory.jsx';


// const LANG_T = antSword['language']['toastr'];
// const LANG = antSword['language']['shellmanager'];

class FileManager {

    constructor() {
        // 初始化
        const myLayout = uiTools['myLayout'];//

        // 初始化左侧::目录管理
        this.category = new Directory(myLayout.cells('a'), this);

        // 初始化右侧::列表管理
        this.list = new List(myLayout.cells('b'), this);

        this.cell = myLayout;
        this.win = new dhtmlXWindows();


        this.loadData();//初始化完成后,准备载入数据;

    }



    DragaddData(dragdata) {


        // 判断当前tab是否在主页
        // console.log('adddata')
        // 初始化窗口
        const win = this.createWin({
            title: "拖拽文件",
            width: 450,
            height: 350
        });
        win.denyResize();
        // 小窗口的工具栏
        const toolbar = win.attachToolbar();
        toolbar.loadStruct([{
            id: 'add',
            type: 'button',
            icon: 'save',
            text:'保存',
        }, {
            type: 'separator'
        }, {
            id: 'clear',
            type: 'button',
            icon: 'remove',
            text: "清空"
        }]);

        const form = win.attachForm([
            { type: 'settings', position: 'label-left', labelWidth: 80, inputWidth: 250 },
            { type: 'block', inputWidth: 'auto', offsetTop: 12, list: [
                { type: 'input', label: "文件名", name: 'filename',value:dragdata['filename'], required: true },
                { type: 'input', label: "路径", name: 'fileaddress',value:dragdata['fileaddress'], required: true },
                {type: "input", label: "描述",name: 'filedescribe', rows:2,required: true},
                { type: 'input', label: "文件类型", name: 'filetype',value:dragdata['filetype'], required: true },
            ]}
        ], true);

        // toolbar点击
        toolbar.attachEvent('onClick', (id) => {
            switch(id) {
                case 'add':
                    // 添加数据
                    // 判断表单数据
                    if (!form.validate()) {
                        return toastr.warning("你输入的有问题");
                    };
                    // 解析数据
                    let data = form.getValues();
                    win.progressOn();
                    // 获取分类
                    data['category'] = this.category['sidebar'].getActiveItem() || 'default';
                    const ret = uiTools['ipcRenderer'].sendSync('file-add', data);
                    // 更新UI
                    win.progressOff();
                    if (ret instanceof Object) {
                        win.close();
                        toastr.success("新增成功");
                        this.loadData({
                            category: data['category']
                        });
                    }else{
                        toastr.error("新增失败"+(ret.toString()),"error");
                    }
                    break;
                case 'clear':
                    // 清空表单
                    form.clear();
                    break;
            }
        });
    }
    // 添加数据
    addData() {

        // 判断当前tab是否在主页
       // console.log('adddata')
        // 初始化窗口
        const win = this.createWin({
            title: "增加文件/收藏网页",
            width: 450,
            height: 350
        });
        win.denyResize();
        // 小窗口的工具栏
        const toolbar = win.attachToolbar();
        toolbar.loadStruct([{
            id: 'add',
            type: 'button',
            icon: 'save',
            text:'保存',
        }, {
            type: 'separator'
        }, {
            id: 'clear',
            type: 'button',
            icon: 'remove',
            text: "清空"
        }]);
        // 表单对象
        // if (dragdata!==NULL){
        //
        //     const form = win.attachForm([
        //         { type: 'settings', position: 'label-left', labelWidth: 80, inputWidth: 250 },
        //         { type: 'block', inputWidth: 'auto', offsetTop: 12, list: [
        //             { type: 'input', label: "文件名", name: 'filename', value: dragdata['filename'],required: true },
        //             { type: 'input', label: "路径/网址", name: 'fileaddress', dragdata['fileaddress'],required: true },
        //             {type: "input", label: "描述",name: 'filedescribe', rows:2,dragdata['filedescribe'],required: true},
        //             { type: 'input', label: "文件类型", name: 'filetype', dragdata['filetype'],required: true },
        //         ]}
        //     ], true);
        //
        // }
        const form = win.attachForm([
            { type: 'settings', position: 'label-left', labelWidth: 80, inputWidth: 250 },
            { type: 'block', inputWidth: 'auto', offsetTop: 12, list: [
                { type: 'input', label: "文件名", name: 'filename', required: true },
                { type: 'input', label: "路径/网址", name: 'fileaddress', required: true },
                {type: "input", label: "描述",name: 'filedescribe', rows:2,required: true},
                { type: 'input', label: "文件类型", name: 'filetype', required: true },
            ]}
        ], true);

        // toolbar点击
        toolbar.attachEvent('onClick', (id) => {
            switch(id) {
                case 'add':
                    // 添加数据
                    // 判断表单数据
                    if (!form.validate()) {
                        return toastr.warning("你输入的有问题");
                    };
                    // 解析数据
                    let data = form.getValues();
                    win.progressOn();
                    // 获取分类
                    data['category'] = this.category['sidebar'].getActiveItem() || 'default';
                    const ret = uiTools['ipcRenderer'].sendSync('file-add', data);
                    // 更新UI
                    win.progressOff();
                    if (ret instanceof Object) {
                        win.close();
                        toastr.success("新增成功");
                        this.loadData({
                            category: data['category']
                        });
                    }else{
                        toastr.error("新增失败"+(ret.toString()),"error");
                    }
                    break;
                case 'clear':
                    // 清空表单
                    form.clear();
                    break;
            }
        });
    }

    // 编辑数据
    editData(sid) {
        // 获取数据
        // const data = antSword['ipcRenderer'].sendSync('shell-find', {
        //   _id: sid
        // })[0];
        const data = uiTools['ipcRenderer'].sendSync('file-findOne', sid);

        // 初始化窗口
        const win = this.createWin({
            title: "编辑"+(data['filename']),
            width: 450,
            height: 350
        });
        win.setModal(true);
        win.denyResize();
        // 工具栏
        const toolbar = win.attachToolbar();
        toolbar.loadStruct([{
            id: 'save',
            type: 'button',
            icon: './imgs/16/new.png',
            text: "保存"
        }, {
            type: 'separator'
        }, {
            id: 'clear',
            type: 'button',
            icon: 'remove',
            text: '清空'
        }]);
        // 表单对象
        const form = win.attachForm([
            { type: 'settings', position: 'label-left', labelWidth: 80, inputWidth: 250 },
            { type: 'block', inputWidth: 'auto', offsetTop: 12, list: [
                { type: 'input', label: "名称", name: 'filename', required: true, value: data['filename'] },
                { type: 'input', label: "地址", name: 'fileaddress', required: true, value: data['fileaddress'] },
                { type: 'input', label: "描述", name: 'filedescribe',rows:2, required: true, value: data['filedescribe'] },
                { type: 'input', label: "类型", name: 'filetype', required: true, value: data['filetype'] },


            ]}
        ], true);

        // toolbar点击
        toolbar.attachEvent('onClick', (id) => {
            switch(id) {
                case 'save':
                    // 添加数据
                    // 判断表单数据
                    if (!form.validate()) {
                        return toastr.warning("警告");
                    };
                    // 解析数据
                    let data = form.getValues();
                    data['_id'] = sid;
                    win.progressOn();

                    // 获取分类
                    data['category'] = this.category['sidebar'].getActiveItem() || 'default';
                    const ret = uiTools['ipcRenderer'].sendSync('file-edit', data);
                    // 更新UI
                    win.progressOff();
                    if (typeof(ret) === 'number') {
                        win.close();
                        toastr.success("编辑成功鸟", 'success');
                        this.loadData({
                            category: data['category']
                        });
                    }else{
                        toastr.error("编辑出错"+(ret.toString()), 'error');
                    }
                    break;
                case 'clear':
                    // 清空表单
                    form.clear();
                    break;
            }
        });
    }

    // 删除数据
    delData(ids) {
        layer.confirm(
            "你确定要删除"+(ids.length)+"个文件?", {
                icon: 2, shift: 6,
                title: `<i class="fa fa-trash"></i> 删除文件`
            }, (_) => {
                layer.close(_);
                const ret = uiTools['ipcRenderer'].sendSync('file-del', ids);
                if (typeof(ret) === 'number') {
                    toastr.success("成功删除"+(ret)+"个文件", 'success');
                    // 更新UI
                    this.loadData({
                        category: this.category['sidebar'].getActiveItem() || 'default'
                    });
                }else{
                    toastr.error('删除失败'+(ret.toString()), 'error');
                }
            });
    }

    // 搜索数据
    searchData() {
        //


        // 初始化窗口
        const win = this.createWin({
            title: '搜索数据 //' + category,
            width: 450,
            height: 350
        });
    }

    // 加载数据
    loadData(arg) {
        // 获取当前分类
        // const _category = this.category.sidebar.getActiveItem() || 'default';
        // 根据分类查询数据
        const ret = uiTools['ipcRenderer'].sendSync('file-find', arg || {});
        let category = {};
        // 解析数据
        let data = [];
        ret.map((_) => {
            category[_['category'] || 'default'] = category[_['category'] || 'default'] || 0;
            category[_['category'] || 'default'] ++;
            if ((arg instanceof Object) && arg['category'] && arg['category'] !== _['category']) {
                return;
            };
            if (!arg && _['category'] !== 'default') {
                return;
            };
            data.push({
                id: _['_id'],
                // pwd: _['pwd'],
                // type: _['type'],
                // encode: _['encode'] || 'utf8',
                // encoder: _['encoder'] || 'default',
                data: [
                    _['filename'],
                    _['fileaddress'],
                    _['filedescribe'],
                    _['filetype'],

                   // new Date(_['utime']).format('yyyy/MM/dd hh:mm:ss')先不用时间
                ]
            });
        });
        // 刷新UI::右侧数据
        this.list.grid.clearAll();
        this.list.grid.parse({
            'rows': data
        }, 'json');
        // 刷新UI::左侧目录
        if ((arg instanceof Object) && arg['category'] && !category[arg['category']]) {
            category[arg['category']] = 0;
        };
        if (typeof(category['default']) === 'object') {
            category['default'] = 0;
        };
        // 1. 判断目录是否存在？更新目录bubble：添加目录
        for (let c in category) {
            // 添加category
            if (!this.category['sidebar'].items(c)) {
                this.category['sidebar'].addItem({
                    id: c,
                    bubble: category[c],
                    // selected: true,
                    text: `<i class="fa fa-folder-o"></i> ${c}`
                });
            }else{
                this.category['sidebar'].items(c).setBubble(category[c]);
            }
        }
        // 2. 选中默认分类
        this.category['sidebar'].items((arg || {})['category'] || 'default').setActive();
        // 3. 更新标题
        this.list.updateTitle(data.length);
        this.category.updateTitle();
    }

    // 创建窗口
    createWin(opts) {
        let _id = String(Math.random()).substr(5, 10);
        // 默认配置
        let opt = $.extend({
            title: 'Window:' + _id,
            width: 550,
            height: 450
        }, opts);

        // 创建窗口
        let _win = this.win.createWindow(_id, 0, 0, opt['width'], opt['height']);
        _win.setText(opt['title']);
        _win.centerOnScreen();
        _win.button('minmax').show();
        _win.button('minmax').enable();

        // 返回窗口对象
        return _win;
    }

}

export default FileManager

