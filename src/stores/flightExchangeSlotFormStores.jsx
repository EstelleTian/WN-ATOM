/*
 * @Author: your name
 * @Date: 2020-12-14 10:18:25
 * @LastEditTime: 2021-03-04 13:57:00
 * @LastEditors: Please set LastEditors
 * @Description: 跑道模块Stores
 * @FilePath: \WN-CDM\src\stores\schemeStores.jsx
 */

import { makeObservable, observable, action, computed } from 'mobx'
// 航班时隙交换表单数据
class FlightExchangeSlotForm{
    constructor() {
        makeObservable(this)
    }
    //模态框是否显示
    @observable modalVisible = false;
    // 申请航班id
    @observable claimantFlightid = "";

    // 申请航班
    @observable claimantFlightData = {};
    // 目标航班
    @observable targetFlightData = {};
    // 备选目标航班集合
    @observable alterTargetFlightList = [];
    // 备选目标航班id集合
    @observable alterTargetFlightIdList = [];
    //更新表单模态框显示状态
    @action toggleModalVisible(visible) {
        this.modalVisible = visible;
    }
    // 更新航班数据
    @action updateClaimantFlightData (data) {
        // 更新航班数据
        this.claimantFlightData = data;
        this.claimantFlightid = data.id || ""
    }
    // 更新前序航班数据
    @action updateTargetFlightData (data) {
        // 更新前序航班数据
        this.targetFlightData = data;
    }
    // 更新备选前序航班集合
    @action updateAlterTargetFlightList (flights) {
        let idList = [];
        let flightList = [];
        for( let i in flights){
            let id = i;
            let flight = flights[i].flight || {};
            idList.push(id);
            flightList.push(flight);
        }
        let sortedFlightList = flightList.sort((item1, item2) => {
            let nameA = item1.sobt; // ignore upper and lowercase
            let nameB = item2.sobt; // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            // names must be equal
            return 0;
        });
        // 备选目标航班集合
        this.alterTargetFlightList = sortedFlightList;
        this.alterTargetFlightIdList = idList;
    }
}

let flightExchangeSlotFormData = new FlightExchangeSlotForm();

export { flightExchangeSlotFormData }