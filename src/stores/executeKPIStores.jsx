/*
 * @Author: your name
 * @Date: 2020-12-14 10:18:25
 * @LastEditTime: 2020-12-22 19:24:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\stores\FlightStores.jsx
 */

import { makeObservable, observable, action, computed } from 'mobx'


 // 单个方案执行KPI数据
class ExecuteKPIData {
    constructor(){
        makeObservable(this)
    }
    // 列表
    @observable KPIData = {};
    //数据时间
    @observable generateTime = "";
    //数据获取
    @observable loading = false;
    // //
    // @observable impactFlights = [];
    // @observable criticalFlights = [];
    // @observable coordinationFlights = [];
    // @observable inPoolFlights = [];
    // @observable closeWaitFlights = [];



ct

    //更新航班数据
    @action updateExecuteKPIData( KPIData ){
        this.KPIData = KPIData;
    }
    //更新loading状态
    @action toggleLoad( load ){
        this.loading = load;
    }
}

let executeKPIData = new ExecuteKPIData();


export { executeKPIData }