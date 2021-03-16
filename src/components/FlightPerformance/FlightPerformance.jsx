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
import { request } from 'utils/request'
import { ReqUrls } from 'utils/request-urls'
import {  message, Col, Row, Spin} from 'antd'
import { getFullTime, addStringTime, isValidObject,isValidVariable } from 'utils/basic-verify'
import PerformanceItemHeader from './PerformanceItemHeader'
import List from './List'
import PieChart from './PieChart'
import LineChart from './LineChart'
import './FlightPerformance.scss'


//航班执行情况模块
const FlightPerformance =(props) => {

    // 航班执行情况数据
    const flightPerformanceData = props.flightPerformanceData || {};
    // 限制数据
    const implementTacticsReasonData = props.implementTacticsReasonData || {};
    const { loading } = flightPerformanceData;
    const performanceData = flightPerformanceData.performanceData || {};
    // 航班执行情况数据对象
    const flight = performanceData.flight || {};
    const performanceGenerateTime = performanceData.generateTime || "";
    // 限制原因数据
    const  reasonData = implementTacticsReasonData.reasonData || {};
    // 限制原因数据对象
    const  statisticsMap = reasonData.statisticsMap || {};

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
    // 起飞正常率绩效情况
    const depRatioSituation = flight.depRatioSituation || "";
    // 离港流量绩效情况
    const depFlowSituation = flight.depFlowSituation || "";
    // 起飞正常率
    const depRatio = flight.depRatio || 0;
    // 地面延误航班架次
    const groundDelay = flight.groundDelay || 0;
    // 返航备降航班
    const cplNum = flight.cplNum || 0;
    // 复飞航班
    const reflySorties = flight.reflySorties || 0;
    // 盘旋航班
    const circlingSorties = flight.circlingSorties || 0;
    // 限制总数
    const restrictTotal = statisticsMap['ALL'] || 0;
    // 限制原因分类数据
    const restrictMap = statisticsMap;


    // 执行起降
    const executeDAMap = isValidObject(flight.executeDAMap) ? flight.executeDAMap : {};
    // 执行区内空中
    const currentInAreaSkyMap = isValidObject(flight.currentInAreaSkyMap) ? flight.currentInAreaSkyMap : {};
    // 执行区域飞越
    const executeAOvfMap = isValidObject(flight.executeAOvfMap) ? flight.executeAOvfMap : {};
    // 执行国际飞越
    const executeOvfMap = isValidObject(flight.executeOvfMap) ? flight.executeOvfMap : {};

    // 执行率
    const executeRatio = flight.executeRatio || 0;
    // 执行数据
    const executeData = {
        executeDAMap,
        executeAOvfMap,
        executeOvfMap,
        currentInAreaSkyMap,
    }

    const planData = [
        {
            id:"sDepNum",
            iconType: 'takeoff',
            // color:"#1890ff",
            des:"计划起飞",
            value:sDepNum,
            unit: "架次"
        },{
            id:"sArrNum",
            iconType: 'landing',
            des:"计划落地",
            value:sArrNum,
            unit: "架次"
        },
        {
            id:"sAOvfNum",
            iconType: 'area-over',
            // color: "#2fc25b",
            des:"飞越本区",
            value:sAOvfNum,
            unit: "架次"
        },
        {
            id:"sOvfNum",
            iconType: 'international-over',
            // color: "#facc14",
            des:"国际飞越",
            value:sOvfNum,
            unit: "架次"
        },
    ];

    // 绩效
    const performance = [
        {
            id:"depRatio",
            iconType: 'normal-takeoff',
            // color:"#2fc25b",
            des:"起飞正常",
            value:(depRatio*100).toFixed(0),
            unit: "%"
        },{
            id:"groundDelay",
            iconType: 'ground-delay',
            // color:"#facc14",
            des:"地面延误",
            value:groundDelay,
            unit: "架次"
        },
        {
            id:"cplNum",
            iconType: 'return',
            // color:"#f04864",
            des:"返航备降",
            value:cplNum,
            unit: "架次"
        },
        {
            id:"reflySorties",
            iconType: 'refly',
            // color:"#f04864",
            des:"复飞架次",
            value:reflySorties,
            unit: "架次"
        },
        {
            id:"circlingSorties",
            iconType: 'circling',
            // color:"#f04864",
            des:"盘旋架次",
            value:circlingSorties,
            unit: "架次"
        },
    ]


    //更新--航班执行情况 store数据
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
    //更新--限制store数据
    const updateImplementTacticsReasonData = useCallback(reasonData => {
        if( isValidObject(reasonData) ){
            props.implementTacticsReasonData.updateFlightPerformanceData(reasonData)
        }else{
            props.implementTacticsReasonData.updateFlightPerformanceData({});
            message.error({
                content:"获取的限制数据为空",
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
        // 获取航班执行情况数据
        requestFlightPerformanceData();
        // 获取限制数据
        requestImplementTacticsReasonData();
        // 清除定时
        clearInterval(props.flightPerformanceData.timeoutId);
        clearInterval(props.implementTacticsReasonData.timeoutId);
        // 开启定时获取数据
        props.flightPerformanceData.timeoutId = setInterval(requestFlightPerformanceData, 60*1000);
        props.implementTacticsReasonData.timeoutId = setInterval(requestImplementTacticsReasonData, 60*1000);
        return function(){
            clearInterval(props.flightPerformanceData.timeoutId);
            clearInterval(props.implementTacticsReasonData.timeoutId);
            props.flightPerformanceData.timeoutId = "";
            props.implementTacticsReasonData.timeoutId = "";
        }
    },[props.userSubscribeData.subscribeData])

    /**
     * 获取监控单元
     * */
    const getMonitorUnits =()=> {
        const { userSubscribeData={} } = props;
        let subscribeData = userSubscribeData.subscribeData || {};
        let {monitorUnit, focus} = subscribeData;
        let arr = [];
        if(isValidObject(monitorUnit) && isValidVariable(focus)){
            let area = monitorUnit[focus] || {};
            let areaData = area.data;
            for( let type in areaData){
                let data = areaData[type];
                let units = data.units;
                for( let unit in units){
                    arr.push(unit);
                }
            }
        }
        return arr;
    };


    //获取--航班执行情况数据
    const requestFlightPerformanceData = useCallback(() => {
        //TODO 时间范围取值需要使用服务器时间，目前使用的终端时间
        // const now = getFullTime(new Date());
        // const nextDate = addStringTime(now, 1000*60*60*24).substring(0,8);
        // const nowDate = now.substring(0,8);
        // const start = nowDate+'050000';
        // const end =nextDate+'050000';
        // const monitorUnits = getMonitorUnits();
        // const units = monitorUnits.join(',');
        // if(!isValidVariable(units)){
        //     return;
        // }

        const { userSubscribeData={} } = props;
        let subscribeData = userSubscribeData.subscribeData || {};
        // 区域
        let { focus } = subscribeData;
        if(!isValidVariable(focus)){
           return;
        }
        const opt = {
            url: ReqUrls.performanceDataUrl + '?areaName='+focus,
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

    //获取--限制数据
    const requestImplementTacticsReasonData = useCallback(() => {
        //TODO 时间范围取值需要使用服务器时间，目前使用的终端时间
        const now = getFullTime(new Date());
        const nowDate = now.substring(0,8);
        const start = nowDate+'000000';
        const end =now;
        const opt = {
            url: ReqUrls.restrictionDataUrl + '?starttime='+ start+'&endtime='+end,
            method:'GET',
            params:{},
            resFunc: (data)=> {
                updateImplementTacticsReasonData(data)
            },
            errFunc: (err)=> {
                requestErr(err, '限制数据获取失败')
            } ,
        };
        request(opt);
    });





    return(
        <Spin spinning={loading} >
        <div className="flight_performance_list_container">
            <Row className="performance-row" style={{marginBottom: 10}}>
                <Col span={24} className="layout-row" >
                    <div className="performance_item module">
                        <PerformanceItemHeader style={ {background:"#4b7ba4", color:"#d4d4d4"}}  title="计划"  value={sDANum}  unit="架次"  />
                        <div className="content">
                            <List listData={planData} />
                        </div>
                    </div>
                    <div className="performance_item module">
                        <PerformanceItemHeader style={ {background:"#2e93bb", color:"#d4d4d4"}}  title="执行"  value={ (executeRatio*100).toFixed(0)}  unit="%"  />
                        <div className="content">
                            <LineChart executeData={executeData}   />
                        </div>
                    </div>
                    <div className="performance_item module">
                        <PerformanceItemHeader style={ {background:"#168f9d", color:"#d4d4d4"}}  title="限制"  value={restrictTotal}  unit="条"  />
                        <div className="content">
                            <PieChart data={restrictMap}/>
                        </div>
                    </div>
                    <div className="performance_item module">
                        <PerformanceItemHeader
                            style={ {background:"#2d6b92", color:"#d4d4d4"}}
                            title="绩效"
                            value={situation}
                            tooltipContent={(<div className="performance-tooltip-content-box"><div className="content-row"><div className="label">起飞正常率:</div> {depRatioSituation}</div><div className="content-row"><div className="label">离港流量:</div> {depFlowSituation}</div></div>)}

                        />
                        <div className="content">
                            <List listData={performance}  />
                        </div>
                    </div>
                </Col>
            </Row>
            <Row className="performance-row" style={{marginBottom: 12}}>
                <Col span={24} className="layout-column" >
                    <div className="performance_item module">
                        <div style={ {height:"140px", }}  ></div>
                    </div>

                </Col>
            </Row>

        </div>
        </Spin>
    )
}

export default inject("userSubscribeData","flightPerformanceData","implementTacticsReasonData","systemPage")(observer(FlightPerformance))
