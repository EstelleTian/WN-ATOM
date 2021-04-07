/*
 * @Author: your name
 * @Date: 2020-12-14 10:18:25
 * @LastEditTime: 2020-12-22 19:24:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\stores\FlightStores.jsx
 */

import { makeObservable, observable, action, computed } from 'mobx'

// 限制数据
class ImplementTacticsReasonData{
    constructor(){
        makeObservable(this)
    }
    // 限制数据
    @observable tacticsData = {};
    //数据时间
    @observable generateTime = "";
    //数据获取
    @observable loading = false;
    //定时器
    @observable timeoutId = "";

    //更新限制数据
    @action updateImplementTacticsData( tacticsData ){
        this.tacticsData = tacticsData;
    }
    //更新loading状态
    @action toggleLoad( load ){
        this.loading = load;
    }
}

let implementTacticsData = new ImplementTacticsReasonData();


export { implementTacticsData }