/**
 * Created by Harwin on 2016/4/6.
 */
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
    viewMap.currentViewHtml = require('/module/studentInfo/studentManagement.html');
    function _loadHtml() {
        if (stateMap.$container && stateMap.$container.length) {
            stateMap.$container.html(viewMap.currentViewHtml);
            $("body").scrollTop(0);
        } else {
            $.Notice.error("notification:loadHtml", "$container not exist");
        }
    }
    function _initTemplate() {
        tmpl = {
            item: Handlebars.compile(stateMap.$container.find('#item').html()),
            info: Handlebars.compile(stateMap.$container.find('#info').html()),
        }
    }

    function _setJqueryMap() {
        jqueryMap = {
            $studentsList: stateMap.$container.find('#studentList'),
            $studentTable: stateMap.$container.find('#studentTable'),
            $tbody: stateMap.$container.find('#tbody'),
            $selectAll: stateMap.$container.find('#selectAll'),
            $delstudent: stateMap.$container.find('#delStudent'),
            $pagination: stateMap.$container.find('#studentPagination'),
            $searchstudent: stateMap.$container.find('#searchStudent'),
            $studentInfo: stateMap.$container.find('#studentInfo')
        };
    }

    function _bindEvent() {
        jqueryMap.$searchstudent.aeTextfield({
            onValueChange: function () {
                var name = jqueryMap.$searchstudent.aeTextfield('getValue'), params;
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
        jqueryMap.$delstudent.on('click', function () {
            var ids = getSelectedIds(), params;
            params = {
                ids: ids
            };
            $.post('/delstudent.json', params, function (data) {
                if (data != 0) {
                    _initTable(null);
                }

            });
        });
        jqueryMap.$tbody.on('click', 'a.remove', function (e) {
            e.preventDefault();
            var id = $(this).parents('tr').attr('data-id'), params, ids = [];
            ids.push(id);
            params = {
                ids: ids
            };
            console.log(ids);
            $.post('/delStudent.json', params, function (data) {
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
            $.post('/userInfo.json', params, function (data) {
                jqueryMap.$studentInfo.html(tmpl.info(data)).removeClass('none');
                jqueryMap.$studentsList.addClass('none');
                jqueryMap.$infoForm = jqueryMap.$studentInfo.find('#infoForm');
                jqueryMap.$update = jqueryMap.$infoForm.find('.update');
                jqueryMap.$back = jqueryMap.$infoForm.find('.back');
                jqueryMap.$update.on('click', function (e) {
                    e.preventDefault();
                    var data = jqueryMap.$infoForm.serializeArray();
                    var params = {
                        _id: data[0].value,
                        uno: data[1].value,
                        name: data[2].value,
                        major: data[3].value,
                        phone: data[6].value,
                        address: data[7].value
                    }
                    $.post('/updateUserInfo.json', params, function (data) {
                        if (data === 1) {
                            $.Notice.success("用户信息修改成功");
                            jqueryMap.$studentInfo.addClass('none');
                            jqueryMap.$studentsList.removeClass('none');
                            _initTable();
                        } else if (data === 0) {
                            $.Notice.error("用户信息修改失败");
                        }
                    });
                });
                jqueryMap.$back.on('click', function (e) {
                    e.preventDefault();
                    jqueryMap.$studentInfo.addClass('none');
                    jqueryMap.$studentsList.removeClass('none');
                });



            });

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

        $.post('/querystudent.json', params, function (data) {
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
                    _initTable(params);
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
            jqueryMap.$delstudent.attr('style', 'visibility: hidden');
        } else {
            jqueryMap.$tbody.find('.singleCheck').each(function (index, item) {
                var id = $(item).parents('tr').attr('data-id');
                $(item).aeCheckbox({ onSelect: _singleCheck }).aeCheckbox('reload', {
                    value: id,
                    text: '',
                    checked: 'checked'
                });

            });
            jqueryMap.$delstudent.attr('style', 'visibility: visible');
        }


    }

    function _singleCheck() {
        var id = $(this).parents('tr').attr('data-id');
        var selectLength = jqueryMap.$tbody.find('label.checked').length;
        var liLength = jqueryMap.$tbody.find('tr').length;
        //如果一个都没选中。则隐藏全选和删除按钮，如果勾选了一个单选框，则将所有的单选框都显示
        if (selectLength === 0) {
            jqueryMap.$delstudent.attr('style', 'visibility: hidden');
        } else {
            jqueryMap.$delstudent.attr('style', 'visibility: visible');
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


    }

    module.exports = {
        initModule: initModule,
        destroyModule: destroyModule
    }
});