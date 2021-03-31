/*
 * @Author: your name
 * @Date: 2020-12-14 10:18:25
 * @LastEditTime: 2021-03-05 10:07:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\stores\FlightStores.jsx
 */

import { makeObservable, observable, action, computed } from 'mobx'


// 单个方案执行KPI数据部分1
class ExecuteKPIData {
    constructor(){
        makeObservable(this)
    }
    // 数据集合
    @observable executeData = {};
    //数据时间
    @observable generateTime = "";
    //数据获取
    @observable loading = false;
    //定时器
    @observable timeoutId = "";

    //更新航班数据
    @action updateExecuteKPIData( KPIData ){
        this.executeData = KPIData;
    }
    //更新loading状态
    @action toggleLoad( load ){
        this.loading = load;
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