define(function (require, exports, moudles) {
//;(function($, undefined){

    $.extend($.aries, {
        service : {
            tt : {
                //查询历史工单 - queryTroubleTicket
                queryTroubleTicket : '/HubCrmServlet?servicecode=queryTroubleTicketSaas',
                queryTroubleTicketPriority : '/ARIESRES/crm-bj/mock-data/trouble-ticket/queryTroubleTicketPriority.json',
                queryTroubleTicketTmlmtState : '/ARIESRES/crm-bj/mock-data/trouble-ticket/queryTroubleTicketTmlmtState.json',
                queryTroubleTicketProcessState : '/ARIESRES/crm-bj/mock-data/trouble-ticket/queryTroubleTicketProcessState.json',
                queryTroubleTicketMassFlag : '/ARIESRES/crm-bj/mock-data/trouble-ticket/queryTroubleTicketMassFlag.json',
                //查询工单类型 － queryTroubleTicketType
                queryTroubleTicketType : '/HubCrmServlet?servicecode=queryTroubleTicketTypeSaas',
                //查询工单模板 - acquireTroubleTicketSpec
                acquireTroubleTicketSpec : '/HubCrmServlet?servicecode=acquireTroubleTicketSpecSaas',
                //查询组织关系，暂无服务
                queryTroubleCreatorInfo : '/ARIESRES/crm-bj/mock-data/trouble-ticket/queryTroubleCreatorInfo.json',
                //查询返回一个新的TT展示流水号 - generateTroubleTicketShowSerialNo
                generateTroubleTicketShowSerialNo : '/HubCrmServlet?servicecode=generateTroubleTicketShowSerialNoSaas',
                //查询大面积故障列表，创建从单的时候选择主单使用 - queryTroubleTicketForMass
                queryTroubleTicketForMass : '/HubCrmServlet?servicecode=queryTroubleTicketForMassSaas',
                //根据员工号查询当前TODO的TT单总数 - queryTicketStatistic
                queryTicketStatistic : '/HubCrmServlet?servicecode=queryTicketStatisticSaas',
                //创建普通单 - submitTroubleTicket
                submitTroubleTicket : '/HubCrmServlet?servicecode=submitTroubleTicketSaas',
                //创建草稿单 - saveTroubleTicket
                saveTroubleTicket : '/HubCrmServlet?servicecode=saveDraftTroubleTicketSaas',
                //directReplyTroubleTicket
                directReplyTroubleTicket : '/HubCrmServlet?servicecode=directReplyTroubleTicketSaas',
                //查询客户信息 - queryCustomerForTicket
                queryCustomerForTicket : '/HubCrmCoreServlet?servicecode=queryCustomer',
                //
                querySubscriberForTicket:'/HubCrmCoreServlet?servicecode=querySubscriber',
                //查询相似工单 - querySimilarTroubleTicket
                querySimilarTroubleTicket : '/HubCrmServlet?servicecode=querySimilarTroubleTicketSaas',
                //查询重复工单 - queryRepeatTroubleTicket
                queryRepeatTroubleTicket : '/HubCrmServlet?servicecode=queryRepeatTroubleTicketSaas',
                //工单详情 - acquireTroubleTicketCompleteInfo
                acquireTroubleTicketCompleteInfo : '/HubCrmServlet?servicecode=acquireTroubleTicketCompleteInfoSaas',
                //查询工单列表 - queryTroubleTicketBySpec
                //queryTroubleTicketBySpec : '/crm-bj/mock-data/trouble-ticket/queryTroubleTicketBySpec.json',
                queryTroubleTicketBySpec : '/HubCrmServlet?servicecode=queryTicketBySpecSaas',
                //troubleShoot 暂无服务
                troubleShoot : '/ARIESRES/crm-bj/mock-data/trouble-ticket/troubleShoot.json',
                //认领工单 - claimWorkItem
                claimWorkItem : '/HubCrmServlet?servicecode=claimWorkItemSaas',
                //强制认领工单 -  forceClaimWorkItemSaas
                forceClaimWorkItem : '/HubCrmServlet?servicecode=forceClaimWorkItemSaas',
                //处理工单 - performWorkItem
                performWorkItem : '/HubCrmServlet?servicecode=performWorkItemSaas',
                //取消工单 - cancelTroubleTicket
                cancelTroubleTicket : '/HubCrmServlet?servicecode=cancelTroubleTicketSaas',
                //关闭工单 - closeTroubleTicket
                closeTroubleTicket : '/HubCrmServlet?servicecode=closeTroubleTicketSaas',
                //委托工单 - transferWorkItem
                transferWorkItem : '/HubCrmServlet?servicecode=transferWorkItemSaas',
                //休眠工单 - suspendWorkItem
                suspendWorkItem : '/HubCrmServlet?servicecode=suspendWorkItemSaas',
                //激活工单 - resumeWorkItem
                resumeWorkItem : '/HubCrmServlet?servicecode=resumeWorkItemSaas',
                //释放工单 - releaseWorkItem
                releaseWorkItem : '/HubCrmServlet?servicecode=releaseWorkItemSaas',
                //重启工单 - rebootTroubleTicket
                rebootTroubleTicket : '/HubCrmServlet?servicecode=rebootTroubleTicketSaas',
                //修改工单 - modifyTroubleTicket
                modifyTroubleTicket : '/HubCrmServlet?servicecode=modifyTroubleTicketSaas',
                //创单设定截止时间 -  totalTmlmtLen
                totalTmlmtLen : '/ARIESRES/crm-bj/mock-data/trouble-ticket/totalTmlmtLen.json',
                //从单关联主单
                attachFollowTroubleTicket:'/HubCrmServlet?servicecode=attachFollowTroubleTicketSaas',
                //上传服务
                uploadForTicket :'http://hub.crm.veris7.ai:32000/TroubleTicketServlet?servicecode=upload',
                //导入受影响人Excel
                importTroubleTicketAffectCust :'http://hub.crm.veris7.ai:32000/TroubleTicketServlet?servicecode=importTroubleTicketAffectCust',
                //查询流程转向规则
                calcTransitionByRule:'/HubCrmServlet?servicecode=calcTransitionByRuleSaas',
                //发送消息
                sendMessageForTicket : '/HubCrmServlet?servicecode=sendMessageForTicketSaas',
                //获取操作员
                getOperInfo: '/auth?servicecode=getOperInfo',
                //获取客户媒介信息
                queryCustomerContactMedium: '/HubCrmCoreServlet?servicecode=queryCustomerContactMedium',
                //删除草稿工单
                deleteDraftTroubleTicket:'/HubCrmServlet?servicecode=deleteDraftTroubleTicketSaas',
                // 查询所有关联主单的从单
                queryRelatedFollowTicket:'/HubCrmServlet?servicecode=queryRelatedFollowTicketSaas',
                // 查询需要导出的工单
                queryExportTicketBySpec:'/HubCrmServlet?servicecode=queryExportTicketBySpecSaas',
                //添加收藏工单
                addTroubleTicketTypeToFavorite:'/HubCrmServlet?servicecode=addTroubleTicketTypeToFavoriteSaas',
                //删除收藏工单
                removeTroubleTicketTypeFromFavorite:'/HubCrmServlet?servicecode=removeTroubleTicketTypeFromFavoriteSaas',
                //更新个人收藏夹中工单类型顺序
                updateTroubleTicketTypeFavoriteOrder:'/HubCrmServlet?servicecode=updateTroubleTicketTypeFavoriteOrderSaas',
                //查询个人收藏工单类型
                queryTroubleTicketTypeForFavorite:'/HubCrmServlet?servicecode=queryTroubleTicketTypeForFavoriteSaas',
                //查询个人TopN工单类型
                queryTroubleTicketTypeForTopN:'/HubCrmServlet?servicecode=queryTroubleTicketTypeForTopNSaas',
                //分离从单
            	detachFollowTroubleTicket:'/HubCrmServlet?servicecode=detachFollowTroubleTicketSaas'

            },
            pushc : {
                //查询运营平台
                queryOperationPlatformForSaas : '/HubCrmServlet?servicecode=queryOperationPlatformForSaas',
                //添加运营平台
                addOperationPlatformForSaas : '/HubCrmServlet?servicecode=addOperationPlatformForSaas',
                //删除运营平台
                deleteOperationPlatformForSaas : '/HubCrmServlet?servicecode=deleteOperationPlatformForSaas' ,
                //修改运营平台
                updateOperationPlatformForSaas : '/HubCrmServlet?servicecode=updateOperationPlatformForSaas' ,
                //运营平台查询回显
                acquireOperationPlatformForSaas : '/HubCrmServlet?servicecode=acquireOperationPlatformForSaas' ,
                //查询通知模板
                queryNotificationTemplateForSaas :'/HubCrmServlet?servicecode=queryNotificationTemplateForSaas' ,
                //激活媒体类型
                addOpPfrmMedSpecRelForSaas : '/HubCrmServlet?servicecode=addOpPfrmMedSpecRelForSaas' ,
                //媒体类型查询回显
                acquireOpPfrmMedSpecRelForSaas: '/HubCrmServlet?servicecode=acquireOpPfrmMedSpecRelForSaas' ,
                //修改媒体类型
                updateOpPfrmMedSpecRelForSaas: '/HubCrmServlet?servicecode=updateOpPfrmMedSpecRelForSaas' ,
                //媒体类型的开关
                switchOpPfrmMediumTypeForSaas: '/HubCrmServlet?servicecode=switchOpPfrmMediumTypeForSaas' ,
                //新增联系媒介
                addContactMediumForSaas : '/HubCrmServlet?servicecode=addContactMediumForSaas' ,
                //查询联系媒介
                acquireContactMediumByIdForSaas : '/HubCrmServlet?servicecode=acquireContactMediumByIdForSaas',
                //检验联系媒介名称唯一性
                checkContactMediumNameForSaas:'/HubCrmServlet?servicecode=checkContactMediumNameForSaas',
                //检验运营平台名称唯一性
                checkOperationPlatformNameForSaas:'/HubCrmServlet?servicecode=checkOperationPlatformNameForSaas',
                //新增业务模块
                addBusinessModuleForSaas:'/HubCrmServlet?servicecode=addBusinessModuleForSaas',
                //查询所有业务模块
                queryAllBusinessModuleForSaas:'/HubCrmServlet?servicecode=queryAllBusinessModuleForSaas',
                //修改业务模块信息
                updateBusinessModuleForSaas:'/HubCrmServlet?servicecode=updateBusinessModuleForSaas',
                //删除业务模块信息
                deleteBusinessModuleForSaas:'/HubCrmServlet?servicecode=deleteBusinessModuleForSaas',
                //查询业务模块信息
                acquireBusinessModuleForSaas:'/HubCrmServlet?servicecode=acquireBusinessModuleForSaas', 
                //加载运营平台信息
                queryContactMediumForSaas : '/HubCrmServlet?servicecode=queryContactMediumForSaas',
                //修改联系媒介
                updateContactMediumForSaas : '/HubCrmServlet?servicecode=updateContactMediumForSaas',
                //删除联系媒介
                deleteContactMediumForSaas : '/HubCrmServlet?servicecode=deleteContactMediumForSaas',
                //查询静态数据
                queryStaticDataForSaas : '/HubCrmServlet?servicecode=queryStaticDataForSaas',
                //查询业务模块列表
                queryAllBusinessModuleForSaas: '/HubCrmServlet?servicecode=queryAllBusinessModuleForSaas',
                //编辑业务模块
                updateBusinessModuleForSaas: '/HubCrmServlet?servicecode=updateBusinessModuleForSaas',
                //删除业务模块
                deleteBusinessModuleForSaas: '/HubCrmServlet?servicecode=deleteBusinessModuleForSaas',
                //根据ID查询业务模块
                acquireBusinessModuleForSaas: '/HubCrmServlet?servicecode=acquireBusinessModuleForSaas',
                //查询通知模板
                queryNotificationTemplateForSaas: '/HubCrmServlet?servicecode=queryNotificationTemplateForSaas',
                //查询业务模块类型
                queryBusinessModuleTypeForSaas: '/HubCrmServlet?servicecode=queryBusinessModuleTypeForSaas',
                //校验业务模块名称
                checkBusinessModuleNameForSaas: '/HubCrmServlet?servicecode=checkBusinessModuleNameForSaas',
                //校验业务模块缩写
                checkBusinessModuleAbbreviationForSaas: '/HubCrmServlet?servicecode=checkBusinessModuleAbbreviationForSaas',
                //查询静态数据（单个）
                queryStaticDataForSaas: '/HubCrmServlet?servicecode=queryStaticDataForSaas',
                //根据ID查询通知
                acquireNotificationForSaas : '/HubCrmServlet?servicecode=acquireNotificationForSaas',
                //查询通知参数
                queryNotificationParamForSaas : '/HubCrmServlet?servicecode=queryNotificationParamForSaas',
                //校验通知编码
                checkNotificationCodeForSaas : '/HubCrmServlet?servicecode=checkNotificationCodeForSaas',
                //校验通知名称
                checkNotificationNameForSaas : '/HubCrmServlet?servicecode=checkNotificationNameForSaas',
                //根据条件查询通知列表
                queryNotificationByConditionForSaas : '/HubCrmServlet?servicecode=queryNotificationByConditionForSaas',
                //查询PushCommunication业务域的业务数据枚举值
                queryPushBusiDataForSaas: '/HubCrmServlet?servicecode=queryPushBusiDataForSaas',
                //查询联系媒介规格
                queryContactMediumSpecForSaas: '/HubCrmServlet?servicecode=queryContactMediumSpecForSaas',
                //查询模板信息
                acquirePushTemplateForSaas: '/HubCrmServlet?servicecode=acquirePushTemplateForSaas',
                //新增通知
                addNotificationForSaas: '/HubCrmServlet?servicecode=addNotificationForSaas',
                //编辑通知
                updateNotificationForSaas: '/HubCrmServlet?servicecode=updateNotificationForSaas',
                //删除通知
                deleteNotificationForSaas: '/HubCrmServlet?servicecode=deleteNotificationForSaas',
                //打开或关闭通知开关
                switchNotificationForSaas: '/HubCrmServlet?servicecode=switchNotificationForSaas',
                //查询展示Twitter详情
                acquireTwitterForSaas: '/HubCrmServlet?servicecode=acquireTwitterForSaas',
                //查询展示SMS详情
                acquireSmsForSaas: '/HubCrmServlet?servicecode=acquireSmsForSaas',
                //查询展示Email详情
                acquireEmailForSaas: '/HubCrmServlet?servicecode=acquireEmailForSaas',
                //查询展示Rtss详情
                acquireRtssForSaas: '/HubCrmServlet?servicecode=acquireRtssForSaas',
                //根据条件查询baseInfo
                queryMsgbaseInfoByConditionForSaas: '/HubCrmServlet?servicecode=queryMsgbaseInfoByConditionForSaas',
                //根据MsgId查询Task
                acquireTaskByMsgIdForSaas: '/HubCrmServlet?servicecode=acquireTaskByMsgIdForSaas',
                //查询TaskLog
                queryTaskLogForSaas: '/HubCrmServlet?servicecode=queryTaskLogForSaas',
                //查询静态数据（多个）
                queryMultiStaticDataForSaas: '/HubCrmServlet?servicecode=queryMultiStaticDataForSaas',
                //查询BusinessCommon业务域的业务数据枚举值
                queryBusiCommonBusiDataForSaas: '/HubCrmServlet?servicecode=queryBusiCommonBusiDataForSaas',
                //打开或关闭业务模块开关
                switchBusinessModuleForSaas: '/HubCrmServlet?servicecode=switchBusinessModuleForSaas',
                //查询有效的可下行的联系媒介
                queryAssociatedContactMediumForSaas: '/HubCrmServlet?servicecode=queryAssociatedContactMediumForSaas',
                //生成二维码
                generateQrcodeForSaas: '/HubCrmServlet?servicecode=generateQrcodeForSaas',
                //生成条形码
                generateBarcodeForSaaS: '/HubCrmServlet?servicecode=generateBarcodeForSaaS'
            },
      marketcampaign : {
                //campaign
                acquireCampaign:'/HubCrmServlet?servicecode=acquireCampaignSaas',
                querySharedListByFuzzyCond:'/HubCrmServlet?servicecode=querySharedListByFuzzyCondSaas',
                queryActivitySpecification:'/HubCrmServlet?servicecode=queryActivitySpecificationSaas',
                queryOfferingByCondition:'/HubCrmServlet?servicecode=queryOfferingByConditionSaas',
                queryCampListByCondition:'/HubCrmServlet?servicecode=queryCampListByConditionSaas',
                queryCampByCond:'/HubCrmServlet?servicecode=queryCampByCondSaas',
                queryCampaignByPreciseCond:'/HubCrmServlet?servicecode=queryCampaignByPreciseCondSaas',
                queryCampOfferRelaByCond:'/HubCrmServlet?servicecode=queryCampOfferRelaByCondSaas',
                queryCollateralByCond:'/HubCrmServlet?servicecode=queryCollateralByCondSaas',
                parseCampaignGraph:'/HubCrmServlet?servicecode=parseCampaignGraphSaas',
                queryFrequencyByCondition:'/HubCrmServlet?servicecode=queryFrequencyByConditionSaas',
                updateFreqParam:'/HubCrmServlet?servicecode=updateFreqParamSaas',
                designCampaign:'/HubCrmServlet?servicecode=designCampaignSaas',
                deleteMarketCampaignInfo:'/HubCrmServlet?servicecode=deleteMarketCampaignInfoSaas',
                suspendCampaign:'/HubCrmServlet?servicecode=suspendCampaignSaas',
                canceledCampaign:'/HubCrmServlet?servicecode=canceledCampaignSaas',
                recoverCampaign:'/HubCrmServlet?servicecode=recoverCampaignSaas',
                submitForApprove:'/HubCrmServlet?servicecode=submitForApproveSaas',
                forceLaunchOrDelay:'/HubCrmServlet?servicecode=forceLaunchOrDelaySaas',
                acquireActivityExecutingInfo:'/HubCrmServlet?servicecode=acquireActivityExecutingInfoSaas',
                queryOperationalDemo:'/HubCrmServlet?servicecode=queryOperationalDemoSaas',
                approveCampaign:'/HubCrmServlet?servicecode=approveCampaignSaas',
                acquireBusinessEvent:'/HubCrmServlet?servicecode=acquireBusinessEventSaas',
                queryBusinessEvent:'/HubCrmServlet?servicecode=queryBusinessEventSaas',
                setCampFavorites:'/HubCrmServlet?servicecode=setCampaignFavoriteSaas',
                queryCampaignWithFavorite:'/HubCrmServlet?servicecode=queryCampaignWithFavoriteSaas',
                
                acquireTargetMonitorView:'/HubCrmServlet?servicecode=acquireTargetMonitorViewSaas',
                acquireCampMonitorView:'/HubCrmServlet?servicecode=acquireCampMonitorViewSaas',
                acquireMonitorTaskList:'/HubCrmServlet?servicecode=acquireMonitorTaskListSaas',
                

                //segment
                querySegment:'/marketing/resource/data/querySegmentByPreciseCond_response.jsonSaas',
                querySegmentByPreciseCond:'/HubCrmServlet?servicecode=querySegmentByPreciseCondSaas',
                queryMarketingAttribute:'/HubCrmServlet?servicecode=queryMarketingAttributeSaas',
                createMarketSegment:'/HubCrmServlet?servicecode=createMarketSegmentSaas',
                updateMarketSegment:'/HubCrmServlet?servicecode=updateMarketSegmentSaas',
                acquireMarketSegment:'/HubCrmServlet?servicecode=acquireMarketSegmentSaas',
                publishMarketSegment:'/HubCrmServlet?servicecode=publishMarketSegmentSaas',
                querySharedListByCondition:'/HubCrmServlet?servicecode=querySharedListByConditionSaas',
                acquireSharedList:'/HubCrmServlet?servicecode=acquireSharedListSaas',
                deleteMarketSegment:'/HubCrmServlet?servicecode=deleteMarketSegmentSaas',
                querySharedListInfo:'/HubCrmServlet?servicecode=querySharedListInfoSaas',
                querySegmentViewDateBySql:'/HubCrmServlet?servicecode=querySegmentViewDateBySqlSaas',
                querySegtMemberBySegtMembListId:'/HubCrmServlet?servicecode=querySegtMemberBySegtMembListIdIntgrtSaas',
                publishSharedList:'/HubCrmServlet?servicecode=publishSharedListSaas',
                deleteSharedList:'/HubCrmServlet?servicecode=deleteSharedListSaas',
                deleteSegmentMemberBatch:'/HubCrmServlet?servicecode=deleteSegmentMemberBatchSaas',
                setSegtFavorites:'/HubCrmServlet?servicecode=setSegmentFavoriteSaas',
                querySegmentWithFavorite:'/HubCrmServlet?servicecode=querySegmentWithFavoriteSaas',
                deleteShareListMembers:'/HubCrmServlet?servicecode=deleteShareListMembersSaas',
                createSharedList:'/HubCrmServlet?servicecode=createSharedListSaas',
                updateSharedList:'/HubCrmServlet?servicecode=updateSharedListSaas',
                queryValOpSelectionByCondition:'/HubCrmServlet?servicecode=queryValOpSelectionByConditionSaas',

                //dashboard
                acquireBudgetUsage:'/HubCrmServlet?servicecode=acquireBudgetUsageSaas',
                aquireCampaignLaunchVariation:'/HubCrmServlet?servicecode=aquireCampaignLaunchVariationSaas',
                aquireChannelDeliverability:'/HubCrmServlet?servicecode=aquireChannelDeliverabilitySaas',
                aquireCampaignDiachrony:'/HubCrmServlet?servicecode=aquireCampaignDiachronySaas',
                acquireCampaignBudget:'/HubCrmServlet?servicecode=acquireCampaignBudgetSaas',
                aquireChannelPerformance:'/HubCrmServlet?servicecode=aquireChannelPerformanceSaas',
                
                //process
                updateProcess:'/HubCrmServlet?servicecode=updateProcessSaas',
                forceCloseProcess:'/HubCrmServlet?servicecode=forceCloseProcessSaas',
                //360 for agentView
                acquireTargetCampList:'/HubCrmServlet?servicecode=queryTargetCampaignByConditionSaas',
                queryTargetCampNum:'/HubCrmServlet?servicecode=queryTargetCampNumSaas',
                
                //offerUrl
                offerUrl:'http://10.1.236.47:8082/ARIESRES/veris7/Main71.html?customerValue=',
                //event
                getSubscribeList:'/HubCrmServlet?servicecode=getSubscribeListSaas',
				startSubscribe:'/HubCrmServlet?servicecode=startSubscribeSaas',
				stopSubscribe:'/HubCrmServlet?servicecode=stopSubscribeSaas',
				cancelSubscribe:'/HubCrmServlet?servicecode=cancelSubscribeSaas',
				acquireCampaignByEventCondition:'/HubCrmServlet?servicecode=acquireCampaignByEventConditionSaas',

                //login
                getOperInfo:'/auth?servicecode=getOperInfo'
                    
            },
            agentview : {
                /*------------页面调用相关URL------------------------------*/
                timelineurl: 'http://nj.web.crm.veris7.ai:8082/ARIESRES/veris7/newsubscription/TimeLineForAgentView.html?customerId=',
                customerviewurl: 'http://nj.web.crm.veris7.ai:8082/ARIESRES/veris7/newsubscription/CustomerView.html?customerId=',
                newuserurl: 'http://nj.web.crm.veris7.ai:8082/ARIESRES/veris7/Main.html?customerId=',
                shopcarturl: 'http://nj.web.crm.veris7.ai:8082/ARIESRES/veris7/newsubscription/ShoppingCart.html?customerId=',
                addcustomerurl: 'http://nj.web.crm.veris7.ai:8082/ARIESRES/veris7/Main.html',
                b2bcustomerviewurl: 'http://nj.web.crm.veris7.ai:8082/ARIESRES/veris7/customer/View360.html?customerId=',
                b2btimelineurl: 'http://nj.web.crm.veris7.ai:8082/ARIESRES/veris7/marketingresource/Timeline.html?customerId=',
                b2bCustomerManagement: 'http://nj.web.crm.veris7.ai:8082/ARIESRES/veris7/customer/queryOrganization.html?customerId=',
                b2bCreateCustomer: 'http://nj.web.crm.veris7.ai:8082/ARIESRES/veris7/customer/AddOrganization.html',
                globleView:'http://billing.crm.veris7.ai:8284/AcctMgnt/page-ng/account/account.jsp#/index?businessId=',

                /*------AgentView内部接口----------------------------------*/
                //AgentSticky
                queryAgentSticky: '/HubCrmServlet?servicecode=queryAgentSticky',
                saveAgentSticky: "/HubCrmServlet?servicecode=saveAgentSticky",
                //Remind
                queryRemind: '/HubCrmServlet?servicecode=queryRemind',
                readRemind: '/HubCrmServlet?servicecode=readRemind',
                addRemind: '/HubCrmServlet?servicecode=addRemind',
                deleteRemind: '/HubCrmServlet?servicecode=deleteRemind',
                deleteRemindByCode: '/HubCrmServlet?servicecode=deleteRemindByCode',
                //CustomerSearchRecord
                addCustomerSearchRecord: '/HubCrmServlet?servicecode=addCustomerSearchRecord',
                queryCustomerHistory: '/HubCrmServlet?servicecode=queryCustomerSearchRecord',
                //quicklink
                queryQuickLinks: '/HubCrmServlet?servicecode=queryQuickLink',
                saveQuickLinks: '/HubCrmServlet?servicecode=saveQuickLink',
                deleteQuickLink: '/HubCrmServlet?servicecode=deleteQuickLink',
                editQuickLink: '/HubCrmServlet?servicecode=editQuickLink',
                queryLinkLogo: 'data/queryLinkLogojson.json',
                //queryLinkLogo:'/HubCrmServlet?servicecode=getStaticDataByCodeType_AGV',


                /*---------------调用SEC相关接口---------------------------*/
                //login
                checkEntityPermission: '/HubCrmServlet?servicecode=checkEntityPermission',
                getMsgServerJsonString: '/HubCrmServlet?servicecode=getMsgServerJsonString',
                login: '/auth?servicecode=login',
                getOperInfo: '/auth?servicecode=getOperInfo',
                loginMenuList: '/HubCrmServlet?servicecode=loginMenuList',
                logout: '/auth?servicecode=logout ',
                getOperatorByCode: '/HubCrmServlet?servicecode=getOperatorByCode',


                /*---------------调用CS相关接口---------------------------*/
                //notes and announcement
//              queryAllAnnouncementCount: 'http://10.1.229.122:32500/HubCrmServletcs?servicecode=queryAllAnnouncementCount',
                queryAllAnnouncementCount:'/ARIESRES/crm-bj/agentview/business/data/queryAllAnnouncementCount.json',
//              queryAllNotesCount: 'http://10.1.229.122:32500/HubCrmServletcs?servicecode=queryAllNotesCount',
                queryAllNotesCount: '/ARIESRES/crm-bj/agentview/business/data/queryAllNotesCount.json',
                modifyAnnouncementToRead: 'http://10.1.229.122:32500/HubCrmServletcs?servicecode=modifyAnnouncementToRead',
                modifyNotesToRead: 'http://10.1.229.122:32500/HubCrmServletcs?servicecode=modifyNotesToRead',
                returnNote: 'http://10.1.229.122:32500/HubCrmServletcs?servicecode=returnNote',
                deleteRecNotes: 'http://10.1.229.122:32500/HubCrmServletcs?servicecode=deleteRecNotes',
                createNotes: '/customerservice?servicecode=createNotes',
                queryAllAnnouncement: 'http://10.1.229.122:32500/HubCrmServletcs?servicecode=queryAllAnnouncement',
                queryAllNotes: 'http://10.1.229.122:32500/HubCrmServletcs?servicecode=queryAllNotes',
                getAnnouncementDetail: 'http://10.1.229.122:32500/HubCrmServletcs?servicecode=getAnnouncementDetail',
                //trouble ticket
                querytroubleticket: '/HubCrmServlet?servicecode=queryTroubleTicket',
                querytroubleticketnum: '/HubCrmServlet?servicecode=queryTroubleTicketBySpecSaas',
                createticket: '/ARIESRES/crm-bj/trouble-ticket/troubleTicket.html?opFlag=new&opId=',
                ticketdetail: '/CS/cs/sr/inter/agentview/SrWorkItemBrowserForAgentView.jsp?serialId=',
                troubleticketlist: '/ARIESRES/crm-bj/trouble-ticket/troubleTicket.html?opFlag=customer&customerId=',

                createtroubleticket: '/ARIESRES/crm-bj/trouble-ticket/create-ticket/newTicket.html?opId=',
                resetTroubleTicketInfo: '/HubCrmServlet?servicecode=resetTroubleTicketSaas',
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
                updateCustomer:"/HubCrmServlet?servicecode=updateCustomer",
                queryCustomer: "/HubCrmCoreServlet?servicecode=queryCustomer",
                identifyCustomer: '/HubCrmCoreServlet?servicecode=identifyCustomer',
                querySubscriber: '/HubCrmCoreServlet?servicecode=querySubscriber',
                queryCustomerAccount: '/HubCrmCoreServlet?servicecode=queryCustomerAccount',
                acquireCustomer: '/HubCrmCoreServlet?servicecode=acquireCustomer',
                acquireCustomerBasicInfo: '/HubCrmCoreServlet?servicecode=acquireCustomerBasicInfo',
                acquireSubscriber: '/HubCrmCoreServlet?servicecode=acquireSubscriber',
                acquireShoppingCartInventory: '/HubCrmCoreServlet?servicecode=acquireShoppingCartInventory',
                identifyCustomerOrder: '/HubCrmCoreServlet?servicecode=identifyCustomerOrder',
                queryCustomerOrder: '/HubCrmCoreServlet?servicecode=queryCustomerOrder',
                acquireProductLine: '/HubCrmCoreServlet?servicecode=acquireProductLine',
                queryAddress: '/HubCrmCoreServlet/HubCrmServlet?servicecode=queryAddress',
                //acquireAssignedManager:'/HubCrmServlet?servicecode=acquireAssignedManager',
                acquireAssignedManager: '/ARIESRES/crm-bj/agentview/business/data/acquireAssignedManager.json',
                queryEmployee: '/HubCrmCoreServlet?servicecode=queryEmployee',
                createBusinessInteraction: '/HubCrmCoreServlet?servicecode=createBusinessInteraction',
                //调用Billing接口
                doGetCaInvIndexByInvoiceId: '/HubCrmServlet?servicecode=doGetCaInvIndexByInvoiceId',
                doQueryByAccId: '/HubCrmServlet?servicecode=doQueryByAccId',


                /*-------------其他相关接口---------------------------------*/
                //微信调用接口
                queryWebChat: 'http://124.207.3.113:32300/HubCrmServlet?servicecode=refreshWebChatContactAmount',
                queryWebHistoryChat: 'http://124.207.3.113:32300/HubCrmServlet?servicecode=queryWeChatHistory',
                updateWebChatHistory: 'http://124.207.3.113:32300/HubCrmServlet?servicecode=updateWeChatHistory',
                recordWebChatRecord: 'http://124.207.3.113:32300/HubCrmServlet?servicecode=recordWeChatHistory',
                //查询Campaign接口
                getCampaignNum: '/HubCrmServlet?servicecode=queryTargetCampNumSaas',
                //查询商机数量接口
                getOpportunityNum: '/HubCrmServlet?servicecode=getOpptyCountFor360View',
                
                //选操作员接口
                getAllOrg:'/HubCrmServlet?servicecode=getAllOrg',
                getAllOperatorId:'/HubCrmServlet?servicecode=getAllOperatorId',


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
            }
            
        }
    });

//})(jQuery);
});