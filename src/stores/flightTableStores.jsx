/*
 * @Author: your name
 * @Date: 2020-12-14 10:18:25
 * @LastEditTime: 2021-03-11 14:53:11
 * @LastEditors: Please set LastEditors
 * @Description: 影响航班表格数据存储
 * @FilePath: \WN-CDM\src\stores\flightTableStores.jsx
 */

import { makeObservable, observable, action, computed } from 'mobx'
import { isValidVariable, calculateStringTimeDiff } from 'utils/basic-verify.js'
import { formatSingleFlight} from 'components/FlightTable/TableColumns'
import { FlightCoordination } from 'utils/flightcoordination.js'
import  FmeToday  from 'utils/fmetoday.js'

// 单条航班对象
class FlightItem{
    // 航班id
    @observable id = "";
    // 优先级
    @observable priority = "";
    // 入池状态
    @observable poolStatus = "";
    // 更新时间戳
    @observable updateTimeStamp = "";
    // 航班选中状态
    @observable selected = false;

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
        // console.log("单条--航班更新");
        const newUpdateTimeStamp = newFlight.updateTimeStamp;
        //当前航班数据时间 无效 或者新的早于当前的，更新数据
        if( !isValidVariable(this.updateTimeStamp) || ( newUpdateTimeStamp*1 >= this.updateTimeStamp*1 ) ){
            // console.log("传入新对象时间更新");
            //更新为传入对象
            for( let key in newFlight ){
                this[key] = newFlight[key];
            }
            // console.log("更新后对象:", this);
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
    //是否显示loading
    @observable loading = false;
    //数据获取状态
    @observable dataLoaded = false;
    //自动滚动状态
    @observable autoScroll = true;
    //快速查询内容
    @observable searchVal = "";
    //选中高亮的航班id
    @observable selectFlightId = "";
    //定时器
    @observable timeoutId = "";
    //上一次请求的方案id
    @observable lastSchemeId = "";
    //更新表格loading显示
    @action toggleLoad( showLoad, dataLoaded ){
        this.loading = showLoad;
        this.dataLoaded = dataLoaded;
    }
     
    //更新航班数据-
    @action updateFlightsList( newList, generateTime ){
        let obj = {};
        // const len = this.list.length;
        // let newFlightList = [];
        newList.map( item => {
            const itemIns = new FlightItem(item);
            obj[item.id] = itemIns;
        })
        this.list = Object.values( obj );
        this.generateTime = generateTime;
    }
    //单条--航班更新
    @action updateSingleFlight( fObj ){
        const newFId = fObj.id;
        this.list.map( item => {
            const oldFId = item.id;
            if( oldFId === newFId ){
                item.updateFlight( fObj );
            }
        });
    }
    //单条--航班高亮--航班id
    @action toggleSelectFlight( fid ){
        if( this.selectFlightId === fid ){
            this.selectFlightId = ""
        }else{
            this.selectFlightId = fid;
        }
    }
    //修改--航班列表-自动滚动状态
    @action setAutoScroll(flag ){
        this.autoScroll = flag;
    }
    //修改--航班列表-自动滚动状态
    @action setSearchVal( values ){
        this.searchVal = values.trim();
    }

    //获取航班高亮航班对象
    @computed get getSelectedFlight(){
        let resFlight = {
            id: ""
        };
        this.list.map( flight => {
            if( flight.selected  ){
                resFlight = flight;
            }
        })
        return resFlight;
    }
    
    //获取真正展示的航班
    @computed get getShowFlights(){
        let showList = this.list.map( flight => formatSingleFlight(flight) );
        const searchVal = this.searchVal.toLowerCase();
        if( searchVal !== "" ){
            showList = showList.filter( flight => {
                let FLIGHTID = flight.FLIGHTID || "";
                FLIGHTID = FLIGHTID.toLowerCase() || "";
                let FFIX = flight.FFIX || "";
                FFIX = FFIX.toLowerCase() || "";
                if( FLIGHTID.indexOf( searchVal ) !== -1 || FFIX.indexOf( searchVal ) !== -1 ){
                    return true
                }else{
                    return false;
                }
                
            } );
        } 
        const targetFlight = this.getTargetFlight(showList);
        return { showList, targetFlight }
    }

    //获取和generatetime时间比最近的航班对象，用以自动滚动
    getTargetFlight(newList){
        // console.log("list长度:" + this.list.length);
        let resFlight = {};
        let time_interval = -1;
        newList.map( flight => {
            let ffixt = flight.FFIXT || "";
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
    @action getExemptFlights(){
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
    @action getPoolFlights(){
        const filterFlights = this.list.filter( flight => {
            // if ( !isValidVariable(flight)  || !isValidVariable(flight.fmeToday) ) {
            //     return false;
            // }
            // // 未发FPL不显示
            // if ( !FmeToday.hadFPL(flight.fmeToday) ) {
            //     return false;
            // }
            // // 已起飞的不显示
            // if( FmeToday.hadDEP(flight.fmeToday) || FmeToday.hadARR(flight.fmeToday) ){
            //     return false;
            // }
            // // 飞越航班不显示
            // if( flight.clearanceType == FlightCoordination.CLEARANCE_OVERFLY ) {
            //     return false;
            // }
            if( FlightCoordination.isInPoolFlight(flight) ) {
                return true;
            }

        })
        return filterFlights;
    }
    //获取特殊航班
    @action getSpecialFlights(){
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
    @action getExpiredFlights(){
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
    @action getTodoFlights(){
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
            if (isValidVariable(fmeToday.rdeptime) || isValidVariable(fmeToday.rarrtime)) {
                return false;
            }
            // 飞越航班不显示
            if(flight.clearanceType === FlightCoordination.CLEARANCE_OVERFLY) {
                return false;
            }
            return true;
        })
        return filterFlights;
    }

}

let flightTableData = new FlightTableData();


export { flightTableData }