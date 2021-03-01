/*
 * @Author: your name
 * @Date: 2020-12-14 13:47:11
 * @LastEditTime: 2021-03-01 11:10:14
 * @LastEditors: Please set LastEditors
 * @Description: 执行KPI
 * @FilePath: \WN-CDM\src\components\ExecuteKPI\ExecuteKPI.jsx
 */
import React, { useEffect, useCallback,useState } from 'react'
import { Row, Spin, message } from 'antd'
import { inject, observer } from 'mobx-react'
import { isValidVariable, isValidObject } from 'utils/basic-verify'
import { ReqUrls } from 'utils/request-urls'
import { request } from 'utils/request'
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
                <ImpactFlights executeKPIData={ executeKPIData } />
                <ImpactLevel executeKPIData={ executeKPIData }  />
                <Row className="ant-row-no-wrap">
                </Row>
                <CTOTRate executeKPIData={ executeKPIData }  />
                <PreDelay executeKPIData={ executeKPIData }  />
            </div>

        </Spin>
    )
}

export default inject("executeKPIData", "schemeListData", "systemPage")(observer(ExecuteKPI))
