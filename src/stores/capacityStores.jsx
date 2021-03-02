/*
 * @Author: your name
 * @Date: 2021-01-26 14:31:45
 * @LastEditTime: 2021-03-02 16:35:04
 * @LastEditors: Please set LastEditors
 * @Description: 容量管理store
 * @FilePath: \WN-ATOM\src\stores\capacityStores.jsx
 */

import { observable, action, computed, makeObservable } from 'mobx'
import { isValidVariable } from 'utils/basic-verify'

 class Capacity{
     constructor(){
        makeObservable(this);
     }
     // tab 状态维护
     @observable panes = [
         {
            title: "ZLXY-西安/咸阳",
            key: "ZLXY",
            type: "airport",
            active: true,
            date: "0", 
            kind: 'all',
            timeInterval: "60"
         }
     ];

     //静态容量数据
     @observable staticData = {};

     //动态容量 
     @observable dynamicData = {};

     //添加pane
     @action setPane(title, key, type){
        this.panes.map( pane => {
            pane.active = false;
        });
         let obj = {
            title,
            key,
            type,
            date: "0", 
            kind: 'all',
            timeInterval: "60",
            active: true
          }
        this.panes.push(obj);
     }
     
     //删除pane
     @action delPane(key){
        this.panes = this.panes.filter( pane => {
            return pane.key !== key;
        })
     }

     //更新pane 激活状态
     @action activePane(key){
        this.panes.map( pane => {
            if( key === pane.key ){
                pane.active = true;
            }else{
                pane.active = false;
            }
        })
     }

     //更新pane 日期选择
     @action updateDateSel(key, val){
        this.panes.map( pane => {
            if( key === pane.key ){
                pane.date = val;
            }
        })
     }
    //更新pane 种类选择
    @action updateKindSel(key, val){
        this.panes.map( pane => {
            if( key === pane.key ){
                pane.kind = val;
            }
        })
    }
    //更新pane 时间间隔选择
    @action updateTimeIntervalSel(key, val){
        this.panes.map( pane => {
            if( key === pane.key ){
                pane.timeInterval = val;
            }
        })
    }

     //获取 激活状态 pane
     @computed get getActivePane(){
        let res = [];
        this.panes.map( pane => {
            if( pane.active ){
                res.push(pane);
            }
        })
        return res;
     }

     //更新 静态data
    @action setStaticData(data){
        let obj = {};
        data.map( item => {
            const capacityTime = item.capacityTime;
            item["key"] = capacityTime;
            obj[ capacityTime ] = item;
        })
        this.staticData = obj;
    }
    //默认静态data
    @computed get defaultStaticData(){
        return Object.values(this.staticData).filter( item => {
            if( item.capacityTime === "BASE" ){
                return true
            }else{
                return false;
            }
        })
    }
    //24小时 静态data
    @computed get customStaticData(){
        return Object.values(this.staticData).filter( item => {
            if( item.capacityTime !== "BASE" ){
                return true
            }else{
                return false;
            }
        })
    }

    //更新 动态data
    @action setDynamicData(data){
        let obj = {};
        data.map( item => {
            const capacityTime = item.capacityTime;
            item["key"] = capacityTime;
            obj[ capacityTime ] = item;
        })
        this.dynamicData = obj;
    }

    //24小时 动态data
    @computed get customDynamicData(){
        return Object.values(this.dynamicData).filter( item => {
            if( item.capacityTime !== "BASE" ){
                return true
            }else{
                return false;
            }
        })
    }

    //根据kind类型更新data
    @action updateDatas( kind, data ){
        switch (kind) {
            case "default":
            case "static":
                data.map( item => {
                    const capacityTime = item.capacityTime;
                    this.staticData[capacityTime] = item;
                } )
                break;
        
            case "dynamic":
                data.map( item => {
                    const capacityTime = item.capacityTime;
                    this.dynamicData[capacityTime] = item;
                } )
                break;
        }
        console.log( this.staticData )
    }
    

    
 }

 const capacity = new Capacity();

 export { capacity }