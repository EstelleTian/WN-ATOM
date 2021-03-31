/*
 * @Author: your name
 * @Date: 2021-02-05 12:59:35
 * @LastEditTime: 2021-03-31 15:50:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\stores\todoListStores.jsx
 */
import { makeObservable, observable, action, computed } from 'mobx'


class MyApplicationList {
    constructor() {
        makeObservable(this)
    }
    // 列表
    @observable myApplications = [];
    //数据时间
    @observable generateTime = "";
    //数据获取
    @observable loading = false;
    //定时器
    @observable timeoutId = "";
    //是否强制刷新
    @observable forceUpdate = false;

    //更新已办列表数据
    @action updateMyApplicationsData(myApplications, generateTime) {
        this.myApplications = myApplications;
        this.generateTime = generateTime;

    }
    //更新loading状态
    @action toggleLoad(load) {
        this.loading = load;
    }
    //修改--已办-强制更新
    @action setForceUpdate( flag ){
        this.forceUpdate = flag;
    }

}

let myApplicationList = new MyApplicationList();


export { myApplicationList }