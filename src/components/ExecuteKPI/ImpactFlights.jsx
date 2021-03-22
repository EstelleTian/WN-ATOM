/*
 * @Author: your name
 * @Date: 2021-01-07 20:19:37
 * @LastEditTime: 2021-03-05 11:00:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\ExecuteKPI\ImpactFlights.jsx
 */
import React from 'react'
import {Col, Row} from "antd";
import { inject, observer } from 'mobx-react'


//影响航班
function ImpactFlights(props){

    const executeKPIData = props.executeKPIData || {};
    const KPIData = executeKPIData.KPIData || {};
    let { impactFlights, criticalFlights, coordinationFlights, inPoolFlights, closeWaitFlights } = KPIData;
    let tacticProcessInfo = KPIData.tacticProcessInfo || {};
    let kpi = tacticProcessInfo.kpi || {};
    let impactFlightCount = kpi.impactFlightCount || {};
    let impactALL = impactFlightCount['AF'];
    // 影响
    const impact = Array.isArray(impactALL) ? impactALL.length : "N/A";
    // 临界
    const critical = Array.isArray(criticalFlights) ? criticalFlights.length : "N/A";
    // coordination
    const coordination = Array.isArray(coordinationFlights) ? coordinationFlights.length : "N/A";
    // 入池
    const inPool = Array.isArray(inPoolFlights) ? inPoolFlights.length : "N/A";
    // 关舱门等待
    const closeWait = Array.isArray(closeWaitFlights) ? closeWaitFlights.length : "N/A";

   return  <Row className="row_model">
       <Col span={10} className="impact block">
           <div className="block-title">影响航班</div>
           <div className="block-content flex justify-content-center layout-column-center">
               <div className="num text-center">{impact}</div>
               <div className="unit text-center">架次</div>
           </div>

       </Col>
       <Col span={14} className="block">
           <Row>
               <Col span={12} className="impact_sub block">
                   <div className="block-title">临界航班</div>
                   <div className="block-content flex">
                       <div className="layout-row">
                           <div className="num layout-column justify-content-center">{critical}</div>
                           <div className="unit layout-column ">架次</div>
                       </div>

                   </div>

               </Col>
               <Col span={12} className="impact_sub block">
                   <div className="block-title">申请协调航班</div>
                   <div className="block-content flex">
                       <div className="layout-row">
                           <div className="num layout-column justify-content-center">{coordination}</div>
                           <div className="unit layout-column ">架次</div>
                       </div>
                   </div>

               </Col>
           </Row>
           <Row>
               <Col span={12} className="impact_sub block">
                   <div className="block-title">入池航班</div>
                   <div className="block-content flex">
                       <div className="layout-row ">
                           <div className="num layout-column justify-content-center">{inPool}</div>
                           <div className="unit layout-column ">架次</div>
                       </div>
                   </div>
               </Col>
               <Col span={12} className="impact_sub block">
                   <div className="block-title">关舱门等待航班</div>
                   <div className="block-content flex">
                       <div className="layout-row">
                           <div className="num layout-column justify-content-center">{closeWait}</div>
                           <div className="unit layout-column ">架次</div>
                       </div>

                   </div>
               </Col>
           </Row>
       </Col>
   </Row>
}

export default inject("executeKPIData")(observer(ImpactFlights));