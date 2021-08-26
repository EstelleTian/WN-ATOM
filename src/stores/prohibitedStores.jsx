/*
 * @Author: your name
 * @Date: 2021-02-05 12:59:35
 * @LastEditTime: 2021-08-26 13:56:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\stores\prohibitedStore.jsx
 */
import { makeObservable, observable, action, computed } from "mobx";

// 放行监控-禁航信息-数据
class ProhibitedData {
  constructor() {
    makeObservable(this);
  }
  // 列表
  @observable dataList = [];
  //是否强制刷新
  @observable forceUpdate = false;
  //数据时间
  @observable generateTime = "";
  //数据获取
  @observable loading = false;
  //定时器
  @observable timeoutId = "";

  //高亮航班id
  @observable focusFlightId = "";
  //高亮工作流id
  @observable focusSid = "";

  //禁航信息列表模态框
  @observable prohibitedListModalVisible = false;
  //禁航信息表单模态框
  @observable updateInfoModalVisible = false;
  //禁航信息表单数据
  @observable formData = {};
  //禁航信息表单类型
  @observable formType = "add";

  //更新禁航信息换列表数据
  @action updateProhibitedListData(slotList, generateTime) {
    this.dataList = slotList;
    this.generateTime = generateTime;
  }
  //更新loading状态
  @action toggleLoad(load) {
    this.loading = load;
  }
  //禁航信息列表模态框显隐
  @action setProhibitedListModalVisible(flag) {
    this.prohibitedListModalVisible = flag;
  }
  //禁航信息表单模态框
  @action setUpdateInfoModalVisible(flag) {
    this.updateInfoModalVisible = flag;
  }
  //修改--禁航信息-强制更新
  @action setForceUpdate(flag) {
    this.forceUpdate = flag;
  }
  //填充--表单数据
  @action setFormData(data, type = "add") {
    this.formData = data;
    this.formType = type;
  }
}

let prohibitedData = new ProhibitedData();

export { prohibitedData };
