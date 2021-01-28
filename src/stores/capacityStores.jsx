/*
 * @Author: your name
 * @Date: 2021-01-26 14:31:45
 * @LastEditTime: 2021-01-27 17:36:12
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

     //动态容量 columns
     @observable dynamicTableColumns = [];

     //动态容量 table数据
     @observable dynamicTableDatas = [];

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
    //更新 动态columns 
    @action setDynamicTableColumns(columns){
        this.dynamicTableColumns = columns;
    }

    //更新 动态tableDatas 
    @action setDynamicTableDatas(tableDatas){
        this.dynamicTableDatas = tableDatas;
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

     //获取 动态columns
     @computed get getDynamicTableColumns(){
        let res = [];
        let pane = this.getActivePane[0];
        const timeInterval = pane.timeInterval || ""
        this.dynamicTableColumns.map( col => {
            let objCol = Object.assign({}, col)
            const dataIndex = objCol.dataIndex || "";
            if( dataIndex === "time" ){
                res.push(objCol);
            }else{
                if( timeInterval === "60" ){
                    if( dataIndex.substring(2,4) === "00" ){
                        res.push(objCol);
                    }
                     
                }else if( timeInterval === "30" ){
                    if( dataIndex.substring(2,4) === "00" || dataIndex.substring(2,4) === "30" ){
                        res.push(objCol);
                    }
                }else{
                    res.push(objCol);
                }
            }
        });
        console.log("getDynamicTableColumns", res);
        return res;
     }



     
 }

 const capacity = new Capacity();

 export { capacity }