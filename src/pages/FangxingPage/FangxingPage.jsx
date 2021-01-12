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
import FlightSearch  from 'components/FlightSearch/FlightSearch'
import SchemeTitle  from 'components/SchemeList/SchemeActiveTitle'
import NavBar  from 'components/NavBar/NavBar.jsx';
import ModalBox from 'components/ModalBox/ModalBox'
import LeftMultiCanvas  from 'components/LeftMultiCanvas/LeftMultiCanvas'
import RightMultiCanvas  from 'components/RightMultiCanvas/RightMultiCanvas'
import './FangxingPage.scss'
import {inject, observer} from "mobx-react";

const FlightTable = lazy(() => import('components/FlightTable/FlightTable') );

//放行监控布局模块
function FangxingPage(props){
    const { systemPage } = props;
    const { leftActiveName } = systemPage;
    return (
        <Layout className="layout">
            <NavBar className="nav_bar" title="空中交通运行放行监控系统" username="西安流量室" />
            <div className="nav_body">
                    <div className="cont_left">
                        <SchemeTitle />
                        <div className="left_cont">
                            {
                                leftActiveName === "" ? ""
                                    :<div className="left_left">
                                        <LeftMultiCanvas/>
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
                            }

                            <div className="left_right">
                                {/***/}
                                <Suspense fallback={<div className="load_spin"><Spin tip="加载中..."/></div>}>
                                    <FlightTable />
                                </Suspense>
                            </div>
                        </div>

                    </div>

                    <RightMultiCanvas />
                </div>
        
        </Layout>
    )
    
}

export default inject("systemPage")( observer(FangxingPage));



