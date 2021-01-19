/*
 * @Author: your name
 * @Date: 2020-12-14 10:18:25
 * @LastEditTime: 2020-12-24 19:07:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\stores\schemeStores.jsx
 */

import { makeObservable, observable, action, computed } from 'mobx'
import { isValidVariable } from 'utils/basic-verify'

// 单条工作流对象
class WorkFlowItem{
    // 方案id
    @observable id = ""
    constructor( opt ){
        makeObservable(this)
        for( let key in opt ){
            this[key] = opt[key]
        }
        this.active = false
    }

}
 // 工作流列表数据
class WorkFlowData{
    constructor(){
        makeObservable(this)
    }
    // 方案列表
    @observable list = [];
    //数据时间
    @observable generateTime = "";
    //方案id
    @observable schemeId = "";
    //定时器
    @observable timeoutId = "";
    //导航选中
    @observable activeTab = 'todo';
    //数据获取
    @observable loading = false;
    //更新表格loading状态
    @action toggleLoad( load ){
        this.loading = load;
    }
    //更新表格loading状态
    @action setStatusValues( values ){
        this.statusValues = values;
    }
    // 更新方案-全部
    @action updateList( arr, generateTime){
        this.list = [];
        arr.map( item => {
            const itemIns = new WorkFlowItem(item);
            this.list.push( itemIns );

        });
        this.generateTime = generateTime;
    }

    @computed get newList(){

    }

}

let workFlowData = new WorkFlowData();

export { workFlowData }