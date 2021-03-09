/*
 * @Author: your name
 * @Date: 2020-12-14 10:18:25
 * @LastEditTime: 2021-03-04 13:57:00
 * @LastEditors: Please set LastEditors
 * @Description: 跑道模块Stores
 * @FilePath: \WN-CDM\src\stores\schemeStores.jsx
 */

import { makeObservable, observable, action, computed } from 'mobx'
import { isValidVariable } from 'utils/basic-verify'

// 单条跑道对象
class RunwayItem{
    @observable id = ""
    constructor( opt ){
        makeObservable(this)
        for( let key in opt ){
            this[key] = opt[key]
        }
        this.id = opt.id;
    }
    // 跑道数据更新
    @action update( opt ){
        for( let key in opt ){
            if( this.hasOwnProperty(key) ){
                this[key] = opt[key]
            }
        }
    }

}
 // 跑道列表数据
class RunwayListData{
    constructor(){
        makeObservable(this)
    }
    // 跑道列表
    @observable list = [];
    //数据时间
    @observable generateTime = "";
    //定时器
    @observable timeoutId = "";
    //跑道过滤关键字
    @observable filterKey = "EFFECTIVE";
    //数据获取
    @observable loading = false;
    //模态框配置
    @observable modalConfig = {
        visible: false,
        modalId: ""
    };

    //更新表格loading状态
    @action toggleLoad( load ){
        this.loading = load;
    }
    //更新表格loading状态
    @action setFilterKey( key ){
        this.filterKey = key;
    }
    // 增加跑道-单条
    @action addRunway( opt ){
        const item = new RunwayItem(opt);
        this.list.unshift( item );
    }
    // 增加跑道-多条
    @action addMultiRunway( arr ){
        arr.map( opt => {
            const item = new RunwayItem(opt);
            this.list.unshift( item );
        })
    }
    // 删除跑道
    @action delRunway( RunwayItem ){
        this.list.remove( RunwayItem );
    }
    // 更新跑道-全部
    @action updateRunwayList( arr, generateTime){
        const newList = new Set();
        this.generateTime = generateTime;
        let hasId = false;
        arr.map( item => {
            const itemIns = new RunwayItem(item);
            if( item.id === this.activeSchemeId ){
                this.activeSchemeId = item.id;
                hasId = true;
            }
            newList.add( itemIns );
        });
        //如果更新的跑道，没有之前选中的,置为空
        if( !hasId && ( this.activeSchemeId.indexOf("focus") === -1) ){
            this.activeSchemeId = "";
        }
        //数组赋值
        this.list = Array.from(newList);
    }

    // 更新跑道-多条
    @action updateMultiRunway( arr ){
        const len = this.list.length;
        arr.map( item => {
            const id = item.id;
            //检验list有没有同id的跑道
            let sameScheme = this.list.filter( item => id === item.id);
            let hasScheme = sameScheme.length === 0 ? false : true;

            //没有同id的就添加一条
            if( len === 0 || hasScheme === false ){
                const itemIns = new RunwayItem(item);
                this.list.push( itemIns );
            }else{
                //有同id的 更新数据
                sameScheme.map( orgScheme => {
                    orgScheme.update(item);
                })

            }
            
        })
    }

    @computed get sortedList(){
        let newList = [];
        if( this.list.length > 0 ){
            newList = this.list.slice() .sort( (a,b) => {
                const data1 = a.tacticTimeInfo.publishTime;
                const data2 = b.tacticTimeInfo.publishTime;
                if (isValidVariable(data1) && isValidVariable(data2)) {
                    let res = data1.localeCompare(data2);
                    if (0 !== res) {
                        return res*(-1);
                    }
                } else if (isValidVariable(data1)) {
                    return -1;
                } else if (isValidVariable(data2)) {
                    return 1;
                }
                return 0;
            })
        }else{
            newList = this.list;
        }
        return newList;
    }
}

let runwayListData = new RunwayListData();

export { runwayListData }