/*
 * @Author: your name
 * @Date: 2020-12-14 13:47:11
 * @LastEditTime: 2020-12-24 18:47:10
 * @LastEditors: Please set LastEditors
 * @Description: 执行KPI
 * @FilePath: \WN-CDM\src\components\ExecuteKPI\ExecuteKPI.jsx
 */
import React from 'react'
import {Row, Spin, } from 'antd'
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
    return (
        <Spin spinning={loading} >
            <div className="kpi_canvas">
                <ImpactFlights />
                <ImpactLevel />
                <Row className="ant-row-no-wrap">
                    <CTOTRate />
                    <PreDelay />
                </Row>

            </div>
        </Spin>
    )
}

export default inject("executeKPIData", "schemeListData")(observer(ExecuteKPI))
