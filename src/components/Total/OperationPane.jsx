


/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-02-24 15:39:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\FangxingPage\FangxingPage.jsx
 */
import React, { Fragment, lazy, Suspense, useState, useEffect, useCallback } from 'react'
import { Layout, Table, Row, Col, Avatar, Radio, message, } from 'antd'

import { UserOutlined, FileTextOutlined } from '@ant-design/icons'
import { request } from 'utils/request'
import { ReqUrls } from 'utils/request-urls'
import { inject, observer } from "mobx-react";

import ModalBox from 'components/ModalBox/ModalBox'
import User from 'components/NavBar/User'
import LoadingIframe from 'components/LoadingIframe/LoadingIframe'
import { openMapFrame, } from 'utils/client'

import { isValidObject, isValidVariable, formatTimeString } from 'utils/basic-verify'
import 'components/NavBar/NavBar.scss'
// import './TotalPage.scss'
const FlightPerformance = lazy(() => import('components/FlightPerformance/FlightPerformance'));
const CapacityFlowMonitor = lazy(() => import('components/CapacityFlowMonitor/CapacityFlowMonitor'));

//总体监控-运行监控
function OperationPane(props) {
    const columns = [
        {
            title: '序号',
            dataIndex: 'num',
            key: 'num',
            width: 40,
            fixed: 'left',
        },
        {
            title: '机场名称',
            dataIndex: 'name',
            key: 'name',
            width: 100,
            fixed: 'left',
        },
        {
            title: '航班延误',
            children: [
                {
                    title: '总计',
                    dataIndex: 'total',
                    key: 'total',
                    width: 50,
                    sorter: (a, b) => a.total - b.total,
                },
                {
                    title: '0-15',
                    dataIndex: 'interval0_15',
                    key: 'interval0_15',
                    width: 50,
                    sorter: (a, b) => a.interval0_15 - b.interval0_15,
                    
                },
                {
                    title: '16-30',
                    dataIndex: 'interval16_30',
                    key: 'interval16_30',
                    width: 50,
                    sorter: (a, b) => a.interval16_30 - b.interval16_30,
                    
                },
                {
                    title: '31-60',
                    dataIndex: '60',
                    key: '60',
                    width: 50,
                    sorter: (a, b) => a.interval31_60 - b.interval31_60,
                    
                },
                {
                    title: '61-120',
                    dataIndex: 'interval61_120',
                    key: 'interval61_120',
                    width: 60,
                    sorter: (a, b) => a.interval61_120 - b.interval61_120,
                    
                },
                {
                    title: '121-180',
                    dataIndex: 'interval120_180',
                    key: 'interval120_180',
                    width: 60,
                    sorter: (a, b) => a.interval120_180 - b.interval120_180,
                    
                },
                {
                    title: '181以上',
                    dataIndex: 'interval181',
                    key: 'interval181',
                    width: 60,
                    sorter: (a, b) => a.interval181 - b.interval181,
                    
                }
            ],
        },
        {
            title: '正常率',
            children: [
                {
                    title: '起飞正常率',
                    dataIndex: 'depEstimateRate',
                    key: 'depEstimateRate',
                    width: 80,
                    sorter: (a, b) => a.depEstimateRate - b.depEstimateRate,
                    
                },
                {
                    title: '对比前30日',
                    dataIndex: 'depEstimateRateDiff',
                    key: 'depEstimateRateDiff',
                    width: 80,
                    sorter: (a, b) => a.depEstimateRateDiff - b.depEstimateRateDiff,
                    
                }
            ],
        },
        {
            title: '返航备降',
            children: [
                {
                    title: 'CPL',
                    dataIndex: 'CPL',
                    key: 'CPL',
                    width: 60,
                    sorter: (a, b) => a.CPL - b.CPL,
                    
                },
                {
                    title: '返航',
                    dataIndex: 'return',
                    key: 'return',
                    width: 60,
                    sorter: (a, b) => a.return - b.return,
                    
                },
                {
                    title: '备降',
                    dataIndex: 'alternate',
                    key: 'alternate',
                    width: 60,
                    sorter: (a, b) => a.alternate - b.alternate,
                    
                },
                {
                    title: '二次备降',
                    dataIndex: 'secondaryDiversion',
                    key: 'secondaryDiversion',
                    width: 60,
                    sorter: (a, b) => a.secondaryDiversion - b.secondaryDiversion,
                    
                },
                {
                    title: 'CPL恢复起飞',
                    dataIndex: 'resumesDep',
                    key: 'resumesDep',
                    width: 80,
                    sorter: (a, b) => a.resumesDep - b.resumesDep,
                    
                },
                {
                    title: 'CPL恢复落地',
                    dataIndex: 'resumesArr',
                    key: 'resumesArr',
                    width: 80,
                    sorter: (a, b) => a.resumesArr - b.resumesArr,
                    
                },
            ],
        },
        {
            title: '盘旋复飞',
            children: [
                {
                    title: '复飞',
                    dataIndex: 'goround',
                    key: 'goround',
                    width: 50,
                    sorter: (a, b) => a.goround - b.goround,
                    
                },
                {
                    title: '盘旋',
                    dataIndex: 'spiral',
                    key: 'spiral',
                    width: 50,
                    sorter: (a, b) => a.spiral - b.spiral,
                    
                }
            ],
        },
        {
            title: '当前跑道模式',
            children: [
                {
                    title: '当前运行模式',
                    dataIndex: 'operatingMode',
                    key: 'operatingMode',
                    width: 100,
                    sorter: (a, b) => a.operatingMode - b.operatingMode,
                    
                },
                {
                    title: <div><p style={{margin:0}}>当前模式60分钟内</p><p style={{margin:0}}>起飞间隔(分钟/架次)</p></div>,
                    dataIndex: 'intervalDep',
                    key: 'intervalDep',
                    width: 120,
                    sorter: (a, b) => a.intervalDep - b.intervalDep,
                    
                },
                {
                    title: <div><p style={{margin:0}}>当前模式60分钟内</p><p style={{margin:0}}>降落间隔(分钟/架次)</p></div>,
                    dataIndex: 'intervalArr',
                    key: 'intervalArr',
                    width: 120,
                    sorter: (a, b) => a.intervalArr - b.intervalArr,
                    
                },
                {
                    title: <div><p style={{margin:0}}>当前模式60分钟内</p><p style={{margin:0}}>起降间隔(分钟/架次)</p></div>,
                    dataIndex: 'intervalDepArr',
                    key: 'intervalDepArr',
                    width: 120,
                    sorter: (a, b) => a.intervalDepArr - b.intervalDepArr,
                }
            ],
        },
    ];

    const data = [
        {
            key: 1,
            num:1,
            name: 'ZLXY-西安/咸阳', //机场名称
            total: 115,
            interval0_15: 28,
            interval16_30: 28,
            interval31_60: 28,
            interval61_120: 11,
            interval120_180: 13,
            interval181: 7,
            depEstimateRate: '94%',
            depEstimateRateDiff: '5%',
            CPL: 25,
            return: 1,
            alternate: 24,
            secondaryDiversion: 0,
            resumesDep: 4,
            resumesArr: 1,
            goround: 4,
            spiral: 1,
            operatingMode: '↓23L/↑23R',
            intervalDep: '5.4/3.2',
            intervalArr: '6.2/8.5',
            intervalDepArr: '↑5.8/↓5.5',
        },
        {
            key: 2,
            num:2,
            name: 'ZLLL-兰州/中川',
            
            street: 'Lake Park',
            building: 'C',
            number: 2035,
            companyAddress: 'Lake Street 42',
            companyName: 'SoftLake Co',
            gender: 'M',
        },
        {
            key: 3,
            num:3,
            name: 'ZLXN-西宁/曹家堡',
            
            street: 'Lake Park',
            building: 'C',
            number: 2035,
            companyAddress: 'Lake Street 42',
            companyName: 'SoftLake Co',
            gender: 'M',
        },
        {
            key: 4,
            name: 'ZLIC-银川/河东',
            num:4,
            street: 'Lake Park',
            building: 'C',
            number: 2035,
            companyAddress: 'Lake Street 42',
            companyName: 'SoftLake Co',
            gender: 'M',
        }
    ];



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

    // useEffect(function () {
    //     // 获取用户订阅数据
    //     requestUserSubscribeData();
    // }, [userId]);
    // 初始化用户信息
    // useEffect(function () {
    //     // 从localStorage取用户信息并存入stores
    //     const user = localStorage.getItem("user");
    //     if (isValidVariable(user)) {
    //         props.systemPage.setUserData(JSON.parse(user));
    //     }
    // }, []);

    return (
        <div>
            <Table
                columns={columns}
                dataSource={data}
                bordered
                size="middle"
                scroll={{ x: 'calc(700px + 50%)', y: 240 }}
            />,
        </div>
    )
}

export default inject("userSubscribeData", "flightPerformanceData", "systemPage")(observer(OperationPane))


