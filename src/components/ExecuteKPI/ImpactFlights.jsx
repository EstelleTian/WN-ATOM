import React from 'react'
import {Col, Row} from "antd";

//影响航班
function ImpactFlights(props){
   return  <Row className="row_model">
       <Col span={10} className="impact block">
           <div className="block-title">影响航班</div>
           <div className="block-content flex justify-content-center layout-column-center">
               <div className="num text-center">80</div>
               <div className="unit text-center">架次</div>
           </div>

       </Col>
       <Col span={14} className="block">
           <Row>
               <Col span={12} className="impact_sub block">
                   <div className="block-title">临界</div>
                   <div className="block-content flex">
                       <div className="layout-row">
                           <div className="num layout-column justify-content-center">10</div>
                           <div className="unit layout-column ">架次</div>
                       </div>

                   </div>

               </Col>
               <Col span={12} className="impact_sub block">
                   <div className="block-title">申请协调</div>
                   <div className="block-content flex">
                       <div className="layout-row">
                           <div className="num layout-column justify-content-center">15</div>
                           <div className="unit layout-column ">架次</div>
                       </div>
                   </div>

               </Col>
           </Row>
           <Row>
               <Col span={12} className="impact_sub block">
                   <div className="block-title">入池</div>
                   <div className="block-content flex">
                       <div className="layout-row ">
                           <div className="num layout-column justify-content-center">21</div>
                           <div className="unit layout-column ">架次</div>
                       </div>
                   </div>
               </Col>
               <Col span={12} className="impact_sub block">
                   <div className="block-title">关舱门等待</div>
                   <div className="block-content flex">
                       <div className="layout-row">
                           <div className="num layout-column justify-content-center">9</div>
                           <div className="unit layout-column ">架次</div>
                       </div>

                   </div>
               </Col>
           </Row>
       </Col>
   </Row>
}

export default ImpactFlights;