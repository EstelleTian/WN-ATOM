/*
 * @Author: your name
 * @Date: 2021-01-26 14:31:45
 * @LastEditTime: 2021-04-30 10:07:48
 * @LastEditors: Please set LastEditors
 * @Description: 容量管理store
 * @FilePath: \WN-ATOM\src\stores\capacityStores.jsx
 */

import { observable, action, computed, makeObservable } from "mobx";
import { isValidVariable, getFullTime } from "utils/basic-verify";
class Capacity {
  constructor() {
    makeObservable(this);
  }
  // tab 状态维护
  @observable panes = [
    {
      title: "ZLXY-西安/咸阳",
      key: "ZLXY",
      type: "AIRPORT",
      active: true,
      date: "0",
      kind: "all",
      timeInterval: "60",
    },
    {
      title: "ZLIC-银川/河东",
      key: "ZLIC",
      type: "AIRPORT",
      active: false,
      date: "0",
      kind: "all",
      timeInterval: "60",
    },
    {
      title: "ZLXYAR01",
      key: "ZLXYAR01",
      type: "AREA",
      active: false,
      date: "0",
      kind: "all",
      timeInterval: "60",
    },
    {
      title: "ZLXYAR02+ZLXYAR03",
      key: "ZLXYAR02+ZLXYAR03",
      type: "AREA",
      active: false,
      date: "0",
      kind: "all",
      timeInterval: "60",
    },
  ];

  //静态容量数据
  @observable staticData = {};
  //数据获取
  @observable loading = false;
  //动态容量
  @observable dynamicData = {};
  @observable dynamicDataGenerateTime = "";
  @observable authMap = {};
  @observable forceUpdateDynamicData = false;
  @observable editable = false;
  //动态航路段
  @observable routeList = [];
  //选中的航路段
  @observable selRoute = "";
  //容量模块名称
  @observable elementNameFs = "";
  //动态容量 工作流
  @observable isFirstLoadDynamicWorkFlowData = true;
  @observable dynamicWorkFlowData = {};
  @observable forceUpdateDynamicWorkFlowData = false;

  //动态容量 时间
  @observable dateRange = 0;

  //动态容量 工作流-添加数据
  @action updateDynamicWorkFlowData(obj) {
    this.dynamicWorkFlowData = obj;
  }
  //更新loading状态
  @action toggleLoad(load) {
    this.loading = load;
  }
  //动态航路段-添加数据
  @action setRouteList(arr) {
    this.routeList = arr;
  }

  //选择的航路段
  @action setSelRoute(name) {
    this.selRoute = name;
  }

  //添加pane
  @action setPane(title, key, type) {
    this.panes.map((pane) => {
      pane.active = false;
    });
    let obj = {
      title,
      key,
      type,
      date: "0",
      kind: "all",
      timeInterval: "60",
      active: true,
    };
    this.panes.push(obj);
  }

  //删除pane
  @action delPane(key) {
    this.panes = this.panes.filter((pane) => {
      return pane.key !== key;
    });
  }

  //更新pane 激活状态
  @action activePane(key) {
    this.panes.map((pane) => {
      if (key === pane.key) {
        pane.active = true;
      } else {
        pane.active = false;
      }
    });
  }
  //更新 表单是否在编辑状态
  @action setEditable(flag) {
    this.editable = flag;
  }
  //更新pane 日期选择
  @action getDate() {
    let now = new Date();
    let timeStamp = now.getTime() + this.dateRange * 24 * 60 * 60 * 1000;
    let newDate = getFullTime(new Date(timeStamp), 4);
    return newDate;
  }

  //更新pane 日期选择
  @action updateDateSel(key, val) {
    this.panes.map((pane) => {
      if (key === pane.key) {
        pane.date = val;
      }
    });
  }
  //更新pane 种类选择
  @action updateKindSel(key, val) {
    this.panes.map((pane) => {
      if (key === pane.key) {
        pane.kind = val;
      }
    });
  }
  //更新pane 时间间隔选择
  @action updateTimeIntervalSel(key, val) {
    this.panes.map((pane) => {
      if (key === pane.key) {
        pane.timeInterval = val;
      }
    });
  }

  //获取 激活状态 pane
  @computed get getActivePane() {
    let res = [];
    this.panes.map((pane) => {
      if (pane.active) {
        res.push(pane);
      }
    });
    return res;
  }

  //更新 静态data
  @action setStaticData(data) {
    for (let key in data) {
      const item = data[key] || {};
      item["key"] = key;
    }
    this.staticData = data;
  }
  //默认静态data
  @computed get defaultStaticData() {
    return Object.values(this.staticData).filter((item) => {
      if (item.capacityTime === "BASE") {
        return true;
      } else {
        return false;
      }
    });
  }
  //24小时 静态data
  @computed get customStaticData() {
    return Object.values(this.staticData).filter((item) => {
      if (item.capacityTime !== "BASE") {
        return true;
      } else {
        return false;
      }
    });
  }

  //更新 动态data
  @action setDynamicData(data) {
    for (let key in data) {
      const item = data[key] || {};
      item["key"] = key;
    }
    this.dynamicData = data;
  }
  //更新 动态data
  @action setOtherData(time = "", authMap, elementNameFs = "") {
    this.dynamicDataGenerateTime = time;
    this.elementNameFs = elementNameFs;
    if (authMap !== undefined) {
      this.authMap = authMap;
    }
  }

  //24小时 动态data
  @computed get customDynamicData() {
    if (isValidVariable(this.dynamicData)) {
      return Object.values(this.dynamicData).filter((item) => {
        if (item.capacityTime !== "BASE") {
          // if( item.capacityTime === "0"  ){
          return true;
        } else {
          return false;
        }
      });
    }
    return [];
  }

  //根据kind类型更新data
  @action updateDatas(kind, data) {
    switch (kind) {
      case "default":
      case "static":
        this.setStaticData(data);
        break;

      case "dynamic":
        this.setDynamicData(data);
        break;
    }
    // console.log( this.staticData )
  }
}

const capacity = new Capacity();

export { capacity };
