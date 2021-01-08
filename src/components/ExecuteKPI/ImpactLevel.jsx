import React from 'react'
import {Col, Row} from "antd";
import {AlertOutlined, WarningOutlined, BulbOutlined} from "@ant-design/icons";
import AirportMonitor from "../MiniMonitor/AirportMonitor";

//影响程度
function ImpactLevel(props){

    const levelData = {
        "H":{
            "label": "高",
            "levelClassName": "level-high",
            "icon": (<AlertOutlined />)

        },
        "M":{
            "label": "中",
            "levelClassName": "level-middle",
            "icon": (<WarningOutlined />)
        },
        "L":{
            "label": "低",
            "levelClassName": "level-Low",
            "icon": (<BulbOutlined />)
        },
    };



    const executeKPIData = props.executeKPIData || {};
    const KPIData = executeKPIData.KPIData || {};
    let { impactDegree, dcb={}} = KPIData;
    let level = levelData[impactDegree] || {}
    const label = level.label || "";
    const levelClassName = level.levelClassName || "";
    const icon = level.icon || "";




    return <Row className="row_model">
        <Col span={10} className="block">
            <div className="block-title">影响程度</div>
            <div className={`${levelClassName} impact-level flex justify-content-center layout-column`}>
                <AlertOutlined />
                {/*{ icon }*/}
                <div className={ `text-center`}>{label}</div>
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