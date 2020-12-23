/*
 * @Author: your name
 * @Date: 2020-12-15 20:48:10
 * @LastEditTime: 2020-12-16 19:06:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\stores\flightStores.jsx
 */

 import { observable, action, makeObservable } from 'mobx'

 //航班轴 单条对象
 class TacticProcessInfo{
    constructor( TacticProcessInfo ){
        makeObservable(this);
        this.TacticProcessInfo = TacticProcessInfo;
    }
    //方案领域信息
    @observable TacticProcessInfo = {};
    //方案ID
    @observable id = "";
    //方案名称
    @observable tacticName = "";
    //方案过滤条件
    @observable filterCondition = {};
    //方案时间刻度
    @observable standarTime = "202012161000";




 }

//航班轴对象集合
 class TimeLineList{
    constructor(){
        makeObservable(this)
    }
    @observable list = [];

    //添加一条方案航班时间轴
    @action addTimeLine( item ){
        let tacticProcessInfo = new TacticProcessInfo( item );
        this.list.push(tacticProcessInfo);
        
    }

 }

 let timeLineList = new TimeLineList()
 export {timeLineList }