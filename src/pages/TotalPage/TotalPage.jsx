/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-02-24 15:39:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\FangxingPage\FangxingPage.jsx
 */
import React , { lazy, Suspense, useState, useEffect, useCallback}  from 'react'
import { Layout, Spin, Row, Col,  Avatar, Radio, message, Button } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { request } from 'utils/request'
import { ReqUrls } from 'utils/request-urls'

import {inject, observer} from "mobx-react";

import ModalBox from 'components/ModalBox/ModalBox'
import NavBellNews from 'components/NavBar/NavBellNews'
import User from 'components/NavBar/User'

// import NavBar  from 'components/NavBar/NavBar.jsx'
import { getFullTime, isValidObject, isValidVariable, formatTimeString, addStringTime } from 'utils/basic-verify'


import 'components/NavBar/NavBar.scss'

import './TotalPage.scss'

const FlightPerformance = lazy(() => import('components/FlightPerformance/FlightPerformance') );
const CapacityFlowMonitor = lazy(() => import('components/CapacityFlowMonitor/CapacityFlowMonitor') );


const { Header, Footer, Sider, Content } = Layout;

alert("总体监控更新了 1600版");
//总体监控布局模块
function TodoPage (props){

    const capacityFlowMonitorUnitData = {
        'NWALL': {
            CN_name: '西北全区',
            data: {
                AP: {
                    CN_name: '机场',
                    units: {
                        ZLXY: {
                            CN_name: '西安机场',
                            order: 0,
                        },
                        ZLLL: {
                            CN_name: '兰州机场',
                            order: 0,
                        },
                        ZLXN: {
                            CN_name: '西宁机场',
                            order: 0,
                        },
                        ZLIC: {
                            CN_name: '银川机场',
                            order: 0,
                        },
                    },
                },
                SECTOR: {
                    CN_name: '扇区',
                    units: {
                        ZLXYAR01: {
                            CN_name: '西安01扇区',
                            order: 0,
                        },
                        ZLXYAR02: {
                            CN_name: '西安02扇区',
                            order: 1,
                        },
                        ZLXYAR03: {
                            CN_name: '西安03扇区',
                            order: 2,
                        },
                        ZLXYAR04: {
                            CN_name: '西安04扇区',
                            order: 3,
                        },
                        ZLXYAR05: {
                            CN_name: '西安05扇区',
                            order: 4,
                        },
                        ZLXYAR06: {
                            CN_name: '西安06扇区',
                            order: 5,
                        },
                        ZLXYAR07: {
                            CN_name: '西安07扇区',
                            order: 6,
                        },
                        ZLXYAR08: {
                            CN_name: '西安08扇区',
                            order: 7,
                        },
                        ZLXYAR09: {
                            CN_name: '西安09扇区',
                            order: 8,
                        },
                        ZLXYAR10: {
                            CN_name: '西安10扇区',
                            order: 9,
                        },
                        ZLXYAR11: {
                            CN_name: '西安11扇区',
                            order: 10,
                        },
                        ZLXYAR12: {
                            CN_name: '西安12扇区',
                            order: 11,
                        },
                        ZLXYAR13: {
                            CN_name: '西安13扇区',
                            order: 12,
                        },
                        ZLLLAR01: {
                            CN_name: '兰州01扇区',
                            order: 13,
                        },
                        ZLLLAR02: {
                            CN_name: '兰州02扇区',
                            order: 14,
                        },
                        ZLLLAR03: {
                            CN_name: '兰州03扇区',
                            order: 15,
                        },
                        ZLLLAR04: {
                            CN_name: '兰州0扇4区',
                            order: 16,
                        },
                        ZLLLAR05: {
                            CN_name: '兰州05扇区',
                            order: 17,
                        },
                        ZLLLAR06: {
                            CN_name: '兰州06扇区',
                            order: 18,
                        },
                        ZLLLAR07: {
                            CN_name: '兰州07扇区',
                            order: 19,
                        },
                        ZLLLAR08: {
                            CN_name: '兰州08扇区',
                            order: 20,
                        },
                        ZLLLAR09: {
                            CN_name: '兰州09扇区',
                            order: 21,
                        },
                        ZLLLAR11: {
                            CN_name: '兰州11扇区',
                            order: 22,
                        },
                        ZLLLAR12: {
                            CN_name: '兰州12扇区',
                            order: 23,
                        },
                    }
                }
            }

        },
        'ZLXYACC': {
            CN_name: '西安管制区',
            data: {
                AP: {
                    CN_name: '机场',
                    units: {
                        ZLXY: {
                            CN_name: '西安机场',
                            order: 0,
                        },
                    },
                },
                SECTOR: {
                    CN_name: '扇区',
                    units: {
                        ZLXYAR01: {
                            CN_name: '西安01扇区',
                            order: 0,
                        },
                        ZLXYAR02: {
                            CN_name: '西安02扇区',
                            order: 1,
                        },
                        ZLXYAR03: {
                            CN_name: '西安03扇区',
                            order: 2,
                        },
                        ZLXYAR04: {
                            CN_name: '西安04扇区',
                            order: 3,
                        },
                        ZLXYAR05: {
                            CN_name: '西安05扇区',
                            order: 4,
                        },
                        ZLXYAR06: {
                            CN_name: '西安06扇区',
                            order: 5,
                        },
                        ZLXYAR07: {
                            CN_name: '西安07扇区',
                            order: 6,
                        },
                        ZLXYAR08: {
                            CN_name: '西安08扇区',
                            order: 7,
                        },
                        ZLXYAR09: {
                            CN_name: '西安09扇区',
                            order: 8,
                        },
                        ZLXYAR10: {
                            CN_name: '西安10扇区',
                            order: 9,
                        },
                        ZLXYAR11: {
                            CN_name: '西安11扇区',
                            order: 10,
                        },
                        ZLXYAR12: {
                            CN_name: '西安12扇区',
                            order: 11,
                        },
                        ZLXYAR13: {
                            CN_name: '西安13扇区',
                            order: 12,
                        },
                    }
                }
            }

        },
        'ZLLLACC': {
            CN_name: '兰州管制区',
            data: {
                AP: {
                    CN_name: '机场',
                    units: {
                        ZLLL: {
                            CN_name: '兰州机场',
                            order: 0,
                        }
                    },
                },
                SECTOR: {
                    CN_name: '扇区',
                    units: {
                        ZLLLAR01: {
                            CN_name: '兰州01扇区',
                            order: 13,
                        },
                        ZLLLAR02: {
                            CN_name: '兰州02扇区',
                            order: 14,
                        },
                        ZLLLAR03: {
                            CN_name: '兰州03扇区',
                            order: 15,
                        },
                        ZLLLAR04: {
                            CN_name: '兰州0扇4区',
                            order: 16,
                        },
                        ZLLLAR05: {
                            CN_name: '兰州05扇区',
                            order: 17,
                        },
                        ZLLLAR06: {
                            CN_name: '兰州06扇区',
                            order: 18,
                        },
                        ZLLLAR07: {
                            CN_name: '兰州07扇区',
                            order: 19,
                        },
                        ZLLLAR08: {
                            CN_name: '兰州08扇区',
                            order: 20,
                        },
                        ZLLLAR09: {
                            CN_name: '兰州09扇区',
                            order: 21,
                        },
                        ZLLLAR11: {
                            CN_name: '兰州11扇区',
                            order: 22,
                        },
                        ZLLLAR12: {
                            CN_name: '兰州12扇区',
                            order: 23,
                        },
                    }
                }
            }

        },
        'NINGXIABRANCH': {
            CN_name: '宁夏分局',
            data: {
                AP: {
                    CN_name: '机场',
                    units: {
                        ZLIC: {
                            CN_name: '银川机场',
                            order: 0,
                        }
                    },
                },
            }
        },
        'QINGHAIBRANCH': {
            CN_name: '青海分局',
            data: {
                AP: {
                    CN_name: '机场',
                    units: {
                        ZLXN: {
                            CN_name: '西宁机场',
                            order: 0,
                        }
                    },
                },
            }
        },
        'ZLXYTOWER': {
            CN_name: 'ZLXY机场塔台',
            data: {
                AP: {
                    CN_name: '机场',
                    units: {
                        ZLXY: {
                            CN_name: '西安机场',
                            order: 0,
                        }
                    },
                },
            }
        },
        'ZLLLTOWER': {
            CN_name: 'ZLLL机场塔台',
            data: {
                AP: {
                    CN_name: '机场',
                    units: {
                        ZLLL: {
                            CN_name: '兰州机场',
                            order: 0,
                        }
                    },
                },
            }
        },
    };

    let [userSubscribeData, setUserSubscribeData] = useState({});
    let [templateId, setTemplateId] = useState(0);

    /**
     * 更新用户订阅容流监控单元数据
     * */
    const updateUserSubscribeData = useCallback(data => {
        let userTemplateList = data.userTemplateList || [];
        let subscribeData = userTemplateList[0];
        if( isValidObject(subscribeData) ){
            props.userSubscribeData.updateUserSubscribeData(subscribeData)
        }else{
            props.userSubscribeData.updateUserSubscribeData({});
            message.error({
                content:"获取的航班执行数据为空",
                duration: 4,
            });

        }
    });

    // 请求错误处理
    const requestErr = useCallback((err, content) => {
        let errMsg = "";
        if(isValidObject(err) && isValidVariable(err.message)){
            errMsg = err.message;
        }else if(isValidVariable(err)){
            errMsg = err;
        }

        message.error({
            content:(
                <span>
                    <span>{ content }</span>
                    <br/>
                    <span>{errMsg}</span>
                </span>
            ),
            duration: 4,
        });
    });

    /**
     * 初始化用户订阅数据
     * */
    const requestUserSubscribeData = ()=> {
        const { systemPage } = props;
        const user = systemPage.user || {};
        const userName= user.username;
        if(isValidVariable(userName)){
            const opt = {
                url: ReqUrls.userSubscribeCapacityFlowMonitorUnitDataUrl+userName+"/capacityFlowMonitorUnitData",
                method:'GET',
                params:{},
                resFunc: (data)=> {
                    updateUserSubscribeData(data)
                },
                errFunc: (err)=> {
                    requestErr(err, '获取用户订阅容流数据失败')
                } ,
            };
            request(opt);
        }
    };

    useEffect(function(){
        // 获取用户订阅数据
        requestUserSubscribeData();
    },[]);

    /**
     * 区域切换事件回调
     * */
    const handleAreaChange = e => {
        const value = e.target.value;
        const { systemPage, userSubscribeData={} } = props;
        let subscribeData = userSubscribeData.subscribeData || {};
        const user = systemPage.user || {};
        const userName= user.username;
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

        const { userSubscribeData={} } = props;
        let originalSubscribeData = userSubscribeData.originalSubscribeData || {};

        let params = {
            ... originalSubscribeData,
            value: JSON.stringify(data),
        };
        const opt = {
            url: ReqUrls.userSubscribeCapacityFlowMonitorUnitDataUrl,
            method:'PUT',
            params:params,
            resFunc: (data)=> {
                requestUserSubscribeData();
            },
            errFunc: (err)=> {
                requestErr(err, '保存用户订阅容流数据失败')
            } ,
        };
        request(opt);
    };

    let { subscribeData} = props.userSubscribeData;
    let focus = subscribeData.focus || "";

    return (
        <Layout>
            <Header className="nav_header">
                <div className="nav_bar layout-row space-between multi_nav">
                    <div className="layout-nav-left layout-row">
                        <div className="area">
                            <Radio.Group
                                onChange={handleAreaChange}
                                value = {focus}
                                buttonStyle="solid"
                                size="large" >
                                <Radio.Button value="NWALL">西北全区</Radio.Button>
                                <Radio.Button value="ZLXYACC">西安管制区</Radio.Button>
                                <Radio.Button value="ZLLLACC">兰州管制区</Radio.Button>
                                <Radio.Button value="NINGXIABRANCH">宁夏分局</Radio.Button>
                                <Radio.Button value="QINGHAIBRANCH">青海分局</Radio.Button>
                                <Radio.Button value="ZLXYTOWER">ZLXY机场塔台</Radio.Button>
                                <Radio.Button value="ZLLLTOWER">ZLLL机场塔台</Radio.Button>
                            </Radio.Group>
                        </div>
                    </div>
                    <div className="layout-nav-right layout-row">
                        <div className="single_bell">
                            <NavBellNews />
                        </div>
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


