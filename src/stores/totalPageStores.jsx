/*
 * @Author: your name
 * @Date: 2020-12-14 10:18:25
 * @LastEditTime: 2020-12-22 19:24:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\stores\totalPageStores.jsx
 */

import { makeObservable, observable, action, computed } from 'mobx'

// 用户订阅监控单元数据
class UserSubscribeData {
    constructor(){
        makeObservable(this)
    }
    // 用户订阅监控单元原始数据
    @observable originalSubscribeData = {};
    // 用户订阅监控单元数据
    @observable subscribeData = {};

    //更新航班数据
    @action updateUserSubscribeData( monitorData ){
        let value = monitorData.value;
        this.originalSubscribeData = monitorData;
        this.subscribeData = JSON.parse(value);
    }
}
let userSubscribeData = new UserSubscribeData();
export { userSubscribeData }