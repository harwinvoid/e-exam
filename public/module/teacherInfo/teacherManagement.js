/**
 * Created by Harwin on 2016/4/6.
 */
var obj = {}
define(function (require, exports, module) {
    var jqueryMap = {},
        viewMap = {
            currentViewHtml: ''
        },
        configMap = {
            isInit: false
        },
        stateMap = {},
        selections = [];
    viewMap.currentViewHtml = require('/module/teacherInfo/teacherManagement.html');
    function _loadHtml() {
        if (stateMap.$container && stateMap.$container.length) {
            stateMap.$container.html(viewMap.currentViewHtml);
            $("body").scrollTop(0);
        } else {
            throw util.getError("notification:loadHtml", "$container not exist");
        }
    };
    function _setJqueryMap() {
        stateMap.$container.find('#teachersList')
        jqueryMap = {
            $teachersList: stateMap.$container.find('#teachersList'),
            $teacherTable: stateMap.$container.find('#teacherTable'),
            $remove: stateMap.$container.find('remove')
        };
    }

    function _bindEvent() {
        _initTable();

    };
    function _initTable() {

        jqueryMap.$teacherTable.bootstrapTable({
            url:'/mockdata/teacher.json',
            icons:{
                export: 'export',
                toggle: 'view_list ',
                refresh: 'refresh',
                columns: 'view_week'
            }
            ,
            columns: [

                {
                    field: 'state',
                    checkbox: true,
                    align: 'center',
                    valign: 'middle'
                },
                {
                    field: 'id',
                    title: '教师号',
                    sortable: true,
                    editable: true,
                    align: 'center'
                },
                {
                    field: 'typeNo',
                    title: '院系编号',
                    sortable: true,
                    align: 'center',
                    editable: {
                        type: 'text',
                        title: '院系编号',
                        validate: function (value) {
                            value = $.trim(value);
                            if (!value) {
                                return 'This field is required';
                            }
                            if (!/^$/.test(value)) {
                                return 'This field needs to start width $.'
                            }
                            var data = jqueryMap.$teacherTable.bootstrapTable('getData'),
                                index = $(this).parents('tr').data('index');
                            console.log(data[index]);
                            return '';
                        }
                    }

                },
                {
                    field: 'name',
                    title: '姓名',
                    sortable: true,
                    editable: true,
                    align: 'center',
                    editable: {
                        type: 'text',
                        title: '姓名',
                        validate: function (value) {
                            value = $.trim(value);
                            if (!value) {
                                return 'This field is required';
                            }
                            if (!/^$/.test(value)) {
                                return 'This field needs to start width $.'
                            }
                            var data = jqueryMap.$teacherTable.bootstrapTable('getData'),
                                index = $(this).parents('tr').data('index');
                            console.log(data[index]);
                            return '';
                        }
                    }
                },
                {
                    field: 'age',
                    title: '年龄',
                    sortable: true,
                    editable: true,
                    align: 'center',
                    editable: {
                        type: 'text',
                        title: '年龄',
                        validate: function (value) {
                            value = $.trim(value);
                            if (!value) {
                                return 'This field is required';
                            }
                            if (!/^$/.test(value)) {
                                return 'This field needs to start width $.'
                            }
                            var data = jqueryMap.$teacherTable.bootstrapTable('getData'),
                                index = $(this).parents('tr').data('index');
                            console.log(data[index]);
                            return '';
                        }
                    }
                },
                {
                    field: 'address',
                    title: '办公地址',
                    sortable: true,
                    editable: true,
                    align: 'center',
                    editable: {
                        type: 'text',
                        title: '办公地址',
                        validate: function (value) {
                            value = $.trim(value);
                            if (!value) {
                                return 'This field is required';
                            }
                            if (!/^$/.test(value)) {
                                return 'This field needs to start width $.'
                            }
                            var data = jqueryMap.$teacherTable.bootstrapTable('getData'),
                                index = $(this).parents('tr').data('index');
                            console.log(data[index]);
                            return '';
                        }
                    }
                },
                {
                    field: 'phone',
                    title: '联系电话',
                    sortable: true,
                    editable: true,
                    align: 'center',
                    editable: {
                        type: 'text',
                        title: '联系电话',
                        validate: function (value) {
                            value = $.trim(value);
                            if (!value) {
                                return 'This field is required';
                            }
                            if (!/^$/.test(value)) {
                                return 'This field needs to start width $.'
                            }
                            var data = jqueryMap.$teacherTable.bootstrapTable('getData'),
                                index = $(this).parents('tr').data('index');
                            console.log(data[index]);
                            return '';
                        }
                    }
                },
                {
                    field: 'operate',
                    title: '操作',
                    align: 'center',
                    events: operateEvents,
                    formatter: operateFormatter
                }


            ]
        });
        // sometimes footer render error.
        setTimeout(function () {
            jqueryMap.$teacherTable.bootstrapTable('resetView');
        }, 200);
        jqueryMap.$teacherTable.on('check.bs.table uncheck.bs.table ' +
            'check-all.bs.table uncheck-all.bs.table', function () {
            console.log(jqueryMap.$teacherTable.bootstrapTable('getSelections').length)
            jqueryMap.$remove.prop('disabled', !jqueryMap.$teacherTable.bootstrapTable('getSelections').length);
            // save your data, here just save the current page
            selections = getIdSelections();
            // push or splice the selections if you want to save all data selections
        });
        jqueryMap.$teacherTable.on('expand-row.bs.table', function (e, index, row, $detail) {
            if (index % 2 == 1) {
                $detail.html('Loading from ajax request...');
                $.get('LICENSE', function (res) {
                    $detail.html(res.replace(/\n/g, '<br>'));
                });
            }
        });
        jqueryMap.$teacherTable.on('all.bs.table', function (e, name, args) {
            console.log(name, args);
        });
        jqueryMap.$remove.click(function () {
            var ids = getIdSelections();
            jqueryMap.$teacherTable.bootstrapTable('remove', {
                field: 'id',
                values: ids
            });
            jqueryMap.$remove.prop('disabled', true);
        });
        $(window).resize(function () {
            jqueryMap.$teacherTable.bootstrapTable('resetView', {
                height: getHeight()
            });
        });
    }
    function operateFormatter(value, row, index) {
        return [
            '<a class="like" href="javascript:void(0)" title="Like">',
            '<i class="dehaze"></i>',
            '</a>  ',
            '<a class="remove m-l-md" href="javascript:void(0)" title="Remove">',
            '<i class="delete"></i>',
            '</a>'
        ].join('');
    }
    window.operateEvents = {
        'click .like': function (e, value, row, index) {
            alert('You click like action, row: ' + JSON.stringify(row));
        },
        'click .remove': function (e, value, row, index) {
            jqueryMap.$teacherTable.bootstrapTable('remove', {
                field: 'id',
                values: [row.id]
            });
        }
    };

    function getIdSelections() {
        return $.map(jqueryMap.$teacherTable.bootstrapTable('getSelections'), function (row) {
            return row.id
        });
    }

    function responseHandler(res) {
        $.each(res.rows, function (i, row) {
            row.state = $.inArray(row.id, selections) !== -1;
        });
        return res;
    }

    function getHeight() {
        return '600px';
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
        _setJqueryMap();
        _bindEvent();


    }

    module.exports = {
        initModule: initModule,
        destroyModule: destroyModule,
        obj: {
            responseHandler: responseHandler
        }

    }
});