import { makeObservable, action, observable } from "mobx";
class mdrsData {
  constructor() {
    makeObservable(this);
  }
  //工作流对象
  @observable hisTasks = [];
  //数据时间
  @observable generateTime = "";
  //按钮权限对象
  @observable authMap = {};
  //是否处于表单编辑中
  @observable editable = false;
  //mdrs表单数据
  @observable formData = {};

  @action setMDRSData = (data, generateTime) => {
    const {
      historyTaskResult: { hisTasks = [] } = {},
      authMap = {},
      mdrs = {},
    } = data;
    this.hisTasks = hisTasks;
    this.generateTime = generateTime;
    this.authMap = authMap;
    this.formData = mdrs;
  };

  @action setEditable = (flag) => {
    this.editable = flag;
  };
}
const MDRSData = new mdrsData();
export { MDRSData };
