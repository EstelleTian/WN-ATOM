/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2020-12-24 17:28:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\FangxingPage\FangxingPage.jsx
 */
import React from 'react'
import { Layout, Spin } from 'antd'
import { withRouter } from 'react-router-dom';
import ModalBox from 'components/ModalBox/ModalBox'
import NavBar  from 'components/NavBar/NavBar.jsx'
import AirportMonitor from 'components/MiniMonitor/AirportMonitor'
import SectorMonitor from 'components/MiniMonitor/SectorMonitor'
import AddMonitorCard from 'components/MiniMonitor/AddMonitorCard'
import FlightPerformance from 'components/FlightPerformance/FlightPerformance'
import CapacityFlowMonitor from 'components/CapacityFlowMonitor/CapacityFlowMonitor'
// import DHXWindow from 'components/SimpleMap/DHXWindow'

import './TotalPage.scss'
//总体监控布局模块
function TodoPage (props){
    return (
        <Layout className="layout">
            <NavBar className="nav_bar" title="空中交通运行总体态势监控" username="西安流量室"/>
            <div className="total_body">
                <div className="cont_top">
                    <div className="cont_top_left">
                        <ModalBox title="缩略地图" showDecorator = {true}  className="map-module" >
                            <div className="map-container">
                                <iframe
                                    className="map-frame"
                                    id="simpleMap"
                                    width="100%"
                                    height="100%"
                                    frameBorder={0}
                                    scrolling="no"
                                    src="http://192.168.210.84:8080/#/map"
                                ></iframe>
                            </div>


                        </ModalBox>
                    </div>
                    <div className="cont_top_right">
                        <ModalBox
                            title="航班执行情况"
                            showDecorator = {true}
                        >
                            <FlightPerformance/>
                        </ModalBox>

                    </div>
                </div>
                <div className="cont_bottom">
                    <div className="capacity-flow-monitor-module">
                        <CapacityFlowMonitor/>
                    </div>
                    {/*<AddMonitorCard/>*/}
                </div>
            </div>
        </Layout>

    )
}

export default withRouter(TodoPage);


