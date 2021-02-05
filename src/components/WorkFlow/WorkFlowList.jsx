/*
 * @Author: liutianjiao
 * @Date:
 * @LastEditTime: 2021-02-05 09:52:01
 * @LastEditors: Please set LastEditors
 * @Description: 工作流列表
 * @FilePath: WorkFlowList.jsx
 */
import React, {useEffect, useState, useCallback, useRef} from 'react'
import ReactDom from 'react-dom';
import { withRouter, Link } from 'react-router-dom'
import { Button, Input, Table, message} from 'antd'
import { Window as WindowDHX } from "dhx-suite";
import { getFullTime, formatTimeString } from 'utils/basic-verify'
import { requestGet } from 'utils/request'
import { ReqUrls } from 'utils/request-urls'
import { inject, observer } from 'mobx-react'
import WorkFlowContent from "./WorkFlowContent";
import {isValidVariable} from "utils/basic-verify";
import { openConfirmFrame, openTimeSlotFrameWithFlightId } from 'utils/client'
const { Search } = Input;
//获取屏幕宽度，适配 2k
let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;

//详情 按钮
const DetailBtn = function(props){
    const [window, setWindow] = useState("");
    const [windowClass, setWindowClass] = useState("");

    //展示详情窗口
    const showDetailWind = useCallback(( record ) => {
        // console.log(record);
         const sid = record.sid || "";
        // showWorkFlowDetail(true, "");
        let windowClass = 'win_' + sid;
        if( !isValidVariable(sid) ){
            windowClass = 'win_' + Math.floor( Math.random()*100000000 );
        }
        if( document.getElementsByClassName(windowClass).length === 0 ){
            const newWindow = new WindowDHX({
                width: 1000,
                height: 665,
                title: "工作流详情(流水号:"+sid+")",
                html: `<div class="wind_canvas `+windowClass+`"></div>`,
                css: "bg-black",
                closable: true,
                movable: true,
                resizable: true
            });
            setWindow(newWindow);
            setWindowClass(windowClass);
        }else{
            window.show();
        }
    },[]);

    useEffect(function(){
        // console.log("111",window);
        if( window !== "" ){
            // console.log(window);
            window.show();
            setTimeout(function(){
                const winDom = document.getElementsByClassName(windowClass)[0];
                let id = windowClass.replace("win_", "");
                ReactDom.render(
                    <WorkFlowContent modalId={id} window={window}/>,
                    winDom);
            }, 200)
        }

    },[window]);
    
    let id = "";
    if( isValidVariable(id) ){
        id = windowClass.replace("win_", "");
    }
    return (
        <span>
            <Link to={`/workflow_detail/list/${props.record.sid}`} target="_blank">详情</Link>

        </span>
    )
}
//主办 按钮
const HandleBtn = function(props){
    //根据不同类型调整到不同窗口
    const openHandleWind = ( record ) => {
        let orgdata = JSON.parse( record.orgdata );
         const instance = orgdata.instance || {};
         const processDefinitionKey = instance.processDefinitionKey || "";
         const businessKey = instance.businessKey || ""; //方案id
         const processVariables = instance.processVariables || {};
         switch(processDefinitionKey){
             case "FlightApprovalProcess": //航班审批流程
                const tacticId = processVariables.tacticId || "";//航班对应方案id
                const fmeId = processVariables.fmeId || "";//航班id
                openTimeSlotFrameWithFlightId(tacticId, fmeId);
                break;
             case "SchemeApprovalProcess": //方案审批流程
                console.log("方案审批流程",businessKey);
                openConfirmFrame( businessKey );
             break;
             case "CapacityApprovalProcess": //容量审批流程
             
             break;
             
         }
         console.log(orgdata);

        
    };

    return (
        <a onClick={ e =>{
            openHandleWind(props.record);
             e.stopPropagation();
         } }>主办</a>
    )
}

//工作流列表
function WorkFlowList(props){
    const [ searchVal, setSearchVal ] = useState("");
    const [ loading, setLoading ] = useState(false);
    const [ refreshBtnLoading, setRefreshBtnLoading ] = useState(false);
    const [ workFlowModalId, setWorkFlowModalId ] = useState(""); //当前选中工作流工作流的id，不一定和激活工作流id一样

    const [ expandable, setExpandable ] = useState(false);

    const timerId = useRef();

    const { systemPage, workFlowData } = props;
    const { activeTab } = workFlowData;
    const { user } = systemPage;

    //查询框
    const onSearch = value => {
        // console.log(value);
        setSearchVal(value);
    }
    const onChange = e => {
        const value = e.target.value;
        // console.log(e.target.value);
        setSearchVal(value);
    }
    //用户信息获取
    useEffect(function(){
        const user = localStorage.getItem("user");
        if( isValidVariable(user) ){
            props.systemPage.setUserData( JSON.parse(user) );
        }
        else{
            props.history.push('/')
        }

    }, []);
    const commonColumns = [
        {
        title: "流水号",
        dataIndex: "sid",
        align: 'center',
        key: "sid",
        width: (screenWidth > 1920) ? 35 : 35,
    },
        {
            title: "工作名称",
            dataIndex: "businessName",
            align: 'left',
            key: "businessName",
            width: (screenWidth > 1920) ? 150 : 150, 

        },
        {
            title: "我经办的步骤",
            dataIndex: "steps",
            align: 'left',
            key: "steps",
            // width: (screenWidth > 1920) ? 70 : 70,
            width: (screenWidth > 1920) ? 70 : 70,
            // render: (text, record, index) => {
            //     return (
            //         <div className="steps_cell">{text}</div>
            //     )
            // }

        },
        {
            title: "发起人",
            dataIndex: "userNameCn",
            align: 'left',
            key: "userNameCn",
            width: (screenWidth > 1920) ? 60 : 60,
        }];

    const optColumn = {
        title: "操作",
        dataIndex: "opt",
        align: 'center',
        key: "opt",
        width: (screenWidth > 1920) ? 45 :45,
        render: (text, record, index) => {
            return (
                <span className='opt_btns'>
                    <DetailBtn record={record} />
                    {
                        activeTab === "todo" ? <HandleBtn record={record} />: ""
                    }
                
                    {/*<a>收回</a>*/}
                    {/*<a>催办</a>*/}
                    {/*<a>导出</a>*/}
                </span>
            )
        }
    };

    //办结列配置
    const finishedColumns = [
        ...commonColumns,
        {
            title: "办结时间",
            dataIndex: "endTime",
            align: 'center',
            key: "endTime",
            width: (screenWidth > 1920) ? 70 : 70,
            render: (text, record, index) => {
                if( text === "" ){
                    return text
                }else {
                    return getFullTime(new Date(text), 1)
                }
                // if( text === "" ){
                //     return <span>{text}</span>
                // }else {
                //     return <span title={`${getFullTime(new Date(text), 1)}`}>{getFullTime(new Date(text), 2)}</span>
                // }
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
        optColumn,

    ];
    //待办列配置
    const todoColumns = [
        ...commonColumns,
        {
            title: "状态", //没有结束时间 为进行中 HisProcessInstance.endTime
            dataIndex: "taskStatus",
            align: 'center',
            key: "taskStatus",
            width: (screenWidth > 1920) ? 40 : 40,
            render: (text, record, index) => {
                let textClass = ""
                if(text === "处理中"){
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
            title: "到达时间",
            dataIndex: "createTime",
            align: 'center',
            key: "createTime",
            showSorterTooltip: false,
            defaultSortOrder: 'descend',
            sorter: (a, b) => {
                return a.createTime - b.createTime
            },
            width: (screenWidth > 1920) ? 70 : 70,
            render: (text, record, index) => {
                if( text === "" ){
                    return text
                }else {
                    return getFullTime(new Date(text), 1)
                }
            }
        },
        // {
        //     title: "已停留",
        //     dataIndex: "stopTime",
        //     align: 'center',
        //     key: "stopTime",
        //     width: (screenWidth > 1920) ? 60 : 40,
        //     render: (text, record, index) => {
        //         if( text === "" ){
        //             return text
        //         }else {
        //             return getFullTime(new Date(text), 1)
        //         }
        //     }
        // },
        optColumn,

    ];
    //办结数据转换
    const convertFinishedData = useCallback((tasks) => {
        let newList = [];
        for( let sid in tasks ){
            const item = tasks[sid] || {};
            const hisInstance = item.hisInstance || {}; //工作流实例
            const hisTasks = item.hisTasks || {}; //子任务集合
            const endTime = hisInstance.endTime || "";
            const processVariables = hisInstance.processVariables || {};
            let businessName = processVariables.businessName || ""; //工作名称
            const processDefinitionName = hisInstance.processDefinitionName || ""; 
            businessName = processDefinitionName + "("+businessName+")";
            if(businessName === "()"){
                businessName = "";
            }

            const userNameCn = processVariables.userNameCn || ""; //发起人
            let taskStatus = "进行中"; //流程状态
            if( isValidVariable(endTime) ){
                taskStatus = "已结束"
            }
            //获取第一个hisTasks对象
            const hisTasksKeys = Object.keys( hisTasks );
            const hisTasksLen = hisTasksKeys.length || 0;
            let hid = "";
            if( hisTasksLen > 0 ){
                hid = hisTasksKeys[0];
                const hitem = hisTasks[hid] || {};
                const name = hitem.name || "";

                let obj = {
                    key: sid,
                    sid: sid,
                    businessName,
                    // steps: "第"+(hisTasksLen)+"步:"+name,
                    steps: name,
                    userNameCn,
                    endTime,
                    taskStatus,
                    opt: "",
                    orgdata: JSON.stringify( item )
                };
                newList.push(obj);
            }                                                                               
        }
        return newList
    },[]);
    //待办数据转换
    const convertTodoData = useCallback((tasks) => {
        let newList = [];
        for( let sid in tasks ){
            const item = tasks[sid] || {};
            const instance = item.instance || {}; //工作流实例
            const instanceTasks = item.instanceTasks || {}; //子任务集合
            
            const processVariables = instance.processVariables || {};
            let businessName = processVariables.businessName || ""; //工作名称
            const processDefinitionName = instance.processDefinitionName || ""; 
            businessName = processDefinitionName + "("+businessName+")";
            if(businessName === "()"){
                businessName = "";
            }
            const userNameCn = processVariables.userNameCn || ""; //发起人
            let taskStatus = "处理中"; //流程状态
            //获取第一个hisTasks对象
            const hisTasksKeys = Object.keys( instanceTasks );
            const hisTasksLen = hisTasksKeys.length || 0;
            let hid = "";
            if( hisTasksLen > 0 ){
                hid = hisTasksKeys[0];
                const hitem = instanceTasks[hid] || {};
                const name = hitem.name || "";
                const createTime = hitem.createTime || ""; //到达时间
                let obj = {
                    key: sid,
                    sid: sid,
                    businessName,
                    // steps: "第"+(hisTasksLen)+"步:"+name,
                    steps: name,
                    userNameCn,
                    createTime,
                    taskStatus,
                    opt: "",
                    orgdata: JSON.stringify( item )
                };
                newList.push(obj)
            }
            
        }
        return newList
    },[]);
    //请求错误处理
    const requestErr = useCallback((err, content) => {
        message.error({
            content,
            duration: 4,
        });
    },[]);
    //获取 办结工作请求
    const requestDatas = useCallback((triggerLoading) => {
        if( !isValidVariable(user.id) ){
            return;
        }
        if( triggerLoading ){
            setLoading(true);
        }
        
        let url = "";
        let params = {};
        if( activeTab === "finished"){
            url = ReqUrls.hisTaskUrl + user.username;
            params = {
                start: "",
                end: "",
                user: user.id
            }
        }else if( activeTab === "todo"){
            url = ReqUrls.tasksUrl + user.username;
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
    },[ props.systemPage.user, activeTab ]);

    //处理 办结工作 数据
    const handleTasksData = useCallback((data) => {
        if( "finished" === activeTab ){
            const { historyTasks ={}, generateTime } = data;
            workFlowData.updateTasks( historyTasks, generateTime );
        }else if( "todo" === activeTab ){
            const { tasks ={}, generateTime } = data;
            workFlowData.updateTasks( tasks, generateTime );
        }

    },[activeTab])

    const getColumns = () => {
        if( "todo" === activeTab ){
            return todoColumns;
        }else if( "finished" === activeTab ){
            return finishedColumns;
        }
    }

    useEffect(function () {
        // console.log(user.id);
        if( "todo" === activeTab ){
            //获取 待办数据
            requestDatas(true);
           
        }
        else if( "finished" === activeTab ){
            //行拓展
            // setExpandable({
            //     expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
            //     rowExpandable: record => record.name !== 'Not Expandable',
            // })
            //获取 办结数据
            requestDatas(true);
        }
        if( isValidVariable(activeTab) ){
            timerId.current = setInterval(()=>{
                requestDatas(false);
            }, 30*1000)
        }
        return () => {
            clearInterval(timerId.current)
            timerId.current = null;
        }
    },[ props.systemPage.user, activeTab ]);
    
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
    let cdata = [];
    if( activeTab === "todo" ){
        cdata = convertTodoData( workFlowData.tasks );
    }else if( activeTab === "finished" ){
        cdata = convertFinishedData( workFlowData.tasks );
    }

    let data = filterInput( cdata );
    //按流水号排序
    // data = data.sort( (a,b) => {
    //     return ( a.sid*1 - b.sid*1 ) *(-1);
    // } );

    let columns = getColumns();
    
    return (
        <div className="work_cont">
            <div className="work_search">
                <Input allowClear placeholder="请输入要查询的关键字" onChange={onChange} style={{ width: 500 }} />
                <Button type="primary" loading = { refreshBtnLoading } style={{ marginLeft: "1rem" }}
                    onClick = { e => {
                        setRefreshBtnLoading(true);
                        //刷新列表
                        requestDatas(true);
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
                            showTotal: (total, range) => `共 ${total} 条`,
                            // defaultPageSize: 20
                        }}
                        scroll={{
                            y: 390,
                        }}
                        loading={ loading }
                        // onChange={onChange}
                        // rowclassName={(record, index)=>setRowclassName(record, index)}
                    />
                </div>
            </div>
            <div className="date_time">数据时间：{ formatTimeString(workFlowData.generateTime) }</div>
        </div>
    )
}

export default withRouter( inject("workFlowData", "systemPage")(observer( WorkFlowList) ));

