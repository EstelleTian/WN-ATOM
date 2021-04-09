/*
 * @Author: liutianjiao
 * @Date:
 * @LastEditTime: 2021-04-09 13:53:28
 * @LastEditors: Please set LastEditors
 * @Description: 项目所有请求url
 * @FilePath: request-urls.js
 */
//工作流ip

const workflowIP = "http://192.168.194.22:29891/hydrogen-duties-server";
// http://192.168.194.22:29891/hydrogen-duties-server/runtask/{user}
const ReqUrls = {
    //用户登录
    loginUrl: 'http://192.168.194.21:18380/uuma-server/client/login',
    //缩略地图
    mapUrl: "http://192.168.194.40:8081/#/map",
    //根据modalId获取方案详情
    schemeDetailByIdUrl: 'http://192.168.194.21:58190/scheme-flow-server/implementTactics/',
    //获取--方案列表
    schemeListUrl: 'http://192.168.194.21:29890/implementTactics',
    // schemeListUrl: 'http://192.168.194.21:58190/implementTactics',
    //获取--模拟方案详情
    simulationSchemeDetailUrl:'http://192.168.194.21:58190/simulationTactics/id/',
    //获取--航班列表数据
    flightsDataUrl: 'http://192.168.194.21:29890/tactic/',
    //获取--航班列表数据(id为空)
    flightsDataNoIdUrl: 'http://192.168.194.21:29890/influence/flights/',
    //获取--执行KPI数据(孔凡续)
    executeKPIDataUrl: 'http://192.168.194.22:28787/kpi/',
    //获取--执行KPI数据(薛满林)
    performanceKPIDataUrl: 'http://192.168.194.21:29890/performkpi/',

    //获取航班执行数据
    performanceDataUrl: 'http://192.168.194.21:27780/hydrogen-traffic-flow-performance-retrieval-server/monitor/nw/v1/flight/areaname',
    // 总体监控-获取限制数据
    restrictionDataUrl: 'http://192.168.194.21:58190/implementTactics/statistics',


    // 获取用户订阅的容流监控单元数据
    userSubscribeCapacityFlowMonitorUnitDataUrl: 'http://192.168.194.20:28485/user-template-rest/template/user/',

    // 获取容流数据
    capacityFlowMonitorDataUrl: 'http://192.168.194.22:28875/traffic-flow-capacity-restful/capacity/v1/flow',
    // 获取容流气象数据
    capacityFlowMonitorWeatherDataUrl: 'http://192.168.210.131:28280/atom-airport-weather-collect-server/airport/weather/search/nw',
    // capacityFlowMonitorWeatherDataUrl: 'http://192.168.210.131:28280/atom-airport-weather-collect-server/airport/weather/search/nw',
    //获取流控数据(ATOM新增)
    ATOMCreateDataUrl: 'http://192.168.194.21:58190/scheme-flow-server/restrictions/create/',
    //获取流控数据(ATOM变更)
    ATOMModifyDataUrl: 'http://192.168.194.21:58190/scheme-flow-server/restrictions/modify/',
    //获取流控数据(NTFM新增)
    NTFMCreateDataUrl: 'http://192.168.194.21:58190/restrictions/createNtfm/',
    // NTFMCreateDataUrl: 'http://192.168.243.138:58190/restrictions/createNtfm/',
    
    //获取流控数据(NTFM变更)
    NTFMModifyDataUrl: 'http://192.168.194.21:58190/restrictions/modifyNtfm/',

    //创建方案(外区流控导入)-数据提交
    importSchemeUrl: 'http://192.168.194.21:58190/scheme-flow-server/simulationTactics/import/sim/',
    // 创建和修改方案-数据提交
    createSchemeUrl: 'http://192.168.194.21:58190/scheme-flow-server/simulationTactics/save/manual/',
    // createSchemeUrl: 'http://192.168.243.138:58190/scheme-flow-server/simulationTactics/save/manual/',
    

    //修改模拟状态的方案-数据提交
    modifySimulationSchemeUrl: 'http://192.168.194.21:58190/simulationTactics/modifyScheme/',
    //获取工作流-办结列表
    hisTaskUrl: workflowIP+'/histask/',
    //获取工作流-待办列表
    tasksUrl: workflowIP+'/runtask/',
    //获取工作流-详情
    taskDetailUrl: workflowIP+'/instance/',
    // 航班查询
    searchFlightUrl: 'http://192.168.194.20:38188/hydrogen-flight-plan-server/flightPlan/retrieveDataByFlightId/',
    //待办航班列表-放行监控页面中的
    todoListUrl: 'http://192.168.194.21:29891/flight/backlog/task/',
    //我的申请列表-放行监控页面中的
    myApplicationListUrl: 'http://192.168.194.20:28087/workflow/procInst/',
    //待办
    runTaskTableUrl:"http://192.168.194.22:29891/flight/runtask/",
    //已结
    histaskTableUrl:"http://192.168.194.22:29891/flight/histask/",

    //容量管理-基础接口
    // capacityBaseUrl: 'http://192.168.243.200:28482/flow-capacity-rest/capacity/',
    capacityBaseUrl: 'http://192.168.194.20:28482/flow-capacity-rest/capacity/',
    // 跑道列表接口
    runwayListUrl: 'http://192.168.194.21:50012/runway/defaulat/and/dynamic/retrieve/new/',
    // 跑道详情
    runwayDefaultDetailUrl: 'http://192.168.194.21:50012/open/runway/default/detail/dialog/',
    // 跑道修改提交
    runwayDefaultUpdatelUrl: 'http://192.168.194.21:50012/rwgap/default/update/new/',
    
};
//协调ip
const CollaborateIP = "http://192.168.194.21:28781";
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
