/*
 * @Author: your name
 * @Date: 2020-12-14 10:18:25
 * @LastEditTime: 2021-03-04 13:57:00
 * @LastEditors: Please set LastEditors
 * @Description:ATOM引接应用配置模块Stores
 * @FilePath: \WN-CDM\src\stores\ATOMConfigModalStores.jsx
 */

import { makeObservable, observable, action } from 'mobx'
import { isValidObject } from 'utils/basic-verify'

// ATOM引接应用配置表单数据
class ATOMConfigForm {
    constructor() {
        makeObservable(this)
    }
    //模态框是否显示
    @observable modalVisible = false;

    //是否强制刷新
    @observable forceUpdate = false;

    // 配置数据
    @observable configData = {};

    //更新表单模态框显示状态
    @action toggleModalVisible(visible) {
        this.modalVisible = visible;
    }
    //强制更新
    @action setForceUpdate(flag) {
        this.forceUpdate = flag;
    }
    // 更新配置选项数据
    @action updateConfigData(data) {
        if (isValidObject(data)) {
            this.configData = data;
        }else {
            this.configData = {};
        }
    }
}

let ATOMConfigFormData = new ATOMConfigForm();

export { ATOMConfigFormData }