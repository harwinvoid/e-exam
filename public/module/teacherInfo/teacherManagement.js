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
    function _initTemplate() {
        tmpl = {
            item: Handlebars.compile(stateMap.$container.find('#item').html())
        }
    }

    function _setJqueryMap() {
        stateMap.$container.find('#teachersList')
        jqueryMap = {
            $teachersList: stateMap.$container.find('#teachersList'),
            $teacherTable: stateMap.$container.find('#teacherTable'),
            $remove: stateMap.$container.find('#remove'),
            $tbody: stateMap.$container.find('#tbody'),
            $selectAll: stateMap.$container.find('#selectAll'),
            $delTeacher: stateMap.$container.find('#delTeacher'),
            $pagination: stateMap.$container.find('#pagination')
        };
    }

    function _bindEvent() {

        jqueryMap.$selectAll.aeCheckbox({
            onSelect: _checkAll
        }).aeCheckbox('reload', {
            text: '',
            value: ''
        });
        _initTable();

    };
    function _initTable() {
        var params = {
            pageNumber: pageInfo.currentPage,
            pageSize: pageInfo.pageSize
        }
        $.post('/queryTeacher.json', params, function (data) {
            jqueryMap.$tbody.html(tmpl.item(data.data));
            jqueryMap.$singleCheck = stateMap.$container.find('.singleCheck')
            $.each(data.data, function (index, item) {
                $(jqueryMap.$singleCheck[index]).aeCheckbox({onSelect: _singleCheck}).aeCheckbox('reload', {
                    value: item._id,
                    text: ''
                })
            });
           jqueryMap.$pagination.aePagination({
                isShowPageSizeCombo: true,
                "currentPage": pageInfo.pageNumber,
                "totalRecords": 0,
                "pageSize": pageInfo.pageSize,
                "onPageChange": function (currentPage, pageSize) {
                    pageInfo.pageNumber = currentPage;
                    pageInfo.pageSize = pageSize;
                    _initTable();
                },

            }).aePagination('setTotalRecords', data.total);

        });

    }

    function _checkAll() {
        var selectLength =jqueryMap.$tbody.find('label.checked').length;
        //如果下面的checkbox已经全部选中，则点击全选按钮后将下面所有的checkbox都置为未勾选状态。反之
        if (selectLength ===jqueryMap.$tbody.find('tr').length) {
           jqueryMap.$tbody.find('.singleCheck').each(function (index, item) {
                var id = $(item).parents('tr').attr('data-id');
                $(item).aeCheckbox({onSelect: _singleCheck}).aeCheckbox('reload', {
                    value: id,
                    text: '',
                });

            });
            jqueryMap.$delTeacher.addClass('none');
        } else {
            jqueryMap.$tbody.find('.singleCheck').each(function (index, item) {
                var id = $(item).parents('tr').attr('data-id');
                $(item).aeCheckbox({onSelect: _singleCheck}).aeCheckbox('reload', {
                    value: id,
                    text: '',
                    checked: 'checked'
                });

            });
            jqueryMap.$delTeacher.removeClass('none');
        }


    }

    function _singleCheck() {
        console.log('-----------')
        var selectLength = jqueryMap.$tbody.find('label.checked').length;
        var liLength = jqueryMap.$tbody.find('tr').length;
        //如果一个都没选中。则隐藏全选和删除按钮，如果勾选了一个单选框，则将所有的单选框都显示
        if (selectLength === 0) {
            jqueryMap.$delTeacher.addClass('none');
        } else {
            jqueryMap.$delTeacher.removeClass('none');
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