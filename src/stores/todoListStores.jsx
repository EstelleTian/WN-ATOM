/*
 * @Author: your name
 * @Date: 2021-02-05 12:59:35
 * @LastEditTime: 2021-02-05 13:04:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\stores\todoListStores.jsx
 */
import { makeObservable, observable, action, computed } from 'mobx'


 // 放行监控-待办列表-数据
class TODOList {
    constructor(){
        makeObservable(this)
    }
    // 列表
    @observable todos = [];
    //数据时间
    @observable generateTime = "";
    //数据获取
    @observable loading = false;
    //定时器
    @observable timeoutId = "";

    //更新待办列表数据
    @action updateTodosData( todos ){
        this.todos = todos;
    }
    //更新loading状态
    @action toggleLoad( load ){
        this.loading = load;
    }

}

let todoList = new TODOList();


export { todoList }