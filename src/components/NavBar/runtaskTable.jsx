/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-03-11 17:49:40
 * @LastEditors: Please set LastEditors
 * @Description:左上切换模块 执行kpi 豁免航班 等待池 特殊航班 失效航班 待办事项
 * @FilePath: \WN-CDM\src\pages\FangxingPage\FangxingPage.jsx
 */
import React, { Suspense, useCallback, useState, useEffect, useMemo, useRef } from 'react';
import { Tabs, Table, Spin, Popconfirm, Form, Modal, Button, Input, DatePicker, Row, Col, Pagination } from 'antd';
import { inject, observer } from "mobx-react";
import { DoubleLeftOutlined, DoubleRightOutlined, SyncOutlined } from '@ant-design/icons';
import ModalBox from 'components/ModalBox/ModalBox';
import { REGEXP } from 'utils/regExpUtil'
import { ReqUrls, CollaborateIP } from "utils/request-urls";
import { customNotice } from 'utils/common-funcs'
import { requestGet, request } from "utils/request";
import { getFullTime, getDayTimeFromString, isValidVariable, formatTimeString } from "utils/basic-verify";
import { FlightCoordination, TodoType } from "utils/flightcoordination";
import { OptionBtn } from "components/Common/OptionBtn";
import moment from "moment";
// import MyApplication from 'components/MyApplication/MyApplication'
// import MyApplicationButton from 'components/MyApplication/MyApplicationButton'
import './RuntaskTable.scss';
const { TabPane } = Tabs;
function callback(key) {
    console.log(key);
}
function showTotal(total) {
    return `共 ${total} 条`;
}





//获取屏幕宽度，适配 2k
let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;
//根据key识别列表列配置columns
const names = {
    "handleStatus": {
        "en": "handleStatus",
        "cn": "本席位处理状态",
        width: 100,
    },
    "key": {
        "en": "key",
        "cn": "流水ID",
        width: 90,
    },
    "type": {
        "en": "type",
        "cn": "类型",
        width: 90,
    },
    "flightsId": {
        "en": "flightsId",
        "cn": "目标",
        width: 90,
    },
    "depap": {
        "en": "depap",
        "cn": "起飞机场",
        width: 90,
    },
    "sourceVal": {
        "en": "sourceVal",
        "cn": "原始值",
        width: 90,
    },
    "targetVal": {
        "en": "targetVal",
        "cn": "协调值",
        width: 90,
    },
    "startUser": {
        "en": "startUser",
        "cn": "发起人",
        width: 130,
    },
    "startTime": {
        "en": "startTime",
        "cn": "发起时间",
        width: 130,
        defaultSortOrder: 'descend',

    },
    "activityName": {
        "en": "activityName",
        "cn": "当前处理环节",
        width: 130,
    },

}
const RuntaskTable = (props) => {
    const [tableWidth, setWidth] = useState(0);
    const [tableHeight, setHeight] = useState(0);

    const [tobtModalVisible, setTobtModalVisible] = useState(false); //TOBT修改确认框
    const [tobtFlight, setTobtFlight] = useState({}); //TOBT record

    // const [ refreshBtnLoading, setRefreshBtnLoading ] = useState(false);
    const timerId = useRef();
    // const generateTime = useRef(0);
    // console.log("aa" + generateTime)
    const tableTotalWidth = useRef();

    const { systemPage = {}, todoList } = props;
    const user = systemPage.user || {};
    const userId = user.id || '';
    const loading = todoList.loading || '';
    // const generateTime = useMemo(() => {
    //     return systemPage.generateTime || "";
    // }, [systemPage.generateTime]);


    //获取待办工作请求
    const requestDatas = useCallback((triggerLoading) => {
        if (!isValidVariable(user.id)) {
            return;
        }
        if (triggerLoading) {
            todoList.toggleLoad(true);
        }

        // let url = "http://192.168.243.187:29891/flight/runtask/adminflw";
        let url = ReqUrls.runtaskTableUrl + user.username;

        const opt = {
            url,
            method: 'GET',
            resFunc: (data) => {

                //更新工作流数据
                handleTasksData(data);
                todoList.toggleLoad(false);
                // setRefreshBtnLoading(false);
            },
            errFunc: (err) => {
                requestErr(err, '待办工作数据获取失败');
                todoList.toggleLoad(false);
                // setRefreshBtnLoading(false);

            },
        };
        requestGet(opt);
    }, [user.id]);

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
            let taskId = key;
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
                TASKID: key,
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

    //数据提交成功回调
    const requestSuccess = useCallback((data, content, key) => {
        console.log("协调成功：", data)
        // const { flightCoordination = {} } = data;
        // props.flightTableData.updateSingleFlight( flightCoordination );
        //重新请求数据
        requestDatas(true);

        customNotice({
            type: 'success',
            message: content,
            duration: 8
        });

    });


    //处理 操作 同意/拒绝
    const sendResultRequest = (type, text = "", setLoad) => {

        if (!isValidVariable(userId)) {
            return;
        }
        const dataObj = JSON.parse(text);
        
        const flightCoorType = dataObj.type || '';
        const key = dataObj.key || ""; //流水号
        const taskId = dataObj.taskId || ""; //流水号
        const flight = dataObj.flight || {};
        const targetVal = dataObj.targetVal;

        let params = {
            userId,
            flightCoordination: flight, //航班原fc
            comment: "",  //备注
            taskId
        }

        let url = "";
        let title = "";
        let typeCn = TodoType[flightCoorType] || flightCoorType;
        if (type === "confirm") {
            url = CollaborateIP + "/confirmFlight";
            title = typeCn + "确认"
        } else if (flightCoorType === "TOBT") {
            if (type === "agree") {
                //TOBT同意
                url = CollaborateIP + "/flight/updateTobtApprove";
                title = "同意" + typeCn;
                params["tobtValue"] = targetVal;
            } else if (type === "refuse") {
                //TOBT拒绝
                url = CollaborateIP + "/flight/denyTobtApprove";
                title = "拒绝" + typeCn;
            }
        } else if (flightCoorType === "INPOOL") {
            if (type === "agree") {
                //入等待池同意
                url = CollaborateIP + "/flightPutPoolConsent";
                title = "同意" + typeCn
            } else if (type === "refuse") {
                //入等待池拒绝
                url = CollaborateIP + "/flightPutPoolDown";
                title = "拒绝" + typeCn
            }
        } else if (flightCoorType === "OUTPOOL") {
            if (type === "agree") {
                //出等待池同意
                url = CollaborateIP + "/flightOutPoolConsent";
                title = "同意" + typeCn
                //TODO 要验证TOBT和当前时间比较
                params["type"] = "";
                params["tobt"] = "";
            } else if (type === "refuse") {
                //出等待池拒绝
                url = CollaborateIP + "/flightOutPoolDown";
                title = "拒绝" + typeCn
            }
        } else if (flightCoorType === "EXEMPT") {
            if (type === "agree") {
                //豁免同意
                url = CollaborateIP + "/flightPriorityApproveRest";
                title = "同意" + typeCn
            } else if (type === "refuse") {
                //豁免拒绝
                url = CollaborateIP + "/flightPriorityRefuseRest";
                title = "拒绝" + typeCn
            }
        } else if (flightCoorType === "UNEXEMPT") {
            if (type === "agree") {
                //取消豁免同意
                url = CollaborateIP + "/flightCancelAgree";
                title = "同意" + typeCn
            } else if (type === "refuse") {
                //取消豁免拒绝
                url = CollaborateIP + "/flightCancelRefused";
                title = "拒绝" + typeCn
            }
        }

        if (isValidVariable(url)) {
            const opt = {
                url,
                method: 'POST',
                params: params,
                resFunc: (data) => {
                    requestSuccess(data, title + '成功', key)
                    setLoad(false);
                },
                errFunc: (err) => {
                    if (isValidVariable(err)) {
                        requestErr(err, err)
                    } else {
                        requestErr(err, title + '失败')
                    }
                    setLoad(false);
                },
            };
            request(opt);

        }


    }
    const getColumns = useMemo(function () {
        let totalWidth = 0;
        //表格列配置-默认-计数列
        let columns = [];
        //生成表配置-全部
        for (let key in names) {
            const obj = names[key];
            const en = obj["en"];
            const cn = obj["cn"];
            const width = obj["width"];
            let tem = {
                title: cn,
                dataIndex: en,
                align: 'center',
                key: en,
                width: width,
                ellipsis: true,
                className: en,
                showSorterTooltip: false,
                onHeaderCell: (column) => {
                    //配置表头属性，增加title值
                    return {
                        title: cn
                    }
                }
            }
            //发起时间排序
            if (en === "startTime") {
                tem["defaultSortOrder"] = 'descend';
                tem["sorter"] = (a, b) => {
                    return a.startTime * 1 - b.startTime * 1;
                };
                tem["render"] = (text, record, index) => {
                    const time = formatTimeString(text)
                    return <div title={time}>{time}</div>;
                }
            }
            //待办类型
            if (en === "type") {
                // tem["fixed"] = 'left'
                tem["render"] = (text, record, index) => {
                    let type = TodoType[text] || text;

                    return <div title={type}>{type}</div>;
                }
            }

            if (en === "handleStatusS") {
                // || en === "FLIGHTID" || en === "TASKID" 
                tem["fixed"] = 'left'
            }

            if (en === "sourceVal" || en === "targetVal") {
                tem["render"] = (text, record, index) => {
                    const { type } = record;
                    if (type === 'TOBT') {
                        if (isValidVariable(text) && text.length >= 12 && text * 1 > 0) {
                            return <div title={text}>{getDayTimeFromString(text)}</div>
                        }
                    } else if (type === 'EXEMPT' || type === 'UNEXEMPT') {
                        // console.log(text)
                        return <div title={text}>{FlightCoordination.getPriorityZh(text)}</div>
                    } else if (type === 'INPOOL' || type === 'OUTPOOL') {
                        return <div title={text}>{FlightCoordination.getPoolStatusZh(text)}</div>
                    } else {
                        if (isValidVariable(text) && text.length >= 12 && text * 1 > 0) {
                            return <div title={text}>{getDayTimeFromString(text)}</div>
                        }
                    }
                    return <div title={text}>{text}</div>;
                }
            }

            if (en === "handleStatus") {

                // tem["fixed"] = 'right'
                tem["render"] = (text, record, index) => {
                    // debugger
                    const { TYPE, handleStatus = "{}" } = record;
                    const dataObj = JSON.parse(handleStatus);
                    const flight = dataObj.flight || {};
                    const authorities = dataObj.authorities || {};
                    const { agree, confirm, refuse } = authorities;
                    let TOBTFlag = false;
                    if (TYPE === "TOBT") {
                        const curTime = generateTime.current || 0;
                        const tobtFiled = flight.tobtFiled || {};
                        const tobtTime = tobtFiled.value || 0;
                        if (isValidVariable(curTime) && isValidVariable(tobtTime)) {
                            if (tobtTime * 1 < curTime * 1) {
                                TOBTFlag = true;
                            }
                        }
                    }



                    return (
                        <div style={{ textAlign: 'right' }}>
                            {
                                agree && <OptionBtn type="agree" size="small" text="同意" callback={
                                    (setLoad) => {
                                        sendResultRequest("agree", text, setLoad)
                                    }
                                } />
                            }
                            {
                                refuse ? <OptionBtn type="refuse" size="small" text="拒绝" callback={
                                    (setLoad) => {
                                        sendResultRequest("refuse", text, setLoad)
                                    }
                                } /> : ""
                            }
                            {
                                confirm ? <OptionBtn type="confirm" size="small" text="确认" callback={
                                    (setLoad) => {
                                        sendResultRequest("confirm", text, setLoad)
                                    }
                                } /> : ""
                            }

                        </div>
                    );
                }
            }

            if (en === "FLIGHTID" || en === "USER" || en === "COMMENT") {
                tem["render"] = (text, record, index) => {
                    return <div title={text} className="full_cell">{text}</div>
                }
            }
            totalWidth += tem.width * 1;
            columns.push(tem)
        }
        tableTotalWidth.current = totalWidth;
        return columns;
    }, []);

    useEffect(() => {
        requestDatas(true);
        timerId.current = setInterval(() => {
            requestDatas(false);
        }, 60 * 1000);
        return () => {
            clearInterval(timerId.current)
            timerId.current = null;
        }
    }, [])

    useEffect(() => {
        const flightCanvas = document.getElementsByClassName("todo_canvas")[0];
        flightCanvas.oncontextmenu = function () {
            return false;
        };
        const boxContent = flightCanvas.getElementsByClassName("box_content")[0];
        const tableHeader = flightCanvas.getElementsByClassName("ant-table-header")[0];

        let width = boxContent.offsetWidth;
        let height = boxContent.offsetHeight;
        // height -= 40;//标题高度“航班列表”
        // height -= 45;//表头高度
        height -= tableHeader.offsetHeight;//表头高度
        height -= 10;//表头高度
        setWidth(width);
        setHeight(height);

    }, [tableWidth, tableHeight]);


    return (
        <Suspense fallback={<div className="load_spin"><Spin tip="加载中..." /></div>}>

            {/* <ModalBox
                // title={`待办航班列表(${formatTimeString(generateTime.current)})`}
                // showDecorator={true}
                className={`sub_table_modal todo_canvas todo`}
            > */}
                {/*<div className='refresh_icon'*/}
                {/*onClick = { () => {*/}
                {/*requestDatas(true)  */}
                {/*setRefreshBtnLoading(true);*/}
                {/*} } */}
                {/*>*/}
                {/*<SyncOutlined title="刷新待办列表" spin={ refreshBtnLoading }  />*/}
                {/*</div>*/}

                {/* <OutLineIcon tableTotalWidth={tableTotalWidth.current} /> */}

                {/* <Tabs onChange={callback} type="card"> */}
                {/* <TabPane tab="待办航班" key="1"> */}
                <div className="advanced-search-base-input-filter">
                </div>
                <div>
                <Table
                    columns={getColumns}
                    dataSource={props.todoList.todos}
                    size="small"
                    bordered
                    pagination={{
                        pageSize: 10,
                        
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
                    // footer={() => }
                />
               <div className="generateTime" style={{position:"absolute",border:"none",left: "40px",bottom: "63px"}}>数据时间: {formatTimeString(props.todoList.generateTime)}</div>
                </div>
                
                {/* {
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

                } */}

                {/* </TabPane>
                    <TabPane tab="我的申请" key="2"> */}
                {/* <MyApplication></MyApplication> */}

                {/* </TabPane>

                </Tabs> */}


            {/* </ModalBox> */}


        </Suspense>

    )

}

export default inject("systemPage", "todoList", "flightTableData")(observer(RuntaskTable))



