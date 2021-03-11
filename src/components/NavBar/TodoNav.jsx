/*
 * @Author: your name
 * @Date: 2021-03-04 16:39:47
 * @LastEditTime: 2021-03-11 19:14:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\NavBar\TodoNav.jsx
 */
import React,{ useEffect, useCallback, useRef } from "react";
import { Radio, Badge } from "antd";
import { observer, inject } from "mobx-react";
import { isValidVariable } from "utils/basic-verify";
import { customNotice } from 'utils/common-funcs';
import { ReqUrls } from "utils/request-urls";
import { requestGet  } from "utils/request";

function TodoNav(props){
    const timerId = useRef();
    const generateTime = useRef();
    const { systemPage = {}, todoList: { todos } } = props;
    const user = systemPage.user || {};
    const userId = user.id || '';
    const todoLen = todos.length || 0;
    
    //处理 待办工作 数据
    const handleTasksData = useCallback((data) => {
        let tableData = [];
        const backLogTasks = data.backLogTasks || {};
        const gTime = data.generateTime || "";
        generateTime.current = gTime;
        for(let key in backLogTasks){
            const backLogTask = backLogTasks[key] || {}; //流水号
            const flight = backLogTask.flight || {};
            const authorities = backLogTask.authorities || {};
            const flightid = flight.flightid || "";
            const depap = flight.depap || "";
            const instance = backLogTask.instance || {};
            const processVariables = instance.processVariables || {};
            const agree = processVariables.agree || false;
            const flightCoorType = processVariables.flightCoorType || "";
            const sourceVal = processVariables.sourceVal;
            let targetVal = processVariables.targetVal;
            // console.log("targetVal", targetVal)
            const businessName = processVariables.businessName || "";
            const startUserName = instance.startUserName || "";
            let startTime = instance.startTime || "";
            let taskId = key;
            let options = {
                 key,
                 flightCoorType,
                 agree,
                 flight,
                 authorities,
                 taskId,
                 targetVal
            }
            
            let obj = {
                 key: key,
                 TASKID: key,
                 FLIGHTID: flightid,
                 TYPE: flightCoorType,
                 ORIGINAL: sourceVal,
                 VALUE: targetVal,
                 USER: startUserName,
                 TIMESTAMP: startTime,
                 DEPAP: depap,
                 COMMENT: businessName,
                 OPTIONS: JSON.stringify(options),    
             }
             tableData.push(obj);
        }
        props.todoList.updateTodosData(tableData);
     },[]);

    //获取待办工作请求
    const requestDatas = useCallback((triggerLoading) => {
        if( !isValidVariable(userId) ){
            return;
        }
        if( triggerLoading ){
            props.todoList.toggleLoad(true);
        }
       
        let url = ReqUrls.todoListUrl + user.username;

        const opt = {
            url,
            method: 'GET',
            resFunc: (data)=> {
                //更新工作流数据
                handleTasksData(data);
                props.todoList.toggleLoad(false);
                // setRefreshBtnLoading(false);
            },
            errFunc: (err)=> {
                requestErr(err, '待办工作数据获取失败' );
                props.todoList.toggleLoad(false);
                // setRefreshBtnLoading(false);

            },
        };
        requestGet(opt);
    },[userId]);

    //请求错误处理
    const requestErr = useCallback((err, content) => {
        customNotice({
            type: "error",
            message: content,
        });
    },[]);

    useEffect(()=>{
        if( isValidVariable(userId) ){
            console.log("userId", userId)
            requestDatas(true);
            timerId.current = setInterval(()=>{
                requestDatas(false);
            }, 60*1000);
            return () => {
                clearInterval(timerId.current)
                timerId.current = null;
            }
        }
        
    },[userId])

    return (
        <Radio.Button value="todo">
            待办事项
            {
                todoLen > 0 ?
                    <Badge
                        className="site-badge-count-109"
                        count={ todoLen }
                        style={{ backgroundColor: 'rgb(61, 132, 36)' }}
                    />
                    : ""
            }
        </Radio.Button>
    )
}

export  default  inject("systemPage", "todoList")( observer(TodoNav))