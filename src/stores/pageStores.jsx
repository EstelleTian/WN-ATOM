/*
 * @Author: your name
 * @Date: 2020-12-21 18:41:43
 * @LastEditTime: 2021-07-12 13:40:06
 * @LastEditors: Please set LastEditors
 * @Description: 页面相关store
 * @FilePath: \WN-CDM\src\stores\pageStores.jsx
 */
import { observable, action, computed, makeObservable } from "mobx";
import { isValidVariable } from "utils/basic-verify";

class UserInfo {
  constructor(opt) {
    makeObservable(this);
    for (let key in opt) {
      this[key] = opt[key];
    }
  }
  @observable id = "";
}

class SystemPage {
  constructor() {
    makeObservable(this);
  }
  //左上导航选中 模块名称
  @observable leftNavSelectedName = "";
  @observable leftNavNameList = [];
  //左上切换模块名称 执行kpi
  @observable leftActiveName = "kpi";
  // @observable leftActiveName = "todo";
  //右侧切换模块名称 方案列表 外部流控
  @observable rightActiveName = "scheme";
  //右侧切换模块名称 豁免、等待池、特殊、失效、航班协调
  @observable modalActiveName = "";
  //航班查询
  @observable activeFlightSearch = true;
  //左侧导航席位
  @observable xiwei = "";
  //左侧导航-时间范围
  @observable dateRange = "";
  //用户对象信息
  @observable user = {};
  //全局刷新按钮
  @observable pageRefresh = false;
  //计划时间范围-基准日期（方案列表获取时候赋值）
  @observable baseDate = "";
  //计划时间范围显隐
  @observable dateRangeVisible = false;
  //计划时间范围内容
  @observable dateRangeData = [];
  @observable dateBarRangeData = [];
  //系统列表
  @observable systemList = [];
  @observable activeSystem = {};
  //当前系统名称--用于判断显示内容
  // CRS              [显示KPI, CRS列配置]
  // CDM              [不显示KPI, CDM列配置]
  // CRS-REGION（分局）[显示KPI, 分局列配置]
  // 3选一
  @observable systemKind = "";
  //系统列表-赋值
  @action setSystemList(list, urlName = "") {
    let newList = list.filter((item) => {
      if (urlName === "") {
        //选默认的
        if (item.logo === "DEFAULT") {
          this.activeSystem = item;
          return false;
        }
      } else if (item.systemType === urlName) {
        this.activeSystem = item;
        return false;
      }
      return true;
    });
    this.systemList = newList;
  }
  //当前系统名称-赋值
  @action setSystemKind(name) {
    this.systemKind = name;
  }

  //计划时间范围显隐
  @action setDateRangeVisible(flag) {
    this.dateRangeVisible = flag;
  }
  //计划时间范围内容
  @action setDateRangeData(range) {
    this.dateRangeData = [...range];
  }
  //计划时间范围内容-获取
  @action getDateRangeData() {
    const dateRangeData = this.dateRangeData;
    let start = dateRangeData[0] || "";
    let end = dateRangeData[1] || "";
    if (isValidVariable(start) && start.length >= 10) {
      start = start.substring(6, 8) + "/" + start.substring(8, 10);
    }
    if (isValidVariable(end) && end.length >= 10) {
      end = end.substring(6, 8) + "/" + end.substring(8, 10);
    }
    if (isValidVariable(start) && isValidVariable(end)) {
      return start + "-" + end;
    }
    return "";
  }
  //计划时间范围-基准日期（方案列表获取时候赋值）
  @action setBaseDate(generateTime) {
    if (generateTime.length >= 8) {
      const base = generateTime.substring(0, 8);
      this.baseDate = base;
      // if (this.dateRangeData.length === 0) {
      //   this.setDateRangeData([base + "0000", base + "2359"]);
      // }
    }
  }
  //左上导航选中 模块名称
  @action setLeftNavSelectedName(name) {
    this.leftNavSelectedName = name;
  }
  //左上切换模块名称 执行kpi
  @action setLeftActiveName(name) {
    if (name === "") {
      this.leftActiveName = name;
    } else if (isValidVariable(name)) {
      this.leftActiveName = name;
    }
  }
  //右侧切换模块名称 方案列表 scheme 外部流控 outer_scheme
  @action setRightActiveName(name) {
    if (isValidVariable(name)) {
      this.rightActiveName = name;
    }
  }
  //右侧切换模块名称 豁免、等待池、特殊、失效、航班协调
  @action setModalActiveName(name) {
    this.modalActiveName = name;
  }
  //航班查询-切换
  @action toggleFlightSearch(flag) {
    if (flag === undefined) {
      this.activeFlightSearch = !this.activeFlightSearch;
    } else {
      this.activeFlightSearch = flag;
    }
  }
  //左侧导航席位
  @action setXiwei(name) {
    if (isValidVariable(name)) {
      this.xiwei = name;
    }
  }
  //左侧导航-时间范围
  @action setDateRange(name) {
    if (isValidVariable(name)) {
      this.dateRange = name;
    }
  }
  //用户信息-赋值
  @action setUserData(user) {
    const userinfo = new UserInfo(user);
    this.user = userinfo;
  }

  //用户信息-赋值
  @action userHasAuth(authCode) {
    let flag = false;
    if (isValidVariable(this.user.id)) {
      const roles = this.user.roles || [];
      if (roles.length > 0) {
        roles.map((role) => {
          if (!flag) {
            const authorities = role.authorities || [];
            if (authorities.length > 0) {
              authorities.map((authority) => {
                if (!flag) {
                  const code = authority.code || "";
                  if (
                    authCode * 1 > 0 &&
                    code * 1 > 0 &&
                    authCode * 1 === code * 1
                  ) {
                    flag = true;
                  }
                }
              });
            }
          }
        });
      }
    }
    return flag;
  }

  @action getSystemListByGroup() {
    let cdmList = [];
    let crsList = [];
    this.systemList.map((item) => {
      if (item.system === "CDM") {
        cdmList.push(item);
      } else if (item.system === "CRS") {
        crsList.push(item);
      }
    });
    return { cdmList, crsList };
  }
}

let systemPage = new SystemPage();

export { systemPage };
