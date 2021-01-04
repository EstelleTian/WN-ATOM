/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2020-12-24 19:19:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\FangxingPage\FangxingPage.jsx
 */
import React, { lazy, Suspense} from 'react';
import { Layout, Spin } from 'antd';
import ExecuteKPI  from 'components/ExecuteKPI/ExecuteKPI'
import FlightSearch  from 'components/FlightSearch/FlightSearch'
import SchemeTitle  from 'components/SchemeList/SchemeActiveTitle'
import NavBar  from 'components/NavBar/NavBar.jsx';
import ModalBox from 'components/ModalBox/ModalBox'
import './FangxingPage.scss'

const FlightTable = lazy(() => import('components/FlightTable/FlightTable') );
const SchemeList = lazy(() => import('components/SchemeList/SchemeList') );


//放行监控布局模块
function FangxingPage(props){
    return (
        <Layout className="layout">
            <NavBar className="nav_bar" title="空中交通运行放行监控系统" username="西安流量室" />
            <div className="nav_body">
                    <div className="cont_left">
                        <SchemeTitle />
                        <div className="left_cont">
                            <div className="left_left">
                                <ModalBox
                                    title="执行KPI"
                                    showDecorator = {true}
                                    className="kpi"
                                >
                                    <ExecuteKPI />
                                </ModalBox>
                                <ModalBox
                                    title="航班查询"
                                    style={{
                                        height: 330
                                    }}
                                    showDecorator = {true}
                                    className="flight_search"
                                >
                                    <FlightSearch />
                                </ModalBox>
                            </div>
                            <div className="left_right">
                                {/***/}
                                <Suspense fallback={<div className="load_spin"><Spin tip="加载中..."/></div>}>
                                    <FlightTable />
                                </Suspense>
                            </div>
                        </div>

                    </div>

                    <div className="cont_right">
                        <ModalBox 
                            title="方案列表"
                            showDecorator = {true}
                        >
                            {/***/} <Suspense fallback={<div className="load_spin"><Spin tip="加载中..."/></div>}>
                                <SchemeList />
                                </Suspense>
                            
                        </ModalBox>
                    </div>
                </div>
        
        </Layout>
    )
    
}

export default FangxingPage;



