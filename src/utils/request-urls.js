/*
 * @Author: liutianjiao
 * @Date:
 * @LastEditTime: 2021-01-20 16:11:18
 * @LastEditors: Please set LastEditors
 * @Description: 项目所有请求url
 * @FilePath: request-urls.js
 */
const ReqUrls = {
    //用户登录
    loginUrl: 'http://192.168.194.21:18380/uuma-server/client/login',
    //缩略地图
    mapUrl: "http://192.168.210.84:8080/#/map",
    //根据modalId获取方案详情
    schemeDetailByIdUrl: 'http://192.168.194.21:58189/hydrogen-scheme-flow-server/implementTactics/',
    //获取--方案列表
    schemeListUrl: 'http://192.168.194.21:58189/implementTactics',
    //获取--航班列表数据
    flightsDataUrl: 'http://192.168.194.21:29890/tactic/',
    //获取--执行KPI数据
    kpiDataUrl: 'http://192.168.194.21:29890/performkpi/',
    //获取航班执行数据
    performanceDataUrl: 'http://192.168.194.22:28001/traffic-flow-monitor-server/monitor/v1/flight',
    // performanceDataUrl: 'http://192.168.243.191:28001/traffic-flow-monitor-server/monitor/v1/flight',
    // 获取容流数据
    capacityFlowMonitorDataUrl: 'http://192.168.194.22:28001/traffic-flow-monitor-server/monitor/v1/flow',
    // capacityFlowMonitorDataUrl: 'http://192.168.243.191:28001/traffic-flow-monitor-server/monitor/v1/flow',
    //获取流控数据
    ATOMDataUrl: 'http://192.168.194.21:58189/hydrogen-scheme-flow-server/restrictions/',
    //创建流控-数据提交
    createFlowUrl: 'http://192.168.194.21:58189/hydrogen-scheme-flow-server/simulationTactics/import/sim/',
    //获取工作流-办结列表
    hisTaskUrl: 'http://192.168.194.20:28087/workflow/userHisTask/',
    //获取工作流-待办列表
    tasksUrl: 'http://192.168.194.20:28087/workflow/userTask/',
    // 航班查询
    searchFlightUrl: 'http://192.168.194.20:38188/hydrogen-flight-plan-server/flightPlan/retrieveDataByFlightId/',

};
//协调相关url
const CollaborateUrl = {
    //标记豁免、取消豁免
    exemptyUrl : 'http://192.168.243.162:28089/',
    //入池、出池
    poolUrl : 'http://192.168.243.162:28089/',
};

export { ReqUrls, CollaborateUrl };
