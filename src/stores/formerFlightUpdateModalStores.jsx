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

// 指定前序航班表单数据
class FormerFlightUpdateForm{
    constructor() {
        makeObservable(this)
    }
    //模态框是否显示
    @observable modalVisible = false;
    // 航班id
    @observable flightid = {};

    // 航班数据
    @observable flightData = {};
    // 前序航班数据
    @observable formerFlightData = {};
    // 备选前序航班集合
    @observable alterFormerFlightList = [];
    // 备选前序航班id集合
    @observable alterFormerFlightIdList = [];
    //更新表单模态框显示状态
    @action toggleModalVisible(visible) {
        this.modalVisible = visible;
    }
    // 更新航班数据
    @action updateFlightData (data) {
        // 更新航班数据
        this.flightData = data;
        this.flightid = data.id || ""
    }
    // 更新前序航班数据
    @action updateFormerFlightData (data) {
        // 更新前序航班数据
        this.formerFlightData = data;
    }
    // 更新备选前序航班集合
    @action updateAlterFormerFlightList (flights) {
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
        // 更新备选前序航班集合
        this.alterFormerFlightList = sortedFlightList;
        this.alterFormerFlightIdList = idList;
    }
}

let formerFlightUpdateFormData = new FormerFlightUpdateForm();

export { formerFlightUpdateFormData }