/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Created by root on 16-4-7.
	 */
	//载入点;需要做的就是划出表格出来;
	'use strict';

	var path = global.require('path');
	var electron = global.require('electron');
	var remote = electron.remote;

	var ipcRenderer = electron.ipcRenderer;

	var uiTools = window.uiTools = {
	    noxss: function noxss(html) {
	        return String(html).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
	    },
	    modules: {}
	};

	uiTools['ipcRenderer'] = ipcRenderer;

	uiTools['myLayout'] = new dhtmlXLayoutObject(document.body, "2U"); //先把layout划开;

	// 加载模块列表

	var FileManager = __webpack_require__(1);
	var myFileManger = new FileManager.default(); //导出为default;

	console.log(FileManager);
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
	    var dragdata = [];
	    dragdata['filename'] = file.name;
	    dragdata['fileaddress'] = file.path;
	    dragdata['filetype'] = file.type;
	    myFileManger.DragaddData(dragdata);

	    return false;
	};
	//结束拖拽
	//搞定收工
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by root on 16-4-7.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


	var _list = __webpack_require__(2);

	var _list2 = _interopRequireDefault(_list);

	var _directory = __webpack_require__(3);

	var _directory2 = _interopRequireDefault(_directory);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// const LANG_T = antSword['language']['toastr'];
	// const LANG = antSword['language']['shellmanager'];

	var FileManager = function () {
	    function FileManager() {
	        _classCallCheck(this, FileManager);

	        // 初始化
	        var myLayout = uiTools['myLayout']; //

	        // 初始化左侧::目录管理
	        this.category = new _directory2.default(myLayout.cells('a'), this);

	        // 初始化右侧::列表管理
	        this.list = new _list2.default(myLayout.cells('b'), this);

	        this.cell = myLayout;
	        this.win = new dhtmlXWindows();

	        this.loadData(); //初始化完成后,准备载入数据;
	    }

	    _createClass(FileManager, [{
	        key: 'DragaddData',
	        value: function DragaddData(dragdata) {
	            var _this = this;

	            // 判断当前tab是否在主页
	            // console.log('adddata')
	            // 初始化窗口
	            var win = this.createWin({
	                title: "拖拽文件",
	                width: 450,
	                height: 350
	            });
	            win.denyResize();
	            // 小窗口的工具栏
	            var toolbar = win.attachToolbar();
	            toolbar.loadStruct([{
	                id: 'add',
	                type: 'button',
	                icon: 'save',
	                text: '保存'
	            }, {
	                type: 'separator'
	            }, {
	                id: 'clear',
	                type: 'button',
	                icon: 'remove',
	                text: "清空"
	            }]);

	            var form = win.attachForm([{ type: 'settings', position: 'label-left', labelWidth: 80, inputWidth: 250 }, { type: 'block', inputWidth: 'auto', offsetTop: 12, list: [{ type: 'input', label: "文件名", name: 'filename', value: dragdata['filename'], required: true }, { type: 'input', label: "路径", name: 'fileaddress', value: dragdata['fileaddress'], required: true }, { type: "input", label: "描述", name: 'filedescribe', rows: 2, required: true }, { type: 'input', label: "文件类型", name: 'filetype', value: dragdata['filetype'], required: true }] }], true);

	            // toolbar点击
	            toolbar.attachEvent('onClick', function (id) {
	                switch (id) {
	                    case 'add':
	                        // 添加数据
	                        // 判断表单数据
	                        if (!form.validate()) {
	                            return toastr.warning("你输入的有问题");
	                        };
	                        // 解析数据
	                        var data = form.getValues();
	                        win.progressOn();
	                        // 获取分类
	                        data['category'] = _this.category['sidebar'].getActiveItem() || 'default';
	                        var ret = uiTools['ipcRenderer'].sendSync('file-add', data);
	                        // 更新UI
	                        win.progressOff();
	                        if (ret instanceof Object) {
	                            win.close();
	                            toastr.success("新增成功");
	                            _this.loadData({
	                                category: data['category']
	                            });
	                        } else {
	                            toastr.error("新增失败" + ret.toString(), "error");
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

	    }, {
	        key: 'addData',
	        value: function addData() {
	            var _this2 = this;

	            // 判断当前tab是否在主页
	            // console.log('adddata')
	            // 初始化窗口
	            var win = this.createWin({
	                title: "增加文件/收藏网页",
	                width: 450,
	                height: 350
	            });
	            win.denyResize();
	            // 小窗口的工具栏
	            var toolbar = win.attachToolbar();
	            toolbar.loadStruct([{
	                id: 'add',
	                type: 'button',
	                icon: 'save',
	                text: '保存'
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
	            var form = win.attachForm([{ type: 'settings', position: 'label-left', labelWidth: 80, inputWidth: 250 }, { type: 'block', inputWidth: 'auto', offsetTop: 12, list: [{ type: 'input', label: "文件名", name: 'filename', required: true }, { type: 'input', label: "路径/网址", name: 'fileaddress', required: true }, { type: "input", label: "描述", name: 'filedescribe', rows: 2, required: true }, { type: 'input', label: "文件类型", name: 'filetype', required: true }] }], true);

	            // toolbar点击
	            toolbar.attachEvent('onClick', function (id) {
	                switch (id) {
	                    case 'add':
	                        // 添加数据
	                        // 判断表单数据
	                        if (!form.validate()) {
	                            return toastr.warning("你输入的有问题");
	                        };
	                        // 解析数据
	                        var data = form.getValues();
	                        win.progressOn();
	                        // 获取分类
	                        data['category'] = _this2.category['sidebar'].getActiveItem() || 'default';
	                        var ret = uiTools['ipcRenderer'].sendSync('file-add', data);
	                        // 更新UI
	                        win.progressOff();
	                        if (ret instanceof Object) {
	                            win.close();
	                            toastr.success("新增成功");
	                            _this2.loadData({
	                                category: data['category']
	                            });
	                        } else {
	                            toastr.error("新增失败" + ret.toString(), "error");
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

	    }, {
	        key: 'editData',
	        value: function editData(sid) {
	            var _this3 = this;

	            // 获取数据
	            // const data = antSword['ipcRenderer'].sendSync('shell-find', {
	            //   _id: sid
	            // })[0];
	            var data = uiTools['ipcRenderer'].sendSync('file-findOne', sid);

	            // 初始化窗口
	            var win = this.createWin({
	                title: "编辑" + data['filename'],
	                width: 450,
	                height: 350
	            });
	            win.setModal(true);
	            win.denyResize();
	            // 工具栏
	            var toolbar = win.attachToolbar();
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
	            var form = win.attachForm([{ type: 'settings', position: 'label-left', labelWidth: 80, inputWidth: 250 }, { type: 'block', inputWidth: 'auto', offsetTop: 12, list: [{ type: 'input', label: "名称", name: 'filename', required: true, value: data['filename'] }, { type: 'input', label: "地址", name: 'fileaddress', required: true, value: data['fileaddress'] }, { type: 'input', label: "描述", name: 'filedescribe', rows: 2, required: true, value: data['filedescribe'] }, { type: 'input', label: "类型", name: 'filetype', required: true, value: data['filetype'] }] }], true);

	            // toolbar点击
	            toolbar.attachEvent('onClick', function (id) {
	                switch (id) {
	                    case 'save':
	                        // 添加数据
	                        // 判断表单数据
	                        if (!form.validate()) {
	                            return toastr.warning("警告");
	                        };
	                        // 解析数据
	                        var data = form.getValues();
	                        data['_id'] = sid;
	                        win.progressOn();

	                        // 获取分类
	                        data['category'] = _this3.category['sidebar'].getActiveItem() || 'default';
	                        var ret = uiTools['ipcRenderer'].sendSync('file-edit', data);
	                        // 更新UI
	                        win.progressOff();
	                        if (typeof ret === 'number') {
	                            win.close();
	                            toastr.success("编辑成功鸟", 'success');
	                            _this3.loadData({
	                                category: data['category']
	                            });
	                        } else {
	                            toastr.error("编辑出错" + ret.toString(), 'error');
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

	    }, {
	        key: 'delData',
	        value: function delData(ids) {
	            var _this4 = this;

	            layer.confirm("你确定要删除" + ids.length + "个文件?", {
	                icon: 2, shift: 6,
	                title: '<i class="fa fa-trash"></i> 删除文件'
	            }, function (_) {
	                layer.close(_);
	                var ret = uiTools['ipcRenderer'].sendSync('file-del', ids);
	                if (typeof ret === 'number') {
	                    toastr.success("成功删除" + ret + "个文件", 'success');
	                    // 更新UI
	                    _this4.loadData({
	                        category: _this4.category['sidebar'].getActiveItem() || 'default'
	                    });
	                } else {
	                    toastr.error('删除失败' + ret.toString(), 'error');
	                }
	            });
	        }

	        // 搜索数据

	    }, {
	        key: 'searchData',
	        value: function searchData() {
	            //

	            // 初始化窗口
	            var win = this.createWin({
	                title: '搜索数据 //' + category,
	                width: 450,
	                height: 350
	            });
	        }

	        // 加载数据

	    }, {
	        key: 'loadData',
	        value: function loadData(arg) {
	            // 获取当前分类
	            // const _category = this.category.sidebar.getActiveItem() || 'default';
	            // 根据分类查询数据
	            var ret = uiTools['ipcRenderer'].sendSync('file-find', arg || {});
	            var category = {};
	            // 解析数据
	            var data = [];
	            ret.map(function (_) {
	                category[_['category'] || 'default'] = category[_['category'] || 'default'] || 0;
	                category[_['category'] || 'default']++;
	                if (arg instanceof Object && arg['category'] && arg['category'] !== _['category']) {
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
	                    data: [_['filename'], _['fileaddress'], _['filedescribe'], _['filetype']]
	                });
	            });
	            // 刷新UI::右侧数据


	            // new Date(_['utime']).format('yyyy/MM/dd hh:mm:ss')先不用时间
	            this.list.grid.clearAll();
	            this.list.grid.parse({
	                'rows': data
	            }, 'json');
	            // 刷新UI::左侧目录
	            if (arg instanceof Object && arg['category'] && !category[arg['category']]) {
	                category[arg['category']] = 0;
	            };
	            if (_typeof(category['default']) === 'object') {
	                category['default'] = 0;
	            };
	            // 1. 判断目录是否存在？更新目录bubble：添加目录
	            for (var c in category) {
	                // 添加category
	                if (!this.category['sidebar'].items(c)) {
	                    this.category['sidebar'].addItem({
	                        id: c,
	                        bubble: category[c],
	                        // selected: true,
	                        text: '<i class="fa fa-folder-o"></i> ' + c
	                    });
	                } else {
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

	    }, {
	        key: 'createWin',
	        value: function createWin(opts) {
	            var _id = String(Math.random()).substr(5, 10);
	            // 默认配置
	            var opt = $.extend({
	                title: 'Window:' + _id,
	                width: 550,
	                height: 450
	            }, opts);

	            // 创建窗口
	            var _win = this.win.createWindow(_id, 0, 0, opt['width'], opt['height']);
	            _win.setText(opt['title']);
	            _win.centerOnScreen();
	            _win.button('minmax').show();
	            _win.button('minmax').enable();

	            // 返回窗口对象
	            return _win;
	        }
	    }]);

	    return FileManager;
	}();

	exports.default = FileManager;

/***/ },
/* 2 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Created by root on 16-4-7.
	 */
	var fs = global.require("fs");
	var exec = global.require('child_process').exec;

	var List = function () {
	    function List(cell, manager) {
	        _classCallCheck(this, List);

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
	        var grid = cell.attachGrid();

	        grid.setHeader("文件,路径,描述,类型");
	        grid.setColTypes("ro,ro,ro,ro");
	        grid.setColSorting('str,str,str,str');
	        grid.setInitWidthsP("20,30,30,20");
	        grid.setColAlign("left,left,left,center");
	        grid.enableMultiselect(true);
	        //下面用来检查是否存在目录;
	        function checkExsitFile(file) {
	            try {
	                var stat = fs.statSync(file);
	                return stat.isDirectory();
	            } catch (err) {
	                toastr.error(file + "不是有效的文件或路径", "error");
	                return;
	            }
	        }

	        //下面点击时用来判断是否是http网址;
	        function IsURL(str_url) {
	            var strRegex = "^((https|http|ftp|rtsp|mms)?://)" + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
	             + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
	             + "|" // 允许IP和DOMAIN（域名）
	             + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
	             + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
	             + "[a-z]{2,6})" // first level domain- .com or .museum
	             + "(:[0-9]{1,4})?" // 端口- :80
	             + "((/?)|" // a slash isn't required if there is no file name
	             + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
	            var re = new RegExp(strRegex);
	            //re.test()
	            if (re.test(str_url)) {
	                return true;
	            } else {
	                return false;
	            }
	        }

	        // 右键
	        grid.attachEvent('onRightClick', function (id, lid, event) {
	            // 获取选中ID列表
	            var ids = (grid.getSelectedId() || '').split(',');

	            // 如果没有选中？则选中右键对应选项
	            if (ids.length === 1) {
	                grid.selectRowById(id);
	                ids = [id];
	            }

	            // 获取选中的单条数据
	            var info = {};
	            if (id && ids.length === 1) {
	                info = uiTools['ipcRenderer'].sendSync('file-findOne', id);
	            };

	            bmenu([{ text: "新建", icon: 'fa fa-plus-circle', action: manager.addData.bind(manager) }, { text: "编辑", icon: 'fa fa-edit', disabled: !id || ids.length !== 1, action: function action() {
	                    manager.editData(id);
	                } }, { text: "删除", icon: 'fa fa-remove', disabled: !id, action: function action() {
	                    manager.delData(ids);
	                } }, { divider: true }, { text: "移动", icon: 'fa fa-share-square', disabled: !id, subMenu: function () {
	                    var items = manager.category.sidebar.getAllItems();
	                    var category = manager.category.sidebar.getActiveItem();
	                    var ret = [];
	                    items.map(function (_) {
	                        ret.push({
	                            text: _ === 'default' ? "默认目录" : _,
	                            icon: 'fa fa-folder-o',
	                            disabled: category === _,
	                            action: function (c) {
	                                return function () {
	                                    var ret = uiTools['ipcRenderer'].sendSync('file-move', {
	                                        ids: ids,
	                                        category: c
	                                    });
	                                    if (typeof ret === 'number') {
	                                        toastr.success("移动" + ret + '条数据成功', "success");
	                                        manager.loadData();
	                                        manager.category.sidebar.callEvent('onSelect', [c]);
	                                    } else {
	                                        toastr.error("移动失败" + ret, "error");
	                                    }
	                                };
	                            }(_)
	                        });
	                    });
	                    return ret;
	                }() }, { divider: true },
	            //{ text: "查找", icon: 'fa fa-search', action: manager::manager.searchData, disabled: true },
	            { text: "终端", icon: 'fa fa-terminal', disabled: !id, action: function action() {

	                    var itemfilename = info['filename'];
	                    var itemaddress = info['fileaddress'];
	                    var itempath = itemaddress.replace(itemfilename, '');
	                    //判断文件路劲是否目录;
	                    var AddressIsDir = checkExsitFile(itemaddress); //判断文件信息;
	                    var PathIsDir = checkExsitFile(itempath); //判断文件路径信息;
	                    // const cdPath=false;
	                    //判断确实存在,再来判断是否目录;

	                    //console.log(PathIsDir!==undefined);
	                    if (PathIsDir !== undefined) {
	                        var cdPath = AddressIsDir >= PathIsDir ? itemaddress : itempath;
	                        if (cdPath) {
	                            //如果是目录则打开所在的路径;
	                            var cmdStr = 'cd ' + cdPath + ' &&x-terminal-emulator';
	                            exec(cmdStr, function (err, stdout, stderr) {
	                                if (err) {
	                                    console.log('get error:' + stderr);
	                                } else {
	                                    console.log(stdout);
	                                }
	                            });
	                        }
	                    }
	                    // console.log(cdPath)
	                } }, { text: "浏览", icon: 'fa fa-firefox', disabled: !id, action: function action() {
	                    //获取地址;
	                    var itmeHttp = info['fileaddress'];
	                    //使用正则判断是否是网址;如果是则使用iceweasel打开
	                    if (IsURL(itmeHttp)) {
	                        var cmdHttp = 'iceweasel ' + itmeHttp;
	                        exec(cmdHttp, function (err, stdout, stderr) {
	                            if (err) {
	                                toastr.error(itmeHttp + "无法用iceweasel打开", "error");
	                            }
	                        });
	                    }
	                }
	            }],

	            //这是后面的分隔开面的混淆;
	            event);

	            return true;
	        });

	        // 双击
	        grid.attachEvent('onRowDblClicked', function (id) {
	            var info = uiTools['ipcRenderer'].sendSync('file-findOne', id);
	            new FileManager(info);
	        });

	        // 隐藏右键菜单
	        grid.attachEvent('onRowSelect', bmenu.hide);
	        $('.objbox').on('click', bmenu.hide);
	        $('.objbox').on('contextmenu', function (e) {
	            e.target.nodeName === 'DIV' && grid.callEvent instanceof Function ? grid.callEvent('onRightClick', [grid.getSelectedRowId(), '', e]) : 0;
	        });

	        grid.init(); //初始化表格

	        // 变量赋值
	        this.grid = grid;
	        this.cell = cell;
	        this.toolbar = toolbar;
	    }

	    // 更新标题


	    _createClass(List, [{
	        key: 'updateTitle',
	        value: function updateTitle(num) {
	            this.cell.setText('<i class="fa fa-list-ul"></i> 文件 (' + num + ')');
	        }
	    }]);

	    return List;
	}();

	exports.default = List;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * Created by root on 16-4-7.
	 */
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Directory = function () {
	    //左边文件目录管理;

	    function Directory(cell, manager) {
	        var _this = this;

	        _classCallCheck(this, Directory);

	        // cell是dhtmlx的Layout划开的单元,这里其实是celle("a")
	        //console.log(cell);//这里输出null表示没有进来哦;
	        cell.setWidth("222");
	        cell.setText("目录");
	        cell.fixSize(1, 0); //禁止左右拉;

	        // 初始化toolbar

	        var toolbar = cell.attachToolbar();

	        toolbar.loadStruct([{ id: 'add', type: 'button', text: "新建", img: "./imgs/16/new.gif" }, { id: 'delete', type: 'button', text: "删除", img: "./imgs/16/close.gif", disabled: true }, { id: 'rename', type: 'button', text: "重命名", img: "./imgs/16/rename.png", disabled: true }]);

	        //左边的toolbar点击事件;

	        toolbar.attachEvent('onClick', function (id) {
	            switch (id) {

	                case 'add':

	                    // 添加分类
	                    layer.prompt({
	                        title: "<B id=\"newdir\" class=\"fa fa-plus-circle \"></B> 新建目录",
	                        value: "新建文件夹"
	                    }, function (value, index, ele) {
	                        layer.close(index);
	                        sidebar.callEvent('onSelect', [value]); //使用sidebar的onslect事件来处理;
	                    });
	                    break;
	                case 'rename':

	                    // 重命名目录分类
	                    var _category = sidebar.getActiveItem(); //获取已经激活的目录;
	                    layer.prompt({
	                        title: "<i class=\"fa fa-font\"></i>  重命名目录",
	                        value: _category
	                    }, function (value, index, ele) {
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
	                        var ret = uiTools['ipcRenderer'].sendSync('renameCategory', { //如果没有问题,则执行数据库;
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
	                                text: "<i class=\"fa fa-folder-o\"></i> " + value
	                            });
	                            // 跳转分类
	                            setTimeout(function () {
	                                sidebar.items(value).setActive();
	                            }, 233);
	                        } else {
	                            toastr.error("重命名失败", '错误');
	                        }
	                    });
	                    break;
	                case 'delete':

	                    // 删除分类
	                    var category = sidebar.getActiveItem();
	                    layer.confirm("删除该目录不可逆,会删除该目录下的所有文件", {
	                        icon: 2, shift: 6,
	                        // skin: 'layui-layer-molv',
	                        title: "<i class=\"fa fa-trash\"></i> 删除目录"
	                    }, function (_) {
	                        layer.close(_);
	                        // 1. 删除分类数据
	                        var ret = uiTools['ipcRenderer'].sendSync('file-clear', category);
	                        if (typeof ret === 'number') {
	                            toastr.success("删除成功", "success"); //原来的调用是(category)
	                            // 2. 跳转到默认分类
	                            sidebar.callEvent('onSelect', ['default']);
	                            // 3. 删除侧边栏
	                            sidebar.items(category).remove();
	                            setTimeout(_this.updateTitle.bind(_this), 100);
	                        } else {
	                            return toastr.error("删除错误", "error"); //(category, ret.toString())原来是这里;
	                        }
	                    });
	                    break;
	            }
	        });
	        // 初始化sidebar
	        var sidebar = cell.attachSidebar({
	            template: 'text',
	            width: 222
	        });
	        // 默认分类
	        sidebar.addItem({
	            id: 'default',
	            bubble: 0,
	            selected: true,
	            text: "<i class=\"fa fa-folder-o\"></i> default</i>"
	        });
	        // sidebar点击事件
	        sidebar.attachEvent('onSelect', function (id) {
	            // console.log(id);//这个ID是(0传送过来的文件名哦;
	            // 更改删除按钮状态
	            if (id !== 'default') {
	                toolbar.enableItem('delete');
	                toolbar.enableItem('rename');
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


	    _createClass(Directory, [{
	        key: "updateTitle",
	        value: function updateTitle() {
	            var num = this.sidebar.getAllItems().length;
	            this.cell.setText("<i class=\"fa fa-folder\"></i> 目录 (" + num + ")");
	        }

	        //类结束

	    }]);

	    return Directory;
	}();

	exports.default = Directory;

/***/ }
/******/ ]);