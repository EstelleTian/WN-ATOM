/*
 * @Author: your name
 * @Date: 2020-12-14 10:18:25
 * @LastEditTime: 2021-09-17 16:36:05
 * @LastEditors: liutianjiao
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\stores\schemeStores.jsx
 */

import { makeObservable, observable, action, computed } from "mobx";
import { isValidVariable } from "utils/basic-verify";
import moment from "moment";

// 单条方案对象
class SchemeItem {
  @observable id = "";
  //判断是否是 true "已计算" false "计算中"
  @observable isCalculated = false;
  constructor(opt) {
    makeObservable(this);
    for (let key in opt) {
      this[key] = opt[key];
    }
    this.id = opt.id;
    this.isCalculated = this.calculateStatus();
  }
  // 方案数据更新
  @action update(opt) {
    for (let key in opt) {
      if (this.hasOwnProperty(key)) {
        this[key] = opt[key];
      }
    }
    this.isCalculated = this.calculateStatus();
  }

  @action calculateStatus() {
    let flag = false;
    const calStatus = this.calStatus;
    if (calStatus === "CALCULATING") {
      flag = false;
    } else if (calStatus === "CALCULATED") {
      flag = true;
    }

    return flag;
  }
}
// 方案列表数据
class SchemeListData {
  constructor() {
    makeObservable(this);
  }
  // 方案列表
  @observable list = [];
  //数据时间
  @observable generateTime = "";
  //方案选中的id
  @observable activeSchemeId = "";
  //是否强制刷新
  @observable forceUpdate = false;
  //活动方案计算中提示框显隐标记
  @observable activeSchemeCalculatingModalVisible = false;
  //自动检测活动方案为计算中状态标记方案id
  @observable autoCheckCalculatingSchemeIds = [];
  //定时器
  @observable timeoutId = "";
  //方案状态
  @observable statusValues = ["FUTURE", "RUNNING"];

  //NTFM 方案显示类型
  @observable NTFMShowType = ["NTFM-ORIGINAL-100"];

  //勾选筛选项个数
  @observable filterCount = 3;
  // 筛选关键字
  @observable searchVal = "";

  //数据获取
  @observable loading = false;
  //方案详情-显隐状态和id
  @observable detailObj = {
    visible: false,
    modalId: ""
  };

  //更新表格loading状态
  @action toggleLoad(load) {
    this.loading = load;
  }
  //修改--航班列表-强制更新
  @action setForceUpdate(flag) {
    this.forceUpdate = flag;
  }
  //更新活动方案计算中提示框显隐标记
  @action toggleActiveSchemeCalculatingModalVisible(visible) {
    this.activeSchemeCalculatingModalVisible = visible;
  }
  //添加自动检测活动方案为计算中状态标记方案id
  @action addAutoCheckCalculatingSchemeId(id) {
    this.autoCheckCalculatingSchemeIds.push(id);
  }
  //删除指定自动检测活动方案为计算中状态标记方案id
  @action deletAutoCheckCalculatingSchemeId(id) {
    if (this.autoCheckCalculatingSchemeIds.includes(id)) {
      let index = this.autoCheckCalculatingSchemeIds.indexOf(id);
      this.autoCheckCalculatingSchemeIds.splice(index, 1);
    }
  }
  //更新表格loading状态
  @action setStatusValues(values) {
    console.log("aaa", values);
    this.statusValues = values;
    this.setFilterCount();
  }
  // 更新NTFM类型方案显示
  @action setNTFMShowType(values) {
    console.log("aaa ntfm", values);
    this.NTFMShowType = values;
    this.setFilterCount();
  }
  // 更新显示条件计数
  @action setFilterCount() {
    console.log("aaa", this.statusValues, this.NTFMShowType);
    this.filterCount = this.statusValues.length + this.NTFMShowType.length;
  }
  // 增加方案-单条
  @action addScheme(opt) {
    const item = new SchemeItem(opt);
    this.list.unshift(item);
  }
  // 增加方案-多条
  @action addMultiScheme(arr) {
    arr.map((opt) => {
      const item = new SchemeItem(opt);
      this.list.unshift(item);
    });
  }
  // 删除方案
  @action delScheme(schemeItem) {
    this.list.remove(schemeItem);
  }
  // 更新方案-全部
  @action updateList(arr, generateTime) {
    const newList = new Set();
    this.generateTime = generateTime;
    let hasId = false;
    arr.map((item) => {
      item["dataGenerateTime"] = generateTime;
      const itemIns = new SchemeItem(item);
      if (item.id === this.activeSchemeId) {
        this.activeSchemeId = item.id;
        hasId = true;
      }
      newList.add(itemIns);
    });
    //如果更新的方案，没有之前选中的,置为空
    if (!hasId) {
      this.activeSchemeId = "";
    }
    //数组赋值
    this.list = Array.from(newList);
  }

  // 更新方案-多条
  @action updateList2(arr) {
    const len = this.list.length;
    arr.map((item) => {
      const id = item.id;
      //检验list有没有同id的方案
      let sameScheme = this.list.filter((item) => id === item.id);
      let hasScheme = sameScheme.length === 0 ? false : true;

      //没有同id的就添加一条
      if (len === 0 || hasScheme === false) {
        const itemIns = new SchemeItem(item);
        this.list.push(itemIns);
      } else {
        //有同id的 更新数据
        sameScheme.map((orgScheme) => {
          orgScheme.update(item);
        });
      }
    });
  }

  //根据激活方案id查找方案对象
  @action activeScheme(targetId) {
    let active = {};
    let activeList = this.list.filter((item) => item.id === targetId);
    if (activeList.length > 0) {
      active = activeList[0];
    }
    return active;
  }
  //获取方案起止时间
  @computed get getTimeRange() {
    const activeScheme = this.activeScheme(this.activeSchemeId) || {};
    const { tacticTimeInfo = {} } = activeScheme;
    const { startTime, endTime } = tacticTimeInfo;
    return {
      activeSchemeId: this.activeSchemeId,
      schemeStartTime: startTime,
      schemeEndTime: endTime
    };
  }
  //激活选中方案，重置其他方案
  @action toggleSchemeActive(id) {
    this.activeSchemeId = id;
  }

  //根据激活选中方案，获取方案名称
  @action getNameBySchemeActiveId(id) {
    let tacticName = "";
    let sId = isValidVariable(id) ? id : this.activeSchemeId;
    if (isValidVariable(sId)) {
      let schemeArr = this.list.filter((item) => sId === item.id);
      if (schemeArr.length > 0) {
        tacticName = schemeArr[0].tacticName || "";
      }
    }
    return tacticName;
  }

  //快捷筛选关键字
  @action setSearchVal(values) {
    this.searchVal = values;
  }

  @computed get sortedList() {
    let list = [...this.list];
    const searchVal = this.searchVal.toLowerCase();

    let statusValues = [...this.statusValues];
    //获取方案列表--开启下一轮更新
    let index = statusValues.indexOf("TERMINATED");
    if (index > -1) {
      // 将"TERMINATED"替换为 "FINISHED","TERMINATED_MANUAL","TERMINATED_AUTO"
      statusValues.splice(
        index,
        1,
        "FINISHED",
        "TERMINATED_MANUAL",
        "TERMINATED_AUTO"
      );
    }

    // 参数过滤
    list = list.filter((item) => {
      const tacticStatus = item.tacticStatus || "";
      if (statusValues.indexOf(tacticStatus) > -1) {
        return true;
      } else {
        return false;
      }
    });
    // NTFMShowType;
    list = list.filter((item) => {
      const tacticSource = item.tacticSource || "";
      if (
        tacticSource === "NTFM-ORIGINAL-100" ||
        tacticSource === "NTFM-ORIGINAL-200"
      ) {
        if (this.NTFMShowType.indexOf(tacticSource) > -1) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    });

    //快速过滤
    if (isValidVariable(searchVal) && isValidVariable(list)) {
      list = list.filter((item) => {
        // 方案名称
        let tacticName = isValidVariable(item.tacticName)
          ? item.tacticName.toLowerCase()
          : "";
        let directionList = item.directionList || [];
        let directionData = directionList[0] || {};
        // 基准点
        let targetUnit = directionData.targetUnit || "";
        targetUnit = isValidVariable(targetUnit)
          ? targetUnit.toLowerCase()
          : "";

        let basicFlowcontrol = item.basicFlowcontrol || {};
        let flowControlMeasure = basicFlowcontrol.flowControlMeasure || {};
        // 限制方式
        let restrictionMode = flowControlMeasure.restrictionMode || "";
        restrictionMode = isValidVariable(restrictionMode)
          ? restrictionMode.toLowerCase()
          : "";
        if (
          tacticName.indexOf(searchVal) !== -1 ||
          targetUnit.indexOf(searchVal) !== -1 ||
          restrictionMode.indexOf(searchVal) !== -1
        ) {
          return true;
        } else {
          return false;
        }
      });
    }

    if (list.length > 0) {
      list = list.slice().sort((a, b) => {
        const data1 = a.tacticTimeInfo.publishTime;
        const data2 = b.tacticTimeInfo.publishTime;
        if (isValidVariable(data1) && isValidVariable(data2)) {
          let res = data1.localeCompare(data2);
          if (0 !== res) {
            return res * -1;
          }
        } else if (isValidVariable(data1)) {
          return -1;
        } else if (isValidVariable(data2)) {
          return 1;
        }
        return 0;
      });
    }

    // console.log("方案list", list);
    return list;
  }
}

let schemeListData = new SchemeListData();

export { schemeListData };
