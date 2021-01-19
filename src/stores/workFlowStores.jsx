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
 // 工作流列表数据
class WorkFlowData{
    constructor(){
        makeObservable(this)
    }
    // 工作流列表
    @observable tasks = {};
    //数据时间
    @observable generateTime = "";
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
    @action setActiveTab( value ){
        this.activeTab = value;
    }

    // 更新工作流-全部
    @action updateTasks( tasks, generateTime){
        this.tasks = tasks;
        this.generateTime = generateTime;
    }
    

}

let workFlowData = new WorkFlowData();

export { workFlowData }