/*
 * @Author: your name
 * @Date: 2020-12-14 13:47:11
 * @LastEditTime: 2020-12-24 17:51:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\components\ExecuteKPI\ExecuteKPI.jsx
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
            <Row>
                <Col className="impact">
                    <div className="title">影响航班</div>
                    <div className="num">79</div>
                    <div className="sub_title">架次</div>
                </Col>
            </Row>
        <div className="layout-row">
                <div className="flex  layout-column justify-content-center">
                    <div className="title justify-content-center">影响航班</div>
                    <div className="justify-content-center layout-column">
                        <div className="title cus_cont">80架次</div>
                    </div>
                </div>
                <div className="flex layout-column justify-content-center">
                    <div className="flex layout-row justify-content-center">
                        <div className="flex  layout-column justify-content-center" >
                            <div className="title justify-content-center">临界航班</div>
                            <div className=" flex justify-content-center layout-column">
                                <div className="title cus_cont">80架次</div>
                            </div>
                        </div>
                        <div className="flex  layout-column justify-content-center" >
                            <div className="title justify-content-center">申请协调航班</div>
                            <div className=" flex justify-content-center layout-column">
                                <div className="title cus_cont">80架次</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex layout-row justify-content-center">
                        <div className="flex  layout-column justify-content-center" >
                            <div className="title justify-content-center">入池航班</div>
                            <div className=" flex justify-content-center layout-column">
                                <div className="title cus_cont">80架次</div>
                            </div>
                        </div>
                        <div className="flex  layout-column justify-content-center" >
                            <div className="title justify-content-center">关舱门等待航班</div>
                            <div className=" flex justify-content-center layout-column">
                                <div className="title cus_cont">80架次</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="layout-row">
                <div className="flex effect layout-column justify-content-center">
                    <div className="title">影响程度</div>
                    <div className="warn flex justify-content-center layout-column">
                        <AlertOutlined />
                        <div className="text-center">高</div>
                    </div>
                </div>
                <div className="flex layout-row dcb justify-content-center">
                    <AirportMonitor title="DCB"/>
                </div>
            </div>
            <div className="layout-row">
                <div className="layout-row flex-wrap justify-content-center">
                    <GaugeChart className="layout-row flex-wrap justify-content-center" value={80} style={{width: '240px', height: '200px'}}  />
                </div>
                <div className="layout-row flex-wrap justify-content-center">
                    <GaugeChart size="small" value={80} name="西安机场" style={{width: '120px', height: '100px'}}  />
                    <GaugeChart size="small" value={90} name="银川机场"  style={{width: '120px', height: '100px'}}  />
                    <GaugeChart size="small" value={70} name="西宁机场"  style={{width: '120px', height: '100px'}}  />
                    <GaugeChart size="small" value={75} name="延安机场"  style={{width: '120px', height: '100px'}}  />
                </div>
            </div>

            <div className="layout-row">
                <div className="flex effect layout-column justify-content-center">
                    <div className="title">受控CTOT符合率分布</div>
                    <div className="warn flex justify-content-center layout-column">
                        <PieChart style={{width: '240px', height: '200px'}}  ></PieChart>
                    </div>
                </div>
                <div className="flex layout-row justify-content-center">
                    <div className="flex layout-column ">
                        <div className="title justify-content-center">平均跳变次数</div>
                        <div className=" flex justify-content-center layout-column">
                            <div className="title cus_cont">3次</div>
                        </div>
                    </div>

                </div>
            </div>
            
        </div>
    )
}


export default SchemePage
