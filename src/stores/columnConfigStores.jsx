import { observable, action, makeObservable } from "mobx";
class ColumnConfig {
  constructor() {
    makeObservable(this);
  }
  //请求格式
  @observable requestData = {};
  //请求格式
  @observable columnData = {};
  // @observable modalVisible = false;
  @observable modalVisible = true;

  @action toggleModalVisible(flag) {
    this.modalVisible = flag;
  }
  @action setRequestData(obj) {
    this.requestData = obj;
    const valueStr = obj.value || "{}";
    const valueObj = JSON.parse(valueStr);
    // let dataArr = [];
    // let data = {};
    // let index = 0;
    // for (let key in valueObj) {
    //   let item = valueObj[key];
    //   item["key"] = index;
    //   // if (index < 1) {
    //   //   dataArr.push(item);
    //   // }
    //   // dataArr.push(item);
    //   data[key] = item;
    //   index++;
    // }
    this.columnData = valueObj;
  }
  @action updateColumnData(obj) {
    this.columnData = { ...this.columnData, ...obj };
  }
  @action setColumnData(data) {
    this.columnData = data;
  }
  @action resetColumnData(){
    const valueStr = this.requestData.value || "{}";
    const valueObj = JSON.parse(valueStr);
    this.columnData = valueObj;
  }
}
const columnConfig = new ColumnConfig();

export { columnConfig };
