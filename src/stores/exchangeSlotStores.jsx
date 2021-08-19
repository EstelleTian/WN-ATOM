/*
 * @Author: your name
 * @Date: 2021-02-05 12:59:35
 * @LastEditTime: 2021-08-19 14:18:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\stores\todoListStores.jsx
 */
import { makeObservable, observable, action, computed } from "mobx";

// 放行监控-时隙交换-数据
class ExchangeSlot {
  constructor() {
    makeObservable(this);
  }
  // 列表
  @observable slotList = [];
  //是否强制刷新
  @observable forceUpdate = false;
  //数据时间
  @observable generateTime = "";
  //数据获取
  @observable loading = false;
  //定时器
  @observable timeoutId = "";

  //高亮工作流id
  @observable focusFlightId = "";
  //高亮工作流id
  @observable focusSid = "";

  //更新时隙交换列表数据
  @action updateSlotListData(slotList, generateTime) {
    this.slotList = slotList;
    this.generateTime = generateTime;
  }
  //更新loading状态
  @action toggleLoad(load) {
    this.loading = load;
  }
  //修改--时隙交换-强制更新
  @action setForceUpdate(flag) {
    this.forceUpdate = flag;
  }
  //根据航班id查找定位流水id
  @action getIdByFlightId() {
    let key = "";
    this.slotList.map((todo) => {
      const flightObj = todo.flightObj || {};
      const id = flightObj.id || "";
      if (this.focusFlightId + "" === id + "") {
        key = todo.key || "";
      }
    });
    return key;
  }
}

let exchangeSlot = new ExchangeSlot();

export { exchangeSlot };
