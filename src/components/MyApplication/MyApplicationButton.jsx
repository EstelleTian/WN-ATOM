/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-03-01 19:33:36
 * @LastEditors: Please set LastEditors
 * @Description:左上切换模块 执行kpi 豁免航班 等待池 特殊航班 失效航班 待办事项
 * @FilePath: \WN-CDM\src\pages\FangxingPage\FangxingPage.jsx
 */
import React, {  Fragment, useCallback, useState, useEffect, useMemo, useRef} from 'react';
import { Badge, Spin, message, Popconfirm, Form, Modal, Button, Input, DatePicker, Row, Col  } from 'antd';
import {inject, observer} from "mobx-react";
import { DoubleLeftOutlined, DoubleRightOutlined, SyncOutlined } from '@ant-design/icons';
import { ReqUrls, CollaborateIP } from "utils/request-urls";
import { requestGet, request  } from "utils/request";
import { getFullTime, getDayTimeFromString, isValidVariable, formatTimeString  } from "utils/basic-verify";
import DraggableModal from 'components/DraggableModal/DraggableModal'
import MyApplication from 'components/MyApplication/MyApplication'

let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;

const MyApplicationButton = (props) => {
    const [myApplicationModalVisible, setMyApplicationModalVisible] = useState(false);
    const [ tableLoading, setTableLoading ] = useState(false);
    const [ refreshBtnLoading, setRefreshBtnLoading ] = useState(false);
    const generateTime = useRef(0);
    const timerId = useRef();

    const { myApplicationList, systemPage  } = props;
    const user = systemPage.user || {};
    const userId = user.id || '';
    const myApplicationLen = myApplicationList.myApplication.length || 0;
    /**
     * 显示【我的申请】模态框
     * */
    const showMyApplicationModal = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setMyApplicationModalVisible(true);
    };
    /**
     * 关闭【我的申请】模态框
     * */
    const closeMyApplicationModal = (e) => {
        setMyApplicationModalVisible(false);
    };
    //请求错误处理
    const requestErr = useCallback((err, content) => {
        message.error({
            content,
            duration: 8,
        });
    },[]);

    //处理 我的申请 数据
    const handleMyApplicationData = useCallback((data) => {
        let tableData = [];
        const instances = data.instances || {};
        const gTime = data.generateTime || "";
        generateTime.current = gTime;
        for(let key in instances){
            const itemObj = instances[key];
            const processVariables = itemObj.processVariables || {};

            let businessName = processVariables.businessName || "";
            const processDefinitionName = itemObj.processDefinitionName || "";


            let activityName = itemObj.activityName || "";
            let startTime = itemObj.startTime || "";
            let endTime = itemObj.endTime || "";
            let obj = {
                key: key,
                id: key,
                businessName: businessName,
                processDefinitionName: processDefinitionName,
                activityName: activityName,
                startTime: startTime,
                endTime: endTime,
                status: isValidVariable(endTime) ? "已结束" : "进行中",
            };
            tableData.push(obj);
        }
        props.myApplicationList.updateMyApplicationListData(tableData);
    },[]);

    //获取我的申请
    const requestMyApplicationDatas = useCallback((triggerLoading) => {
        if( !isValidVariable(user.id) ){
            return;
        }
        if( triggerLoading ){
            setTableLoading(true);
            setRefreshBtnLoading(true);
        }
        let url = ReqUrls.myApplicationListUrl+user.username;
        const opt = {
            url,
            method: 'GET',
            resFunc: (data)=> {
                //更新我的申请数据
                handleMyApplicationData(data);
                setTableLoading(false);
                setRefreshBtnLoading(false);
            },
            errFunc: (err)=> {
                requestErr(err, '获取我的申请数据失败' );
                setTableLoading(false);
                setRefreshBtnLoading(false);
            },
        };
        requestGet(opt);
    },[user.id]);

    useEffect(()=>{
        requestMyApplicationDatas(true);
        timerId.current = setInterval(()=>{
            requestMyApplicationDatas(false);
        }, 60*1000);
        return () => {
            clearInterval(timerId.current);
            timerId.current = null;
        }
    },[ user.id ]);
    return (
        <Fragment>
            <Button
                type={myApplicationModalVisible ? "primary" : "default"}
                size="large"
                onClick={showMyApplicationModal}
            >我的申请
                <Badge
                    className="site-badge-count-109"
                    count={ myApplicationLen }
                    style={{ backgroundColor: 'rgb(61, 132, 36)' }}
                />
            </Button>
            <DraggableModal
                title="我的申请"
                style={{ top: 100}}
                visible={ myApplicationModalVisible }
                handleOk={() => closeMyApplicationModal()}
                handleCancel={() => closeMyApplicationModal()}
                width={(screenWidth > 1920) ? 1280: 1080}
                maskClosable={false}
                mask={false}
                destroyOnClose = { true }
                footer = {
                    <div></div>
                }
            >
                <MyApplication
                    tableLoading = {tableLoading}
                    refreshBtnLoading= { refreshBtnLoading }
                    generateTime = {generateTime}
                    requestMyApplicationDatas = { requestMyApplicationDatas}
                    // myApplicationList = {myApplicationList}
                >

                </MyApplication>
            </DraggableModal>
        </Fragment>
    )

}

export default inject("systemPage","myApplicationList", "flightTableData")(observer(MyApplicationButton))



