
/*
 * @Author: your name
 * @Date: 2021-03-04 16:39:47
 * @LastEditTime: 2021-04-09 15:49:43
 * @LastEditors: Please set LastEditors
 * @Description: 航班协调-按钮+模态框
 * @FilePath: \WN-ATOM\src\components\NavBar\TodoNav.jsx
 */
import React, { Fragment, useEffect, useCallback, useRef, useState } from "react";
import { Tabs, Radio, Badge, Modal } from "antd";
import { observer, inject } from "mobx-react";
import { isValidVariable } from 'utils/basic-verify';
import { requestGet } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import { customNotice } from 'utils/common-funcs'
import DraggableModal from 'components/DraggableModal/DraggableModal'
import TodoTable from './TodoTable';
import HisTaskTable from './HistaskTable';
import './TodoNav.scss'

const { TabPane } = Tabs;

function TodoNav(props) {
    const [todoModalVisible, setTodoModalVisible] = useState(false);
    const timerId = useRef();
    const { systemPage = {}, todoList: { todos } } = props;
    const modalActiveName = systemPage.modalActiveName || "";
    const user = systemPage.user || {};
    const todoLen = todos.length || 0;

    const hideModal = () => {
        setTodoModalVisible(false);
        props.systemPage.setModalActiveName("");
    }
    //获取待办工作请求
    const requestData = useCallback((triggerLoading, nextRefresh = false) => {
        if (!isValidVariable(user.username)) {
            return;
        }
        if (triggerLoading) {
            props.todoList.toggleLoad(true);
        }

        let url = ReqUrls.runTaskTableUrl + user.username;

        const timerFunc = ()=>{
            if(nextRefresh){
                if( isValidVariable(timerId.current) ){
                    clearTimeout(timerId.current);
                    timerId.current = "";
                }
                timerId.current = setTimeout(() => {
                    requestData(false, nextRefresh);
                }, 60 * 1000);
            }
        }

        const opt = {
            url,
            method: 'GET',
            resFunc: (data) => {
                //更新工作流数据
                handleTasksData(data);
                props.todoList.toggleLoad(false);
                timerFunc();
                
            },
            errFunc: (err) => {
                requestErr(err, '待办工作数据获取失败');
                props.todoList.toggleLoad(false);
                timerFunc();
            },
        };
        requestGet(opt);
    }, [user.username]);

    //请求错误处理
    const requestErr = useCallback((err, content) => {
        customNotice({
            type: "error",
            message: content,
        });
    }, []);

    //处理 待办工作 数据
    const handleTasksData = useCallback((data) => {
        let tableData = [];
        const backLogTasks = data.tasks || {};
        const flights = data.flights || {};
        // console.log("qqq"+backLogTasks);
        const generateTime = data.generateTime || "";
        // generateTime.current = gTime;
        for (let key in backLogTasks) {
            const backLogTask = backLogTasks[key] || {}; //流水号
            const flight = backLogTask.flight || {};
            const authorities = backLogTask.authorities || {};
            const startUser = backLogTask.startUser || "";//发起人
            const activityName = backLogTask.activityName || {};
            let startTime = backLogTask.startTime || "";//发起时间


            const businessId = backLogTask.businessId || {};
            const flightObj = flights[businessId] || {};
            const flightsId = flightObj.flightid || {};//目标
            const depap = flightObj.depap || {};//起飞机场

            const flightid = flight.flightid || "";

            const instance = backLogTask.instance || {};
            const type = backLogTask.type || {};//类型
            const handleStatus = backLogTasks.handleStatus || {};
            const processVariables = instance.processVariables || {};
            const agree = processVariables.agree || false;
            const flightCoorType = processVariables.flightCoorType || "";


            let sourceVal = backLogTask.sourceVal;//原始值
            let targetVal = backLogTask.targetVal;//协调值
            //    console.log("targetVal", targetVal)
            const businessName = processVariables.businessName || "";
            let taskId = backLogTask.taskId || "";
            let options = {
                key,
                type,
                flightCoorType,
                agree,
                flight:flightObj,
                authorities,
                taskId,
                targetVal
            }

            let obj = {
                flightsId: flightsId,
                key: taskId,
                TASKID: taskId,
                type: type,
                sourceVal: sourceVal, //原始值
                handleStatus: handleStatus,
                activityName: activityName,
                FLIGHTID: flightid,
                TYPE: flightCoorType,
                targetVal: targetVal, //协调值
                startUser: startUser,
                startTime: startTime,
                depap: depap,
                COMMENT: businessName,
                handleStatus: JSON.stringify(options),
                flightObj: flightObj,
            }
            tableData.push(obj);
        }
        //    console.log(tableData)
        props.todoList.updateTodosData(tableData, generateTime);
    }, []);

    useEffect( ()=>{
        if( modalActiveName === "todo" ){
            setTodoModalVisible(true);
        } else{
            setTodoModalVisible(false);
        }

    }, [modalActiveName]);
    
    useEffect( ()=>{
        if( props.todoList.forceUpdate ){
            console.log("强制更新待办列表")
            requestData(false, false)
        }
    },[ props.todoList.forceUpdate ])

    useEffect(() => {
        requestData(true, true);
        return () => {
            clearTimeout(timerId.current)
            timerId.current = null;
        }
    }, [])

    return (
        <Fragment>
           <Radio.Button value="todo">
                    航班协调
                {
                    todoLen > 0 ?
                        <Badge
                            className="site-badge-count-109"
                            count={todoLen}
                            style={{ backgroundColor: 'rgb(61, 132, 36)' }}
                        />
                        : ""
                }
            </Radio.Button>

            <DraggableModal
                title="航班协调"
                style={{ top: "110px", left: '320px' }}
                visible={ todoModalVisible }
                handleOk={() => {}}
                handleCancel={ hideModal }
                width={1250}
                maskClosable={false}
                mask={false}
                // destroyOnClose设置为true,每次打开模态框子组件挂载，关闭模态框子组件卸载 
                destroyOnClose = { true }
                footer = {''}
            >
                <Tabs size="large" style={{marginTop:-25}} activeKey={props.todoList.activeTab} onChange={function(activeKey) {
                    console.log(activeKey)
                    props.todoList.activeTab = activeKey+"";
                }}>
                    <TabPane tab="待办" key="1">
                       <TodoTable requestDatas={requestData} />
                    </TabPane>
                    <TabPane tab="办结" key="2">
                        <HisTaskTable />
                    </TabPane>
                </Tabs>
            </DraggableModal>
            
            {/* <Modal
                width={1250}
                style={{ top: "110px", left: '320px'}}
                title="航班协调"
                visible={ todoModalVisible }
                footer={[]} // 设置footer为空，去掉 取消 确定默认按钮
                onOk={() => { }}
                mask={false}
                wrapClassName="pointer-events-none"
                onCancel={ hideModal }
                className="collaborate_table_modal"
            >
                <Tabs size="large" style={{marginTop:-25}} activeKey={props.todoList.activeTab} onChange={function(activeKey) {
                    console.log(activeKey)
                    props.todoList.activeTab = activeKey+"";
                }}>
                    <TabPane tab="待办" key="1">
                       <TodoTable requestDatas={requestData} />
                    </TabPane>
                    <TabPane tab="办结" key="2">
                        <HisTaskTable />
                    </TabPane>
                </Tabs>
            </Modal> */}
        </Fragment>

    )
}

export default inject("systemPage", "todoList")(observer(TodoNav))