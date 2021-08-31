/*
 * @Author: your name
 * @Date: 2020-12-21 18:41:43
 * @LastEditTime: 2021-08-31 14:45:58
 * @LastEditors: liutianjiao
 * @Description: 消息中心数据存储
 * @FilePath: \WN-ATOM\src\stores\newsStores.jsx
 */
import { observable, action, computed, makeObservable } from 'mobx';

class NewsList{
    constructor(){
        makeObservable(this)
    }
    //消息数据
    @observable list = [];
    //消息数据
    @observable generateTime = "";

    //插入消息
    @action addNews( newList ){
        newList.map( item => this.list.unshift( item ))
        let len = this.list.length || 0;
        //如果大于100条，截取前100条
        if( len > 100 ){
            this.list = this.list.splice(0,100)
        }
    }
    //插入消息
    @action addAllNews( newList, generateTime ){
        this.list = newList;
        this.generateTime = generateTime;
    }
    // 清空消息
    @action emptyNews(){
        this.list = [];
    }
    //删除消息
    @action delNew( item ){
        this.list.remove( item );
    }
    //获取消息长度
    @computed get newsLength( ){
        return this.list.length || 0;
    }
    
}

let newsList = new NewsList();

export { newsList }