
/*
 * @Author: your name
 * @Date: 2021-03-04 16:39:47
 * @LastEditTime: 2021-03-25 18:52:00
 * @LastEditors: Please set LastEditors
 * @Description: 航班协调-按钮+模态框
 * @FilePath: \WN-ATOM\src\components\NavBar\TodoNav.jsx
 */
import React, { Fragment, useEffect, useCallback, useRef, useState } from "react";
import { Tabs, Radio, Badge, Modal } from "antd";
import { observer, inject } from "mobx-react";
import { isValidVariable } from 'utils/basic-verify';
import { requestGet, request } from "utils/request";
import { ReqUrls, CollaborateIP } from "utils/request-urls";
import { customNotice } from 'utils/common-funcs'
import TodoTable from './TodoTable';
import HisTaskTable from './HisTaskTable';

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
                key: key,
                TASKID: taskId,
                type: type,
                sourceVal: sourceVal,
                handleStatus: handleStatus,
                activityName: activityName,
                FLIGHTID: flightid,
                TYPE: flightCoorType,
                targetVal: targetVal,
                startUser: startUser,
                startTime: startTime,
                depap: depap,
                COMMENT: businessName,
                handleStatus: JSON.stringify(options),
                abc: flightObj,
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
            <Modal
                width={1600}
                style={{ marginTop: "-50px"}}
                title="航班协调"
                visible={ todoModalVisible }
                footer={[] // 设置footer为空，去掉 取消 确定默认按钮
                    }
                onOk={() => { }}
                mask={false}
                wrapClassName="pointer-events-none"
                onCancel={ hideModal }
            >
                <Tabs size="large" style={{marginTop:-25}}>
                    <TabPane tab="待办" key="1">
                       <TodoTable requestDatas={requestData} />
                    </TabPane>
                    <TabPane tab="办结" key="2">
                        <HisTaskTable />
                    </TabPane>
                </Tabs>
            </Modal>
        </Fragment>

    )
}

export default inject("systemPage", "todoList")(observer(TodoNav))