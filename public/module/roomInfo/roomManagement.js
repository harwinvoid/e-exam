var public = {};
define(function (require, exports, module) {
    var jqueryMap = {},
        viewMap = {
            currentViewHtml: ''
        },
        configMap = {
            isInit: false
        },
        stateMap = {},
        tmpl = {},
        pageInfo = {
            currentPage: 1,
            pageSize: 10
        }
    viewMap.currentViewHtml = require('/module/roomInfo/roomManagement.html');
    function _loadHtml() {
        if (stateMap.$container && stateMap.$container.length) {
            stateMap.$container.html(viewMap.currentViewHtml);
            $('body').scrollTop(0);
        } else {
            $.Notice.error("notification:loadHtml", "$container not exist");
        }
    }

    function _initTemplate() {
        tmpl = {
            item: Handlebars.compile(stateMap.$container.find('#item').html()),
        };
    }

    function _setJqueryMap() {
        jqueryMap = {
            $roomsList: stateMap.$container.find('#roomList'),
            $roomTable: stateMap.$container.find('#roomTable'),
            $tbody: stateMap.$container.find('#tbody'),
            $selectAll: stateMap.$container.find('#selectAll'),
            $delroom: stateMap.$container.find('#delRoom'),
            $addroom: stateMap.$container.find('#addRoom'),
            $pagination: stateMap.$container.find('#roomPagination'),
            $searchroom: stateMap.$container.find('#searchRoom'),
            $no: stateMap.$container.find('#no'),
            $address: stateMap.$container.find('#address'),
            $capacity: stateMap.$container.find('#capacity'),
            $isEmpty: stateMap.$container.find('#isEmpty')
        };
    }
    function initUploader() {
        var Uploader = Q.Uploader;
        var uploader = new Uploader({
            target: $("#upload")[0],
            allows: '.xlsx',
            url: '/uploadRoom.json',
            on: {
                add: function (task) {
                    console.log(task);
                    if (task.disabled) return alert("允许上传的文件格式为：" + this.ops.allows);
                    console.log(task.name + ": 已添加!");
                },
                remove: function (task) {
                    log(task.name + ": 已移除!");
                },
                //上传之前触发
                upload: function (task) {
                    //exe文件可以添加，但不会上传
                    if (task.ext == ".exe") return false;
                    //可针对单独的任务配置参数(POST方式)
                    task.data = { name: task.name + "_" + Date.now() };
                },
                //上传完成后触发
                complete: function (task) {
                    if (task.state != Uploader.COMPLETE) return console.log(task.name + ": " + Uploader.getStatusText(task.state) + "!");
                    var json = task.json;
                    if (!json) return log(task.name + ": 服务器未返回正确的数据");
                    $.Notice.success('数据导入成功');
                    _initTable(null);
                }
            }
        });
    }
    function _bindEvent() {
        initUploader();
        $("[data-toggle='tooltip']").tooltip();
        var isEmptyRadio = [{ code: '是', value: '1', checked: 'true' }, { code: '否', value: '0' }];
        jqueryMap.$isEmpty.aeRadio('reload', isEmptyRadio);
        jqueryMap.$no.aeTextfield({});
        jqueryMap.$address.aeTextfield({});
        jqueryMap.$capacity.aeTextfield({});
        jqueryMap.$searchroom.aeTextfield({
            onValueChange: function () {
                var name = jqueryMap.$searchroom.aeTextfield('getValue'), params;
                _initTable(name);

            }
        });

        jqueryMap.$selectAll.aeCheckbox({
            onSelect: _checkAll
        }).aeCheckbox('reload', {
            text: '',
            value: ''
        });
        _initTable(null);
        //删除选中的老师
        jqueryMap.$delroom.on('click', function () {
            var ids = getSelectedIds(), params;
            params = {
                ids: ids
            };
            $.post('/delroom.json', params, function (data) {
                if (data != 0) {
                    _initTable(null);
                }

            });
        });
        jqueryMap.$addroom.on('click', function () {
            $.openPopupDiv('addRoomModal', '添加考场', '600', '', {
                showButton: true,
                confirmButtonText: 'Save',
                cancelButtonText: 'Cancle',
                onConfirm: "public.addRoom"
            });

        });


        jqueryMap.$tbody.on('click', 'a.remove', function (e) {
            e.preventDefault();
            var id = $(this).parents('tr').attr('data-id'), params, ids = [];
            ids.push(id);
            params = {
                ids: ids
            };
            $.post('/delRoom.json', params, function (data) {
                console.log(data);
                if (data != 0) {
                    _initTable(null);
                }
            })
        }).on('click', 'a.detail', function (e) {
            e.preventDefault();
            var id = $(this).parents('tr').attr('data-id'), params;
            params = {
                id: id,
                role: 3
            };
            // $.post('/userInfo.json', params, function (data) {
            //     jqueryMap.$roomInfo.html(tmpl.info(data)).removeClass('none');
            //     jqueryMap.$roomsList.addClass('none');
            //     jqueryMap.$infoForm = jqueryMap.$roomInfo.find('#infoForm');
            //     jqueryMap.$update = jqueryMap.$infoForm.find('.update');
            //     jqueryMap.$back = jqueryMap.$infoForm.find('.back');
            //     jqueryMap.$update.on('click', function (e) {
            //         e.preventDefault();
            //         var data = jqueryMap.$infoForm.serializeArray();
            //         var params = {
            //             _id: data[0].value,
            //             uno: data[1].value,
            //             name: data[2].value,
            //             major: data[3].value,
            //             phone: data[6].value,
            //             address: data[7].value
            //         }
            //         $.post('/updateUserInfo.json', params, function (data) {
            //             if (data === 1) {
            //                 $.Notice.success("用户信息修改成功");
            //                 jqueryMap.$roomInfo.addClass('none');
            //                 jqueryMap.$roomsList.removeClass('none');
            //                 _initTable();
            //             } else if (data === 0) {
            //                 $.Notice.error("用户信息修改失败");
            //             }
            //         });
            //     });
            //     jqueryMap.$back.on('click', function (e) {
            //         e.preventDefault();
            //         jqueryMap.$roomInfo.addClass('none');
            //         jqueryMap.$roomsList.removeClass('none');
            //     });



            // });

        });
    }
    function addRoom() {
        var no = jqueryMap.$no.aeTextfield('getValue');
        var address = jqueryMap.$address.aeTextfield('getValue');
        var capacity = jqueryMap.$capacity.aeTextfield('getValue');
        var isEmpty = jqueryMap.$isEmpty.aeRadio('getValue') === '1' ? true : false;
        console.log(isEmpty);
        if (no === '') {
            $.Notice.warning('警告', '教室编号不可为空！');
        }
        if (address === '') {
            $.Notice.warning('警告', '教室地址不可为空！');
        }
        if (capacity === '') {
            $.Notice.warning('警告', '教室容量不可为空！');
        } else {
            if (!parseInt(capacity)) {
                $.Notice.warning('警告', '教室容量必须为数字');
            }
        }
        var params = {
            no: no,
            address: address,
            capacity: capacity,
            isEmpty: isEmpty
        };
        $.post('/addRoom.json', params, function (data) {

        });

    }

    function _initTable(name) {
        var params = {
            name: name,
            pageNumber: pageInfo.pageNumber,
            pageSize: pageInfo.pageSize
        };
        if (!name) {
            delete params[name];
        }

        $.post('/queryroom.json', params, function (data) {
            console.log(data);
            jqueryMap.$tbody.html(tmpl.item(data.data));
            jqueryMap.$singleCheck = stateMap.$container.find('.singleCheck')
            $.each(data.data, function (index, item) {
                $(jqueryMap.$singleCheck[index]).aeCheckbox({ onSelect: _singleCheck }).aeCheckbox('reload', {
                    value: item._id,
                    text: ''
                })
            });
            jqueryMap.$pagination.aePagination({
                isShowPageSizeCombo: true,
                "currentPage": pageInfo.pageNumber,
                "totalRecords": 0,
                "pageSize": pageInfo.pageSize,
                onPageChange: function (currentPage, pageSize) {
                    pageInfo.pageNumber = currentPage;
                    pageInfo.pageSize = pageSize;
                    _initTable(null);
                },
                onComboChange: function (currentPage, pageSize) {
                    pageInfo.pageNumber = currentPage;
                    pageInfo.pageSize = pageSize;
                    _initTable(null);
                }


            }).aePagination('setTotalRecords', data.total);

        });

    }

    function getSelectedIds() {
        var selected = [];
        jqueryMap.$tbody.find('label').each(function (index, item) {
            console.log(item);
            if ($(item).hasClass('checked')) {
                selected.push($(item).parents('tr').attr('data-id'));
            }
        });
        return selected;
    }

    function _checkAll() {
        var selectLength = jqueryMap.$tbody.find('label.checked').length;
        //如果下面的checkbox已经全部选中，则点击全选按钮后将下面所有的checkbox都置为未勾选状态。反之
        if (selectLength === jqueryMap.$tbody.find('tr').length) {
            jqueryMap.$tbody.find('.singleCheck').each(function (index, item) {
                var id = $(item).parents('tr').attr('data-id');
                $(item).aeCheckbox({ onSelect: _singleCheck }).aeCheckbox('reload', {
                    value: id,
                    text: '',
                });

            });
            jqueryMap.$delroom.attr('style', 'visibility: hidden');
        } else {
            jqueryMap.$tbody.find('.singleCheck').each(function (index, item) {
                var id = $(item).parents('tr').attr('data-id');
                $(item).aeCheckbox({ onSelect: _singleCheck }).aeCheckbox('reload', {
                    value: id,
                    text: '',
                    checked: 'checked'
                });

            });
            jqueryMap.$delroom.attr('style', 'visibility: visible');
        }


    }

    function _singleCheck() {
        var id = $(this).parents('tr').attr('data-id');
        var selectLength = jqueryMap.$tbody.find('label.checked').length;
        var liLength = jqueryMap.$tbody.find('tr').length;
        //如果一个都没选中。则隐藏全选和删除按钮，如果勾选了一个单选框，则将所有的单选框都显示
        if (selectLength === 0) {
            jqueryMap.$delroom.attr('style', 'visibility: hidden');
        } else {
            jqueryMap.$delroom.attr('style', 'visibility: visible');
        }
        //如果一个一个的把checkbox全部选中，则把顶部的全选按钮也置为勾选状态
        if (selectLength === liLength) {
            jqueryMap.$selectAll.aeCheckbox('reload', {
                text: '',
                value: '1',
                checked: 'checked'
            });
        } else {
            jqueryMap.$selectAll.aeCheckbox('reload', {
                text: '',
                value: '1'
            });

        }

    }

    function destroyModule() {
        if (!configMap.isInit) {
            return;
        }
        stateMap.$container.off().empty();
        configMap.isInit = false;
        console.log("module destroy...");
    }

    function initModule($container) {
        if (configMap.isInit === true || !$container) {
            return;
        }
        stateMap.$container = $container || null;
        _loadHtml();
        _initTemplate();
        _setJqueryMap();
        _bindEvent();
        public = {
            addRoom: addRoom
        }


    }

    module.exports = {
        initModule: initModule,
        destroyModule: destroyModule
    }

});