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
    @observable runwayMap = {};
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
    @action updateRunwayList( map, generateTime){
        //数组赋值
        this.runwayMap = map;
        this.generateTime = generateTime;
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

    @computed get filterList(){
        
        let groupRunwayList = [];
        // 获取正在生效的跑道集合
        const getEffectiveRunwayMap = ()=>{
            const result = {};
            for( let ap in this.runwayMap){
                let apData = this.runwayMap[ap] || {};
                let obj = {
                    defaultMap: apData.rwGapDefaultMap || {},
                    dynamicMap: apData.rwDynamicMap || {},
                }
                result[ap] = obj;
            }
            return result;
        }
        // 获取今日全部的跑道集合
        const getAllRunwayMap = ()=>{
            const result = {};
            for( let ap in this.runwayMap){
                let apData = this.runwayMap[ap] || {};
                let obj = {
                    dynamicMap: apData.rwDynamicMapTodayAll || {},
                    defaultMap: apData.rwGapDefaultMapTodayAll || {}
                }
                result[ap] = obj;
            }
            return result;
        }
        // 获取默认跑道集合
        const getDefaultRunwayMap = (data)=>{
            const result = {};
            for( let ap in data){
                let apData = data[ap] || {};
                let obj = apData.defaultMap || {}
                result[ap] = obj;
            }
            return result;
        }
        // 获取动态跑道集合
        const getDdynamicRunwayMap = (data)=>{
            const result = {};
            for( let ap in data){
                let apData = data[ap] || {};
                let obj = apData.dynamicMap || {}
                result[ap] = obj;
            }
            return result;
        }
        // 获取指定类型的跑道列表
        const getGroupRunwayList = (data, type)=>{
            const arr = [];
            for( let ap in data){
                let apData = data[ap] || {};
                for(let group in apData){
                    let runway = apData[group] || {};
                    let groupData = {
                        id: group,
                        airportName: ap,
                        type: type,
                        runway:runway
                    }
                    arr.push(groupData);
                }
            }
            return arr;
        }

        let effectiveMap = getEffectiveRunwayMap();
        let allMap = getAllRunwayMap();
        let map = {}
        if(this.filterKey ==="EFFECTIVE"){
            map = effectiveMap;
        }else if(this.filterKey ==="ALL"){
            map = allMap;
        }
        
        let defaultMap = getDefaultRunwayMap(map);
        let dynamicMap = getDdynamicRunwayMap(map);
        let defaultList = getGroupRunwayList(defaultMap,'default');
        let dynamicList = getGroupRunwayList(dynamicMap,'dynamic');
        groupRunwayList = [...defaultList, ...dynamicList];
        return groupRunwayList;
    }
}

let runwayListData = new RunwayListData();

export { runwayListData }