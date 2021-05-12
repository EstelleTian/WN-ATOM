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
    if (this.tabSelect === "") {
      const { categorySubscribeConfigs = [] } = data;
      const config = categorySubscribeConfigs[0] || {};
      const type = config.type || "";
      this.setTabSelect(type);
    }
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
            child.subscribe = checked;
          }
        });
      }
    });
  }
  //不是全选中 - 全选   全选中->全不选
  @action hasAllChecked() {
    const { categorySubscribeConfigs = [] } = this.data;

    let tabItems = categorySubscribeConfigs.filter((item) => {
      if (item.type === this.tabSelect) {
        return item;
      }
    });

    if (tabItems.length > 0) {
      tabItems = tabItems[0] || {};
    }
    const children = tabItems.children || [];
    const unCheckedChildren = children.filter((child) => {
      if (!child.subscribe) {
        return child;
      }
    });

    return unCheckedChildren.length;
  }
  @action changeChecked(type) {
    const { categorySubscribeConfigs } = this.data;
    let tabItems = categorySubscribeConfigs.filter((item) => {
      if (item.type === this.tabSelect) {
        return item;
      }
    });

    if (tabItems.length > 0) {
      tabItems = tabItems[0] || {};
    }
    const children = tabItems.children || [];
    if (type === "all") {
      children.map((child) => {
        child.subscribe = true;
      });
    } else {
      children.map((child) => {
        child.subscribe = false;
      });
    }
  }
}
let newsSubscribe = new NewsSubscribe();
export { newsSubscribe };
