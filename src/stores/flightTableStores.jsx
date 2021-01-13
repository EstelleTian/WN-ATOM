/*
 * @Author: your name
 * @Date: 2020-12-14 10:18:25
 * @LastEditTime: 2020-12-22 19:24:44
 * @LastEditors: Please set LastEditors
 * @Description: 影响航班表格数据存储
 * @FilePath: \WN-CDM\src\stores\flightTableStores.jsx
 */

import { makeObservable, observable, action, computed } from 'mobx'
import { isValidVariable, calculateStringTimeDiff } from 'utils/basic-verify.js'
import { FlightCoordination } from 'utils/flightcoordination.js'
import  FmeToday  from 'utils/fmetoday.js'

// 单条航班对象
class FlightItem{
    // 航班id
    @observable id = "";
    // 更新时间戳
    @observable updateTimeStamp = "";
    // 航班选中状态
    @observable selected = false
    constructor( opt ){
        makeObservable(this)
        for( let key in opt ){
            this[key] = opt[key]
        }
        this.selected = false
    }
    // 航班 选中状态切换
    @action toggleSelected( ){
        this.selected = !this.selected;
    }
    //单条--航班更新--对比updateTimeStamp 时间戳
    @action updateFlight( newFlight ){
        const newupdateTimeStamp = newFlight.updateTimeStamp;
        if( newupdateTimeStamp*1 >= this.updateTimeStamp*1 ){
            console.log("传入新对象时间更新");
            //更新为传入对象
            for( let key in newFlight ){
                this[key] = newFlight[key];
            }
            console.log("更新后对象:", this);
        }
    }

}
 // 航班表格数据
class FlightTableData{
    constructor(){
        makeObservable(this)
    }
    // 列表
    @observable list = [];
    //数据时间
    @observable generateTime = "";
    //数据获取
    @observable loading = false;
    //定时器
    @observable timeoutId = "";
    //上一次请求的方案id
    @observable lastSchemeId = "";
    //更新表格loading状态
    @action toggleLoad( load ){
        this.loading = load;
    }
    //更新航班数据-
    @action updateFlightsList( newList, generateTime, id ){
        //上次获取航班的方案id和本次的id不一样，直接替换
        if( this.lastSchemeId !== id ){
            this.list = [];
            this.generateTime = generateTime;
            // const len = this.list.length;
            let newFlightList = [];
            newList.map( item => {
                const itemIns = new FlightItem(item);
                newFlightList.push( itemIns );
            })
            this.list = newFlightList;
            this.lastSchemeId = id; //更新为本次方案id
        }else{//上次获取航班的方案id和本次的id一样，航班逐一对比时间戳
            if( this.lastSchemeId !== "" && id !=="" ){
                //获取当前所有航班ids集合
                let idsList = [];
                this.list.map( item => {
                    const id = item.id;
                    if( idsList.indexOf(id) === -1 ){
                        idsList.push( id );
                    }
                });
                //遍历新航班集合
                let newResList = [];
                newList.map( newItem => {
                    const nid = newItem.id;
                    //该航班已存在
                    const index = idsList.indexOf(nid);
                    if( index > -1 ){
                        //获取已存在航班实例
                        const oldItem = this.list[index];
                        const curUpdateTimeStampe = oldItem.updateTimeStamp;
                        const newUpdateTimeStamp = newItem.updateTimeStamp;
                        if( newUpdateTimeStamp*1 >= curUpdateTimeStampe*1 ){
                            newResList.push( newItem );
                        }else{
                            newResList.push( oldItem );
                        }
                    }else{
                        const itemIns = new FlightItem(newItem);
                        newResList.push( itemIns );
                    }
                });
            }


        }

    }
    //单条--航班更新
    @action updateSingleFlight( fObj, generateTime ){
        const newFId = fObj.id;
        this.list.map( item => {
            const oldFId = item.id;
            if( oldFId === newFId ){
                item.updateFlight( fObj );
            }
        });
    }
    //获取和generatetime时间比最近的航班对象，用以自动滚动
    @computed get getTargetFlight(){
        // console.log("list长度:" + this.list.length);
        let resFlight = {};
        let time_interval = -1;
        this.list.map( flight => {
            const ffixField = flight.ffixField || {};
            let ffixt = ffixField.value || "";
            if( isValidVariable(ffixt) && ffixt.length >= 12 ){
                ffixt = ffixt.substring(0,12);
                // 计算计划时间和当前时间的绝对差值 返回毫秒值
                let tempTime = Math.abs(calculateStringTimeDiff(ffixt, this.generateTime));
                //如果时间间隔 小于记录的 赋值替换
                //tempTime  time_interval  取最小
                if (time_interval === -1 || tempTime < time_interval) {
                    time_interval = tempTime;
                    resFlight = flight;
                }
            }
        })
        return resFlight;
    }

    //获取豁免航班
    @computed get getExemptFlights(){
        const filterFlights = this.list.filter( flight => {
            if( isValidVariable(flight.priority) && flight.priority === FlightCoordination.PRIORITY_EXEMPT ){
                return true;
            }else{
                return false
            }
        })
        return filterFlights;
        // return this.list;
    }
    //获取等待池航班
    @computed get getPoolFlights(){
        const filterFlights = this.list.filter( flight => {
            if ( !isValidVariable(flight)  || !isValidVariable(flight.fmeToday) ) {
                return false;
            }
            // 未发FPL不显示
            if ( !FmeToday.hadFPL(flight.fmeToday) ) {
                return false;
            }
            // 已起飞的不显示
            if( FmeToday.hadDEP(flight.fmeToday) || FmeToday.hadARR(flight.fmeToday) ){
                return false;
            }
            // 飞越航班不显示
            if( flight.clearanceType == FlightCoordination.CLEARANCE_OVERFLY ) {
                return false;
            }
            if(FlightCoordination.isInPoolFlight(flight)) {
                return true;
            }

        })
        return filterFlights;
    }
    //获取特殊航班
    @computed get getSpecialFlights(){
        const filterFlights = this.list.filter( flight => {
            if (!isValidVariable(flight) || !isValidVariable(flight.fmeToday)) {
                return false;
            }
            // 判断是否是CRS管理航班
            if (!flight.clearanceType == FlightCoordination.CLEARANCE_FLIGHTS) {
                return false;
            }
            // 判断是否为特殊航班
            if (!flight.special) {
                return false;
            }
            return true;
        })
        return filterFlights;
    }
    //获取失效航班
    @computed get getExpiredFlights(){
        const filterFlights = this.list.filter( flight => {
            if (!isValidVariable(flight) || !isValidVariable(flight.fmeToday)) {
                return false;
            }
            // 判断是否是CRS管理航班
            if (!flight.clearanceType == FlightCoordination.CLEARANCE_FLIGHTS) {
                return false;
            }
            // 判断是否为失效航班
            if (!flight.expired) {
                return false;
            }
            return true;
        })
        return filterFlights;
    }
    //获取待办航班
    @computed get getTodoFlights(){
        const filterFlights = this.list.filter( flight => {
            if (!isValidVariable(flight) || !isValidVariable(flight.fmeToday)) {
                return false;
            }
            // 待办事项 只显示CRS航班
            if (!flight.crsFlight) {
                return false;
            }
            const fmeToday = flight.fmeToday;
            // 已起飞航班不计算
            if (isValidVariable(fmeToday.RDeptime) || isValidVariable(fmeToday.RArrtime)) {
                return false;
            }
            // 飞越航班不显示
            if(flight.clearanceType == FlightCoordination.CLEARANCE_OVERFLY) {
                return false;
            }
            return true;
        })
        return filterFlights;
    }

}

let flightTableData = new FlightTableData();


export { flightTableData }