


/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-02-24 15:39:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\FangxingPage\FangxingPage.jsx
 */
import React, { Fragment, lazy, Suspense, useState, useEffect, useCallback } from 'react'
import { Layout, Spin, Row, Col, Avatar, Radio, message,} from 'antd'

import { UserOutlined, FileTextOutlined } from '@ant-design/icons'
import { request } from 'utils/request'
import { ReqUrls } from 'utils/request-urls'
import { inject, observer } from "mobx-react";

import ModalBox from 'components/ModalBox/ModalBox'
import User from 'components/NavBar/User'
import LoadingIframe from 'components/LoadingIframe/LoadingIframe'
import { openMapFrame, } from 'utils/client'

import { isValidObject, isValidVariable, formatTimeString} from 'utils/basic-verify'
import 'components/NavBar/NavBar.scss'
// import './TotalPage.scss'
const FlightPerformance = lazy(() => import('components/FlightPerformance/FlightPerformance'));
const CapacityFlowMonitor = lazy(() => import('components/CapacityFlowMonitor/CapacityFlowMonitor'));
const { Header, Footer, Sider, Content } = Layout;

//总体监控布局模块
function PrimaryPane(props) {
    const capacityFlowMonitorUnitData = {
        "NW": {
            CN_name: '西北全区',
            data: {
                AIRPORT: ["ZLXY", "ZLLL", "ZLXN", "ZLIC"],
                SECTOR: ["ZLXYAR01", "ZLXYAR02", "ZLXYAR03", "ZLXYAR04", "ZLXYAR05", "ZLXYAR06", "ZLXYAR07", "ZLXYAR08", "ZLXYAR09", "ZLXYAR10", "ZLXYAR11", "ZLXYAR12", "ZLXYAR13", "ZLLLAR01", "ZLLLAR02", "ZLLLAR03", "ZLLLAR04", "ZLLLAR05", "ZLLLAR06", "ZLLLAR07", "ZLLLAR08", "ZLLLAR09", "ZLLLAR11", "ZLLLAR12",],
                APP: [],
            }
        },
        "ZLXYACC": {
            CN_name: '西安管制区',
            data: {
                AIRPORT: ["ZLXY"],
                SECTOR: ["ZLXYAR01", "ZLXYAR02", "ZLXYAR03", "ZLXYAR04", "ZLXYAR05", "ZLXYAR06", "ZLXYAR07", "ZLXYAR08", "ZLXYAR09", "ZLXYAR10", "ZLXYAR11", "ZLXYAR12", "ZLXYAR13"],
                APP: ["ZLXYAP"],
            }

        },
        "ZLLLACC": {
            CN_name: '兰州管制区',
            data: {
                AIRPORT: ["ZLLL", "ZLXN", "ZLIC"],
                SECTOR: ["ZLLLAR01", "ZLLLAR02", "ZLLLAR03", "ZLLLAR04", "ZLLLAR05", "ZLLLAR06", "ZLLLAR07", "ZLLLAR08", "ZLLLAR09", "ZLLLAR11", "ZLLLAR12",],
                APP: ["ZLLLAP", "ZLXNAP", "ZLICAP"],
            }
        },
        "ZLIC": {
            CN_name: '宁夏分局',
            data: {
                AIRPORT: ["ZLIC"],
                SECTOR: [],
                APP: ["ZLICAP"],
                APPSEC: ["ZLICAP01", "ZLICAP02", "ZLICAP03", "ZLICAP04"]
            }
        },
        "ZLXN": {
            CN_name: '青海分局',
            data: {
                AIRPORT: ["ZLXN"],
                SECTOR: [],
                APP: ["ZLXNAP"],
                APPSEC: ["ZLXNAP01", "ZLXNAP02", "ZLXNAP03"]
            }
        },
        "ZLXY": {
            CN_name: '西安机场塔台',
            data: {
                AIRPORT: ["ZLXY"],
                SECTOR: [],
                APP: ["ZLXYAP"],
                APPSEC: ["ZLXYAP01(05)", "ZLXYAP01(23)", "ZLXYAP02", "ZLXYAP03", "ZLXYAP04(05)", "ZLXYAP04(23)", "ZLXYAP05(05)", "ZLXYAP05(23)",]
            }
        },
        "ZLLL": {
            CN_name: '兰州机场塔台',
            data: {
                AIRPORT: ["ZLLL"],
                SECTOR: [],
                APP: ["ZLLLAP"],
                APPSEC: ["ZLLLAP01", "ZLLLAP02", "ZLLLAP03", "ZLLLAP04", "ZLLLAP05",]
            }
        },
    };
    const obj = {
        "focus": "NW",
        "monitorUnit": capacityFlowMonitorUnitData
    }

    let [userSubscribeData, setUserSubscribeData] = useState({});
    let [templateId, setTemplateId] = useState(0);
    const { user = {} } = props.systemPage;
    const userId = user.id || "";
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
    }, [userId]);
    // 初始化用户信息
    useEffect(function () {
        // 从localStorage取用户信息并存入stores
        const user = localStorage.getItem("user");
        if (isValidVariable(user)) {
            props.systemPage.setUserData(JSON.parse(user));
        }
    }, []);

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
                            >
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
                                        <div className="detail" onClick={() => { openMapFrame(focus) }} >
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
                                    <FlightPerformance setActiveTabPane={props.setActiveTabPane} onDoubleClick={() => console.log("on double click")} />
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

export default inject("userSubscribeData", "flightPerformanceData", "systemPage")(observer(PrimaryPane))


