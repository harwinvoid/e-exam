define(function (require, exports, moudles) {
    //;(function($, undefined){

    $.extend($.aries, {
        service: {
            tt: {
                queryTroubleTicket: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=queryTroubleTicketSaas',
                queryTroubleTicketPriority: 'http://web.crm.veris7.ai:30051/ARIESRES/crm-bj/mock-data/trouble-ticket/queryTroubleTicketPriority.json',
                queryTroubleTicketTmlmtState: 'http://web.crm.veris7.ai:30051/ARIESRES/crm-bj/mock-data/trouble-ticket/queryTroubleTicketTmlmtState.json',
                queryTroubleTicketProcessState: 'http://web.crm.veris7.ai:30051/ARIESRES/crm-bj/mock-data/trouble-ticket/queryTroubleTicketProcessState.json',
                queryTroubleTicketMassFlag: 'http://web.crm.veris7.ai:30051/ARIESRES/crm-bj/mock-data/trouble-ticket/queryTroubleTicketMassFlag.json',
                //查询工单类型 － queryTroubleTicketType
                queryTroubleTicketType: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=queryTroubleTicketTypeSaas',
                //查询工单模板 - acquireTroubleTicketSpec
                acquireTroubleTicketSpec: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=acquireTroubleTicketSpecSaas',
                //查询组织关系，暂无服务
                queryTroubleCreatorInfo: 'http://web.crm.veris7.ai:30051/ARIESRES/crm-bj/mock-data/trouble-ticket/queryTroubleCreatorInfo.json',
                //查询返回一个新的TT展示流水号 - generateTroubleTicketShowSerialNo
                generateTroubleTicketShowSerialNo: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=generateTroubleTicketShowSerialNoSaas',
                //查询大面积故障列表，创建从单的时候选择主单使用 - queryTroubleTicketForMass
                queryTroubleTicketForMass: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=queryTroubleTicketForMassSaas',
                //根据员工号查询当前TODO的TT单总数 - queryTicketStatistic
                queryTicketStatistic: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=queryTicketStatisticSaas',
                //创建普通单 - submitTroubleTicket
                submitTroubleTicket: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=submitTroubleTicketSaas',
                //创建草稿单 - saveTroubleTicket
                saveTroubleTicket: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=saveDraftTroubleTicketSaas',
                //directReplyTroubleTicket
                directReplyTroubleTicket: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=directReplyTroubleTicketSaas',
                //查询客户信息 - queryCustomerForTicket
                queryCustomerForTicket: 'http://web.crm.veris7.ai:30051/HubCrmCoreServlet?servicecode=queryCustomer',
                //
                querySubscriberForTicket: 'http://web.crm.veris7.ai:30051/HubCrmCoreServlet?servicecode=querySubscriber',
                //查询相似工单 - querySimilarTroubleTicket
                querySimilarTroubleTicket: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=querySimilarTroubleTicketSaas',
                //查询重复工单 - queryRepeatTroubleTicket
                queryRepeatTroubleTicket: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=queryRepeatTroubleTicketSaas',
                //工单详情 - acquireTroubleTicketCompleteInfo
                acquireTroubleTicketCompleteInfo: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=acquireTroubleTicketCompleteInfoSaas',
                //查询工单列表 - queryTroubleTicketBySpec
                //queryTroubleTicketBySpec : 'http://web.crm.veris7.ai:30051/crm-bj/mock-data/trouble-ticket/queryTroubleTicketBySpec.json',
                queryTroubleTicketBySpec: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=queryTicketBySpecSaas',
                //troubleShoot 暂无服务
                troubleShoot: 'http://web.crm.veris7.ai:30051/ARIESRES/crm-bj/mock-data/trouble-ticket/troubleShoot.json',
                //认领工单 - claimWorkItem
                claimWorkItem: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=claimWorkItemSaas',
                //强制认领工单 -  forceClaimWorkItemSaas
                forceClaimWorkItem: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=forceClaimWorkItemSaas',
                //处理工单 - performWorkItem
                performWorkItem: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=performWorkItemSaas',
                //取消工单 - cancelTroubleTicket
                cancelTroubleTicket: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=cancelTroubleTicketSaas',
                //关闭工单 - closeTroubleTicket
                closeTroubleTicket: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=closeTroubleTicketSaas',
                //委托工单 - transferWorkItem
                transferWorkItem: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=transferWorkItemSaas',
                //休眠工单 - suspendWorkItem
                suspendWorkItem: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=suspendWorkItemSaas',
                //激活工单 - resumeWorkItem
                resumeWorkItem: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=resumeWorkItemSaas',
                //释放工单 - releaseWorkItem
                releaseWorkItem: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=releaseWorkItemSaas',
                //重启工单 - rebootTroubleTicket
                rebootTroubleTicket: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=rebootTroubleTicketSaas',
                //修改工单 - modifyTroubleTicket
                modifyTroubleTicket: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=modifyTroubleTicketSaas',
                //创单设定截止时间 -  totalTmlmtLen
                totalTmlmtLen: 'http://web.crm.veris7.ai:30051/ARIESRES/crm-bj/mock-data/trouble-ticket/totalTmlmtLen.json',
                //从单关联主单
                attachFollowTroubleTicket: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=attachFollowTroubleTicketSaas',
                //上传服务
                uploadForTicket: 'http://hub.crm.veris7.ai:32000/TroubleTicketServlet?servicecode=upload',
                //导入受影响人Excel
                importTroubleTicketAffectCust: 'http://hub.crm.veris7.ai:32000/TroubleTicketServlet?servicecode=importTroubleTicketAffectCust',
                //查询流程转向规则
                calcTransitionByRule: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=calcTransitionByRuleSaas',
                //发送消息
                sendMessageForTicket: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=sendMessageForTicketSaas',
                //获取操作员
                getOperInfo: 'http://web.crm.veris7.ai:30051/auth?servicecode=getOperInfo',
                //获取客户媒介信息
                queryCustomerContactMedium: 'http://web.crm.veris7.ai:30051/HubCrmCoreServlet?servicecode=queryCustomerContactMedium',
                //删除草稿工单
                deleteDraftTroubleTicket: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=deleteDraftTroubleTicketSaas',
                // 查询所有关联主单的从单
                queryRelatedFollowTicket: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=queryRelatedFollowTicketSaas',
                // 查询需要导出的工单
                queryExportTicketBySpec: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=queryExportTicketBySpecSaas',
                //添加收藏工单
                addTroubleTicketTypeToFavorite: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=addTroubleTicketTypeToFavoriteSaas',
                //删除收藏工单
                removeTroubleTicketTypeFromFavorite: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=removeTroubleTicketTypeFromFavoriteSaas',
                //更新个人收藏夹中工单类型顺序
                updateTroubleTicketTypeFavoriteOrder: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=updateTroubleTicketTypeFavoriteOrderSaas',
                //查询个人收藏工单类型
                queryTroubleTicketTypeForFavorite: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=queryTroubleTicketTypeForFavoriteSaas',
                //查询个人TopN工单类型
                queryTroubleTicketTypeForTopN: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=queryTroubleTicketTypeForTopNSaas'

            },
            pushc: {
                //新增业务模块
                addBusinessModuleForSaas: 'http://localhost:32000/HubCrmServlet?servicecode=addBusinessModuleForSaas',
                //查询业务模块列表
                queryAllBusinessModuleForSaas: 'http://localhost:32000/HubCrmServlet?servicecode=queryAllBusinessModuleForSaas',
                //编辑业务模块
                updateBusinessModuleForSaas: 'http://localhost:32000/HubCrmServlet?servicecode=updateBusinessModuleForSaas',
                //删除业务模块
                deleteBusinessModuleForSaas: 'http://localhost:32000/HubCrmServlet?servicecode=deleteBusinessModuleForSaas',
                //根据ID查询业务模块
                acquireBusinessModuleForSaas: 'http://localhost:32000/HubCrmServlet?servicecode=acquireBusinessModuleForSaas',
                //查询运营平台信息
                queryOperationPlatformForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=queryOperationPlatformForSaas',
                //添加运营平台
                addOperationPlatformForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=addOperationPlatformForSaas',
                //删除运营平台信息
                deleteOperationPlatformForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=deleteOperationPlatformForSaas',
                //修改运营平台信息
                updateOperationPlatformForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=updateOperationPlatformForSaas',
                //校验联系媒介名称唯一性
                checkContactMediumNameForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=checkContactMediumNameForSaas',
                //检验运营平台名称唯一性
                checkOperationPlatformNameForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=checkOperationPlatformNameForSaas',
                //运营平台查询信息回显
                acquireOperationPlatformForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=acquireOperationPlatformForSaas',
                //查询通知模板
                queryNotificationTemplateForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=queryNotificationTemplateForSaas',
                //激活媒体类型
                addOpPfrmMedSpecRelForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=addOpPfrmMedSpecRelForSaas',
                //修改媒体类型
                updateOpPfrmMedSpecRelForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=updateOpPfrmMedSpecRelForSaas',
                //打开或关闭媒体类型
                switchOpPfrmMediumTypeForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=switchOpPfrmMediumTypeForSaas',
                //新增联系媒介
                addContactMediumForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=addContactMediumForSaas',
                //查询业务模块类型
                queryBusinessModuleTypeForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=queryBusinessModuleTypeForSaas',
                //查询联系媒介
                queryContactMediumForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=queryContactMediumForSaas',
                //联系媒介信息查询回显
                acquireContactMediumByIdForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=acquireContactMediumByIdForSaas',
                //修改联系媒介
                updateContactMediumForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=updateContactMediumForSaas',
                //删除联系媒介
                deleteContactMediumForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=deleteContactMediumForSaas',
                //校验业务模块名称
                checkBusinessModuleNameForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=checkBusinessModuleNameForSaas',
                //校验业务模块缩写
                checkBusinessModuleAbbreviationForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=checkBusinessModuleAbbreviationForSaas',
                //查询静态数据（单个）
                queryStaticDataForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=queryStaticDataForSaas',
                //媒体类型的回显
                acquireOpPfrmMedSpecRelForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=acquireOpPfrmMedSpecRelForSaas',
                //根据ID查询通知
                acquireNotificationForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=acquireNotificationForSaas',
                //查询通知参数
                queryNotificationParamForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=queryNotificationParamForSaas',
                //校验通知编码
                checkNotificationCodeForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=checkNotificationCodeForSaas',
                //校验通知名称
                checkNotificationNameForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=checkNotificationNameForSaas',
                //根据条件查询通知列表
                queryNotificationByConditionForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=queryNotificationByConditionForSaas',
                //查询PushCommunication业务域的业务数据枚举值
                queryPushBusiDataForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=queryPushBusiDataForSaas',
                //查询联系媒介规格
                queryContactMediumSpecForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=queryContactMediumSpecForSaas',
                //查询模板
                acquirePushTemplateForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=acquirePushTemplateForSaas',
                //新增通知
                addNotificationForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=addNotificationForSaas',
                //编辑通知
                updateNotificationForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=updateNotificationForSaas',
                //删除通知
                deleteNotificationForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=deleteNotificationForSaas',
                //打开或关闭通知开关
                switchNotificationForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=switchNotificationForSaas',
                //查询展示Twitter详情
                acquireTwitterForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=acquireTwitterForSaas',
                //查询展示SMS详情
                acquireSmsForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=acquireSmsForSaas',
                //查询展示Email详情
                acquireEmailForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=acquireEmailForSaas',
                //查询展示RTSS详情
                acquireRtssForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=acquireRtssForSaas',
                //根据条件查询baseInfo
                queryMsgbaseInfoByConditionForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=queryMsgbaseInfoByConditionForSaas',
                //根据MsgId查询Task
                acquireTaskByMsgIdForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=acquireTaskByMsgIdForSaas',
                //查询TaskLog
                queryTaskLogForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=queryTaskLogForSaas',
                //查询静态数据（多个）
                queryMultiStaticDataForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=queryMultiStaticDataForSaas',
                //查询BusinessCommon业务域的业务数据枚举值
                queryBusiCommonBusiDataForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=queryBusiCommonBusiDataForSaas',
                //打开或关闭业务模块开关
                switchBusinessModuleForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=switchBusinessModuleForSaas',
                //查询有效的可下行的联系媒介
                queryAssociatedContactMediumForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=queryAssociatedContactMediumForSaas',
                //生成二维码
                generateQrcodeForSaas: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=generateQrcodeForSaas',
                //生成条形码
                generateBarcodeForSaaS: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=generateBarcodeForSaaS'
            },
            agentview: {

                /*------------页面调用相关URL------------------------------*/
                timelineurl: 'http://10.1.231.7:8083/ARIESRES/veris7/newsubscription/TimeLineForAgentView.html?customerId=',
                customerviewurl: 'http://10.1.231.7:8083/ARIESRES/veris7/newsubscription/CustomerView.html?customerId=',
                newuserurl: 'http://10.1.231.7:8083/ARIESRES/veris7/Main.html?customerId=',
                shopcarturl: 'http://10.1.231.7:8083/ARIESRES/veris7/newsubscription/ShoppingCart.html?customerId=',
                addcustomerurl: 'http://10.1.231.7:8083/ARIESRES/veris7/Main.html',
                b2bcustomerviewurl: 'http://10.1.231.7:8083/ARIESRES/veris7/customer/View360.html?customerId=',
                b2btimelineurl: 'http://10.1.231.7:8083/ARIESRES/veris7/marketingresource/Timeline.html?customerId=',
                b2bCustomerManagement: 'http://10.1.231.7:8083/ARIESRES/veris7/customer/queryOrganization.html?customerId=',
                b2bCreateCustomer: 'http://10.1.231.7:8083/ARIESRES/veris7/customer/AddOrganization.html',
                globleView: 'http://billing.crm.veris7.ai:8284/AcctMgnt/page-ng/account/account.jsp#/index?businessId=',

                /*------AgentView内部接口----------------------------------*/
                //AgentSticky
                queryAgentSticky: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=queryAgentSticky',
                saveAgentSticky: "http://localhost:32000/HubCrmServlet?servicecode=saveAgentSticky",
                //Remind
                queryRemind: 'http://localhost:32000/HubCrmServlet?servicecode=queryRemind',
                readRemind: 'http://localhost:32000/HubCrmServlet?servicecode=readRemind',
                addRemind: 'http://localhost:32000/HubCrmServlet?servicecode=addRemind',
                deleteRemind: 'http://localhost:32000/HubCrmServlet?servicecode=deleteRemind',
                deleteRemindByCode: 'http://localhost:32000/HubCrmServlet?servicecode=deleteRemindByCode',
                //CustomerSearchRecord
                addCustomerSearchRecord: 'http://localhost:32000/HubCrmServlet?servicecode=addCustomerSearchRecord',
                queryCustomerHistory: 'http://localhost:32000/HubCrmServlet?servicecode=queryCustomerSearchRecord',
                //quicklink
                queryQuickLinks: 'http://localhost:32000/HubCrmServlet?servicecode=queryQuickLink',
                saveQuickLinks: 'http://localhost:32000/HubCrmServlet?servicecode=saveQuickLink',
                deleteQuickLink: 'http://localhost:32000/HubCrmServlet?servicecode=deleteQuickLink',
                editQuickLink: 'http://localhost:32000/HubCrmServlet?servicecode=editQuickLink',
                queryLinkLogo: 'data/queryLinkLogojson.json',
                //queryLinkLogo:'/HubCrmServlet?servicecode=getStaticDataByCodeType_AGV',


                /*---------------调用SEC相关接口---------------------------*/
                //login
                checkEntityPermission: 'http://localhost:32000/HubCrmServlet?servicecode=checkEntityPermission',
                getMsgServerJsonString: 'http://localhost:32000/HubCrmServlet?servicecode=getMsgServerJsonString',
                login: 'http://localhost:32000/auth?servicecode=login',
                getOperInfo: 'http://web.crm.veris7.ai:30051/auth?servicecode=getOperInfo',
                loginMenuList: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=loginMenuList',
                logout: 'http://localhost:32000/auth?servicecode=logout ',
                getOperatorByCode: 'http://localhost:32000/HubCrmServlet?servicecode=getOperatorByCode',


                /*---------------调用CS相关接口---------------------------*/
                //notes and announcement
                //queryAllAnnouncementCount: 'http://web.crm.veris7.ai:30051/HubCrmServletcs?servicecode=queryAllAnnouncementCount',
                queryAllAnnouncementCount: '/ARIESRES/crm-bj/agentview/business/data/queryAllAnnouncementCount.json',
                //queryAllNotesCount: 'http://web.crm.veris7.ai:30051/HubCrmServletcs?servicecode=queryAllNotesCount',
                queryAllNotesCount: '/ARIESRES/crm-bj/agentview/business/data/queryAllNotesCount.json',
                modifyAnnouncementToRead: 'http://10.1.229.122:32604/HubCrmServletcs?servicecode=modifyAnnouncementToRead',
                modifyNotesToRead: 'http://10.1.229.122:32604/HubCrmServletcs?servicecode=modifyNotesToRead',
                returnNote: 'http://10.1.229.122:32604/HubCrmServletcs?servicecode=returnNote',
                deleteRecNotes: 'http://10.1.229.122:32604/HubCrmServletcs?servicecode=deleteRecNotes',
                createNotes: '/customerservice?servicecode=createNotes',
                queryAllAnnouncement: 'http://10.1.229.122:32604/HubCrmServletcs?servicecode=queryAllAnnouncement',
                queryAllNotes: 'http://10.1.229.122:32604/HubCrmServletcs?servicecode=queryAllNotes',
                getAnnouncementDetail: 'http://10.1.229.122:32604/HubCrmServletcs?servicecode=getAnnouncementDetail',
                //trouble ticket
                querytroubleticket: '/HubCrmServlet?servicecode=queryTroubleTicket',
                querytroubleticketnum: '/HubCrmServlet?servicecode=queryTroubleTicketBySpec',
                createticket: '/CS/cs/sr/inter/agentview/SrRecvMainForAgentView.jsp',
                ticketdetail: '/CS/cs/sr/inter/agentview/SrWorkItemBrowserForAgentView.jsp?serialId=',
                troubleticketlist: 'http://10.1.226.85:30054/crm-bj/trouble-ticket/list-for-customer/listForCustomer.html?customerId=',
                createtroubleticket: 'http://10.1.226.85:30054/crm-bj/trouble-ticket/create-ticket/newTicket.html?opId=',
                resetTroubleTicketInfo: '/HubCrmServlet?servicecode=resetTroubleTicketInfo',
                //查询知识库接口
                getPromptsByKeyWord: '/customerservice?servicecode=getPromptsByKeyWord',
                getArticlesByKeyWord: '/customerservice?servicecode=getArticlesByKeyWord',
                getKbDirectoryTree: '/customerservice?servicecode=getKbDirectoryTree',
                queryKbDoc: '/customerservice?servicecode=queryKbDoc',
                getArticleDetailById: '/customerservice?servicecode=getArticleDetailById',
                getRecommendArticles: '/ARIESRES/crm-bj/agentview/business/data/getRecommendArticles.json',
                saveKbScore: '/customerservice?servicecode=saveKbScore',
                queryKbScore: '/customerservice?servicecode=queryKbScore',
                kbsHomePageUrl: '/CS/portal.do?method=init',
                csFileService: '',
                querySubscribeTopicChannelList: '/customerservice?servicecode=QuerySubscribeTopicChannelList',
                subscribeKnowlegeArticle: '/customerservice?servicecode=AgentViewSubscribeKnowlega',
                queryAgentSubscription: '/customerservice?servicecode=QueryAgentSubscription',
                queryCatalog: '/customerservice?servicecode=queryCatalog',
                statisticPendingCaseNum: '/customerservice?servicecode=getPendingCaseNum',
                //statisticPendingCaseNum:'/agentView/data/statisticPendingCaseNum.json',


                /*-------------客户查询相关接口-----------------------------*/
                //调用CRM接口
                //customer
                queryCustomer: "http://10.1.231.8:32500/HubCrmServlet?servicecode=queryCustomer",
                identifyCustomer: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=identifyCustomer',
                querySubscriber: 'http://10.1.231.8:32500/HubCrmServlet?servicecode=querySubscriber',
                queryCustomerAccount: 'http://10.1.231.8:32500/HubCrmServlet?servicecode=queryCustomerAccount',
                acquireCustomer: 'http://10.1.231.8:32500/HubCrmServlet?servicecode=acquireCustomer',
                acquireCustomerBasicInfo: 'http://10.1.231.8:32500/HubCrmServlet?servicecode=acquireCustomerBasicInfo',
                acquireSubscriber: 'http://10.1.231.8:32500/HubCrmServlet?servicecode=acquireSubscriber',
                acquireShoppingCartInventory: 'http://10.1.231.8:32500/HubCrmServlet?servicecode=acquireShoppingCartInventory',
                identifyCustomerOrder: 'http://10.1.231.8:32500/HubCrmServlet?servicecode=identifyCustomerOrder',
                queryCustomerOrder: 'http://10.1.231.8:32500/HubCrmServlet?servicecode=queryCustomerOrder',
                acquireProductLine: 'http://10.1.231.8:32500/HubCrmServlet?servicecode=acquireProductLine',
                queryAddress: 'http://10.1.231.8:32500/HubCrmServlet?servicecode=queryAddress',
                //acquireAssignedManager:'/HubCrmServlet?servicecode=acquireAssignedManager',
                acquireAssignedManager: '/ARIESRES/crm-bj/agentview/business/data/acquireAssignedManager.json',
                queryEmployee: '/HubCrmCoreServlet?servicecode=queryEmployee',
                //调用Billing接口
                doGetCaInvIndexByInvoiceId: 'http://localhost:32000/HubCrmServlet?servicecode=doGetCaInvIndexByInvoiceId',
                doQueryByAccId: 'http://localhost:32000/HubCrmServlet?servicecode=doQueryByAccId',


                /*-------------其他相关接口---------------------------------*/
                //微信调用接口
                queryWebChat: 'http://124.207.3.113:32300/HubCrmServlet?servicecode=refreshWebChatContactAmount',
                queryWebHistoryChat: 'http://124.207.3.113:32300/HubCrmServlet?servicecode=queryWeChatHistory',
                updateWebChatHistory: 'http://124.207.3.113:32300/HubCrmServlet?servicecode=updateWeChatHistory',
                recordWebChatRecord: 'http://124.207.3.113:32300/HubCrmServlet?servicecode=recordWeChatHistory',
                //查询Campaign接口
                getCampaignNum: '/customerservice?servicecode=acquireTargetCampList',
                //查询商机数量接口
                getOpportunityNum: '/customerservice?servicecode=getOpportunityNum',

                getAllOrg: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=getAllOrg',
                getAllOperatorId: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=getAllOperatorId',

                /*----调用JSON数据------------------------------------------*/
                customerType: '/ARIESRES/crm-bj/agentview/business/data/customerType.json',
                customerState: '/ARIESRES/crm-bj/agentview/business/data/customerState.json',
                customerQueryCondition: '/ARIESRES/crm-bj/agentview/business/data/customerQueryCondition.json',
                loadSimpleTree: '/demo/data/loadSimpleTree.json',
                acquireCustomerInfo: '/demo/data/acquireCustomerInfo.json',
                loadTreeToAsync: '/test?servicecode=loadTreeToAsync',
                loadPhoneNumber: '/demo/data/loadPhoneNumber.json',
                queryPhoneNumber: '/demo/data/queryPhoneNumber.json',
                b2CCustomerDetail: '/ARIESRES/crm-bj/agentview/business/data/b2CCustomerDetail.json',
                b2CCustomerSubscriberDetail: '/ARIESRES/crm-bj/agentview/business/data/b2CCustomerSubscriberDetail.json',
                b2CCustomerSubscriberDetail01: '/ARIESRES/crm-bj/agentview/business/data/b2CCustomerSubscriberDetail01.json',
                statisticPendingCampaignNum: '/ARIESRES/crm-bj/agentview/business/data/statisticPendingCampaignNum.json',
                statisticPendingOrderNum: '/ARIESRES/crm-bj/agentview/business/data/statisticPendingOrderNum.json',
                statisticPendingOpportunityNum: '/ARIESRES/crm-bj/agentview/business/data/statisticPendingOpportunityNum.json',
                statisticPendingBasketNum: '/ARIESRES/crm-bj/agentview/business/data/statisticPendingBasketNum.json',
                b2CCustomerAccountDetail: '/ARIESRES/crm-bj/agentview/business/data/b2CCustomerAccountDetail.json',
                reckno: '/ARIESRES/crm-bj/agentview/business/data/reckno.json'
            },
            marketcampaign: {
                //campaign
                acquireCampaign: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=acquireCampaignSaas',
                querySharedListByFuzzyCond: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=querySharedListByFuzzyCondSaas',
                queryActivitySpecification: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=queryActivitySpecificationSaas',
                queryOfferingByCondition: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=queryOfferingByConditionSaas',
                queryCampListByCondition: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=queryCampListByConditionSaas',
                queryCampByCond: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=queryCampByCondSaas',
                queryCampaignByPreciseCond: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=queryCampaignByPreciseCondSaas',
                queryCampOfferRelaByCond: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=queryCampOfferRelaByCondSaas',
                queryCollateralByCond: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=queryCollateralByCondSaas',
                parseCampaignGraph: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=parseCampaignGraphSaas',
                queryFrequencyByCondition: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=queryFrequencyByConditionSaas',
                updateFreqParam: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=updateFreqParamSaas',
                designCampaign: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=designCampaignSaas',
                deleteMarketCampaignInfo: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=deleteMarketCampaignInfoSaas',
                suspendCampaign: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=suspendCampaignSaas',
                canceledCampaign: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=canceledCampaignSaas',
                recoverCampaign: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=recoverCampaignSaas',
                submitForApprove: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=submitForApproveSaas',
                forceLaunchOrDelay: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=forceLaunchOrDelaySaas',
                acquireActivityExecutingInfo: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=acquireActivityExecutingInfoSaas',
                queryOperationalDemo: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=queryOperationalDemoSaas',
                approveCampaign: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=approveCampaignSaas',
                acquireBusinessEvent: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=acquireBusinessEventSaas',
                queryBusinessEvent: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=queryBusinessEventSaas',

                queryEvent: '/crm-bj/mock-data/event-rule/eventChose.json',
                setCampFavorites: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=setCampaignFavoriteSaas',
                queryCampaignWithFavorite: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=queryCampaignWithFavoriteSaas',


                //segment
                querySegment: 'http://127.0.0.1:32000/marketing/resource/data/querySegmentByPreciseCond_response.jsonSaas',
                querySegmentByPreciseCond: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=querySegmentByPreciseCondSaas',
                queryMarketingAttribute: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=queryMarketingAttributeSaas',
                createMarketSegment: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=createMarketSegmentSaas',
                updateMarketSegment: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=updateMarketSegmentSaas',
                acquireMarketSegment: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=acquireMarketSegmentSaas',
                publishMarketSegment: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=publishMarketSegmentSaas',
                querySharedListByCondition: 'http://web.crm.veris7.ai:30051/HubCrmServlet?servicecode=querySharedListByConditionSaas',
                acquireSharedList: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=acquireSharedListSaas',
                deleteMarketSegment: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=deleteMarketSegmentSaas',
                querySharedListInfo: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=querySharedListInfoSaas',
                querySegmentViewDateBySql: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=querySegmentViewDateBySqlSaas',
                querySegtMemberBySegtMembListId: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=querySegtMemberBySegtMembListIdIntgrtSaas',
                deleteShareListMembers: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=deleteShareListMembersSaas',
                createSharedList: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=createSharedListSaas',
                updateSharedList: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=updateSharedListSaas',

                setSegtFavorites: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=setSegmentFavoriteSaas',
                querySegmentWithFavorite: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=querySegmentWithFavoriteSaas',
                deleteShareListMembers: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=deleteShareListMembersSaas',
                //createSharedList:'/HubCrmServlet?servicecode=createSharedListSaas',
                //updateSharedList:'/HubCrmServlet?servicecode=updateSharedListSaas',
                publishSharedList: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=publishSharedListSaas',
                deleteSharedList: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=deleteSharedListSaas',
                //dashboard
                acquireBudgetUsage: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=acquireBudgetUsageSaas',
                aquireCampaignLaunchVariation: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=aquireCampaignLaunchVariationSaas',
                aquireChannelDeliverability: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=aquireChannelDeliverabilitySaas',
                aquireCampaignDiachrony: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=aquireCampaignDiachronySaas',
                acquireCampaignBudget: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=acquireCampaignBudgetSaas',
                aquireChannelPerformance: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=aquireChannelPerformanceSaas',


                acquireTargetMonitorView: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=acquireTargetMonitorViewSaas',
                acquireCampMonitorView: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=acquireCampMonitorViewSaas',
                //event
                getSubscribeList: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=getSubscribeListSaas',
                startSubscribe: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=startSubscribeSaas',
                stopSubscribe: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=stopSubscribeSaas',
                cancelSubscribe: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=cancelSubscribeSaas',
                acquireCampaignByEventCondition: 'http://127.0.0.1:32000/HubCrmServlet?servicecode=acquireCampaignByEventConditionSaas',

                //process
                updateProcess: '/HubCrmServlet?servicecode=updateProcessSaas',

                //360 for agentView
                acquireTargetCampList: '/HubCrmServlet?servicecode=acquireTargetCampListSaas',

                //offerUrl
                offerUrl: 'http://10.1.231.7:8083/ARIESRES/veris7/OfferMain.html?offeringType=1&offeringId=',
                //login
                getOperInfo: 'http://web.crm.veris7.ai:30051/auth?servicecode=getOperInfo'

            }
        }
    });

    //})(jQuery);
});