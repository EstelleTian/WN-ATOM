/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-05-14 11:14:40
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
import { newsSubscribe } from "./newsSubscribeStore";
import { collaboratePopoverData } from "./collaboratePopoverStore";
import { formerFlightUpdateFormData } from "./formerFlightUpdateModalStores";
import { flightExchangeSlotFormData } from "./flightExchangeSlotFormStores";


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
  flightExchangeSlotFormData
};
