import { makeObservable, observable, action } from "mobx";

class FightSearch {
  constructor() {
    makeObservable(this);
  }
  //略情航班列表
  @observable flightListData = [];
  //选中的单个航班
  @observable selectedId = "";
  //查询日期
  @observable searchDate = "today";
  //查询输入框内容
  @observable searchInputVal = "";
  //查询输入框提示
  @observable searchTooltipText = "";
  //查询输入框loading
  @observable searchLoadingVisible = false;
  //单个略情航班
  @observable drawerFlight = {};
  //单个略情航班抽屉框是否显示
  @observable drawerVisible = false;
  //单个略情是否显示
  @action setDrawerVisible(flag) {
    this.drawerVisible = flag;
  }
  //单个略情航班
  @action setDrawerFlight(flight) {
    this.drawerFlight = flight;
  }
  //略情航班列表
  @action setFlightListData(list) {
    this.flightListData = list;
  }
  //略情航班列表
  @action setSelectedId(id) {
    this.selectedId = id;
  }
  //查询日期
  @action setSearchDate(val) {
    this.searchDate = val;
  }
  //查询输入框内容
  @action setSearchInputVal(val) {
    this.searchInputVal = val;
  }
  //查询输入框提示
  @action setSearchTooltipText(val) {
    this.searchTooltipText = val;
  }
  //查询输入框loading
  @action setSearchLoadingVisible(flag) {
    this.searchLoadingVisible = flag;
  }
}

const fightSearch = new FightSearch();

export { fightSearch };
