/*
 * @Author: your name
 * @Date: 2020-12-14 13:47:11
 * @LastEditTime: 2020-12-24 18:47:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\components\ExecuteKPI\SubTable.jsx
 */
import React from 'react'
import { Row, Col} from 'antd'
import { AlertOutlined } from '@ant-design/icons'
import ReactEcharts from 'echarts-for-react'
import GaugeChart from './GaugeChart'
import PieChart from '../FlightPerformance/PieChart'



import AirportMonitor from '../MiniMonitor/AirportMonitor'
import './ExecuteKPI.scss'

//方案列表模块
const SchemePage =(props) => {
    return(
        <div className="kpi_canvas">
            <Row className="row_model">
                <Col span={10} className="impact">
                    <div className="title">影响航班</div>
                    <div className="num">—</div>
                    <div className="sub_title">架次</div>
                </Col>
                <Col span={14}>
                    <Row>
                        <Col span={12} className="impact_sub">
                            <div className="title">临界航班</div>
                            <div className="num">—<span className="sub_title2">架次</span></div>
                        </Col>
                        <Col span={12} className="impact_sub">
                            <div className="title">申请协调航班</div>
                            <div className="num">—<span className="sub_title2">架次</span></div>
                            
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} className="impact_sub">
                            <div className="title">入池航班</div>
                            <div className="num">—<span className="sub_title2">架次</span></div>
                        </Col>
                        <Col span={12} className="impact_sub">
                            <div className="title">关舱门等待航班</div>
                            <div className="num">—<span className="sub_title2">架次</span></div>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className="row_model">
                <Col span={10} className="">
                    <div className="title">影响程度</div>
                    <div className="warn flex justify-content-center layout-column">
                        <AlertOutlined />
                        <div className="text-center">高</div>
                    </div>
                </Col>
                <Col span={14}>
                    <AirportMonitor title="DCB"/>
                </Col>
            </Row>
            <Row className="row_model">
                <Col span={10} className="">
                    <GaugeChart className="layout-row flex-wrap justify-content-center" 
                    value={80} style={{width: '240px', height: '200px'}}  />
                </Col>
                <Col span={14}>
                    <Row>
                        <Col span={12} className="impact_sub">
                            <GaugeChart size="small" value={80} name="西安机场" style={{width: '120px', height: '100px'}}  />
                        </Col>
                        <Col span={12} className="impact_sub">
                            <GaugeChart size="small" value={90} name="银川机场"  style={{width: '120px', height: '100px'}}  />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} className="impact_sub">
                            <GaugeChart size="small" value={70} name="西宁机场"  style={{width: '120px', height: '100px'}}  />
                        </Col>
                        <Col span={12} className="impact_sub">
                            <GaugeChart size="small" value={75} name="延安机场"  style={{width: '120px', height: '100px'}}  />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className="row_model">
                <Col span={10} className="">
                    <div className="title">受控CTOT符合率分布</div>
                        <div className="warn flex justify-content-center layout-column">
                            <PieChart style={{width: '240px', height: '200px'}}  ></PieChart>
                    </div>
                </Col>
                <Col span={14} className="impact_sub">
                    <div className="title">平均跳变次数</div>
                    <div className="num">—<span className="sub_title2">次</span></div>
                </Col>
            </Row>
        </div>
    )
}


export default SchemePage
