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
import {  message, Checkbox , Empty, Spin, List, Card} from 'antd'
import { getFullTime,  getTimeFromString, getDayTimeFromString, isValidVariable, isValidObject } from 'utils/basic-verify'
import AirportMonitor from 'components/MiniMonitor/AirportMonitor'
import SectorMonitor from 'components/MiniMonitor/SectorMonitor'
import './CapacityFlowMonitor.scss'


//容流略图模块
const CapacityFlowMonitor =(props) => {

    const AirportMonitorData = [
        {
            title: '西安机场',
        },
        {
            title: '西安机场',
        },
        {
            title: '西安机场',
        },
        {
            title: '西安机场',
        },

    ];
    const SectorMonitorData = [
        {
            title: '西安01扇区',
        },
        {
            title: '西安02扇区',
        },
        {
            title: '西安03扇区',
        },
        {
            title: '西安04扇区',
        },

    ];

    //更新--执行KPI store数据
    // const updateFlightPerformanceData = useCallback(flightPerformanceData => {
    //     if( isValidObject(flightPerformanceData) ){
    //         props.flightPerformanceData.updateFlightPerformanceData(flightPerformanceData)
    //     }else{
    //         props.flightPerformanceData.updateFlightPerformanceData({});
    //         message.error({
    //             content:"获取的航班执行数据为空",
    //             duration: 4,
    //         });
    //
    //     }
    // });

    //请求错误处理
    // const requestErr = useCallback((err, content) => {
    //     const errMsg = err.message || "";
    //     message.error({
    //         content:(
    //             <span>
    //                 <span>{ content }</span>
    //                 <br/>
    //                 <span>{errMsg}</span>
    //             </span>
    //         ),
    //         duration: 4,
    //     });
    // });


    // useEffect(function(){
    //     // 初次获取数据启用loading
    //     props.flightPerformanceData.toggleLoad(true);
    //     // 获取数据
    //     requestFlightPerformanceData();
    //     // 清除定时
    //     clearInterval(props.flightPerformanceData.timeoutId);
    //     // 开启定时获取数据
    //     props.flightPerformanceData.timeoutId = setInterval(requestFlightPerformanceData, 60*1000);
    //     return function(){
    //         clearInterval(props.flightPerformanceData.timeoutId);
    //         props.flightPerformanceData.timeoutId = "";
    //     }
    // },[])




    //获取--执行KPI数据
    // const requestFlightPerformanceData = useCallback(() => {
    //
    //     const nowDate = getFullTime(new Date()).substring(0.8);
    //     const start = nowDate+'000000';
    //     const end = nowDate+'235900';
    //
    //
    //     const opt = {
    //         // url:'http://192.168.194.22:28001/atc-monitor-server/monitor/v1/flight/',
    //         // url:'http://192.168.243.191:28001/atc-monitor-server/monitor/v1/flight?targets=ZLXYACC,ZLLLACC&starttime=202101130000&endtime=202101132359',
    //         url:'http://192.168.194.22:28001/atc-monitor-server/monitor/v1/flight?targets=ZLXYACC,ZLLLACC&starttime='+ start+'&endtime='+end,
    //         method:'GET',
    //         params:{},
    //         resFunc: (data)=> {
    //             updateFlightPerformanceData(data)
    //             props.flightPerformanceData.toggleLoad(false)
    //         },
    //         errFunc: (err)=> {
    //             requestErr(err, '航班执行数据获取失败')
    //             props.flightPerformanceData.toggleLoad(false)
    //         } ,
    //     };
    //     request(opt);
    // });





    return(
        <Spin spinning={false} >
        <div className="capacity_flow_monitor_container">
            <List
                grid={{ gutter: 16, column: 8 }}
                dataSource={AirportMonitorData}
                renderItem={item => (
                    <List.Item>
                        <Card size="small" title={item.title}><AirportMonitor/></Card>
                    </List.Item>
                )}
            />
            <List
                grid={{ gutter: 16, column: 8 }}
                dataSource={SectorMonitorData}
                renderItem={item => (
                    <List.Item>
                        <Card size="small" title={item.title}><SectorMonitor/></Card>
                    </List.Item>
                )}
            />
        </div>
        </Spin>
    )
}

export default inject("flightPerformanceData","systemPage")(observer(CapacityFlowMonitor))
