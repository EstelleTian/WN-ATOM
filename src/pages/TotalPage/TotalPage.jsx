/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-02-24 15:39:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\FangxingPage\FangxingPage.jsx
 */
import React, { Fragment, lazy, Suspense, useState, useEffect, useCallback } from 'react'
import { Layout, Spin, Row, Col, Avatar, Radio, message, Button } from 'antd'
import { UserOutlined, FileTextOutlined } from '@ant-design/icons'
import { request } from 'utils/request'
import { ReqUrls } from 'utils/request-urls'
import { inject, observer } from "mobx-react";

import ModalBox from 'components/ModalBox/ModalBox'
import User from 'components/NavBar/User'
import LoadingIframe from 'components/LoadingIframe/LoadingIframe'
import { openMapFrame, } from 'utils/client'



// import NavBar  from 'components/NavBar/NavBar.jsx'
import { getFullTime, isValidObject, isValidVariable, formatTimeString, addStringTime } from 'utils/basic-verify'


import 'components/NavBar/NavBar.scss'

import './TotalPage.scss'

const FlightPerformance = lazy(() => import('components/FlightPerformance/FlightPerformance'));
const CapacityFlowMonitor = lazy(() => import('components/CapacityFlowMonitor/CapacityFlowMonitor'));


const { Header, Footer, Sider, Content } = Layout;


//总体监控布局模块
function TodoPage(props) {

    const capacityFlowMonitorUnitData = {
        "NW": {
            CN_name: '西北全区',
            data: {
                AP: ["ZLXY", "ZLLL", "ZLXN", "ZLIC"],
                SECTOR: ["ZLXYAR01", "ZLXYAR02", "ZLXYAR03", "ZLXYAR04", "ZLXYAR05", "ZLXYAR06", "ZLXYAR07", "ZLXYAR08", "ZLXYAR09", "ZLXYAR10", "ZLXYAR11", "ZLXYAR12", "ZLXYAR13", "ZLLLAR01", "ZLLLAR02", "ZLLLAR03", "ZLLLAR04", "ZLLLAR05", "ZLLLAR06", "ZLLLAR07", "ZLLLAR08", "ZLLLAR09", "ZLLLAR11", "ZLLLAR12",],
                APP: [],
            }
        },
        "ZLXYACC": {
            CN_name: '西安管制区',
            data: {
                AP: ["ZLXY"],
                SECTOR: ["ZLXYAR01", "ZLXYAR02", "ZLXYAR03", "ZLXYAR04", "ZLXYAR05", "ZLXYAR06", "ZLXYAR07", "ZLXYAR08", "ZLXYAR09", "ZLXYAR10", "ZLXYAR11", "ZLXYAR12", "ZLXYAR13"],
                APP: ["ZLXYAP"],
            }

        },
        "ZLLLACC": {
            CN_name: '兰州管制区',
            data: {
                AP: ["ZLLL", "ZLXN", "ZLIC"],
                SECTOR: ["ZLLLAR01", "ZLLLAR02", "ZLLLAR03", "ZLLLAR04", "ZLLLAR05", "ZLLLAR06", "ZLLLAR07", "ZLLLAR08", "ZLLLAR09", "ZLLLAR11", "ZLLLAR12",],
                APP: ["ZLLLAP", "ZLXNAP", "ZLICAP"],
            }
        },
        "ZLIC": {
            CN_name: '宁夏分局',
            data: {
                AP: ["ZLIC"],
                SECTOR: [],
                APP: ["ZLICAP"],
            }
        },
        "ZLXN": {
            CN_name: '青海分局',
            data: {
                AP: ["ZLXN"],
                SECTOR: [],
                APP: ["ZLXNAP"],
            }
        },
        "ZLXY": {
            CN_name: 'ZLXY机场塔台',
            data: {
                AP: ["ZLXY"],
                SECTOR: [],
                APP: ["ZLXYAP"],
            }
        },
        "ZLLL": {
            CN_name: 'ZLLL机场塔台',
            data: {
                AP: ["ZLLL"],
                SECTOR: [],
                APP: ["ZLLLAP"],
            }
        },
    };
    const obj = {
        "focus": "NW",
        "monitorUnit": capacityFlowMonitorUnitData
    }

    let [userSubscribeData, setUserSubscribeData] = useState({});
    let [templateId, setTemplateId] = useState(0);
    let { subscribeData } = props.userSubscribeData;
    let focus = subscribeData.focus || "";

    /**
     * 更新用户订阅容流监控单元数据
     * */
    const updateUserSubscribeData = useCallback(data => {
        let userTemplateList = data.userTemplateList || [];
        let subscribeData = userTemplateList[0];
        // subscribeData.value = JSON.stringify(obj);
        if (isValidObject(subscribeData)) {
            props.userSubscribeData.updateUserSubscribeData(subscribeData)
        } else {
            props.userSubscribeData.updateUserSubscribeData({});
            message.error({
                content: "获取的订阅容流监控单元数据为空",
                duration: 8,
            });
        }
    });

    // 请求错误处理
    const requestErr = useCallback((err, content) => {
        let errMsg = "";
        if (isValidObject(err) && isValidVariable(err.message)) {
            errMsg = err.message;
        } else if (isValidVariable(err)) {
            errMsg = err;
        }

        message.error({
            content: (
                <span>
                    <span>{content}</span>
                    <br />
                    <span>{errMsg}</span>
                </span>
            ),
            duration: 8,
        });
    });

    /**
     * 初始化用户订阅数据
     * */
    const requestUserSubscribeData = () => {
        const { systemPage } = props;
        const user = systemPage.user || {};
        const userName = user.username;
        if (isValidVariable(userName)) {
            const opt = {
                url: ReqUrls.userSubscribeCapacityFlowMonitorUnitDataUrl + userName + "/capacityFlowMonitorUnitData",
                method: 'GET',
                params: {},
                resFunc: (data) => {
                    updateUserSubscribeData(data)
                },
                errFunc: (err) => {
                    requestErr(err, '获取用户订阅容流数据失败')
                },
            };
            request(opt);
        }
    };

    useEffect(function () {
        // 获取用户订阅数据
        requestUserSubscribeData();
    }, []);


    const reloadSimpleMap = () => {
        let iframe = document.getElementById("simpleMap");
        iframe.src += '';
    }

    /**
     * 区域切换事件回调
     * */
    const handleAreaChange = e => {
        const value = e.target.value;
        const { systemPage, userSubscribeData = {} } = props;
        let subscribeData = userSubscribeData.subscribeData || {};
        // subscribeData.monitorUnit["NW"] = {};
        // subscribeData.monitorUnit["NW"] = subscribeData.monitorUnit["NWALL"];
        // subscribeData.monitorUnit = capacityFlowMonitorUnitData;
        const user = systemPage.user || {};
        const userName = user.username;
        let data = {
            ...subscribeData,
            focus: value,
        };
        saveUserSubscribeData(userName, data);
    };

    /**
     * 更新保存用户订阅容流监控单元数据
     * */
    const saveUserSubscribeData = (userName, data) => {

        const { userSubscribeData = {} } = props;
        let originalSubscribeData = userSubscribeData.originalSubscribeData || {};

        let params = {
            ...originalSubscribeData,
            value: JSON.stringify(data),
        };
        const opt = {
            url: ReqUrls.userSubscribeCapacityFlowMonitorUnitDataUrl,
            method: 'PUT',
            params: params,
            resFunc: (data) => {
                requestUserSubscribeData();
            },
            errFunc: (err) => {
                requestErr(err, '保存用户订阅容流数据失败')
            },
        };
        request(opt);
    };

    const iframeLoaded = () => {
        console.log("load")
    }

    return (
        <Layout>
            <Header className="nav_header">
                <div className="nav_bar layout-row space-between multi_nav">
                    <div className="layout-nav-left layout-row">
                        <div className="area">
                            <Radio.Group
                                onChange={handleAreaChange}
                                value={focus}
                                buttonStyle="solid"
                                size="large" >
                                <Radio.Button value="NW">西北全区</Radio.Button>
                                <Radio.Button value="ZLXYACC">西安管制区</Radio.Button>
                                <Radio.Button value="ZLLLACC">兰州管制区</Radio.Button>
                                <Radio.Button value="ZLIC">宁夏分局</Radio.Button>
                                <Radio.Button value="ZLXN">青海分局</Radio.Button>
                                <Radio.Button value="ZLXY">西安机场塔台</Radio.Button>
                                <Radio.Button value="ZLLL">兰州机场塔台</Radio.Button>
                            </Radio.Group>
                        </div>
                    </div>
                    <div className="layout-nav-right layout-row">
                        <div className="single_user">
                            <Avatar className="user_icon" icon={<UserOutlined />} />
                            <User />
                        </div>
                    </div>
                </div>
            </Header>


            {/*<NavBar className="nav_bar" title="空中交通运行总体态势监控" />*/}
            <Content className="main-wrapper layout-column">

                <div className="top layout-column">
                    <Row className="flex-row">
                        <Col className="left-container">
                            <ModalBox
                                title="缩略地图"
                                showDecorator={true}
                                className="map-module"
                                style={{
                                    height: '100%',
                                }}
                            >
                                <div className="map-container">
                                    <div className="actions">
                                        <div className="detail" onClick={()=>{openMapFrame(focus)}} >
                                            <FileTextOutlined />查看详情
                                        </div>
                                    </div>
                                    
                                    {/* 虽然以下条件里的每个LoadingIframe一样，但一定要这样写，用于解决iframe src值变更后iframe页面内容不刷新问题  */}
                                    {
                                        focus === "NW" ? <LoadingIframe focus={focus} ></LoadingIframe> : ""
                                    }
                                    {
                                        focus === "ZLXYACC" ? <LoadingIframe focus={focus} ></LoadingIframe> : ""
                                    }
                                    {
                                        focus === "ZLLLACC" ? <LoadingIframe focus={focus} ></LoadingIframe> : ""
                                    }
                                    {
                                        focus === "ZLIC" ? <LoadingIframe focus={focus} ></LoadingIframe> : ""
                                    }
                                    {
                                        focus === "ZLXN" ? <LoadingIframe focus={focus} ></LoadingIframe> : ""
                                    }
                                    {
                                        focus === "ZLXY" ? <LoadingIframe focus={focus} ></LoadingIframe> : ""
                                    }
                                    {
                                        focus === "ZLLL" ? <LoadingIframe focus={focus} ></LoadingIframe> : ""
                                    }
                                </div>
                            </ModalBox>
                        </Col>
                        <Col className="right-container">
                            <ModalBox
                                title={`航班执行情况 (数据时间:${formatTimeString(props.flightPerformanceData.performanceData.generateTime)})`}
                                showDecorator={true}
                            >
                                <Suspense fallback={<div className="load_spin"><Spin tip="加载中..." /></div>}>
                                    <FlightPerformance onDoubleClick={() => console.log("on double click")} />
                                </Suspense>

                            </ModalBox>

                        </Col>
                    </Row>
                </div>
                <div className="bottom">
                    <div className="capacity-contianer">
                        <CapacityFlowMonitor />
                    </div>
                </div>
            </Content>
        </Layout>


    )
}

// export default withRouter(TodoPage);
// export default TodoPage

export default inject("userSubscribeData", "flightPerformanceData", "systemPage")(observer(TodoPage))


