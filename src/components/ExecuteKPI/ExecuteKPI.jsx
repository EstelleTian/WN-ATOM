/*
 * @Author: your name
 * @Date: 2020-12-14 13:47:11
 * @LastEditTime: 2021-03-01 13:22:35
 * @LastEditors: Please set LastEditors
 * @Description: 执行KPI
 * @FilePath: \WN-CDM\src\components\ExecuteKPI\ExecuteKPI.jsx
 */
import React, { useEffect, useCallback,useState } from 'react'
import { Row, Spin } from 'antd'
import { inject, observer } from 'mobx-react'
import ImpactFlights from './ImpactFlights'
import ImpactLevel from './ImpactLevel'
import CTOTRate from './CTOTRate'
import PreDelay from './PreDelay'

import './ExecuteKPI.scss'

//单个方案执行KPI模块
const ExecuteKPI = (props) => {
    const executeKPIData = props.executeKPIData;
    const { loading } = executeKPIData; 
    // DidMount 
    useEffect(function(){
        return function(){
            console.log("KPI 卸载")
            executeKPIData.timeoutId = "";
            clearTimeout(executeKPIData.timeoutId);
        }
    },[]);
    return (
        <Spin spinning={loading} >
            <div className="kpi_canvas">
                <ImpactFlights executeKPIData={ executeKPIData } />
                <ImpactLevel executeKPIData={ executeKPIData }  />
                <Row className="ant-row-no-wrap"></Row>
                <CTOTRate executeKPIData={ executeKPIData }  />
                <PreDelay executeKPIData={ executeKPIData }  />
            </div>

        </Spin>
    )
}

export default inject("executeKPIData")(observer(ExecuteKPI))
