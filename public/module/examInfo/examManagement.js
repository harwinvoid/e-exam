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
    viewMap.currentViewHtml = require('/module/examInfo/examManagement.html');
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
            $examsList: stateMap.$container.find('#examList'),
            $examTable: stateMap.$container.find('#examTable'),
            $tbody: stateMap.$container.find('#tbody'),
            $selectAll: stateMap.$container.find('#selectAll'),
            $delExam: stateMap.$container.find('#delExam'),
            $addExam: stateMap.$container.find('#addExam'),
            $pagination: stateMap.$container.find('#examPagination'),
            $searchExam: stateMap.$container.find('#searchExam'),
            $startTime: stateMap.$container.find('#startTime'),
            $endTime: stateMap.$container.find('#endTime'),
            $attendClass: stateMap.$container.find('#attendClass'),
            $examAddress: stateMap.$container.find('#examAddress'),
            $examType: stateMap.$container.find('#examType'),
            $attendNum: stateMap.$container.find('#attendNum'),
            $examTeacher: stateMap.$container.find('#examTeacher'),
            $courseName: stateMap.$container.find('#courseName'),



        };
    }
    function initUploader() {
        var Uploader = Q.Uploader;
        var uploader = new Uploader({
            target: $("#upload")[0],
            allows: '.xlsx',
            url: '/uploadExam.json',
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
    function getTeachers() {
        $.post('/queryTeacher.json', null, function (data) {
            var teachers = [];
            $.each(data.data, function (index, item) {
                var displayTeacher = {
                    value: item._id,
                    text: item.name
                }
                teachers.push(displayTeacher);
            });
           
            jqueryMap.$examTeacher.aeCombo('reload', teachers);
        })
    }
    function getRoom() {
        $.post('/queryroom.json', null, function (data) {
            var rooms = [];
         
            $.each(data.data, function (index, item) {
                var item = {
                    text: item.address + ':' + item.roomNo,
                    value: item._id
                }
                rooms.push(item);
            });
            jqueryMap.$examAddress.aeCombo('reload',rooms);
        });
    }
    function indexOf(Array,obj){
        var newArray = [];
        $.each(Array,function (index,item) {
            newArray.push(JSON.stringify(item));
        });
        if(newArray.indexOf(JSON.stringify(obj))){
            return newArray.indexOf(JSON.stringify(obj));
        }else{
            return 0;
        }
        
    }
    function getClassName() {
        $.post('/querystudent.json',null,function (data) {
           var clazz = [];
           
           //120522130
           $.each(data.data,function(index,item) {
               var item = {
                   text: item.uno.substring(0,7),
                   value: item.uno.substring(0,7)
               }
               if(indexOf(clazz,item) === -1){
                clazz.push(item);    
               }
           }) ;
           jqueryMap.$attendClass.aeCombo('reload',clazz);
          
        });
    }
    function _bindEvent() {
        initUploader();
        $("[data-toggle='tooltip']").tooltip();
        var examType = [{ code: '上机考试', value: '1', checked: 'true' }, { code: '笔试', value: '0' }];
        jqueryMap.$examType.aeRadio('reload', examType);
        jqueryMap.$courseName.aeTextfield({});
        jqueryMap.$attendNum.aeFlip({});
        jqueryMap.$startTime.aeCalendar({});
        jqueryMap.$endTime.aeCalendar({});
        jqueryMap.$examAddress.aeCombo({});
        jqueryMap.$attendClass.aeCombo({});
        jqueryMap.$examTeacher.aeCombo({});
        getTeachers();
        getRoom();
        getClassName();
        jqueryMap.$searchExam.aeTextfield({
            onValueChange: function () {
                var name = jqueryMap.$searchexam.aeTextfield('getValue'), params;
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
        //删除选中的考试
        jqueryMap.$delExam.on('click', function () {
            var ids = getSelectedIds(), params;
            params = {
                ids: ids
            };
            $.post('/delexam.json', params, function (data) {
                if (data != 0) {
                    _initTable(null);
                }

            });
        });
        jqueryMap.$addExam.on('click', function () {
            $.openPopupDiv('addExamModal', '考试信息', '600', '', {
                showButton: true,
                confirmButtonText: 'Save',
                cancelButtonText: 'Cancle',
                onConfirm: "public.addExam"
            });

        });


        jqueryMap.$tbody.on('click', 'a.remove', function (e) {
            e.preventDefault();
            var id = $(this).parents('tr').attr('data-id'), params, ids = [];
            ids.push(id);
            params = {
                ids: ids
            };
            $.post('/delexam.json', params, function (data) {
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
            //     jqueryMap.$examInfo.html(tmpl.info(data)).removeClass('none');
            //     jqueryMap.$examsList.addClass('none');
            //     jqueryMap.$infoForm = jqueryMap.$examInfo.find('#infoForm');
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
            //                 jqueryMap.$examInfo.addClass('none');
            //                 jqueryMap.$examsList.removeClass('none');
            //                 _initTable();
            //             } else if (data === 0) {
            //                 $.Notice.error("用户信息修改失败");
            //             }
            //         });
            //     });
            //     jqueryMap.$back.on('click', function (e) {
            //         e.preventDefault();
            //         jqueryMap.$examInfo.addClass('none');
            //         jqueryMap.$examsList.removeClass('none');
            //     });



            // });

        });
    }
    function addExam() {
        var courseName = jqueryMap.$courseName.aeTextfield('getValue');
            examAddress = jqueryMap.$examAddress.aeCombo('getValue'),
            attendNum = jqueryMap.$attendNum.aeFlip('getValue'),
            examType = jqueryMap.$examType.aeRadio('getValue') === '1' ? '上机考试' : '笔试',
            startTime = jqueryMap.$startTime.aeCalendar('getValue'),
            endTime = jqueryMap.$endTime.aeCalendar('getValue'),
            examTeacher = jqueryMap.$examTeacher.aeCombo('getValue'),
            attendClass = jqueryMap.$attendClass.aeCombo('getValue');
            
        if (courseName === '') {
            $.Notice.warning('警告', '科目名称不能为空！');
        }
        if (startTime === '') {
            $.Notice.warning('警告', '考试开始时间不可为空！');
        }
        if (endTime === '') {
            $.Notice.warning('警告', '考试结束时间不可为空！');
        }
        if (examAddress === '') {
            $.Notice.warning('警告', '考试地址不可为空！');
        }
        if (attendNum === '') {
            $.Notice.warning('警告', '参考人数不可为空！');
        }
        if (attendClass === '') {
            $.Notice.warning('警告', '参考班级不可为空！');
        }
        if(endTime < startTime){
            $.Notice.warning('警告', '结束时间不可小于开始时间！');
        }
        var params = {
            courseName : courseName,
            examAddress : examAddress,
            time : {
                startTime : startTime,
                endTime : endTime
            },
            attendClass : attendClass,
            examTeacher : examTeacher, 
            attendNum : attendNum,
            examType : examType
        };
        console.log(params);
        $.post('/addExam.json', params, function (data) {
               if(data.code  == '1'){
                   $.Notice.success('成功',data.msg);
                   _initTable(null);
                   $.closePopupDiv();
               }else{
                   $.Notice.error('失败',data.msg);
               }
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

        $.post('/queryExam.json', params, function (data) {
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
            jqueryMap.$delexam.attr('style', 'visibility: hidden');
        } else {
            jqueryMap.$tbody.find('.singleCheck').each(function (index, item) {
                var id = $(item).parents('tr').attr('data-id');
                $(item).aeCheckbox({ onSelect: _singleCheck }).aeCheckbox('reload', {
                    value: id,
                    text: '',
                    checked: 'checked'
                });

            });
            jqueryMap.$delexam.attr('style', 'visibility: visible');
        }


    }

    function _singleCheck() {
        var id = $(this).parents('tr').attr('data-id');
        var selectLength = jqueryMap.$tbody.find('label.checked').length;
        var liLength = jqueryMap.$tbody.find('tr').length;
        //如果一个都没选中。则隐藏全选和删除按钮，如果勾选了一个单选框，则将所有的单选框都显示
        if (selectLength === 0) {
            jqueryMap.$delexam.attr('style', 'visibility: hidden');
        } else {
            jqueryMap.$delexam.attr('style', 'visibility: visible');
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
            addExam: addExam
        }


    }

    module.exports = {
        initModule: initModule,
        destroyModule: destroyModule
    }

});