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
import { Button, Input, Table, message} from 'antd'
import { Window as WindowDHX } from "dhx-suite";
import { getFullTime, formatTimeString } from 'utils/basic-verify'
import { requestGet } from 'utils/request'
// import Stomp from 'stompjs'
import { inject, observer } from 'mobx-react'
import WorkFlowContent from "./WorkFlowContent";
import {isValidVariable} from "../../utils/basic-verify";
const { Search } = Input;
//获取屏幕宽度，适配 2k
let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;

const convertData = (tasks) => {
    let newList = [];
    for( let sid in tasks ){
        const item = tasks[sid] || {};
        const hisInstance = item.hisInstance || {}; //工作流实例
        const hisTasks = item.hisTasks || {}; //子任务集合
        const endTime = hisInstance.endTime || "";
        const processVariables = hisInstance.processVariables || {};
        const businessName = processVariables.businessName || ""; //工作名称
        const userNameCn = processVariables.userNameCn || ""; //发起人
        let taskStatus = "进行中"; //流程状态
        if( isValidVariable(endTime) ){
            taskStatus = "已结束"
        }
        //获取第一个hisTasks对象
        const hisTasksKeys = Object.keys( hisTasks );
        let hid = hisTasksKeys[0];
        const hitem = hisTasks[hid];
        const name = hitem.name || "";

        let obj = {
            key: sid,
            sid: sid,
            businessName,
            steps: name,
            userNameCn,
            endTime,
            taskStatus,
            opt: "",
            orgdata: JSON.stringify( item )
        };
        newList.push(obj)
    }
    return newList
}

//消息模块
function WorkFlowList(props){
    const [ searchVal, setSearchVal ] = useState("");
    const [ loading, setLoading ] = useState(false);
    const [ refreshBtnLoading, setRefreshBtnLoading ] = useState(false);
    const [ workFlowModalId, setWorkFlowModalId ] = useState(""); //当前选中工作流工作流的id，不一定和激活工作流id一样

    const [ columns, setColumns ] = useState([]);
    const [ expandable, setExpandable ] = useState(false);

    const { systemPage, workFlowData } = props;
    const { activeTab } = workFlowData;
    const { user } = systemPage;

    //查询框
    const onSearch = value => {
        console.log(value);
        setSearchVal(value);
    }
    //用户信息获取
    useEffect(function(){
        const user = localStorage.getItem("user");
        props.systemPage.setUserData( JSON.parse(user) );
    }, []);

    //请求错误处理
    const requestErr = useCallback((err, content) => {
        message.error({
            content,
            duration: 4,
        });
    });
    //获取 办结工作请求
    const requestDatas = () => {
        if( !isValidVariable(user.id) ){
            return;
        }
        setLoading(true);
        let url = "";
        let params = {};
        if( activeTab === "finished"){
            url = 'http://192.168.243.187:28086/workflow/userHisTask/'+user.username;
            params = {
                start: "",
                end: "",
                user: user.id
            }
        }
        const opt = {
            url,
            method: 'GET',
            params,
            resFunc: (data)=> {
                //更新工作流数据
                handleTasksData(data);
                setLoading(false);
                setRefreshBtnLoading(false);
            },
            errFunc: (err)=> {
                requestErr(err, '办结工作数据获取失败' );
                setLoading(false);
                setRefreshBtnLoading(false);

            },
        };
        requestGet(opt);
    };

    //处理 办结工作 数据
    const handleTasksData = (data) => {
        const { historyTasks ={}, generateTime } = data;
        workFlowData.updateTasks( historyTasks, generateTime );
    }

    useEffect(function () {
        console.log(activeTab, user.id);
        if( "todo" === activeTab ){
            // setExpandable(false);
            // setColumns([
            //     {
            //         title: "流水号",
            //         dataIndex: "businessKey",
            //         align: 'center',
            //         key: "businessKey",
            //         width: (screenWidth > 1920) ? 60 : 35,
            //
            //         // render:
            //     },
            //     {
            //         title: "工作名称", //processVariables.businesbusinessName
            //         dataIndex: "businessName",
            //         align: 'center',
            //         key: "businessName",
            //         width: (screenWidth > 1920) ? 130 : 130,
            //
            //         // render: (text, record, index) => {
            //         //     return (
            //         //
            //         //     )
            //         // }
            //     },
            //     {
            //         title: "我经办的步骤", //HisTaskInstance .name
            //         dataIndex: "steps",
            //         align: 'center',
            //         key: "steps",
            //         width: (screenWidth > 1920) ? 70 : 70,
            //
            //         // render:
            //     },
            //     {
            //         title: "发起人", //processVariables.userNameCn
            //         dataIndex: "userNameCn",
            //         align: 'center',
            //         key: "userNameCn",
            //         width: (screenWidth > 1920) ? 50 : 50,
            //
            //         // render:
            //     },
            //     {
            //         title: "状态", //没有结束时间 为进行中 HisProcessInstance.endTime
            //         dataIndex: "status",
            //         align: 'center',
            //         key: "status",
            //         width: (screenWidth > 1920) ? 60 : 50,
            //
            //         // render:
            //     },
            //     {
            //         title: "到达时间",
            //         dataIndex: "endTime",
            //         align: 'center',
            //         key: "endTime",
            //         width: (screenWidth > 1920) ? 60 : 50,
            //
            //         // render:
            //     },
            //     {
            //         title: "已停留",
            //         dataIndex: "stopTime",
            //         align: 'center',
            //         key: "stopTime",
            //         width: (screenWidth > 1920) ? 60 : 40,
            //     },
            //     {
            //         title: "操作",
            //         dataIndex: "opt",
            //         align: 'center',
            //         key: "opt",
            //         width: (screenWidth > 1920) ? 120 :100,
            //         render: (text, record, index) => {
            //             return (
            //                 <span className='opt_btns'>
            //         <a onClick={ e =>{
            //             // showWorkFlowDetail(true, "");
            //             let windowClass = 'win_' + Math.floor( Math.random()*100000000 );
            //             let window = new WindowDHX({
            //                 width: 1000,
            //                 height: 665,
            //                 title: "工作流详情",
            //                 html: `<div class="`+windowClass+`"></div>`,
            //                 css: "bg-black",
            //                 closable: true,
            //                 movable: true,
            //                 resizable: true
            //             })
            //
            //             setTimeout(function(){
            //                 window.show();
            //                 const winDom = document.getElementsByclassName(windowClass)[0];
            //                 ReactDom.render(
            //                     <WorkFlowContent modalId={""} />,
            //                     winDom);
            //             }, 500)
            //
            //
            //             e.stopPropagation();
            //         } }>详情</a>
            //         <a>收回</a>
            //         <a>催办</a>
            //         <a>导出</a>
            //     </span>
            //
            //             )
            //         }
            //     },
            //
            // ]);
            // props.workFlowData.updateTasks(([
            //     {
            //         key: '1',
            //         sid: "181125",
            //         businessName: "15/1835 西南-军事活动 IGAGA 20分钟",
            //         steps: "第1步：申请人申请",
            //         userNameCn: "兰州流量室",
            //         endTime: "2021-1-15 10:14:15",
            //         stopTime: "到达：7天1小时",
            //         status: "处理中",
            //         opt: "",
            //     },{
            //         key: '2',
            //         sid: "181126",
            //         businessName: "15/1835 西南-军事活动 IGAGA 20分钟",
            //         steps: "第1步：申请人申请",
            //         userNameCn: "兰州流量室",
            //         endTime: "2021-1-15 10:14:15",
            //         stopTime: "到达：7天1小时",
            //         status: "处理中",
            //         opt: "",
            //     },{
            //         key: '3',
            //         sid: "181127",
            //         businessName: "15/1835 西南-军事活动 IGAGA 20分钟",
            //         steps: "第1步：申请人申请",
            //         userNameCn: "兰州流量室",
            //         endTime: "2021-1-15 10:14:15",
            //         stopTime: "到达：7天1小时",
            //         status: "处理中",
            //         opt: "",
            //     },{
            //         key: '4',
            //         sid: "181128",
            //         businessName: "15/1835 西南-军事活动 IGAGA 20分钟",
            //         steps: "第1步：申请人申请",
            //         userNameCn: "兰州流量室",
            //         endTime: "2021-1-15 10:14:15",
            //         stopTime: "到达：7天1小时",
            //         status: "处理中",
            //         opt: "",
            //     }]));
        }
        else if( "finished" === activeTab ){
            setColumns([
                {
                    title: "流水号",
                    dataIndex: "sid",
                    align: 'center',
                    key: "sid",
                    width: (screenWidth > 1920) ? 30 : 30,

                },
                {
                    title: "工作名称",
                    dataIndex: "businessName",
                    align: 'center',
                    key: "businessName",
                    width: (screenWidth > 1920) ? 130 : 130,

                },
                {
                    title: "我经办的步骤",
                    dataIndex: "steps",
                    align: 'center',
                    key: "steps",
                    width: (screenWidth > 1920) ? 70 : 70,

                },
                {
                    title: "发起人",
                    dataIndex: "userNameCn",
                    align: 'center',
                    key: "userNameCn",
                    width: (screenWidth > 1920) ? 50 : 50,
                },
                {
                    title: "办结时间",
                    dataIndex: "endTime",
                    align: 'center',
                    key: "endTime",
                    width: (screenWidth > 1920) ? 60 : 50,
                    render: (text, record, index) => {
                        if( text === "" ){
                            return text
                        }else {
                            return getFullTime(new Date(text), 1)
                        }
                    }
                },
                {
                    title: "流程状态",
                    dataIndex: "taskStatus",
                    align: 'center',
                    key: "taskStatus",
                    width: (screenWidth > 1920) ? 40 : 40,
                    
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
                    width: (screenWidth > 1920) ? 60 :60,
                    render: (text, record, index) => {
                        return (
                            <span className='opt_btns'>
                    <a onClick={ e =>{
                        showDetailWind( record );
                        e.stopPropagation();
                    } }>详情</a>
                    {/*<a>收回</a>*/}
                    {/*<a>催办</a>*/}
                    {/*<a>导出</a>*/}
                </span>

                        )
                    }
                },

            ]);
            //行拓展
            // setExpandable({
            //     expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
            //     rowExpandable: record => record.name !== 'Not Expandable',
            // })
            //获取 办结数据
            requestDatas();
        }
        // else if( "all" === activeTab ){
        //     setColumns([
        //         {
        //             title: "流水号",
        //             dataIndex: "sid",
        //             align: 'center',
        //             key: "sid",
        //             width: (screenWidth > 1920) ? 60 : 35,
        //
        //         },
        //         {
        //             title: "流程类型",
        //             dataIndex: "ftype",
        //             align: 'center',
        //             key: "ftype",
        //             width: (screenWidth > 1920) ? 60 : 50,
        //
        //             // render:
        //         },
        //         {
        //             title: "工作名称",
        //             dataIndex: "businessName",
        //             align: 'center',
        //             key: "businessName",
        //             width: (screenWidth > 1920) ? 130 : 130,
        //
        //             // render: (text, record, index) => {
        //             //     return (
        //             //
        //             //     )
        //             // }
        //         },
        //         {
        //             title: "发起人",
        //             dataIndex: "userNameCn",
        //             align: 'center',
        //             key: "userNameCn",
        //             width: (screenWidth > 1920) ? 50 : 50,
        //
        //             // render:
        //         },
        //         {
        //             title: "我经办的步骤",
        //             dataIndex: "steps",
        //             align: 'center',
        //             key: "steps",
        //             width: (screenWidth > 1920) ? 70 : 70,
        //
        //             // render:
        //         },
        //         {
        //             title: "步骤状态",
        //             dataIndex: "status",
        //             align: 'center',
        //             key: "status",
        //             width: (screenWidth > 1920) ? 60 : 40,
        //
        //             render: (text, record, index) => {
        //                 let textClass = ""
        //                 if(text === "已办结"){
        //                     textClass = "#ec4747";
        //                 }else if(text === "办理中"){
        //                     textClass = "green";
        //                 }
        //                 return (
        //                     <span style={{ color: textClass}}>
        //             {text}
        //         </span>
        //
        //                 )
        //             }
        //         },
        //         {
        //             title: "操作",
        //             dataIndex: "opt",
        //             align: 'center',
        //             key: "opt",
        //             width: (screenWidth > 1920) ? 120 :100,
        //             render: (text, record, index) => {
        //                 return (
        //                     <span className='opt_btns'>
        //             <a onClick={ e =>{
        //                 // showWorkFlowDetail(true, "");
        //                 let windowClass = 'win_' + Math.floor( Math.random()*100000000 );
        //                 let window = new WindowDHX({
        //                     width: 1000,
        //                     height: 665,
        //                     title: "工作流详情",
        //                     html: `<div class="`+windowClass+`"></div>`,
        //                     css: "bg-black",
        //                     closable: true,
        //                     movable: true,
        //                     resizable: true
        //                 })
        //
        //                 setTimeout(function(){
        //                     window.show();
        //                     const winDom = document.getElementsByclassName(windowClass)[0];
        //                     ReactDom.render(
        //                         <WorkFlowContent modalId={""} />,
        //                         winDom);
        //                 }, 500)
        //
        //
        //                 e.stopPropagation();
        //             } }>详情</a>
        //             <a>收回</a>
        //             <a>催办</a>
        //             <a>导出</a>
        //         </span>
        //
        //                 )
        //             }
        //         },
        //
        //     ]);
        //     props.workFlowData.updateTasks([
        //         {
        //             key: '1',
        //             sid: "181125",
        //             businessName: "15/1835 西南-军事活动 IGAGA 20分钟",
        //             ftype: "工作流发布",
        //             userNameCn: "兰州流量室",
        //             status: "办理中",
        //             opt: "",
        //         },{
        //             key: '2',
        //             sid: "181126",
        //             businessName: "15/1835 西南-军事活动 IGAGA 20分钟",
        //             ftype: "工作流发布",
        //             userNameCn: "兰州流量室",
        //             status: "办理中",
        //             opt: "",
        //         },{
        //             key: '3',
        //             sid: "181127",
        //             businessName: "15/1835 西南-军事活动 IGAGA 20分钟",
        //             ftype: "工作流发布",
        //             userNameCn: "兰州流量室",
        //             status: "办理中",
        //             opt: "",
        //         },{
        //             key: '4',
        //             sid: "181128",
        //             businessName: "15/1835 西南-军事活动 IGAGA 20分钟",
        //             ftype: "工作流发布",
        //             userNameCn: "兰州流量室",
        //             status: "已办结",
        //             opt: "",
        //         }]);
        //     setExpandable({
        //         expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
        //         rowExpandable: record => record.name !== 'Not Expandable',
        //     })
        // }
    },[activeTab, user.id]);
    //展示详情窗口
    const showDetailWind = useCallback(( record ) => {
        console.log(record);
         const sid = record.sid || "";
        // showWorkFlowDetail(true, "");
        let windowClass = 'win_' + sid;
        if( !isValidVariable(sid) ){
            windowClass = 'win_' + Math.floor( Math.random()*100000000 );
        }
        let window = new WindowDHX({
            width: 1000,
            height: 665,
            title: "工作流详情",
            html: `<div class="`+windowClass+`"></div>`,
            css: "bg-black",
            closable: true,
            movable: true,
            resizable: true
        });
        window.show();
        setTimeout(function(){

            const winDom = document.getElementsByClassName(windowClass)[0];
            ReactDom.render(
                <WorkFlowContent modalId={ sid } />,
                winDom);
        }, 500)
    });
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
        } );
        return newArr;
    });
    //转换为表格数据
    let cdata = convertData( workFlowData.tasks );
    let data = filterInput( cdata );
    return (
        <div className="work_cont">
            <div className="work_search">
                <Search allowClear placeholder="请输入要查询的工作号" onSearch={onSearch} style={{ width: 500 }}  enterButton="查询" />
                <Button type="primary" loading = { refreshBtnLoading } style={{ marginLeft: "1rem" }}
                    onClick = { e => {
                        setRefreshBtnLoading(true);
                        //刷新列表
                        requestDatas();
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
                        // rowSelection={true}
                        // expandable={expandable}
                        pagination={{
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => `共 ${total} 条`
                        }}
                        loading={ loading }
                        // onChange={onChange}
                        // rowclassName={(record, index)=>setRowclassName(record, index)}
                    />
                </div>
            </div>
            <div className="data_time">数据时间：{ formatTimeString(workFlowData.generateTime) }</div>
        </div>
    )
}

export default inject("workFlowData", "systemPage")(observer(WorkFlowList));

