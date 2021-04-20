/*
 * @Author: your name
 * @Date: 2020-12-14 10:18:25
 * @LastEditTime: 2021-04-15 15:57:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\stores\FlightStores.jsx
 */

import { makeObservable, observable, action, computed } from "mobx";

// 容流监控数据
class CapacityFlowMonitorData {
  constructor() {
    makeObservable(this);
  }
  // 列表
  @observable monitorData = {};
  //数据时间
  @observable generateTime = "";
  //数据获取
  @observable loading = false;
  //定时器
  @observable timeoutId = "";

  //更新航班数据
  @action updateCapacityFlowMonitorData(monitorData) {
    this.monitorData = monitorData;
  }
  //更新loading状态
  @action toggleLoad(load) {
    this.loading = load;
  }
}

let capacityFlowMonitorData = new CapacityFlowMonitorData();
// 容流监控气象数据
class CapacityFlowMonitorWeatherData {
  constructor() {
    makeObservable(this);
  }
  // 列表
  @observable weatherData = [];
  //数据时间
  @observable generateTime = "";
  //定时器
  @observable timeoutId = "";

  //更新航班数据
  @action updateCapacityFlowMonitorWeatherData(weatherData) {
    this.weatherData = weatherData;
  }
}

let capacityFlowMonitorWeatherData = new CapacityFlowMonitorWeatherData();

export { capacityFlowMonitorData, capacityFlowMonitorWeatherData };
