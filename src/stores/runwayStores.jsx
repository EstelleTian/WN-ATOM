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
import { RunwayConfigUtil } from "utils/runway-config-util";


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
    // 强制更新跑道列表
    @observable forceUpdate = false;
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



    //更新跑道强制更新标记
    @action setForceUpdate( flag ){
        
        this.forceUpdate = flag;
    }

    //更新表格loading状态
    @action toggleLoad( load ){
        this.loading = load;
    }
    //更新表格loading状态
    @action setFilterKey( key ){
        this.filterKey = key;
    }
    
    // 更新跑道-全部
    @action updateRunwayList( map, generateTime){
        //数组赋值
        this.runwayMap = map;
        this.generateTime = generateTime;
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
                // 单个机场跑道数据
                let apData = data[ap] || {};
                for(let group in apData){
                    let runwayList = apData[group] || [];
                    let singleRunwayData = runwayList[0] || {};
                    let isExecuting = singleRunwayData.isExecuting || "";
                    let startTime = singleRunwayData.startTime || "";
                    let endTime = singleRunwayData.endTime || "";
                    let generateTime = singleRunwayData.generateTime || "";

                    let groupData = {
                        id: group,
                        airportName: ap,
                        type: type,
                        isExecuting: isExecuting,
                        startTime: startTime,
                        generateTime: generateTime,
                        endTime: endTime,
                        runway:runwayList
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
        // 默认跑道集合
        let defaultList = getGroupRunwayList(defaultMap,RunwayConfigUtil.TYPE_DEFAULT);
        // 动态跑道集合
        let dynamicList = getGroupRunwayList(dynamicMap,RunwayConfigUtil.TYPE_DYNAMIC);
        groupRunwayList = [...defaultList, ...dynamicList];
        return groupRunwayList;
    }
}

let runwayListData = new RunwayListData();

export { runwayListData }