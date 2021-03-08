/*
 * @Author: liutianjiao
 * @Date:
 * @LastEditTime: 2021-03-05 14:41:21
 * @LastEditors: Please set LastEditors
 * @Description: 项目所有请求url
 * @FilePath: request-urls.js
 */
//工作流ip
// const workflowIP = "http://192.168.243.187:28086";
const workflowIP = "http://192.168.194.20:28087";
const ReqUrls = {
    //用户登录
    loginUrl: 'http://192.168.194.21:18380/uuma-server/client/login',
    //缩略地图
    mapUrl: "http://192.168.194.40:8081/#/map",
    //根据modalId获取方案详情
    schemeDetailByIdUrl: 'http://192.168.194.21:58190/scheme-flow-server/implementTactics/',
    //获取--方案列表
    schemeListUrl: 'http://192.168.194.21:58190/implementTactics',
    //获取--航班列表数据
    flightsDataUrl: 'http://192.168.194.21:29890/tactic/',
    //获取--航班列表数据(id为空)
    flightsDataNoIdUrl: 'http://192.168.194.21:29890/influence/flights/',
    //获取--执行KPI数据
    // kpiDataUrl: 'http://192.168.194.21:29890/performkpi/',
    kpiDataUrl: 'http://192.168.210.131:28787/kpi/',
    //获取航班执行数据
    performanceDataUrl: 'http://192.168.194.21:27780/hydrogen-traffic-flow-performance-retrieval-server/monitor/nw/v1/flight/areaname',
    // performanceDataUrl: 'http://192.168.194.22:28001/traffic-flow-monitor-server/monitor/v1/flight',
    // performanceDataUrl: 'http://192.168.243.191:28001/traffic-flow-monitor-server/monitor/v1/flight',

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

    //创建流控-数据提交
    createFlowUrl: 'http://192.168.194.21:58190/scheme-flow-server/simulationTactics/import/sim/',
    // createFlowUrl: 'http://192.168.243.138:58190/scheme-flow-server/simulationTactics/import/sim/',
    //修改方案-数据提交
    updateSchemeUrl: 'http://192.168.194.21:58190/scheme-flow-server/implementTactics/modify/',
    //获取工作流-办结列表
    hisTaskUrl: workflowIP+'/workflow/userHisTask/',
    //获取工作流-待办列表
    tasksUrl: workflowIP+'/workflow/userTask/',
    //获取工作流-详情
    taskDetailUrl: workflowIP+'/workflow/procTaskHis/',
    // 航班查询
    searchFlightUrl: 'http://192.168.194.20:38188/hydrogen-flight-plan-server/flightPlan/retrieveDataByFlightId/',
    //待办航班列表-放行监控页面中的
    todoListUrl: 'http://192.168.194.21:29891/flight/backlog/task/',
    //我的申请列表-放行监控页面中的
    myApplicationListUrl: 'http://192.168.194.20:28087/workflow/procInst/',

    //容量管理-基础接口
    capacityBaseUrl: 'http://192.168.243.200:28482/flow-capacity-rest/capacity/',
    // capacityBaseUrl: 'http://192.168.194.20:28482/flow-capacity-rest/capacity/',
    
};
//协调ip
const CollaborateIP = "http://192.168.194.22:28088";
// const CollaborateIP = "http://192.168.243.162:28088";
//协调相关url
const CollaborateUrl = {
    //标记豁免、取消豁免
    exemptyUrl : CollaborateIP,
    //入池、出池
    poolUrl : CollaborateIP,
    //TOBT
    tobtUrl : CollaborateIP,
    //CTOT
    ctotUrl : CollaborateIP,
    //COBT
    cobtUrl : CollaborateIP,
};

export { ReqUrls, CollaborateIP, CollaborateUrl };
