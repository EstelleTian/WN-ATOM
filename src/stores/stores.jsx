/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-08-26 08:40:38
 * @LastEditors: Please set LastEditors
 * @Description: store集合
 * @FilePath: \WN-CDM\src\stores\stores.jsx
 */
import { schemeListData } from "./schemeStores";
import { newsList } from "./newsStores";
import { flightTableData } from "./flightTableStores";
import { executeKPIData, performanceKPIData } from "./executeKPIStores";
import { flightPerformanceData } from "./flightPerformanceStores";
import {
  capacityFlowMonitorData,
  capacityFlowMonitorWeatherData,
} from "./capacityFlowMonitorStores";
import { systemPage } from "./pageStores";
import { workFlowData } from "./workFlowStores";
import { implementTacticsData } from "./implementTacticsReasonStores";
import { infoHistoryData } from "./infoHistoryStores";
import { capacity } from "./capacityStores";
import { userSubscribeData } from "./totalPageStores";
import { todoList } from "./todoListStores";
import { exchangeSlot } from "./exchangeSlotStores";
import { myApplicationList } from "./myApplicationListStores";
import { runwayListData } from "./runwayStores";
import { MDRSData } from "./mdrsStores";
import { flightDetailData } from "./flightDetailStores";
import { schemeFormData } from "./SchemeFormStores";
// 方案模板
import { schemeTemplateData } from "./schemeTemplateStores";
import { newsSubscribe } from "./newsSubscribeStore";
import { collaboratePopoverData } from "./collaboratePopoverStore";
import { formerFlightUpdateFormData } from "./formerFlightUpdateModalStores";
import { flightExchangeSlotFormData } from "./flightExchangeSlotFormStores";
// ATOM 引接应用配置
import { ATOMConfigFormData } from "./ATOMConfigModalStores";
// NTFM 引接应用配置
import { NTFMConfigFormData } from "./NTFMConfigModalStores";
// 航班略情
import { fightSearch } from "./fightSearchStores";
// 列配置
import { columnConfig } from "./columnConfigStores";
// 动态跑道发布
import { RunwayDynamicPublishFormData } from "./RunwayDynamicPublishStores";
// 动态跑道修改
import { RunwayDynamicEditFormData } from "./RunwayDynamicEditStores";
// 默认跑道修改
import { RunwayDefaultEditFormData } from "./RunwayDefaultEditStores";
// 默认跑道修改
import { RunwayFormworkmanagementData } from "./RunwayFormworkmanagementStores";
// 禁航信息
import { prohibitedData } from "./prohibitedStores.jsx";

export {
  schemeListData,
  newsList,
  flightTableData,
  executeKPIData,
  performanceKPIData,
  systemPage,
  flightPerformanceData,
  capacityFlowMonitorData,
  capacityFlowMonitorWeatherData,
  workFlowData,
  implementTacticsData,
  infoHistoryData,
  capacity,
  todoList,
  userSubscribeData,
  myApplicationList,
  runwayListData,
  MDRSData,
  flightDetailData,
  schemeFormData,
  newsSubscribe,
  collaboratePopoverData,
  formerFlightUpdateFormData,
  flightExchangeSlotFormData,
  schemeTemplateData,
  ATOMConfigFormData,
  NTFMConfigFormData,
  RunwayDynamicPublishFormData,
  RunwayFormworkmanagementData,
  RunwayDynamicEditFormData,
  RunwayDefaultEditFormData,
  fightSearch,
  exchangeSlot,
  columnConfig,
  prohibitedData
};
