/*
 * @Author: liutianjiao
 * @Date:
 * @LastEditTime: 2021-08-31 15:40:48
 * @LastEditors: liutianjiao
 * @Description: 生产环境-项目所有请求url
 * @FilePath: \WN-ATOM\src\utils\request-urls-prod-nw.js
 */
//消息监听地址
const TopicConstant={
    ip:"10.25.1.62",
    port: 15674,
    url: "ws://10.25.1.62:15674/ws,ws://10.25.1.63:15674/ws,ws://10.25.1.64:15674/ws",
    username:"admin",
    password:"AT0M_82325o5o",
}

//登录IP(姜浩)
const loginIP = "http://10.25.1.55:80";
//网关IP
const netIp = "http://10.25.1.10:80";



const ReqUrls = {
    //用户登录
    loginUrl: loginIP+"/uuma-server/client/login",
    loginVerifyUrl: loginIP+"/uuma-server/user/verify-password",
     //用户信息上传
    postUserInfoUrl: netIp+"/uuma-server/online/keepalive",
    //根据用户id获取可跳转系统
    systemListUrl: netIp+"/hydrogen-flight-monitor-server-cache/user/system/",
    //方向列表
    directionListUrl: netIp+"/hydrogen-flight-monitor-server-cache/crs/direction",
    
    //缩略地图
    mapUrl: "http://10.25.1.51:8081/#/map",
    mapWebUrl: "http://10.25.1.51:8082/#/map",
    //根据方案id获取正式发布方案数据,用于正式发布的方案调整页面初始化回显示和客户端回显
    schemeDataByIdForUpdateUrl: netIp+"/scheme-flow-server/implementTactics/",
    
    //根据modalId获取方案详情
    schemeDetailByIdUrl: netIp+"/hydrogen-flight-monitor-server-cache/implementTacticDetails/",
    //获取--方案列表
    schemeListUrl: netIp+"/hydrogen-flight-monitor-server-cache/implementTactics",
    //获取--模拟方案详情
    simulationSchemeDetailUrl:netIp+"/scheme-flow-server/simulationTactics/id/",
    // 获取方案模板数据
    schemeTemplateDataUrl: netIp+"/user-template-rest/template/user/",
    
    //获取--航班列表数据(id为空)
    // flightsDataNoIdUrl: clearanceIP+"/hydrogen-flight-monitor-server/influence/flights/",
    flightsDataNoIdUrl: netIp+"/hydrogen-flight-monitor-server-cache/influence/flights/",
    //获取--执行KPI数据(孔凡续)
    executeKPIDataUrl: netIp+"/kpi/",
    
    //获取总体监控-航班执行数据
    performanceDataUrl: netIp+"/hydrogen-traffic-flow-performance-retrieval-server/monitor/nw/v1/flight/areaname",
    // 总体监控-获取限制数据
    restrictionDataUrl: netIp+"/scheme-flow-server/implementTactics/statistics",
    // 获取用户订阅的容流监控单元数据
    userSubscribeCapacityFlowMonitorUnitDataUrl: netIp+"/user-template-rest/template/user/",
    // 获取容流数据
    capacityFlowMonitorDataUrl: netIp+"/traffic-flow-capacity-restful/capacity/v1/flow",
    // 获取容流气象数据
    capacityFlowMonitorWeatherDataUrl: netIp+"/atom-airport-weather-collect-server/airport/weather/search/nw",
    //获取流控数据(ATOM新增)
    ATOMCreateDataUrl: netIp+"/scheme-flow-server/restrictions/create/",
    //获取流控数据(ATOM变更)
    ATOMModifyDataUrl: netIp+"/scheme-flow-server/restrictions/modify/",
    //获取流控数据(NTFM新增)
    //NTFMCreateDataUrl: schemeIP+"/restrictions/createNtfm/",
    NTFMCreateDataUrl: netIp+"/scheme-flow-server/restrictions/createNtfm/",

    //获取流控数据(NTFM变更)
    NTFMModifyDataUrl: netIp+"/scheme-flow-server/restrictions/modifyNtfm/",
    //创建方案(外区流控导入)-数据提交
    importSchemeUrl: netIp+"/scheme-flow-server/simulationTactics/import/sim/",
    // 创建和修改方案-数据提交
    createSchemeUrl: netIp+"/scheme-flow-server/simulationTactics/save/manual/",
    // 依据已有模拟状态的方案创建方案-数据提交
    createSchemeBySimulationUrl: netIp+"/scheme-flow-server/simulationTactics/save/simScheme/",
    // 获取指定航路点对应的速度
    speedUrl: netIp+"/flow-route-point-speed-calculate-server/speed-retrive/speed/",
    // 获取交通流快捷录入表单依赖数据
    shortcutInputFormDataUrl: netIp+"/hydrogen-flight-monitor-server-cache/flowcontrol/fast/",
    // 校验航路接口
    validateRouteUrl: netIp+"/hydrogen-reroute-check-server/reroute/rerouteCheckPost",

    //修改模拟状态的方案-数据提交
    modifySimulationSchemeUrl: netIp+"/scheme-flow-server/simulationTactics/modifyScheme/",
    //获取工作流-办结列表
    hisTaskUrl: netIp+"/hydrogen-duties-server/histask/",
    //获取工作流-待办列表
    tasksUrl: netIp+"/hydrogen-duties-server/runtask/",
    //获取工作流-详情
    taskDetailUrl: netIp+"/hydrogen-duties-server/instance/",
    // 航班查询
    searchFlightUrl: netIp+"/hydrogen-flight-plan-server/retrieveFlightDetailsByFlightId/",
    // 航班详情
    getFlightDetailUrl: netIp+"/hydrogen-flight-plan-server/retrieveFlightDetailsById/",

    // 获取可选前序航班集合
    getAlterFormerFlightListUrl: netIp+"/hydrogen-flight-plan-server/retrieveFormerFCData/",
   
    //待办航班列表-放行监控页面中的
    todoListUrl: netIp+"/hydrogen-duties-server/flight/backlog/task/",
    //我的申请列表-放行监控页面中的
    myApplicationListUrl: netIp+"/hydrogen-duties-server/workflow/procInst/",
    //待办
    runTaskTableUrl:netIp+"/hydrogen-duties-server/flight/runtask/",
    //已办
    histaskTableUrl:netIp+"/hydrogen-duties-server/flight/histask/",

    //容量管理-基础接口
    capacityBaseUrl: netIp+"/flow-capacity-rest/capacity/",
    // 跑道列表接口
    runwayListUrl: netIp+"/hydrogen-cdm-runway-server/runway/defaulat/and/dynamic/retrieve/new/",
    // 默认跑道配置详情
    runwayDefaultDetailUrl: netIp+"/hydrogen-cdm-runway-server/open/runway/default/detail/dialog/",
    // 默认跑道配置修改提交
    runwayDefaultUpdatelUrl: netIp+"/hydrogen-cdm-runway-server/rwgap/default/update/new/",
    // 动态跑道配置详情
    runwayDynamicDetailUrl: netIp+"/hydrogen-cdm-runway-server/open/runway/dynamic/detail/dialog/",
    
    // 跑道模板创建获取跑道数据
    runwayTemplateCreateRunwayDataUrl: netIp+"/hydrogen-cdm-runway-server/runway/mould/template/create/show/",
    // 动态跑道发布提交
    runwayDynamicPublishUrl: netIp+"/hydrogen-cdm-runway-server/runway/dynamic/create/new/",
    // 动态跑道配置修改提交
    runwayDynamicUpdatelUrl: netIp+"/hydrogen-cdm-runway-server/open/runway/dynamic/edit/dialog/update/",
    // 动态跑道配置终止
    runwayDynamicTerminateUrl: netIp+"/hydrogen-cdm-runway-server/open/runway/dynamic/edit/dialog/terminate",
    // MDRS+工作流数据获取
    mdrsRetrieveDataUrl: netIp+"/traffic-flow-overall-monitor-mdrs-server/capacity-alert/data/retrieval/handle",
    // MDRS数据-审批-同意、拒绝、撤回
    mdrsWorkFlowUrl: netIp+"/traffic-flow-overall-monitor-mdrs-server/capacity-alert/workflow/approve",
    // MDRS数据-终止-申请、同意、拒绝、撤回
    mdrsTerminalWorkFlowUrl: netIp+"/traffic-flow-overall-monitor-mdrs-server/capacity-alert/workflow/termination",
    // 总体监控-协调KPI-运行配置
    totalOperationUrl: netIp+"/operation-coordination-server/operation/record",
    // 总体监控-协调KPI-航班协调
    totalCollaborateUrl: netIp+"/hydrogen-flight-record-server/flightRecord/retrieveFlightRecordByType",
    // 消息订阅-查
    getUserSubscribeUrl: netIp+"/cdm-nw-event-center-server/user-subscribe/retrieval/user/subscribe/category",
    // 消息订阅-应用 存
    setUserSubscribeUrl: netIp+"/cdm-nw-event-center-server/user-subscribe/user/subscribe",
    // 消息记录-当日
    getTodayNewsUrl: netIp+"/cdm-nw-event-center-server/event/info/lately/user/id",
    // 消息记录-历史
    getHistoryNewsUrl: netIp+"/cdm-nw-event-center-server/event/info/history/user/id",
    //计划时间范围获取-(薛满林)
    rangeScopeUrl: netIp+"/hydrogen-flight-monitor-server-cache/plan/time/scope",
    // 开关配置
    switchConfigUrl: netIp +"/hydrogen-ntfm-info-receive-server/switchConfig",
    // 表格列配置
    flightTableColumnConfigUrl: netIp +"/hydrogen-param-config-server",
    // 方案中心-流控血缘关系
    schemeByIdIP: netIp +"/scheme-flight-calculation-server/evaluation/schemeById",

    // 跑道配置-跑道模板管理
    getRunwayTemplateUrl: netIp+"/hydrogen-cdm-runway-server/runway/mould/template/retrieve/",
    // 跑道配置-跑道模板管理删除
    dleRunwayTemplateUrl: netIp+"/hydrogen-cdm-runway-server/runway/mould/template/delete",
    // 跑道配置-跑道模板管理添加(显示)
    addRunwayTemplateUrl: netIp+"/hydrogen-cdm-runway-server/runway/mould/template/create/show/",
    // 跑道配置-跑道模板管理更新(显示)
    updateRunwayTemplateUrl: netIp+"/hydrogen-cdm-runway-server/runway/mould/template/retrieve/by_id/",
    // 跑道配置-跑道模板管理添加(保存)
    addUploadRunwayTemplateUrl: netIp+"/hydrogen-cdm-runway-server/runway/mould/template/create/",
    // 跑道配置-跑道模板管理更新(保存)
    updateUploadRunwayTemplateUrl: netIp+"/hydrogen-cdm-runway-server/runway/mould/template/update/",
    // 动态跑道配置
    loadRunwayTemplateListUrl: netIp+"/hydrogen-cdm-runway-server/airport-regular/runway/config/retrieve/",

    // 自观
    timeSlotSwitchingUrl: netIp+"/airport/weather/newest/",

     // 时隙交换备选航班获取
     retrieveSubstitutionFmeUrl: netIp+"/hydrogen-flight-plan-server/retrieveSubstitutionFme/",
     // 验证航班是否可以进行时隙交换
     judgeAbilityFlightUrl: netIp+"/hydrogen-flight-coordination-server/flight/judgeAbilityFlight/",
     // 时隙交换申请
     applyFlightExchangeSlotUrl: netIp+"/hydrogen-flight-coordination-server/flight/applyFlightExchangeSlot/",
     // 时隙交换拒绝
     refuseFlightExchangeSlotUrl: netIp+"/hydrogen-flight-coordination-server/flight/refuseFlightExchangeSlot/",
     // 时隙交换同意
     approveFlightExchangeSlotUrl: netIp+"/hydrogen-flight-coordination-server/flight/approveFlightExchangeSlot/",
     // 时隙交换列表
     retrieveExchangeSlotInfoUrl: netIp+"/hydrogen-flight-coordination-server/flight/retrieveExchangeSlotInfo/",
     // 时隙交换详情
     retrieveExchangeSlotDetailUrl: netIp+"/hydrogen-flight-coordination-server/flight/instance/",

     //禁航信息列表
     findNoTamByUnitTypeUrl: netIp+"/data-receive-server-notam/notam/findByUnitType/AIRPORT",
     //禁航信息新增、修改
     updateNoTamDataUrl: netIp+"/data-receive-server-notam/notam/saveNotam",
};

//协调相关url
const CollaborateIP = netIp;
const CollaborateUrl = {
    baseUrl: netIp + "/hydrogen-flight-coordination-server/flight",
    //标记豁免、取消豁免
    exemptUrl : netIp + "/hydrogen-flight-coordination-server/flight",
    //入池、出池
    poolUrl : netIp + "/hydrogen-flight-coordination-server/flight",
    //TOBT
    tobtUrl : netIp + "/hydrogen-flight-coordination-server/flight",
    //CTOT
    ctotUrl : netIp + "/hydrogen-flight-coordination-server/flight",
    //COBT
    cobtUrl : netIp + "/hydrogen-flight-coordination-server/flight",
    //FFIXT
    ffixtUrl : netIp + "/hydrogen-flight-coordination-server/flight",
    //RWY /updateFlightRunway clearFlightRunway
    runwayUrl : netIp + "/hydrogen-flight-coordination-server/flight",
    //POSITION  /updateFlightPosition  clearFlightPosition
    positionUrl : netIp + "/hydrogen-flight-coordination-server/flight",
    // 指定前序航班 
    updateFormerFlightUrl: netIp+"/hydrogen-flight-coordination-server/flight/updateFormerFlight"
};



export { TopicConstant,ReqUrls, CollaborateIP, CollaborateUrl } 