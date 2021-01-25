/*
 * @Author: your name
 * @Date: 2020-12-14 10:18:25
 * @LastEditTime: 2021-01-25 18:17:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\stores\schemeStores.jsx
 */
import { makeObservable, observable, action, computed } from 'mobx'
import { isValidVariable } from 'utils/basic-verify'
 // 消息历史流列表数据
class InfoHistoryData{
    constructor(){
        makeObservable(this)
    }
    // 消息历史列表
    @observable infoData = [];
    //数据时间
    @observable generateTime = "";
    //定时器
    @observable timeoutId = "";
    //导航选中的过滤类型项
    @observable filterType= 'ALL';
    //数据获取
    @observable loading = false;
    //更新表格loading状态
    @action toggleLoad( load ){
        this.loading = load;
    }
    //更新列表过滤类型项
    @action setFilterType( value ){
        this.filterType = value;
    }

    // 更新消息历史数据-全部
    @action updateTasks( tasks, generateTime){
        this.infoData = tasks;
        this.generateTime = generateTime;
    }
}

let infoHistoryData = new InfoHistoryData();

export { infoHistoryData }