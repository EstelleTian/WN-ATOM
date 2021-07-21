import { observable, action, computed, makeObservable } from "mobx";
class ColumnConfig {
  constructor() {
    makeObservable(this);
  }
  //请求格式
  @observable requestData = {};
  //请求格式
  @observable columnData = {};
  // @observable modalVisible = false;
  @observable modalVisible = false;

  @action toggleModalVisible(flag) {
    this.modalVisible = flag;
  }
  @action setRequestData(obj) {
    this.requestData = obj;
    const valueStr = obj.value || "{}";
    const valueObj = JSON.parse(valueStr);
    let data = {};
    let index = 0;
    for (let key in valueObj) {
      let item = valueObj[key];
      item["key"] = index;
      data[key] = item;
      index++;
    }
    this.columnData = data;
  }
  @action updateColumnData(obj) {
    this.columnData = { ...this.columnData, ...obj };
  }
  @action setColumnData(data) {
    this.columnData = data;
  }
  @action resetColumnData() {
    const valueStr = this.requestData.value || "{}";
    const valueObj = JSON.parse(valueStr);
    this.columnData = valueObj;
  }
  // // 获取显示列
  // @computed get displayColumnData() {
  //   let displayList = [];
  //   let columnList = Object.values(this.columnData);
  //   displayList = columnList.filter((item) => item.display === 1);
  //   return displayList;
  // }
  
  // 获取显示列
  @computed get displayColumnData() {
    let displayColumnData = {};
    let requestData = this.requestData;
    const valueStr = requestData.value || "{}";
    const valueObj = JSON.parse(valueStr);
    for (let key in valueObj) {
      let item = valueObj[key];
      if(item.display === 1){
        displayColumnData[key] = item;
      }
    }
    return displayColumnData;
  }
}
const columnConfig = new ColumnConfig();

export { columnConfig };
