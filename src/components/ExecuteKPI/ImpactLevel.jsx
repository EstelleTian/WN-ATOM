import React from 'react'
import {Col, Row} from "antd";
import {AlertOutlined} from "@ant-design/icons";
import AirportMonitor from "../MiniMonitor/AirportMonitor";

//影响程度
function ImpactLevel(props){
    return <Row className="row_model">
        <Col span={10} className="block">
            <div className="block-title">影响程度</div>
            <div className="warn flex justify-content-center layout-column">
                <AlertOutlined />
                <div className="text-center">高</div>
            </div>
        </Col>
        <Col span={14} className="block">
            <div className="block-title">DCB</div>
            <div className="warn flex justify-content-center layout-column">
                <AirportMonitor title=""/>
            </div>

        </Col>
    </Row>
}

export default ImpactLevel;