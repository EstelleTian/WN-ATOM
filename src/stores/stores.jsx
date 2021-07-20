/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-07-20 17:08:13
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
  fightSearch,
  columnConfig
};
