/*
 * @Author: your name
 * @Date: 2020-12-18 18:39:39
 * @LastEditTime: 2020-12-22 20:36:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\InfoPage\InfoPage.jsx
 */
import React, {useEffect, useState, useCallback} from 'react'
import ReactDom from 'react-dom';
import {Layout, Button, Menu, Row, Col, Input, Table, ConfigProvider} from 'antd'
import { Window as WindowDHX } from "dhx-suite";
import { ClockCircleOutlined, CheckOutlined, StarOutlined, PauseCircleOutlined, ExpandAltOutlined, FontColorsOutlined } from '@ant-design/icons'
import { formatTimeString } from 'utils/basic-verify'
// import Stomp from 'stompjs'
import { inject, observer } from 'mobx-react'
import WorkFlowContent from "./WorkFlowContent";
const { Search } = Input;
//获取屏幕宽度，适配 2k
let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;

//消息模块
function WorkFlowList(props){
    const { workFlowData } = props;
    const { activeTab } = workFlowData;
    const [ searchVal, setSearchVal ] = useState("");
    const [ loading, setLoading ] = useState(false);
    const [ workFlowModalId, setWorkFlowModalId ] = useState(""); //当前选中方案工作流的id，不一定和激活方案id一样

    const [ columns, setColumns ] = useState([]);
    const [ expandable, setExpandable ] = useState(false);
    const onSearch = value => {
        console.log(value);
        setSearchVal(value);
    }

    const requestFinishedDatas = () => {
        const opt = {
            url:'http://192.168.243.187:28086/workflow/taskHis/xianflw',
            method: 'GET',
            params:{
                start: "",
                end: "",
                userId: props.systemPage.user.id
            },
            resFunc: (data)=> {
                //更新方案数据
                updateSchemeListData(data);
                if( props.schemeListData.loading !== false){
                    props.schemeListData.toggleLoad(false);
                }

            },
            errFunc: (err)=> {
                requestErr(err, '方案列表数据获取失败' );
                setManualRefresh(false);
            },
        };
        requestGet(opt);
    }

    useEffect(function () {
        if( "todo" === activeTab ){
            setExpandable(false);
            setColumns([
                {
                    title: "流水号",
                    dataIndex: "businessKey",
                    align: 'center',
                    key: "businessKey",
                    width: (screenWidth > 1920) ? 60 : 35,
                    // fixed: 'left',
                    // render:
                },
                {
                    title: "工作名称", //processVariables.businessName
                    dataIndex: "sName",
                    align: 'center',
                    key: "sName",
                    width: (screenWidth > 1920) ? 130 : 130,
                    // fixed: 'left',
                    // render: (text, record, index) => {
                    //     return (
                    //
                    //     )
                    // }
                },
                {
                    title: "我经办的步骤", //HisTaskInstance .name
                    dataIndex: "steps",
                    align: 'center',
                    key: "steps",
                    width: (screenWidth > 1920) ? 70 : 70,
                    // fixed: 'left',
                    // render:
                },
                {
                    title: "发起人", //processVariables.userNameCn
                    dataIndex: "publisher",
                    align: 'center',
                    key: "publisher",
                    width: (screenWidth > 1920) ? 50 : 50,
                    // fixed: 'left',
                    // render:
                },
                {
                    title: "状态", //没有结束时间 为进行中 HisProcessInstance.endTime
                    dataIndex: "status",
                    align: 'center',
                    key: "status",
                    width: (screenWidth > 1920) ? 60 : 50,
                    // fixed: 'left',
                    // render:
                },
                {
                    title: "到达时间",
                    dataIndex: "endTime",
                    align: 'center',
                    key: "endTime",
                    width: (screenWidth > 1920) ? 60 : 50,
                    // fixed: 'left',
                    // render:
                },
                {
                    title: "已停留",
                    dataIndex: "stopTime",
                    align: 'center',
                    key: "stopTime",
                    width: (screenWidth > 1920) ? 60 : 40,
                },
                {
                    title: "操作",
                    dataIndex: "opt",
                    align: 'center',
                    key: "opt",
                    width: (screenWidth > 1920) ? 120 :100,
                    render: (text, record, index) => {
                        return (
                            <span className='opt_btns'>
                    <a onClick={ e =>{
                        // showWorkFlowDetail(true, "");
                        let windowClass = 'win_' + Math.floor( Math.random()*100000000 );
                        let window = new WindowDHX({
                            width: 1000,
                            height: 665,
                            title: "工作流详情",
                            html: `<div class="`+windowClass+`"></div>`,
                            css: "bg-black",
                            closable: true,
                            movable: true,
                            resizable: true
                        })

                        setTimeout(function(){
                            window.show();
                            const winDom = document.getElementsByClassName(windowClass)[0];
                            ReactDom.render(
                                <WorkFlowContent modalId={""} />,
                                winDom);
                        }, 500)


                        e.stopPropagation();
                    } }>详情</a>
                    <a>收回</a>
                    <a>催办</a>
                    <a>导出</a>
                </span>

                        )
                    }
                },

            ]);
            props.workFlowData.updateList(([
                {
                    key: '1',
                    sid: "181125",
                    sName: "15/1835 西南-军事活动 IGAGA 20分钟",
                    steps: "第1步：申请人申请",
                    publisher: "兰州流量室",
                    endTime: "2021-1-15 10:14:15",
                    stopTime: "到达：7天1小时",
                    status: "处理中",
                    opt: "",
                },{
                    key: '2',
                    sid: "181126",
                    sName: "15/1835 西南-军事活动 IGAGA 20分钟",
                    steps: "第1步：申请人申请",
                    publisher: "兰州流量室",
                    endTime: "2021-1-15 10:14:15",
                    stopTime: "到达：7天1小时",
                    status: "处理中",
                    opt: "",
                },{
                    key: '3',
                    sid: "181127",
                    sName: "15/1835 西南-军事活动 IGAGA 20分钟",
                    steps: "第1步：申请人申请",
                    publisher: "兰州流量室",
                    endTime: "2021-1-15 10:14:15",
                    stopTime: "到达：7天1小时",
                    status: "处理中",
                    opt: "",
                },{
                    key: '4',
                    sid: "181128",
                    sName: "15/1835 西南-军事活动 IGAGA 20分钟",
                    steps: "第1步：申请人申请",
                    publisher: "兰州流量室",
                    endTime: "2021-1-15 10:14:15",
                    stopTime: "到达：7天1小时",
                    status: "处理中",
                    opt: "",
                }]));
        }
        else if( "finished" === activeTab ){
            setColumns([
                {
                    title: "流水号",
                    dataIndex: "sid",
                    align: 'center',
                    key: "sid",
                    width: (screenWidth > 1920) ? 60 : 35,

                },
                {
                    title: "工作名称",
                    dataIndex: "sName",
                    align: 'center',
                    key: "sName",
                    width: (screenWidth > 1920) ? 130 : 130,

                    // render: (text, record, index) => {
                    //     return (
                    //
                    //     )
                    // }
                },
                {
                    title: "我经办的步骤",
                    dataIndex: "steps",
                    align: 'center',
                    key: "steps",
                    width: (screenWidth > 1920) ? 70 : 70,

                    // render:
                },
                {
                    title: "发起人",
                    dataIndex: "publisher",
                    align: 'center',
                    key: "publisher",
                    width: (screenWidth > 1920) ? 50 : 50,
                    // fixed: 'left',
                    // render:
                },
                {
                    title: "办结时间",
                    dataIndex: "endTime",
                    align: 'center',
                    key: "endTime",
                    width: (screenWidth > 1920) ? 60 : 50,
                    // fixed: 'left',
                    // render:
                },
                {
                    title: "流程状态",
                    dataIndex: "status",
                    align: 'center',
                    key: "status",
                    width: (screenWidth > 1920) ? 60 : 40,
                    // fixed: 'left',
                    render: (text, record, index) => {
                        let textClass = ""
                        if(text === "已结束"){
                            textClass = "#ec4747";
                        }else if(text === "进行中"){
                            textClass = "green";
                        }
                        return (
                            <span style={{ color: textClass}}>
                    {text}
                </span>

                        )
                    }
                },
                {
                    title: "操作",
                    dataIndex: "opt",
                    align: 'center',
                    key: "opt",
                    width: (screenWidth > 1920) ? 120 :100,
                    render: (text, record, index) => {
                        return (
                            <span className='opt_btns'>
                    <a onClick={ e =>{
                        // showWorkFlowDetail(true, "");
                        let windowClass = 'win_' + Math.floor( Math.random()*100000000 );
                        let window = new WindowDHX({
                            width: 1000,
                            height: 665,
                            title: "工作流详情",
                            html: `<div class="`+windowClass+`"></div>`,
                            css: "bg-black",
                            closable: true,
                            movable: true,
                            resizable: true
                        })

                        setTimeout(function(){
                            window.show();
                            const winDom = document.getElementsByClassName(windowClass)[0];
                            ReactDom.render(
                                <WorkFlowContent modalId={""} />,
                                winDom);
                        }, 500)


                        e.stopPropagation();
                    } }>详情</a>
                    <a>收回</a>
                    <a>催办</a>
                    <a>导出</a>
                </span>

                        )
                    }
                },

            ]);
            //获取 办结数据
            requestFinishedDatas();
            props.workFlowData.updateList([
                {
                    key: '1',
                    sid: "181125",
                    sName: "15/1835 西南-军事活动 IGAGA 20分钟",
                    steps: "第1步：申请人申请",
                    publisher: "兰州流量室",
                    endTime: "2021-1-15 10:14:15",
                    status: "进行中",
                    opt: "",
                },{
                    key: '2',
                    sid: "181126",
                    sName: "15/1835 西南-军事活动 IGAGA 20分钟",
                    steps: "第1步：申请人申请",
                    publisher: "兰州流量室",
                    endTime: "2021-1-15 10:14:15",
                    status: "已结束",
                    opt: "",
                },{
                    key: '3',
                    sid: "181127",
                    sName: "15/1835 西南-军事活动 IGAGA 20分钟",
                    steps: "第1步：申请人申请",
                    publisher: "兰州流量室",
                    endTime: "2021-1-15 10:14:15",
                    status: "进行中",
                    opt: "",
                },{
                    key: '4',
                    sid: "181128",
                    sName: "15/1835 西南-军事活动 IGAGA 20分钟",
                    steps: "第1步：申请人申请",
                    publisher: "兰州流量室",
                    endTime: "2021-1-15 10:14:15",
                    status: "已结束",
                    opt: "",
                },{
                    key: '5',
                    sid: "181129",
                    sName: "15/1835 西南-军事活动 IGAGA 20分钟",
                    steps: "第1步：申请人申请",
                    publisher: "兰州流量室",
                    endTime: "2021-1-15 10:14:15",
                    status: "进行中",
                    opt: "",
                },{
                    key: '6',
                    sid: "181130",
                    sName: "15/1835 西南-军事活动 IGAGA 20分钟",
                    steps: "第1步：申请人申请",
                    publisher: "兰州流量室",
                    endTime: "2021-1-15 10:14:15",
                    status: "已结束",
                    opt: "",
                }]);
            setExpandable({
                expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
                rowExpandable: record => record.name !== 'Not Expandable',
            })
        }
        else if( "all" === activeTab ){
            setColumns([
                {
                    title: "流水号",
                    dataIndex: "sid",
                    align: 'center',
                    key: "sid",
                    width: (screenWidth > 1920) ? 60 : 35,

                },
                {
                    title: "流程类型",
                    dataIndex: "ftype",
                    align: 'center',
                    key: "ftype",
                    width: (screenWidth > 1920) ? 60 : 50,
                    // fixed: 'left',
                    // render:
                },
                {
                    title: "工作名称",
                    dataIndex: "sName",
                    align: 'center',
                    key: "sName",
                    width: (screenWidth > 1920) ? 130 : 130,

                    // render: (text, record, index) => {
                    //     return (
                    //
                    //     )
                    // }
                },
                {
                    title: "发起人",
                    dataIndex: "publisher",
                    align: 'center',
                    key: "publisher",
                    width: (screenWidth > 1920) ? 50 : 50,
                    // fixed: 'left',
                    // render:
                },
                {
                    title: "我经办的步骤",
                    dataIndex: "steps",
                    align: 'center',
                    key: "steps",
                    width: (screenWidth > 1920) ? 70 : 70,

                    // render:
                },
                {
                    title: "步骤状态",
                    dataIndex: "status",
                    align: 'center',
                    key: "status",
                    width: (screenWidth > 1920) ? 60 : 40,
                    // fixed: 'left',
                    render: (text, record, index) => {
                        let textClass = ""
                        if(text === "已办结"){
                            textClass = "#ec4747";
                        }else if(text === "办理中"){
                            textClass = "green";
                        }
                        return (
                            <span style={{ color: textClass}}>
                    {text}
                </span>

                        )
                    }
                },
                {
                    title: "操作",
                    dataIndex: "opt",
                    align: 'center',
                    key: "opt",
                    width: (screenWidth > 1920) ? 120 :100,
                    render: (text, record, index) => {
                        return (
                            <span className='opt_btns'>
                    <a onClick={ e =>{
                        // showWorkFlowDetail(true, "");
                        let windowClass = 'win_' + Math.floor( Math.random()*100000000 );
                        let window = new WindowDHX({
                            width: 1000,
                            height: 665,
                            title: "工作流详情",
                            html: `<div class="`+windowClass+`"></div>`,
                            css: "bg-black",
                            closable: true,
                            movable: true,
                            resizable: true
                        })

                        setTimeout(function(){
                            window.show();
                            const winDom = document.getElementsByClassName(windowClass)[0];
                            ReactDom.render(
                                <WorkFlowContent modalId={""} />,
                                winDom);
                        }, 500)


                        e.stopPropagation();
                    } }>详情</a>
                    <a>收回</a>
                    <a>催办</a>
                    <a>导出</a>
                </span>

                        )
                    }
                },

            ]);
            props.workFlowData.updateList([
                {
                    key: '1',
                    sid: "181125",
                    sName: "15/1835 西南-军事活动 IGAGA 20分钟",
                    ftype: "方案发布",
                    publisher: "兰州流量室",
                    status: "办理中",
                    opt: "",
                },{
                    key: '2',
                    sid: "181126",
                    sName: "15/1835 西南-军事活动 IGAGA 20分钟",
                    ftype: "方案发布",
                    publisher: "兰州流量室",
                    status: "办理中",
                    opt: "",
                },{
                    key: '3',
                    sid: "181127",
                    sName: "15/1835 西南-军事活动 IGAGA 20分钟",
                    ftype: "方案发布",
                    publisher: "兰州流量室",
                    status: "办理中",
                    opt: "",
                },{
                    key: '4',
                    sid: "181128",
                    sName: "15/1835 西南-军事活动 IGAGA 20分钟",
                    ftype: "方案发布",
                    publisher: "兰州流量室",
                    status: "已办结",
                    opt: "",
                }]);
            setExpandable({
                expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
                rowExpandable: record => record.name !== 'Not Expandable',
            })
        }
    },[activeTab]);
    //根据输入框输入值，检索显示航班
    const filterInput = useCallback((data) => {
        if( searchVal === "" ){
            return data;
        }
        let newArr = data.filter( flight => {
            for(let key in flight){
                let val = flight[key] || ""
                val = val + ""
                val = val.toLowerCase();
                const sVal = searchVal.toLowerCase();
                if( val.indexOf( sVal ) !== -1 ){
                    return true
                }
            }
            return false
        } )
        return newArr
    });
    let data = filterInput( props.workFlowData.list);

    return (
        <div className="work_cont">
            <div className="work_search">
                <Search allowClear placeholder="请输入要查询的工作号" onSearch={onSearch} style={{ width: 500 }}  enterButton="查询" />
                <Button type="primary" loading = {loading} style={{ marginLeft: "1rem" }}
                    onClick = { e => {
                        //刷新列表
                    }}
                >
                    刷新
                </Button>
            </div>
            <div>
                <div className="cont_canvas">
                    <Table
                        columns={ columns }
                        dataSource={ data }
                        size="small"
                        bordered
                        rowSelection={true}
                        expandable={expandable}
                        pagination={{
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => `共 ${total} 条`
                        }}
                        loading={ loading }
                        // onChange={onChange}
                        // rowClassName={(record, index)=>setRowClassName(record, index)}
                    />
                </div>
            </div>
        </div>
    )
}

export default inject("workFlowData")(observer(WorkFlowList));

