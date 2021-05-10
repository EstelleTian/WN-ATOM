/*
 * @Author: liutianjiao
 * @Date:
 * @LastEditTime: 2021-05-10 13:48:31
 * @LastEditors: Please set LastEditors
 * @Description: 项目所有请求url
 * @FilePath: request-urls.js
 */
//工作流ip
const workflowIP = "http://192.168.194.22:29891";
//路武臣
const mdrsIP = "http://192.168.194.21:27580";
//路武臣
const userSubscribeIP = "http://192.168.194.21:28680";
//
const runwayIP = "http://192.168.194.21:50012";
const clearanceIP = "http://192.168.194.21:29890";
const schemeIP = "http://192.168.194.21:58190";
//协调ip
const CollaborateIP = "http://192.168.194.21:28781";
//登录IP
const loginIP = "http://192.168.194.21:18380";
//容量管理IP
const capacityIP = "http://192.168.194.20:28482"
//容流数据IP
const capacityFlowIP= "http://192.168.194.22:28875"
//容流气象数据IP
const capacityFlowWeatherIP= "http://192.168.210.131:28280"
//总体监控-协调KPI-航班协调-数据IP
const totalCollaborateIP= "http://192.168.194.21:28782"

const ReqUrls = {
    //用户登录
    loginUrl: loginIP+"/uuma-server/client/login",
    //缩略地图
    mapUrl: "http://192.168.194.40:8081/#/map",
    mapWebUrl: "http://192.168.194.40:8082/#/map",
    //根据modalId获取方案详情
    schemeDetailByIdUrl: clearanceIP+"/implementTacticDetails/",
    //获取--方案列表
    schemeListUrl: clearanceIP+"/implementTactics",
    //获取--模拟方案详情
    simulationSchemeDetailUrl:schemeIP+"/simulationTactics/id/",
    //获取--航班列表数据
    flightsDataUrl: clearanceIP+"/tactic/",
    //获取--航班列表数据(id为空)
    flightsDataNoIdUrl: clearanceIP+"/influence/flights/",
    // flightsDataNoIdUrl: 'http://192.168.243.8:29890/influence/flights/',
    //获取--执行KPI数据(孔凡续)
    executeKPIDataUrl: "http://192.168.194.22:28787/kpi/",
    
    //获取--执行KPI数据(薛满林)
    performanceKPIDataUrl: clearanceIP+"/performkpi/",

    //获取航班执行数据
    performanceDataUrl: "http://192.168.194.21:27780/hydrogen-traffic-flow-performance-retrieval-server/monitor/nw/v1/flight/areaname",
    // 总体监控-获取限制数据
    restrictionDataUrl: schemeIP+"/implementTactics/statistics",


    // 获取用户订阅的容流监控单元数据
    userSubscribeCapacityFlowMonitorUnitDataUrl: "http://192.168.194.20:28485/user-template-rest/template/user/",

    // 获取容流数据
    capacityFlowMonitorDataUrl: capacityFlowIP+"/traffic-flow-capacity-restful/capacity/v1/flow",
    // 获取容流气象数据
    capacityFlowMonitorWeatherDataUrl: capacityFlowWeatherIP+"/atom-airport-weather-collect-server/airport/weather/search/nw",
    //获取流控数据(ATOM新增)
    ATOMCreateDataUrl: schemeIP+"/scheme-flow-server/restrictions/create/",
    //获取流控数据(ATOM变更)
    ATOMModifyDataUrl: schemeIP+"/scheme-flow-server/restrictions/modify/",
    //获取流控数据(NTFM新增)
    NTFMCreateDataUrl: schemeIP+"/restrictions/createNtfm/",
    // NTFMCreateDataUrl: "http://192.168.243.138:58190/restrictions/createNtfm/",
    
    //获取流控数据(NTFM变更)
    NTFMModifyDataUrl: schemeIP+"/restrictions/modifyNtfm/",

    //创建方案(外区流控导入)-数据提交
    importSchemeUrl: schemeIP+"/scheme-flow-server/simulationTactics/import/sim/",
    // 创建和修改方案-数据提交
    createSchemeUrl: schemeIP+"/scheme-flow-server/simulationTactics/save/manual/",
    // createSchemeUrl: "http://192.168.243.138:58190/scheme-flow-server/simulationTactics/save/manual/",
    

    //修改模拟状态的方案-数据提交
    modifySimulationSchemeUrl: schemeIP+"/simulationTactics/modifyScheme/",
    //获取工作流-办结列表
    hisTaskUrl: workflowIP+"/hydrogen-duties-server/histask/",
    //获取工作流-待办列表
    tasksUrl: workflowIP+"/hydrogen-duties-server/runtask/",
    //获取工作流-详情
    taskDetailUrl: workflowIP+"/hydrogen-duties-server/instance/",
    // 航班查询
    searchFlightUrl: "http://192.168.194.20:38188/hydrogen-flight-plan-server/flightPlan/retrieveDataByFlightId/",
    //待办航班列表-放行监控页面中的
    todoListUrl: "http://192.168.194.21:29891/flight/backlog/task/",
    //我的申请列表-放行监控页面中的
    myApplicationListUrl: "http://192.168.194.20:28087/workflow/procInst/",
    //待办
    runTaskTableUrl:workflowIP+"/flight/runtask/",
    //已结
    histaskTableUrl:workflowIP+"/flight/histask/",

    //容量管理-基础接口
    capacityBaseUrl: capacityIP+"/flow-capacity-rest/capacity/",
    // 跑道列表接口
    runwayListUrl: runwayIP+"/runway/defaulat/and/dynamic/retrieve/new/",
    // 跑道详情
    runwayDefaultDetailUrl: runwayIP+"/open/runway/default/detail/dialog/",
    // 跑道修改提交
    runwayDefaultUpdatelUrl: runwayIP+"/rwgap/default/update/new/",
    // MDRS+工作流数据获取
    mdrsRetrieveDataUrl: mdrsIP+"/traffic-flow-overall-monitor-mdrs-server/capacity-alert/data/retrieval/handle",
    // MDRS数据-审批-同意、拒绝、撤回
    mdrsWorkFlowUrl: mdrsIP+"/traffic-flow-overall-monitor-mdrs-server/capacity-alert/workflow/approve",
    // 总体监控-协调KPI-航班协调
    totalCollaborateUrl: totalCollaborateIP+"/flightRecord/retrieveFlightRecordByType",
    // 消息订阅-查
    getUserSubscribeUrl: userSubscribeIP+"/cdm-nw-event-center-server/user-subscribe/retrieval/user/subscribe/category",
    // 消息订阅-应用 存
    setUserSubscribeUrl: userSubscribeIP+"/cdm-nw-event-center-server/user-subscribe/user/subscribe",
};

//协调相关url
const CollaborateUrl = {
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
};

export { ReqUrls, CollaborateIP, CollaborateUrl };
