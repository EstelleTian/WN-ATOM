/*
 * @Author: your name
 * @Date: 2020-12-15 15:54:57
 * @LastEditTime: 2020-12-16 17:44:02
 * @LastEditors: Please set LastEditors
 * @Description: In U.3ser Settings Edit
 * @FilePath: \WN-CDM\src\components\FlightSearch\FlightSearch.jsx
 */
import React, { useEffect, useCallback,useState } from 'react'
import { inject, observer } from 'mobx-react'
import { requestGet, request } from 'utils/request'
import {  message, Checkbox , Empty, Spin} from 'antd'
import { getTimeFromString, getDayTimeFromString, isValidVariable, isValidObject } from 'utils/basic-verify'



import PerformanceItemHeader from './PerformanceItemHeader'
import List from './List'
import PieChart from './PieChart'
import LineChart from './LineChart'
import './FlightPerformance.scss'


//航班执行情况模块
const FlightPerformance =(props) => {

    const flightPerformanceData = props.flightPerformanceData || { };
    const { loading } = flightPerformanceData;
    const performanceData = flightPerformanceData.performanceData || {};


    const flight = performanceData.flight || {};
    const generateTime = performanceData.generateTime || "";
    // 计划起降架次
    const sDANum = flight.sDANum || 0;
    //计划起飞架次
    const sDepNum = flight.sDepNum || 0;
    // 计划落地架次
    const sArrNum = flight.sArrNum || 0;
    // 计划区域飞越架次(飞越本区)
    const sAOvfNum = flight.sAOvfNum || 0;
    // 计划飞越架次(国际飞越)
    const sOvfNum = flight.sOvfNum || 0;
    // 绩效情况
    const situation = flight.situation || "";
    // 起飞正常率
    const depRatio = flight.depRatio || 0;
    // 地面延误航班架次
    const groundDelay = flight.groundDelay || 0;
    // 返航备降航班
    const cplNum = flight.cplNum || 0;
    // 限制总数
    const restrictTotal = flight.restrictTotal || 0;

    // 限制原因分类数据
    const restrictMap = isValidObject(flight.restrictMap) ? flight.restrictMap : {};





    const planData = [
        {
            id:"sDepNum",
            color:"#1890ff",
            des:"计划起飞",
            value:sDepNum,
            unit: "架次"
        },{
            id:"sArrNum",
            color: "#13c2c2",
            des:"计划落地",
            value:sArrNum,
            unit: "架次"
        },
        {
            id:"sAOvfNum",
            color: "#2fc25b",
            des:"飞越本区",
            value:sAOvfNum,
            unit: "架次"
        },
        {
            id:"sOvfNum",
            color: "#facc14",
            des:"国际飞越",
            value:sOvfNum,
            unit: "架次"
        },
    ];

    // 绩效
    const performance = [
        {
            id:"depRatio",
            color:"#2fc25b",
            des:"起飞正常",
            value:(depRatio*100).toFixed(0),
            unit: "%"
        },{
            id:"groundDelay",
            color:"#facc14",
            des:"地面延误",
            value:groundDelay,
            unit: "架次"
        },
        {
            id:"cplNum",
            color:"#f04864",
            des:"返航备降",
            value:cplNum,
            unit: "架次"
        },
    ]


    //更新--执行KPI store数据
    const updateFlightPerformanceData = useCallback(flightPerformanceData => {
        if( isValidObject(flightPerformanceData) ){
            props.flightPerformanceData.updateFlightPerformanceData(flightPerformanceData)
        }else{
            props.flightPerformanceData.updateFlightPerformanceData({});
            message.error({
                content:"获取的航班执行数据为空",
                duration: 4,
            });

        }
    });

    //请求错误处理
    const requestErr = useCallback((err, content) => {
        const errMsg = err.message || "";
        message.error({
            content:(
                <span>
                    <span>{ content }</span>
                    <br/>
                    <span>{errMsg}</span>
                </span>
            ),
            duration: 4,
        });
    });


    useEffect(function(){
        // 初次获取数据启用loading
        props.flightPerformanceData.toggleLoad(true);
        // 获取数据
        requestFlightPerformanceData();
        // 清除定时
        clearInterval(props.flightPerformanceData.timeoutId);
        // 开启定时获取数据
        props.flightPerformanceData.timeoutId = setInterval(requestFlightPerformanceData, 60*1000);
        return function(){
            clearInterval(props.flightPerformanceData.timeoutId);
            props.flightPerformanceData.timeoutId = "";
        }
    },[])




    //获取--执行KPI数据
    const requestFlightPerformanceData = useCallback(() => {


        const opt = {
            // url:'http://192.168.194.22:28001/atc-monitor-server/monitor/v1/flight/',
            // url:'http://192.168.243.191:28001/atc-monitor-server/monitor/v1/flight?targets=ZLXYACC,ZLLLACC&starttime=202101130000&endtime=202101132359',
            url:'http://192.168.194.22:28001/atc-monitor-server/monitor/v1/flight?targets=ZLXYACC,ZLLLACC&starttime=202101130000&endtime=202101132359',
            method:'GET',
            params:{},
            resFunc: (data)=> {
                updateFlightPerformanceData(data)
                props.flightPerformanceData.toggleLoad(false)
            },
            errFunc: (err)=> {
                requestErr(err, '航班执行数据获取失败')
                props.flightPerformanceData.toggleLoad(false)
            } ,
        };
        request(opt);
    });





    return(
        <Spin spinning={loading} >
        <div className="flight_performance_list_container">

            <div className="performance_item">
                <PerformanceItemHeader style={ {background:"#0c6277", color:"#09f"}}  title="计划"  value={sDANum}  unit="架次"  />
                <div className="content">
                    <List listData={planData} />
                </div>
            </div>
            <div className="performance_item">
                <PerformanceItemHeader style={ {background:"#595654", color:"#FFCC00"}}  title="执行"  value="88"  unit="%"  />
                <div className="content">
                    <LineChart/>
                </div>
            </div>
            <div className="performance_item">
                <PerformanceItemHeader style={ {background:"#c9b5d8", color:"#9966FF"}}  title="限制"  value={restrictTotal}  unit="条"  />
                <div className="content">
                    <PieChart data={restrictMap}/>
                </div>
            </div>
            <div className="performance_item">
                <PerformanceItemHeader style={ {background:"#ff99994c", color:"#CC3366"}} title="绩效"  value={situation}  />
                <div className="content">
                    <List listData={performance}  />
                </div>
            </div>
            <div className="performance_item">
            <PerformanceItemHeader style={ {background:"#ff99994c", color:"#CC3366"}} title="XX"  value="XX"  />
            <div className="content">
                <List listData={[
                    {
                        id:211,
                        color:"#2fc25b",
                        des:"起飞正常",
                        value:93,
                        unit: "%"
                    },{
                        id:212,
                        color:"#facc14",
                        des:"地面延误",
                        value:14,
                        unit: "架次"
                    },
                    {
                        id:213,
                        color:"#f04864",
                        des:"返航备降",
                        value:7,
                        unit: "架次"
                    },
                ]}  />
            </div>
        </div>
        </div>
        </Spin>
    )
}

export default inject("flightPerformanceData","systemPage")(observer(FlightPerformance))
