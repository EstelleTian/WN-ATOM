/*
 * @Author: your name
 * @Date: 2020-12-14 10:18:25
 * @LastEditTime: 2021-03-04 13:57:00
 * @LastEditors: Please set LastEditors
 * @Description:NTFM引接应用配置模块Stores
 * @FilePath: \WN-CDM\src\stores\NTFMConfigModalStores.jsx
 */

import { makeObservable, observable, action } from 'mobx'
import { isValidObject } from 'utils/basic-verify'

// NTFM引接应用配置表单数据
class NTFMConfigForm {
    constructor() {
        makeObservable(this)
    }
    //模态框是否显示
    @observable modalVisible = false;
    // 配置选项数据
    @observable configOptionData = {};
    // 选中的配置值
    @observable configValue = "";

    //更新表单模态框显示状态
    @action toggleModalVisible(visible) {
        this.modalVisible = visible;
    }
    // 更新配置选项数据
    @action updateConfigData(data) {
        if (isValidObject) {
            // 选中的配置值 
            const val = data.currentVal || "";
            // 更新配置选项数据
            this.configOptionData = data.alternative || {}
            // 更新选中的配置值
            this.configValue = val;
        }else {
            // 更新配置选项数据
            this.configOptionData = {}
            // 更新选中的配置值
            this.configValue = "";
        }
    }
}

let NTFMConfigFormData = new NTFMConfigForm();

export { NTFMConfigFormData }