/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-03-01 17:42:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\FangxingPage\FangxingPage.jsx
 */
import React, { lazy, Suspense, useState, useEffect} from 'react';
import { Layout, Spin } from 'antd';
import {inject, observer} from "mobx-react";
import FlightSearch  from 'components/FlightSearch/FlightSearch'
import SchemeTitle  from 'components/SchemeList/SchemeActiveTitle'
import NavBar  from 'components/NavBar/NavBar.jsx';
import ModalBox from 'components/ModalBox/ModalBox'
import LeftMultiCanvas  from 'components/LeftMultiCanvas/LeftMultiCanvas'
import RightMultiCanvas  from 'components/RightMultiCanvas/RightMultiCanvas'
import {  isValidVariable  } from 'utils/basic-verify'
import './FangxingPage.scss'

const FlightTableModal = lazy(() => import('components/FlightTable/FlightTable') );

//放行监控布局模块
function FangxingPage(props){
    const { systemPage } = props;
    const { leftActiveName, user = {} } = systemPage;
    const [ login, setLogin ] = useState(false);
    useEffect(function(){
        const id = user.id;
        if( isValidVariable(id) ){
            // alert("登录成功:" + props.systemPage.user.id);
            setLogin(true);
        }
        else{
            //TODO 测试用，正式去掉该else
            // setTimeout(function(){
            //     if( !isValidVariable( props.systemPage.user.id ) ){
            //         // alert("未登录成功:" + props.systemPage.user.id);
            //         props.systemPage.setUserData({
            //             id: 14,
            //             descriptionCN: "--",
            //             username: 'lanzhouflw'
            //         });
            //         setLogin(true);
            //     }
            // },1)
        }
    },[ user.id ]);
    return (
        <Layout className="layout">
            <NavBar className="nav_bar" title="空中交通运行放行监控系统" username="" />
            {
                login ?  <div className="nav_body">
                    <div className="cont_left">
                        {/*<SchemeTitle />*/}
                        <div className="left_cont">
                            {/**/
                                leftActiveName === "" ? ""
                                    :<div className="left_left">
                                        <LeftMultiCanvas/>
                                        {/*<ModalBox*/}
                                            {/*title="航班查询"*/}
                                            {/*style={{*/}
                                                {/*height: 330*/}
                                            {/*}}*/}
                                            {/*showDecorator = {true}*/}
                                            {/*className="flight_search"*/}
                                        {/*>*/}
                                            {/*<FlightSearch />*/}
                                        {/*</ModalBox>*/}
                                    </div>
                                }

                            <div className="left_right">
                                {/***/}
                                <Suspense fallback={<div className="load_spin"><Spin tip="加载中..."/></div>}>
                                    <FlightTableModal />
                                </Suspense>
                            </div>
                        </div>

                    </div>

                    <RightMultiCanvas />
                </div> : ""
            }

        </Layout>
    )
    
}

export default inject("systemPage")( observer(FangxingPage));



