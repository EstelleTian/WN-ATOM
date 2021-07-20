/*
 * @Author: your name
 * @Date: 2020-12-14 10:18:25
 * @LastEditTime: 2021-03-04 13:57:00
 * @LastEditors: Please set LastEditors
 * @Description: 跑道模块Stores
 * @FilePath: \WN-CDM\src\stores\schemeStores.jsx
 */

import { makeObservable, observable, action, computed } from 'mobx'
import { isValidVariable, isValidObject } from 'utils/basic-verify'

// 航班表格字号数据
class FlightTableFontSize {
    constructor() {
        makeObservable(this)
    }
    // 表格列字号数据
    @observable columnFontSizeData = {};
    //计数器用于变更此值以触发子组件更新
    @observable counter = 0;
    
    //更新计数器
    @action triggerCounterChange() {
        let t = this.counter;
        t++;
        this.counter = t;
    }
    // 更新方案模式
    @action updateColumnFontSizeData(col, fontSize) {
        let data = {... this.columnFontSizeData};
        data[col] = fontSize;
        this.columnFontSizeData = data;
    }
}

let flightTableFontSizeData = new FlightTableFontSize();

export { flightTableFontSizeData }