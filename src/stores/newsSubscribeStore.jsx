import { makeObservable, observable, action } from "mobx";

class NewsSubscribe {
  constructor() {
    makeObservable(this);
  }
  //接口JSON结构
  @observable data = {};
  //左侧树结构-选中的
  @observable treeSelect = "";
  //按钮选中的
  @observable buttonSelect = "subscribe";
  //tab选中的
  @observable tabSelect = "";
  @action setData(data) {
    this.data = data;
  }
  @action setButtonSelect(name) {
    this.buttonSelect = name;
  }
  @action setTabSelect(name) {
    this.tabSelect = name;
  }
  @action updateSubChecked(type, code, checked) {
    const { categorySubscribeConfigs } = this.data;
    categorySubscribeConfigs.map((item) => {
      if (item.type === type) {
        const children = item.children || [];
        children.map((child) => {
          if (child !== null && child.code === code) {
            child.isSubscribe = checked;
          }
        });
      }
    });
  }
  //   @action getTabs() {
  //     const {categorySubscribeConfigs}=this.data;
  //     categorySubscribeConfigs.map(item=>{
  //         let obj = {}
  //     })
  //   }
}
let newsSubscribe = new NewsSubscribe();
export { newsSubscribe };
