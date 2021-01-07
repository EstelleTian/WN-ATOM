/*
 * @Author: your name
 * @Date: 2020-12-14 10:18:25
 * @LastEditTime: 2020-12-22 19:24:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\stores\FlightStores.jsx
 */

import { makeObservable, observable, action, computed } from 'mobx'

 // 执行KPI数据
class KpiData{
    constructor(){
        makeObservable(this)
    }
    // 列表
    @observable list = [];
    //数据时间
    @observable generateTime = "";
    //数据获取
    @observable loading = false;

    //更新表格loading状态
    @action toggleLoad( load ){
        this.loading = load;
    }
    

}

let kpiData = new KpiData();


export { kpiData }