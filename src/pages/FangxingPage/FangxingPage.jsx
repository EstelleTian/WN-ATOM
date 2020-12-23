/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2020-12-22 18:44:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\FangxingPage\FangxingPage.jsx
 */
import React, {Component} from 'react';
import { Layout } from 'antd';

import { withRouter } from 'react-router-dom';
import FlightTable from '../../components/FlightTable/FlightTable'
import SchemeList from '../../components/SchemeList/SchemeList'
import ExecuteKPI  from '../../components/ExecuteKPI/ExecuteKPI'
// import TimeLineContent  from '../../components/TimeLineFlight/TimeLineContent';
import FlightSearch  from '../../components/FlightSearch/FlightSearch'
import NavBar  from '../../components/NavBar/NavBar.jsx';
import * as stores  from '../../stores/stores.jsx';
import ModalBox from '../../components/ModalBox/ModalBox'
import './FangxingPage.scss'
//放行监控布局模块
function TodoPage(){
    return (
        <Layout className="layout">
            <NavBar className="nav_bar" title="空中交通运行放行监控系统" username="西安流量室" />
            <div className="nav_body"> 
                    <div className="cont_left">
                        <ModalBox 
                            title="执行KPI"
                            className="kpi"
                        >
                            <ExecuteKPI />
                        </ModalBox>
                        <ModalBox 
                            title="航班查询"
                            style={{
                                height: 330
                            }}
                            className="flight_search"
                        >
                            <FlightSearch />
                        </ModalBox>
                    </div>
                    <div className="cont_center">
                        <FlightTable />
                    </div>
                    <div className="cont_right">
                        <ModalBox 
                            title="方案列表"
                        >
                            <SchemeList />
                        </ModalBox>
                    </div>
                </div>
        
        </Layout>       
    )
    
}

export default withRouter(TodoPage);



