/*
 * @Author: your name
 * @Date: 2020-12-21 18:41:43
 * @LastEditTime: 2021-05-24 19:54:35
 * @LastEditors: Please set LastEditors
 * @Description: 协调窗口相关store
 * @FilePath: \WN-CDM\src\stores\collaboratePopoverStore.jsx
 */
import { observable, action, computed, makeObservable } from "mobx";
import { isValidVariable } from "utils/basic-verify";

class CollaboratePopoverData {
  constructor() {
    makeObservable(this);
  }
  //右键选中的列名
  @observable selectedObj = {
    name: "",
    target: null,
    x: null,
    y: null,
    width: null,
    height: null,
  };
  //选中的航班对象
  @observable data = {};
  //tips
  @observable tipsObj = {
    title: "",
    type: "", //success fail
    name: "",
    target: null,
    x: null,
    y: null,
    width: null,
    height: null,
  };

  //右键选中的列名
  @action setSelectedObj(selectedObj) {
    this.selectedObj = selectedObj;
  }

  //选中航班数据赋值
  @action setData(data) {
    this.data = data;
  }
  //popover显隐-切换
  @action setTipsObj(obj) {
    this.tipsObj = {
      ...this.tipsObj,
      ...obj,
    };
    // setTimeout(() => {
    //   this.tipsObj = {
    //     title: "",
    //     name: "",
    //     target: null,
    //     x: null,
    //     y: null,
    //     width: null,
    //     height: null,
    //   };
    // }, 3000);
  }
}

let collaboratePopoverData = new CollaboratePopoverData();

export { collaboratePopoverData };
