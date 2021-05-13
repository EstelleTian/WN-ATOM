/*
 * @Author: your name
 * @Date: 2020-12-14 10:18:25
 * @LastEditTime: 2021-05-13 15:29:44
 * @LastEditors: Please set LastEditors
 * @Description: 影响航班表格数据存储
 * @FilePath: \WN-CDM\src\stores\flightTableStores.jsx
 */

import { makeObservable, observable, action, computed } from "mobx";
import {
  isValidVariable,
  isValidObject,
  calculateStringTimeDiff,
} from "utils/basic-verify.js";
import { formatSingleFlight } from "components/FlightTable/TableColumns";

// 单条航班对象
class FlightDetail {
  constructor() {
    makeObservable(this);
  }

  // 航班id
  @observable id = "";

  // 数据集合
  @observable flightData = {};

  //数据时间
  @observable generateTime = "";
  //模态框是否显示
  @observable modalVisible = false;

  //数据获取
  @observable loading = false;

  //定时器
  @observable timeoutId = "";

  // 优先级
  @observable priority = "";
  // 入池状态
  @observable poolStatus = "";
  // 更新时间戳
  @observable updateTimeStamp = "";

  // 航班查询-数据值
  @observable flightResult = {};
  // 航班查询-单个略情是否显示
  @observable drawerVisible = false;
  // 航班查询-单个略情激活id
  @observable drawerFlightId = "";

  //更新航班id
  @action toggleFlightId(id) {
    this.id = id;
  }

  //更新loading状态
  @action toggleLoad(load) {
    this.loading = load;
  }
  //更新航班列表模态框显示状态
  @action toggleModalVisible(visible) {
    this.modalVisible = visible;
  }

  //更新航班数据
  @action updateFlightDetailData(data) {
    this.flightData = data;
  }
  //航班查询-数据值
  @action updateFlightResult(data) {
    this.flightResult = data;
  }
  //航班查询-单个略情是否显示
  @action setDrawerVisible(flag) {
    this.drawerVisible = flag;
  }
  //航班查询-单个略情激活id
  @action setDrawerFlightId(id) {
    this.drawerFlightId = id;
  }
  //航班查询-根据激活id获取略情数据
  @action getFlightBySelectedId() {
    return this.flightResult[this.drawerFlightId] || {};
  }
}

let flightDetailData = new FlightDetail();
export { flightDetailData };
