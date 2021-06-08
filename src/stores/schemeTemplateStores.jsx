/*
 * @Author: your name
 * @Date: 2020-12-14 10:18:25
 * @LastEditTime: 2021-03-04 13:57:00
 * @LastEditors: Please set LastEditors
 * @Description: 方案模板数据Stores
 * @FilePath: \WN-CDM\src\stores\schemeTemplateStores.jsx
 */

import { makeObservable, observable, action, computed } from 'mobx'
import { isValidVariable, isValidObject } from 'utils/basic-verify'

// 方案模板数据
class SchemeTemplate {
    constructor() {
        makeObservable(this)
    }
    // 模板数据
    @observable templateData = [];
    // 选中的模板id
    @observable selectedTemplateId = "";
    // 选中的模板数据
    @observable selectedTemplateData = {};

    //计数器用于变更此值以触发子组件更新
    @observable counter = 0;

    //更新计数器
    @action triggerCounterChange() {
        let t = this.counter;
        t++;
        this.counter = t;
    }
    // 更新选中的模板id
    @action updateSelectedTemplateId(id) {
        this.selectedTemplateId = id;
    }
    // 更新模板数据
    @action updateTemplateData(data) {
        let dataSet = [];
        if(isValidVariable(data) && Array.isArray(data) && data.length > 0){
            dataSet = data;
        }
        this.templateData = dataSet;
    }
    // 更新模板数据
    @action getRepeatTemplateData(templateName) {
        let templateData = this.templateData;
        let repeatData = [];
        if(isValidVariable(templateData) && Array.isArray(templateData) && templateData.length > 0){
            repeatData = templateData.filter((v) => {
                if(isValidVariable(v.name)){
                    return v.name.trim() === templateName.trim();
                }else{
                    return false;
                }
            });
        }
        return repeatData;
    }
}

let schemeTemplateData = new SchemeTemplate();

export { schemeTemplateData }