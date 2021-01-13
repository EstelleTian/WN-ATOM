/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2020-12-24 19:19:59
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
import {  isValidVariable,  } from 'utils/basic-verify'
import './FangxingPage.scss'

const FlightTable = lazy(() => import('components/FlightTable/FlightTable') );

//放行监控布局模块
function FangxingPage(props){
    const { systemPage } = props;
    const { leftActiveName, user = {} } = systemPage;
    const [ login, setLogin ] = useState(false);
    useEffect(function(){
        const id = user.id;
        if( isValidVariable(id) ){
            setLogin(true);
        }
        else{
            //TODO 测试用，正式去掉该else
            setTimeout(function(){
                if( !isValidVariable(user.id) ){
                    // alert("未登录成功，点击确认 中后将注入假用户数据");
                    props.systemPage.setUserData({
                        id: 14,
                        descriptionCN: "兰州流量室(假)"
                    });
                    setLogin(true);
                }
            },1000)
        }
    },[ user.id ]);
    return (
        <Layout className="layout">
            <NavBar className="nav_bar" title="空中交通运行放行监控系统" username="" />
            {
                login ?  <div className="nav_body">
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
                </div> : ""
            }

        </Layout>
    )
    
}

export default inject("systemPage")( observer(FangxingPage));



