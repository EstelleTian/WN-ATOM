/*
 * @Author: your name
 * @Date: 2021-02-05 12:59:35
 * @LastEditTime: 2021-03-31 11:00:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\stores\todoListStores.jsx
 */
import { makeObservable, observable, action, computed } from 'mobx'


// 放行监控-待办列表-数据
class TODOList {
    constructor() {
        makeObservable(this)
    }
    // 列表
    @observable todos = [];
    //是否强制刷新
    @observable forceUpdate = false;
    //数据时间
    @observable generateTime = "";
    //数据获取
    @observable loading = false;
    //定时器
    @observable timeoutId = "";

    //更新待办列表数据
    @action updateTodosData(todos, generateTime) {
        this.todos = todos;
        this.generateTime = generateTime;

    }
    //更新loading状态
    @action toggleLoad(load) {
        this.loading = load;
    }
    //修改--待办-强制更新
    @action setForceUpdate( flag ){
        this.forceUpdate = flag;
    }
}

// class MyApplicationList {
//     constructor() {
//         makeObservable(this)
//     }
//     // 列表
//     @observable myApplications = [];
//     //数据时间
//     @observable generateTime = "";
//     //数据获取
//     @observable loading = false;
//     //定时器
//     @observable timeoutId = "";

//     //更新待办列表数据
//     @action updateMyApplicationsData(myApplications, generateTime) {
//         this.myApplications = myApplications;
//         this.generateTime = generateTime;

//     }
//     //更新loading状态
//     @action toggleLoad(load) {
//         this.loading = load;
//     }

// }

let todoList = new TODOList();
// let myApplicationList = new MyApplicationList();

export { todoList,  }