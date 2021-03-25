// /*
//  * @Author: your name
//  * @Date: 2021-03-04 16:39:47
//  * @LastEditTime: 2021-03-15 13:18:35
//  * @LastEditors: Please set LastEditors
//  * @Description: In User Settings Edit
//  * @FilePath: \WN-ATOM\src\components\NavBar\TodoNav.jsx
//  */
// import React,{ useEffect, useCallback, useRef } from "react";
// import { Radio, Badge } from "antd";
// import { observer, inject } from "mobx-react";
// import { isValidVariable } from "utils/basic-verify";
// import { customNotice } from 'utils/common-funcs';
// import { ReqUrls } from "utils/request-urls";
// import { requestGet  } from "utils/request";

// function TodoNav(props){
//     const timerId = useRef();
//     const generateTime = useRef();
//     const { systemPage = {}, todoList: { todos } } = props;
//     const user = systemPage.user || {};
//     const userId = user.id || '';
//     const todoLen = todos.length || 0;
    
//     //处理 待办工作 数据
//     const handleTasksData = useCallback((data) => {
//         let tableData = [];
//         const backLogTasks = data.backLogTasks || {};
//         const gTime = data.generateTime || "";
//         generateTime.current = gTime;
//         for(let key in backLogTasks){
//             const backLogTask = backLogTasks[key] || {}; //流水号
//             const flight = backLogTask.flight || {};
//             const authorities = backLogTask.authorities || {};
//             const flightid = flight.flightid || "";
//             const depap = flight.depap || "";
//             const instance = backLogTask.instance || {};
//             const processVariables = instance.processVariables || {};
//             const agree = processVariables.agree || false;
//             const flightCoorType = processVariables.flightCoorType || "";
//             const sourceVal = processVariables.sourceVal;
//             let targetVal = processVariables.targetVal;
//             // console.log("targetVal", targetVal)
//             const businessName = processVariables.businessName || "";
//             const startUserName = instance.startUserName || "";
//             let startTime = instance.startTime || "";
//             let taskId = key;
//             let options = {
//                  key,
//                  flightCoorType,
//                  agree,
//                  flight,
//                  authorities,
//                  taskId,
//                  targetVal
//             }
            
//             let obj = {
//                  key: key,
//                  TASKID: key,
//                  FLIGHTID: flightid,
//                  TYPE: flightCoorType,
//                  ORIGINAL: sourceVal,
//                  VALUE: targetVal,
//                  USER: startUserName,
//                  TIMESTAMP: startTime,
//                  DEPAP: depap,
//                  COMMENT: businessName,
//                  OPTIONS: JSON.stringify(options),    
//              }
//              tableData.push(obj);
//         }
//         props.todoList.updateTodosData(tableData);
//      },[]);

//     //获取待办工作请求
//     const requestDatas = useCallback((triggerLoading) => {
//         if( !isValidVariable(userId) ){
//             return;
//         }
//         if( triggerLoading ){
//             props.todoList.toggleLoad(true);
//         }
       
//         let url = ReqUrls.todoListUrl + user.username;

//         const opt = {
//             url,
//             method: 'GET',
//             resFunc: (data)=> {
//                 //更新工作流数据
//                 handleTasksData(data);
//                 props.todoList.toggleLoad(false);
//                 // setRefreshBtnLoading(false);
//             },
//             errFunc: (err)=> {
//                 requestErr(err, '待办工作数据获取失败' );
//                 props.todoList.toggleLoad(false);
//                 // setRefreshBtnLoading(false);

//             },
//         };
//         requestGet(opt);
//     },[userId]);

//     //请求错误处理
//     const requestErr = useCallback((err, content) => {
//         customNotice({
//             type: "error",
//             message: content,
//         });
//     },[]);

//     useEffect(()=>{
//         if( isValidVariable(userId) ){
//             console.log("userId", userId)
//             requestDatas(true);
//             timerId.current = setInterval(()=>{
//                 requestDatas(false);
//             }, 60*1000);
//             return () => {
//                 clearInterval(timerId.current)
//                 timerId.current = null;
//             }
//         }
        
//     },[userId])

//     return (
//         <Radio.Button value="todo">
//             航班协调
//             {
//                 todoLen > 0 ?
//                     <Badge
//                         className="site-badge-count-109"
//                         count={ todoLen }
//                         style={{ backgroundColor: 'rgb(61, 132, 36)' }}
//                     />
//                     : ""
//             }
//         </Radio.Button>
//     )
// }

// export  default  inject("systemPage", "todoList")( observer(TodoNav))

/*
 * @Author: your name
 * @Date: 2021-03-04 16:39:47
 * @LastEditTime: 2021-03-15 13:18:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\NavBar\TodoNav.jsx
 */
import React, { Fragment, useEffect, useCallback, useRef } from "react";
import { Table, Tabs, Radio, Badge, Modal } from "antd";
import { observer, inject } from "mobx-react";
import { isValidVariable } from "utils/basic-verify";
import { customNotice } from 'utils/common-funcs';
import { ReqUrls } from "utils/request-urls";
import { requestGet } from "utils/request";
import MyApplication from 'components/MyApplication/MyApplication';
// import MyApplicationButton from 'components/MyApplication/MyApplicationButton';
import RuntaskTable from './runtaskTable';
import HistaskTable from './histaskTable';

const { TabPane } = Tabs;
function callback(key) {
    console.log(key);
}
function showTotal(total) {
    return `共 ${total} 条`;
}
function TodoNav(props) {
    const timerId = useRef();
    const generateTime = useRef();
    const { systemPage = {}, todoList: { todos } } = props;
    const user = systemPage.user || {};
    const userId = user.id || '';
    const todoLen = todos.length || 0;
    // const [modalVisible, setModalVisible] = useState(false);



    const hideModal = () => {
        props.hidTodoModalVisible(false);
    }


    //处理 待办工作 数据
    const handleTasksData = useCallback((data) => {
        let tableData = [];
        const backLogTasks = data.backLogTasks || {};
        const gTime = data.generateTime || "";
        generateTime.current = gTime;
        for (let key in backLogTasks) {
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
    }, []);

    //获取待办工作请求
    // const requestDatas = useCallback((triggerLoading) => {
    //     if (!isValidVariable(userId)) {
    //         return;
    //     }
    //     if (triggerLoading) {
    //         props.todoList.toggleLoad(true);
    //     }

    //     let url = ReqUrls.todoListUrl + user.username;

    //     const opt = {
    //         url,
    //         method: 'GET',
    //         resFunc: (data) => {
    //             //更新工作流数据
    //             handleTasksData(data);
    //             props.todoList.toggleLoad(false);
    //             // setRefreshBtnLoading(false);
    //         },
    //         errFunc: (err) => {
    //             requestErr(err, '待办工作数据获取失败');
    //             props.todoList.toggleLoad(false);
    //             // setRefreshBtnLoading(false);

    //         },
    //     };
    //     requestGet(opt);
    // }, [userId]);

    // //请求错误处理
    // const requestErr = useCallback((err, content) => {
    //     customNotice({
    //         type: "error",
    //         message: content,
    //     });
    // }, []);

    // useEffect(() => {
    //     if (isValidVariable(userId)) {
    //         console.log("userId", userId)
    //         requestDatas(true);
    //         timerId.current = setInterval(() => {
    //             requestDatas(false);
    //         }, 60 * 1000);
    //         return () => {
    //             clearInterval(timerId.current)
    //             timerId.current = null;
    //         }
    //     }

    // }, [userId])


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
                style={{ marginTop: 50}}
                title="航班协调"
                visible={props.todoModalVisible}
                footer={
                    [] // 设置footer为空，去掉 取消 确定默认按钮
                    }
                onOk={() => { }}
                mask={false}
                wrapClassName="pointer-events-none"
                onCancel={hideModal}>


                <Tabs onChange={callback} size="large" style={{marginTop:-25}}>
                    <TabPane tab="待办" key="1">
                       <RuntaskTable></RuntaskTable>
                     </TabPane>
                    <TabPane tab="办结" key="2">
                        
                        <HistaskTable></HistaskTable>
                    </TabPane>

                </Tabs>

                {/* <Tabs onChange={callback} type="card">
                    <TabPane tab="待办航班" key="1">
                        <Table
                            columns={getColumns}
                            dataSource={props.todoList.todos}
                            size="small"
                            bordered
                            pagination={{
                                pageSize: 18,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: total => {
                                    return `共${total}条`;
                                },

                            }}
                            loading={loading}
                            scroll={{
                                x: tableWidth,
                                y: tableHeight
                            }}
                            footer={() => <div className="generateTime">数据时间: {formatTimeString(props.todoList.generateTime)}</div>}
                        />
                        {
                            tobtModalVisible &&
                            <TOBTModal
                                userId={userId}
                                record={tobtFlight}
                                // setTobtModalVisible={setTobtModalVisible}
                                tobtModalVisible={tobtModalVisible}
                                generateTime={generateTime.current}
                                setTobtModalVisible={setTobtModalVisible}
                                requestSuccess={requestSuccess}
                                requestErr={requestErr}
                            />

                        }

                    </TabPane>
                    <TabPane tab="我的申请" key="2">
                        <MyApplication></MyApplication>

                    </TabPane>

                </Tabs> */}

            </Modal>
        </Fragment>

    )
}

export default inject("systemPage", "todoList")(observer(TodoNav))