/*
 * @Author: your name
 * @Date: 2021-02-05 12:59:35
 * @LastEditTime: 2021-04-07 18:01:03
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
    //航班协调tab选中状态
    @observable activeTab = "1";
    //高亮工作流id
    @observable focusTaskId = "";

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
    //根据航班id查找定位流水id
    @action getIdByFlightId( fid ){
        let key = "";
        this.todos.map( todo => {
            const flightObj = todo.flightObj || {}
            const id = flightObj.id || "";
            if( fid+"" === id+""){
                 key = todo.key || ""
            }
            
        })
        return key;
    }
}


let todoList = new TODOList();
// let myApplicationList = new MyApplicationList();

export { todoList,  }