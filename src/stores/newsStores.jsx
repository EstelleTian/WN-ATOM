/*
 * @Author: your name
 * @Date: 2020-12-21 18:41:43
 * @LastEditTime: 2020-12-22 17:24:51
 * @LastEditors: Please set LastEditors
 * @Description: 消息中心数据存储
 * @FilePath: \WN-CDM\src\stores\infoStores.jsx
 */
import { observable, action, computed, makeObservable } from 'mobx'


class New{
    constructor(){
        makeObservable(this)
    }
    
    //消息id
    @observable id = ""
    //消息入库时间
    @observable timestamp = ""
    //消息生成时间
    @observable generateTime = ""
    //消息发送时间
    @observable sendTime = ""
    //消息名称
    @observable name = ""
    //消息代码
    @observable code = ""
    //消息级别（message notice warning）
    @observable level = ""
    //消息内容
    @observable content = ""
    //消息数据
    @observable data = ""
    //消息发送者
    @observable publishUser = ""

 
}

class NewsList{
    constructor(){
        makeObservable(this)
    }
    //消息数据
    @observable list = [];

    //插入消息
    @action addNews( newList ){
        newList.map( item => this.list.unshift( item ))
    }
    // 清空消息
    @action emptyNews(){
        this.list = [];
    }
    //删除消息
    @action delNew( item ){
        this.list.remove( item );
    }
    
}

let newsList = new NewsList();

export { newsList }