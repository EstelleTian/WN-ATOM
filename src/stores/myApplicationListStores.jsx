/*
 * @Author: your name
 * @Date: 2021-02-05 12:59:35
 * @LastEditTime: 2021-02-05 13:04:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\stores\todoListStores.jsx
 */
import { makeObservable, observable, action, computed } from 'mobx'


 // 放行监控-我的申请列表-数据
// class MyApplicationList {
//     constructor(){
//         makeObservable(this)
//     }
//     // 列表
//     @observable myApplication = [];
//     //数据时间
//     @observable generateTime = "";
//     //数据获取
//     @observable loading = false;
//     //定时器
//     @observable timeoutId = "";

//     //过滤关键字
//     @observable filterKey = "";
//     //过滤时间范围
//     @observable filterTimeRange = "";

//     //更新待办列表数据
//     @action updateMyApplicationListData( data ){
//         this.myApplication = data;
//     }
//     @action updateGenerateTime( time ){
//         this.generateTime = time;
//     }
//     //更新loading状态
//     @action toggleLoad( load ){
//         this.loading = load;
//     }
//     //更新过滤关键字
//     @action setFilterKey( key ){
//         this.filterKey = key;
//     }
//     //更新过滤关键字
//     @action setFilterTimeRange(timeRange){
//         this.filterTimeRange = timeRange;
//     }

//     @computed get filterData () {
//         const mapKey = (item) =>{
//             for(const name in item ){
//                 let val = item[name] || "";
//                 val = val.toString().toUpperCase();
//                 if(val.includes(this.filterKey)){
//                     return true;
//                 }
//             }
//             return false
//         };
//         let filterData = this.myApplication.filter(item => mapKey(item));
//         return filterData;
//     }
// }

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

    //更新待办列表数据
    @action updateMyApplicationsData(myApplications, generateTime) {
        this.myApplications = myApplications;
        this.generateTime = generateTime;

    }
    //更新loading状态
    @action toggleLoad(load) {
        this.loading = load;
    }

}

let myApplicationList = new MyApplicationList();


export { myApplicationList }