/*
 * @Author: liutianjiao
 * @Date:
 * @LastEditTime: 2021-06-23 21:42:13
 * @LastEditors: Please set LastEditors
 * @Description: 生产环境-项目所有请求url
 * @FilePath: request-urls.js
 */
//消息监听地址
const TopicConstant={
    ip:"192.168.210.145",
    port: 15674,
    url: "ws://192.168.210.145:15674/ws,ws://192.168.210.146:15674/ws",
    username:"admin",
    password:"1q2w3e$R%T^Y",
}
//登录IP(姜浩)
const loginIP = "http://192.168.194.21:18380";

// 工作流ip
const workflowIP = "http://192.168.210.120:81";
//MDRS(路武臣)
const mdrsIP = "http://192.168.210.120:81";
//消息订阅(路武臣)
const userSubscribeIP = "http://192.168.210.120:81";
const runwayIP = "http://192.168.210.120:81";
const clearanceIP = "http://192.168.210.120:81";
// 方案相关(刘殿臣)
const schemeIP = "http://192.168.210.120:81";
// 获取指定航路点对应的速度(路武臣)
const speedIP = "http://192.168.210.120:81";
// 校验航路接口IP(李东骏)
const validateRouteIP = "http://192.168.210.120:81";

//协调ip
const CollaborateIP = "http://192.168.210.120:81";

//容量管理IP(韩涛)
const capacityIP = "http://192.168.210.120:81";
//容流数据IP(孔凡续)
const capacityFlowIP= "http://192.168.210.120:81";
//容流气象数据IP(孔凡续)
const capacityFlowWeatherIP= "http://192.168.210.120:81";
//总体监控-协调KPI-航班协调-数据IP
const totalCollaborateIP= "http://192.168.210.120:81";
//总体监控-协调KPI-运行配置-数据IP
const totalOperationIP= "http://192.168.210.120:81";
//航班详情、略情查询IP(韩涛)
const flightInfoIP= "http://192.168.210.120:81";
//总体监控-执行KPI-IP(孔凡续)
const executeKPIDataIP= "http://192.168.210.120:81";
//总体监控-航班执行数据-IP(路武臣)
const performanceDataIP= "http://192.168.210.120:81";
// 获取用户订阅的容流监控单元数据-IP()
const userSubscribeCapacityFlowMonitorUnitDataIP= "http://192.168.210.120:81";
// 获取方案模板数据-IP(韩涛)
const schemeTemplateIP= "http://192.168.210.120:81";
//待办航班列表-放行监控页面中的-IP(张杰)
const todoListIP= "http://192.168.210.120:81";
//我的申请列表-放行监控页面中的-IP(张杰)
const myApplicationListIP= "http://192.168.210.120:81";
//计划时间范围获取-IP(薛满林)
const rangeScopeIP= "http://192.168.210.120:81";
// 开关配置IP(张杰)
const switchConfigIP= "http://192.168.194.22:28080";
// 系统各个标题IP（薛满林）
const systemListIP= "http://192.168.210.120:81";

const ReqUrls = {
    //用户登录
    loginUrl: loginIP+"/uuma-server/client/login",
    loginVerifyUrl: loginIP+"/uuma-server/user/verify-password",
    //根据用户id获取可跳转系统
    systemListUrl: systemListIP+"/hydrogen-flight-monitor-server-cache/user/system/",
   
    //缩略地图
    mapUrl: "http://192.168.194.40:8081/#/map",
    mapWebUrl: "http://192.168.194.40:8082/#/map",
    //根据方案id获取方案数据,用于正式发布的方案进行修改时使用
    schemeDataByIdForUpdateUrl: schemeIP+"/scheme-flow-server/implementTactics/",
    
    //根据modalId获取方案详情
    schemeDetailByIdUrl: clearanceIP+"/hydrogen-flight-monitor-server-cache/implementTacticDetails/",
    //获取--方案列表
    schemeListUrl: clearanceIP+"/hydrogen-flight-monitor-server-cache/implementTactics",
    //获取--模拟方案详情
    simulationSchemeDetailUrl:schemeIP+"/scheme-flow-server/simulationTactics/id/",
    // 获取方案模板数据
    schemeTemplateDataUrl: schemeTemplateIP+"/user-template-rest/template/user/",
    
    //获取--航班列表数据(id为空)
    // flightsDataNoIdUrl: clearanceIP+"/hydrogen-flight-monitor-server/influence/flights/",
    flightsDataNoIdUrl: clearanceIP+"/hydrogen-flight-monitor-server-cache/influence/flights/",
    //获取--执行KPI数据(孔凡续)
    executeKPIDataUrl: executeKPIDataIP+"/kpi/",
    
    //获取总体监控-航班执行数据
    performanceDataUrl: performanceDataIP+"/hydrogen-traffic-flow-performance-retrieval-server/monitor/nw/v1/flight/areaname",
    // 总体监控-获取限制数据
    restrictionDataUrl: schemeIP+"/scheme-flow-server/implementTactics/statistics",
    // 获取用户订阅的容流监控单元数据
    userSubscribeCapacityFlowMonitorUnitDataUrl: userSubscribeCapacityFlowMonitorUnitDataIP+"/user-template-rest/template/user/",
    // 获取容流数据
    capacityFlowMonitorDataUrl: capacityFlowIP+"/traffic-flow-capacity-restful/capacity/v1/flow",
    // 获取容流气象数据
    capacityFlowMonitorWeatherDataUrl: capacityFlowWeatherIP+"/atom-airport-weather-collect-server/airport/weather/search/nw",
    //获取流控数据(ATOM新增)
    ATOMCreateDataUrl: schemeIP+"/scheme-flow-server/restrictions/create/",
    //获取流控数据(ATOM变更)
    ATOMModifyDataUrl: schemeIP+"/scheme-flow-server/restrictions/modify/",
    //获取流控数据(NTFM新增)
    //NTFMCreateDataUrl: schemeIP+"/restrictions/createNtfm/",
    NTFMCreateDataUrl: schemeIP+"/scheme-flow-server/restrictions/createNtfm/",

    //获取流控数据(NTFM变更)
    NTFMModifyDataUrl: schemeIP+"/scheme-flow-server/restrictions/modifyNtfm/",
    //创建方案(外区流控导入)-数据提交
    importSchemeUrl: schemeIP+"/scheme-flow-server/simulationTactics/import/sim/",
    // 创建和修改方案-数据提交
    createSchemeUrl: schemeIP+"/scheme-flow-server/simulationTactics/save/manual/",
    // 依据已有模拟状态的方案创建方案-数据提交
    createSchemeBySimulationUrl: schemeIP+"/scheme-flow-server/simulationTactics/save/simScheme/",
    // 获取指定航路点对应的速度
    speedUrl: speedIP+"/flow-route-point-speed-calculate-server/speed-retrive/speed/",
    // 获取交通流快捷录入表单依赖数据
    shortcutInputFormDataUrl: clearanceIP+"/hydrogen-flight-monitor-server-cache/flowcontrol/fast/",
    // 校验航路接口
    validateRouteUrl: validateRouteIP+"/hydrogen-reroute-check-server/reroute/rerouteCheckPost",

    //修改模拟状态的方案-数据提交
    modifySimulationSchemeUrl: schemeIP+"/scheme-flow-server/simulationTactics/modifyScheme/",
    //获取工作流-办结列表
    hisTaskUrl: workflowIP+"/hydrogen-duties-server/histask/",
    //获取工作流-待办列表
    tasksUrl: workflowIP+"/hydrogen-duties-server/runtask/",
    //获取工作流-详情
    taskDetailUrl: workflowIP+"/hydrogen-duties-server/instance/",
    // 航班查询
    searchFlightUrl: flightInfoIP+"/hydrogen-flight-plan-server/retrieveFlightDetailsByFlightId/",
    // 航班详情
    getFlightDetailUrl: flightInfoIP+"/hydrogen-flight-plan-server/retrieveFlightDetailsById/",

    // 获取可选前序航班集合
    getAlterFormerFlightListUrl: flightInfoIP+"/hydrogen-flight-plan-server/retrieveFormerFCData/",
   
    //待办航班列表-放行监控页面中的
    todoListUrl: todoListIP+"/hydrogen-duties-server/flight/backlog/task/",
    //我的申请列表-放行监控页面中的
    myApplicationListUrl: myApplicationListIP+"/hydrogen-duties-server/workflow/procInst/",
    //待办
    runTaskTableUrl:workflowIP+"/hydrogen-duties-server/flight/runtask/",
    //已办
    histaskTableUrl:workflowIP+"/hydrogen-duties-server/flight/histask/",

    //容量管理-基础接口
    capacityBaseUrl: capacityIP+"/flow-capacity-rest/capacity/",
    // 跑道列表接口
    runwayListUrl: runwayIP+"/hydrogen-cdm-runway-server/runway/defaulat/and/dynamic/retrieve/new/",
    // 默认跑道配置详情
    runwayDefaultDetailUrl: runwayIP+"/hydrogen-cdm-runway-server/open/runway/default/detail/dialog/",
    // 默认跑道配置修改提交
    runwayDefaultUpdatelUrl: runwayIP+"/hydrogen-cdm-runway-server/rwgap/default/update/new/",
    // MDRS+工作流数据获取
    mdrsRetrieveDataUrl: mdrsIP+"/traffic-flow-overall-monitor-mdrs-server/capacity-alert/data/retrieval/handle",
    // MDRS数据-审批-同意、拒绝、撤回
    mdrsWorkFlowUrl: mdrsIP+"/traffic-flow-overall-monitor-mdrs-server/capacity-alert/workflow/approve",
    // MDRS数据-终止-申请、同意、拒绝、撤回
    mdrsTerminalWorkFlowUrl: mdrsIP+"/traffic-flow-overall-monitor-mdrs-server/capacity-alert/workflow/termination",
    // 总体监控-协调KPI-运行配置
    totalOperationUrl: totalOperationIP+"/operation-coordination-server/operation/record",
    // 总体监控-协调KPI-航班协调
    totalCollaborateUrl: totalCollaborateIP+"/hydrogen-flight-record-server/flightRecord/retrieveFlightRecordByType",
    // 消息订阅-查
    getUserSubscribeUrl: userSubscribeIP+"/cdm-nw-event-center-server/user-subscribe/retrieval/user/subscribe/category",
    // 消息订阅-应用 存
    setUserSubscribeUrl: userSubscribeIP+"/cdm-nw-event-center-server/user-subscribe/user/subscribe",
    // 消息记录-当日
    getTodayNewsUrl: userSubscribeIP+"/cdm-nw-event-center-server/event/info/lately/user/id",
    // 消息记录-历史
    getHistoryNewsUrl: userSubscribeIP+"/cdm-nw-event-center-server/event/info/history/user/id",
    //计划时间范围获取-(薛满林)
    rangeScopeUrl: rangeScopeIP+"/hydrogen-flight-monitor-server-cache/plan/time/scope",
    // 开关配置
    switchConfigUrl: switchConfigIP +"/hydrogen-ntfm-info-receive-server/switchConfig",
};

//协调相关url
const CollaborateUrl = {
    baseUrl: CollaborateIP + "/hydrogen-flight-coordination-server/flight",
    //标记豁免、取消豁免
    exemptUrl : CollaborateIP + "/hydrogen-flight-coordination-server/flight",
    //入池、出池
    poolUrl : CollaborateIP + "/hydrogen-flight-coordination-server/flight",
    //TOBT
    tobtUrl : CollaborateIP + "/hydrogen-flight-coordination-server/flight",
    //CTOT
    ctotUrl : CollaborateIP + "/hydrogen-flight-coordination-server/flight",
    //COBT
    cobtUrl : CollaborateIP + "/hydrogen-flight-coordination-server/flight",
    //FFIXT
    ffixtUrl : CollaborateIP + "/hydrogen-flight-coordination-server/flight",
    //RWY /updateFlightRunway clearFlightRunway
    runwayUrl : CollaborateIP + "/hydrogen-flight-coordination-server/flight",
    //POSITION  /updateFlightPosition  clearFlightPosition
    positionUrl : CollaborateIP + "/hydrogen-flight-coordination-server/flight",
    // 指定前序航班 
    updateFormerFlightUrl: CollaborateIP+"/hydrogen-flight-coordination-server/flight/updateFormerFlight"
};

export { TopicConstant,ReqUrls, CollaborateIP, CollaborateUrl } 