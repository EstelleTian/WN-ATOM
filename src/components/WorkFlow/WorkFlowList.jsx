/*
 * @Author: liutianjiao
 * @Date:
 * @LastEditTime: 2021-01-19 18:33:18
 * @LastEditors: liutianjiao
 * @Description: 工作流列表
 * @FilePath: WorkFlowList.jsx
 */
import React, {useEffect, useState, useCallback} from 'react'
import ReactDom from 'react-dom';
import { withRouter } from 'react-router-dom'
import { Button, Input, Table, message} from 'antd'
import { Window as WindowDHX } from "dhx-suite";
import { getFullTime, formatTimeString } from 'utils/basic-verify'
import { requestGet } from 'utils/request'
import { ReqUrls } from 'utils/request-urls'
import { inject, observer } from 'mobx-react'
import WorkFlowContent from "./WorkFlowContent";
import {isValidVariable} from "utils/basic-verify";
const { Search } = Input;
//获取屏幕宽度，适配 2k
let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;

//工作流列表
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
        }];

    const optColumn = {
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
    };

    //办结列配置
    const finishedColumns = [
        ...commonColumns,
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
            width: (screenWidth > 1920) ? 60 : 50,
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
            title: "已停留",
            dataIndex: "stopTime",
            align: 'center',
            key: "stopTime",
            width: (screenWidth > 1920) ? 60 : 40,
        },
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
            const businessName = processVariables.businessName || ""; //工作名称
            const userNameCn = processVariables.userNameCn || ""; //发起人
            let taskStatus = "进行中"; //流程状态
            if( isValidVariable(endTime) ){
                taskStatus = "已结束"
            }
            //获取第一个hisTasks对象
            const hisTasksKeys = Object.keys( hisTasks );
            let hid = hisTasksKeys[0];
            const hitem = hisTasks[hid] || {};
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
    });
    //待办数据转换
    const convertTodoData = useCallback((tasks) => {
        let newList = [];
        for( let sid in tasks ){
            const item = tasks[sid] || {};
            const instance = item.instance || {}; //工作流实例
            const instanceTasks = item.instanceTasks || {}; //子任务集合
            const processVariables = instance.processVariables || {};
            const businessName = processVariables.businessName || ""; //工作名称
            const userNameCn = processVariables.userNameCn || ""; //发起人
            let taskStatus = "处理中"; //流程状态
            //获取第一个hisTasks对象
            const hisTasksKeys = Object.keys( instanceTasks );
            let hid = hisTasksKeys[0];
            const hitem = instanceTasks[hid] || {};
            const name = hitem.name || "";
            const createTime = hitem.createTime || ""; //到达时间
            let obj = {
                key: sid,
                sid: sid,
                businessName,
                steps: name,
                userNameCn,
                createTime,
                taskStatus,
                opt: "",
                orgdata: JSON.stringify( item )
            };
            newList.push(obj)
        }
        return newList
    });
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
    };

    //处理 办结工作 数据
    const handleTasksData = (data) => {
        if( "finished" === activeTab ){
            const { historyTasks ={}, generateTime } = data;
            workFlowData.updateTasks( historyTasks, generateTime );
        }else if( "todo" === activeTab ){
            const { tasks ={}, generateTime } = data;
            workFlowData.updateTasks( tasks, generateTime );
        }

    }

    useEffect(function () {
        console.log(user.id);
        if( "todo" === activeTab ){
            setColumns(todoColumns);
            //获取 待办数据
            requestDatas();
        }
        else if( "finished" === activeTab ){
            setColumns(finishedColumns);
            //行拓展
            // setExpandable({
            //     expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
            //     rowExpandable: record => record.name !== 'Not Expandable',
            // })
            //获取 办结数据
            requestDatas();
        }
    },[ props.systemPage.user ]);
    useEffect(function () {
        console.log("activeTab改变了:",activeTab);
        if( "todo" === activeTab ){
            setColumns(todoColumns);
            //获取 待办数据
            requestDatas();
        }
        else if( "finished" === activeTab ){
            setColumns(finishedColumns);
            //行拓展
            // setExpandable({
            //     expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
            //     rowExpandable: record => record.name !== 'Not Expandable',
            // })
            //获取 办结数据
            requestDatas();
        }
    },[ activeTab ]);

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
            title: "工作流详情(流水号:"+sid+")",
            html: `<div class="wind_canvas `+windowClass+`"></div>`,
            css: "bg-black",
            closable: true,
            movable: true,
            resizable: true
        });
        window.show();
        setTimeout(function(){
            const winDom = document.getElementsByClassName(windowClass)[0];
            ReactDom.render(
                <WorkFlowContent modalId={ sid } window={window}/>,
                winDom);
        }, 200)
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
    let cdata = [];
    if( activeTab === "todo" ){
        cdata = convertTodoData( workFlowData.tasks );
    }else if( activeTab === "finished" ){
        cdata = convertFinishedData( workFlowData.tasks );
    }

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

export default withRouter( inject("workFlowData", "systemPage")(observer( WorkFlowList) ));

