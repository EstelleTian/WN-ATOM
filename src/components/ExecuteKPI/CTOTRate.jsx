import React from 'react'
import {Col, Row} from "antd";
import PieChart from "../FlightPerformance/PieChart";

//CTOT符合率
function CTOTRate(props){
    return  <Col span={10} className="row_model ctot-rate">
        <Col span={24} className="block">
            <div className="block-title">CTOT符合率</div>
            <div className="flex justify-content-center layout-column">
                <PieChart style={{width: '100%', height: '150px'}} />
            </div>
        </Col>
        <Col span={24} className="block">
            <div className="block-title">平均跳变次数</div>
            <div className="flex justify-content-center layout-column">
                <div className="layout-row justify-content-center">
                    <div className="layout-row justify-content-center dance">
                        <div className="num layout-column justify-content-center">3</div>
                        <div className="unit layout-column ">次</div>
                    </div>
                </div>
            </div>
        </Col>
    </Col>
}

export default CTOTRate;