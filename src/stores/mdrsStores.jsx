import { makeObservable, action, observable } from "mobx";
class mdrsData {
  constructor() {
    makeObservable(this);
  }
  //工作流对象
  @observable historyTaskResult = {};
  //数据时间
  @observable generateTime = "";
  //按钮权限对象
  @observable authMap = {};
  //是否处于表单编辑中
  @observable editable = false;
  //是否强制更新
  @observable forceUpdate = false;
  //mdrs表单数据
  @observable formData = {};
  //mdrs 已发布数据
  @observable publishData = [];

  @action setMDRSData = (data, generateTime) => {
    const {
      historyTaskResult = {},
      authMap = {},
      mdrs = {},
    } = data;
    this.historyTaskResult = historyTaskResult;
    this.generateTime = generateTime;
    this.authMap = authMap;
    this.formData = mdrs;
  };
  @action setPublishData = (data) => {

    this.publishData = data;
  };

  @action setEditable = (flag) => {
    this.editable = flag;
  };
  @action setForceUpdate = (flag) => {
    this.forceUpdate = flag;
  };
}
const MDRSData = new mdrsData();
export { MDRSData };
