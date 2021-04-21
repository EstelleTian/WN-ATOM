


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

//总体监控-运行监控
function OperationPane(props) {
    

    

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

    return (
        <div>sss</div>
    )
}

export default inject("userSubscribeData", "flightPerformanceData", "systemPage")(observer(OperationPane))


