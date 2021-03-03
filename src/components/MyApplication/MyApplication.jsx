/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-03-01 19:33:36
 * @LastEditors: Please set LastEditors
 * @Description:左上切换模块 执行kpi 豁免航班 等待池 特殊航班 失效航班 待办事项
 * @FilePath: \WN-CDM\src\pages\FangxingPage\FangxingPage.jsx
 */
import React, {  Suspense, useCallback, useState, useEffect, useMemo, useRef} from 'react';
import { Table, Spin, message, Popconfirm, Form, Modal, Button, Input, DatePicker, Row, Col  } from 'antd';
import {inject, observer} from "mobx-react";
import { DoubleLeftOutlined, DoubleRightOutlined, SyncOutlined } from '@ant-design/icons';
import { ReqUrls, CollaborateIP } from "utils/request-urls";
import { requestGet, request  } from "utils/request";
import { getFullTime, getDayTimeFromString, isValidVariable, formatTimeString  } from "utils/basic-verify";
import { FlightCoordination  } from "utils/flightcoordination";
import moment from "moment";
// import './TodoTable.scss';


//获取屏幕宽度，适配 2k
let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;
//根据key识别列表列配置columns
const names = {
    "ID":{
        "en":"ID",
        "cn":"流水号",
        align: 'center',
        width: 90,
    },
    "BUSINESSNAME":{
        "en":"BUSINESSNAME",
        "cn":"工作名称",
        width: 200,
        align: 'left',
    },
    "ACTIVITYNAME":{
        "en":"ACTIVITYNAME",
        "cn":"当前所处环节",
        width: 200,
        align: 'left',
    },
    "STARTTIME":{
        "en":"STARTTIME",
        "cn":"发起时间",
        width: 100,
        align: 'center',
    },
    "ENDTIME":{
        "en":"ENDTIME",
        "cn":"状态",
        width: 100,
        align: 'center',
    },
}

const columns = [
    {
        title: "流水号",
        dataIndex: "id",
        align: 'center',
        key: "id",
        width: 80,
    },
    {
        title: "工作名称",
        dataIndex: "businessName",
        align: 'left',
        key: "businessName",
        width: 320,
    },{
        title: "当前所处环节",
        dataIndex: "activityName",
        align: 'left',
        key: "activityName",
        width: 250,
    },{
        title: "发起时间",
        dataIndex: "startTime",
        align: 'center',
        key: "startTime",
        width: 180,
        defaultSortOrder: 'descend',
        sorter: (a, b) => {
            return a.startTime - b.startTime;
        },
        render: (text, record, index) => {
            if( text === "" ){
                return text
            }else {
                return getFullTime(new Date(text), 1)
            }
        }
    },{
        title: "状态",
        dataIndex: "status",
        align: 'center',
        key: "status",
        width: 80,
    },
];


const MyApplication = (props) => {
    const [tableWidth, setWidth] = useState(1000);
    const [tableHeight, setHeight] = useState(800);
    const [ loading, setLoading ] = useState(false);
    
    const [ refreshBtnLoading, setRefreshBtnLoading ] = useState(false);
    
    const generateTime = useRef(0);
    const timerId = useRef();
    const tableTotalWidth = useRef();

    const user = props.systemPage.user || {};
    const userId = user.id || '';


    //获取我的申请
    const requestDatas = useCallback((triggerLoading) => {
        if( !isValidVariable(user.id) ){
            return;
        }
        if( triggerLoading ){
            setLoading(true);
        }
        let url = ReqUrls.myApplicationListUrl+user.username;
        const opt = {
            url,
            method: 'GET',
            resFunc: (data)=> {
                //更新工作流数据
                handleTasksData(data);
                setLoading(false);
                setRefreshBtnLoading(false);
            },
            errFunc: (err)=> {
                requestErr(err, '获取我的申请数据失败' );
                setLoading(false);
                setRefreshBtnLoading(false);

            },
        };
        requestGet(opt);
    },[user.id]);

    //请求错误处理
    const requestErr = useCallback((err, content) => {
        message.error({
            content,
            duration: 8,
        });
    },[]);
    
    //处理 待办工作 数据
    const handleTasksData = useCallback((data) => {
       let tableData = [];
       const instances = data.instances || {};
       const gTime = data.generateTime || "";
       generateTime.current = gTime;
       for(let key in instances){
           const itemObj = instances[key];
           const processVariables = itemObj.processVariables || {};

           let businessName = processVariables.businessName || "";
           const processDefinitionName = itemObj.processDefinitionName || "";
           if(isValidVariable(processDefinitionName)){
               businessName = processDefinitionName + "("+businessName+")";
           }

           let activityName = itemObj.activityName || "";
           let startTime = itemObj.startTime || "";
           let endTime = itemObj.endTime || "";
           let obj = {
               key: key,
               id: key,
               businessName: businessName,
               activityName: activityName,
               startTime: startTime,
               endTime: endTime,
               status: isValidVariable(endTime) ? "已结束" : "进行中",
           };
            tableData.push(obj);
       }
       props.myApplicationList.updateMyApplicationListData(tableData);
    },[]);

    useEffect(()=>{
        requestDatas(true);
        timerId.current = setInterval(()=>{
            requestDatas(false);
        }, 60*1000);
        return () => {
            clearInterval(timerId.current)
            timerId.current = null;
        }
    },[])
    return (
        <Suspense fallback={<div className="load_spin"><Spin tip="加载中..."/></div>}>
            <div className="search">
                <Input allowClear placeholder="请输入要查询的关键字" onChange={()=>{}} style={{ width: 500 }} />
                <Button type="primary" loading = { refreshBtnLoading } style={{ marginLeft: "1rem" }}
                        onClick = { e => { }}
                >
                刷新
                </Button>
            </div>
            <div>
                <Table
                    columns={ columns }
                    dataSource={ props.myApplicationList.myApplication }
                    size="small"
                    bordered
                    pagination={false}
                    loading={ loading }
                    scroll={{
                        x: tableWidth,
                        y: tableHeight
                    }}
                />
            </div>
        </Suspense>

    )

}

export default inject("systemPage","myApplicationList", "flightTableData")(observer(MyApplication))



