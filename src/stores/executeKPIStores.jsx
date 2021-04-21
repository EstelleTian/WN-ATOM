

import { makeObservable, observable, action, computed } from 'mobx'


// 单个方案执行KPI数据部分1
class ExecuteKPIData {
    constructor(){
        makeObservable(this)
    }
    // 数据集合
    @observable KPIData = {};
    //数据时间
    @observable generateTime = "";
    //数据获取
    @observable loading = false;
    //定时器
    @observable timeoutId = "";
    
    //航班列表模态框显示状态
    @observable flightListModalVisible = false;

    //航班列表类别
    @observable flightListCategory = "";
    //航班列表类别
    @observable flightListCategoryZh = "";
    
    //更新KPI数据
    @action updateExecuteKPIData( KPIData ){
        this.KPIData = KPIData;
    }
    //更新loading状态
    @action toggleLoad( load ){
        this.loading = load;
    }
    //更新航班列表模态框显示状态
    @action toggleFlightListModalVisible( visible ){
        this.flightListModalVisible = visible;
    }
    //更新航班列表类别
    @action updateFlightListCategory ( category ){
        this.flightListCategory = category;
    }
    //更新航班列表类别
    @action updateFlightListCategoryZh ( categoryZh ){
        this.flightListCategoryZh = categoryZh;
    }

    //更新航班列表类别
    @computed get getFocusCategoryFlight ( ){
        return this[this.flightListCategory] || [];
    }



    // 影响航班数据集合
    @computed get impactFlight() {
        const {impactFlightCount={}} = this.KPIData;
        const { AF}= impactFlightCount;
        return AF
    }
    // 已执行航班集合
    @computed get executedFlight() {
        const {executedFlight} = this.KPIData;
        return executedFlight
    }
    // 执行中航班集合
    @computed get inExecutionFlight() {
        const {inExecutionFlight} = this.KPIData;
        return inExecutionFlight
    }
    // 待放行航班集合
    @computed get nonExecutionFlight() {
        const {nonExecutionFlight} = this.KPIData;
        return nonExecutionFlight
    }

    // 影响等级
    @computed get impactDegree() {
        const {impactDegree} = this.KPIData;
        return impactDegree
    }
    // 全区DCB
    @computed get tacticDCB() {
        const {tacticDCB} = this.KPIData;
        return tacticDCB
    }
    // 区内DCB
    @computed get inDCB() {
        const {inDCB} = this.KPIData;
        return inDCB
    }
    // 区外DCB
    @computed get outDCB() {
        const {outDCB} = this.KPIData;
        return outDCB
    }
    // 比率数据对象
    @computed get degree() {
        const {degree} = this.KPIData;
        return degree
    }
    // 预计起飞正常率  
    @computed get entiretyNormalRate() {
        const {entiretyNormalRate} = this.KPIData;
        return entiretyNormalRate
    }
    // 实际起飞正常率
    @computed get entiretyDepNormalRate() {
        const {entiretyDepNormalRate} = this.KPIData;
        return entiretyDepNormalRate
    }
    // 四大机场预计起飞正常率
    @computed get apEstimateRateMap() {
        const {apEstimateRateMap} = this.KPIData;
        return apEstimateRateMap
    }
    // 四大机场实际起飞正常率
    @computed get apDepEstimateRateMap() {
        const {apDepEstimateRateMap} = this.KPIData;
        return apDepEstimateRateMap
    }

}

// 单个方案执行KPI数据部分2
class PerformanceKPIData {
    constructor(){
        makeObservable(this)
    }
    // 数据集合
    @observable performanceData = {};
    //数据时间
    @observable generateTime = "";
    //数据获取
    @observable loading = false;
    //定时器
    @observable timeoutId = "";
    //更新航班数据
    @action updatePerformanceKPIData( data ){
        this.performanceData = data;
    }
    //更新loading状态
    @action toggleLoad( load ){
        this.loading = load;
    }
}

let executeKPIData = new ExecuteKPIData();
let performanceKPIData = new PerformanceKPIData();


export { executeKPIData, performanceKPIData }