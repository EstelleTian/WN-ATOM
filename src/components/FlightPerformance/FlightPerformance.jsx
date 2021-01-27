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
import { getFullTime, isValidObject } from 'utils/basic-verify'
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
    // 起飞正常率
    const depRatio = flight.depRatio || 0;
    // 地面延误航班架次
    const groundDelay = flight.groundDelay || 0;
    // 返航备降航班
    const cplNum = flight.cplNum || 0;
    // 限制总数
    const restrictTotal = statisticsMap['ALL'] || 0;
    // 限制原因分类数据
    const restrictMap = statisticsMap;


    // 执行起降
    const executeDAMap = isValidObject(flight.executeDAMap) ? flight.executeDAMap : {};
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
    }

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
    },[])




    //获取--航班执行情况数据
    const requestFlightPerformanceData = useCallback(() => {
        //TODO 时间范围取值需要使用服务器时间，目前使用的终端时间
        const nowDate = getFullTime(new Date()).substring(0,8);
        const start = nowDate+'000000';
        const end = nowDate+'235900';

        const opt = {
            url: ReqUrls.performanceDataUrl + '?targets=ZLXYACC,ZLLLACC&starttime='+ start+'&endtime='+end,
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
        const nowDate = getFullTime(new Date()).substring(0,8);
        const start = nowDate+'000000';
        const end = nowDate+'235900';

        const opt = {
            url: ReqUrls.schemeListUrl + '/statistics?starttime='+ start+'&endtime='+end,
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
                        <PerformanceItemHeader style={ {background:"#2d6b92", color:"#d4d4d4"}} title="绩效"  value={situation}  />
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

export default inject("flightPerformanceData","implementTacticsReasonData","systemPage")(observer(FlightPerformance))
