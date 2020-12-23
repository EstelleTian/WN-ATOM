/*
 * @Author: your name
 * @Date: 2020-12-15 18:30:33
 * @LastEditTime: 2020-12-18 15:16:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\components\TimeLineFlight\FlightCard.jsx
 */
import React from 'react'
import {Popover,Row,Col} from 'antd'
import './FlightCard.scss'

function ToolContent( props ){
    return(
        <div>
            <Row>
                <Col span={12}>起飞机场：</Col>
                <Col span={12}>ZLXY</Col>
            </Row>
            <Row>
                <Col span={12}>降落机场：</Col>
                <Col span={12}>ZBAA</Col>
            </Row>
            <Row>
                <Col span={12}>过点时间：</Col>
                <Col span={12}>09/1200</Col>
            </Row>
        </div>
    )
}

function FlightCard(props){
    return(
            <div className="flight_card" style={{ height: props.height, lineHeight: props.height+"px" }}>
                <Popover placement="topLeft" title="CSC567" content={<ToolContent/>}>
                    <div className="flight_item dep"> 
                        <div>CSC567{props.item}</div>
                    </div>
                </Popover>
                <Popover placement="topLeft" title="CSC567" content={<ToolContent/>}>
                    <div className="flight_item arr">
                        <div>CSC567{props.item}</div>
                    </div>
                </Popover>
            </div>
    )
}

export default FlightCard 
