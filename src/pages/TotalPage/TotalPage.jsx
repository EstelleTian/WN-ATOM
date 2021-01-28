/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2020-12-24 17:28:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\FangxingPage\FangxingPage.jsx
 */
import React , { lazy, Suspense, useState, useEffect, useCallback}  from 'react'
import { Layout, Empty, Spin, Row, Col } from 'antd'

import { withRouter } from 'react-router-dom';
import {inject, observer} from "mobx-react";

import ModalBox from 'components/ModalBox/ModalBox'
import NavBar  from 'components/NavBar/NavBar.jsx'
import { ReqUrls } from 'utils/request-urls'
import { formatTimeString } from 'utils/basic-verify'

const FlightPerformance = lazy(() => import('components/FlightPerformance/FlightPerformance') );
const CapacityFlowMonitor = lazy(() => import('components/CapacityFlowMonitor/CapacityFlowMonitor') );



import './TotalPage.scss'
const { Header, Footer, Sider, Content } = Layout;


//总体监控布局模块
function TodoPage (props){
    // useEffect(() => {
    //     alert('组件加载')
    //
    // }, []);


    return (
        <Layout>
            <NavBar className="nav_bar" title="空中交通运行总体态势监控" username="西安流量室"/>
        <Content className="main-wrapper layout-column">

            <div className="top layout-column">
                <Row className="flex-row">
                    <Col className="left-container">
                        <ModalBox
                            title="缩略地图"
                            showDecorator = {true}
                            className="map-module"
                            style={{
                                height: '100%',
                            }}
                        >
                            <div className="map-container">
                                <iframe
                                    className="map-frame"
                                    id="simpleMap"
                                    width="100%"
                                    height="100%"
                                    frameBorder={0}
                                    scrolling="no"
                                    src={ ReqUrls.mapUrl }
                                />
                            </div>
                        </ModalBox>
                    </Col>
                    <Col className="right-container">
                        <ModalBox
                            title={`航班执行情况 (数据时间:${ formatTimeString(props.flightPerformanceData.performanceData.generateTime) })`}
                            showDecorator = {true}
                        >
                            <Suspense fallback={<div className="load_spin"><Spin tip="加载中..."/></div>}>
                                <FlightPerformance/>
                            </Suspense>

                        </ModalBox>

                    </Col>
                </Row>
            </div>
            <div className="bottom">
                <div className="capacity-contianer">
                    <CapacityFlowMonitor/>
                </div>
            </div>
        </Content>
    </Layout>
        // <Layout className="layout">
        //     <NavBar className="nav_bar" title="空中交通运行总体态势监控" username="西安流量室"/>
        //     <div className="total_body">
        //         <div className="cont_top">
        //             <div className="cont_top_left">
        //                 <ModalBox title="缩略地图" showDecorator = {true}  className="map-module" >
        //                     <div className="map-container">
        //                         <iframe
        //                             className="map-frame"
        //                             id="simpleMap"
        //                             width="100%"
        //                             height="100%"
        //                             frameBorder={0}
        //                             scrolling="no"
        //                             src={ ReqUrls.mapUrl }
        //                         />
        //                     </div>
        //                 </ModalBox>
        //             </div>
        //             <div className="cont_top_right">
        //                 <ModalBox
        //                     title={`航班执行情况 (数据时间:${ formatTimeString(props.flightPerformanceData.performanceData.generateTime) })`}
        //                     showDecorator = {true}
        //                 >
        //                     <Suspense fallback={<div className="load_spin"><Spin tip="加载中..."/></div>}>
        //                         <FlightPerformance/>
        //                     </Suspense>
        //
        //                 </ModalBox>
        //
        //             </div>
        //         </div>
        //         <div className="cont_bottom">
        //             <div className="capacity-flow-monitor-module">
        //                 <CapacityFlowMonitor/>
        //             </div>
        //             {/*<AddMonitorCard/>*/}
        //         </div>
        //     </div>
        // </Layout>

    )
}

// export default withRouter(TodoPage);
export default inject("flightPerformanceData", "capacityFlowMonitorData", "systemPage")(observer(TodoPage))


