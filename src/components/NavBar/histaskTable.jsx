/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-03-26 16:47:08
 * @LastEditors: Please set LastEditors
 * @Description:左上切换模块 执行kpi 豁免航班 等待池 特殊航班 失效航班 待办事项
 * @FilePath: \WN-CDM\src\pages\FangxingPage\FangxingPage.jsx
 */
import React, { Suspense, useCallback, useState, useEffect, useMemo, useRef } from 'react';
import { message, Table, Spin, Button, Input, Radio, Select, Pagination } from 'antd';
import { inject, observer } from "mobx-react";
import debounce from 'lodash/debounce'
import { DoubleLeftOutlined, DoubleRightOutlined, SyncOutlined } from '@ant-design/icons';
import { ReqUrls, CollaborateIP } from "utils/request-urls";
import { requestGet, request } from "utils/request";
import { getFullTime, getDayTimeFromString, isValidVariable, formatTimeString } from "utils/basic-verify";
import { FlightCoordination, TodoType, Status,HandleStatus } from "utils/flightcoordination";
import moment from "moment";
// import './MyApplication.scss';

const { Option } = Select;
//获取屏幕宽度，适配 2k
let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;
//根据key识别列表列配置columns
const getLockedCn = ( value ) => {
    let res = "";
    switch(value){
        case "1": res = "禁止调整";break;
        case "0": res = "自动";break;
    }
    return res;
}

const names = {
    "HandleStatus": {
        "en": "HandleStatus",
        "cn": "本席位处理状态",
        width: 120,
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
        width: 100,
    },
    "depap": {
        "en": "depap",
        "cn": "起飞机场",
        width: 90,
    },
    "sourceVal": {
        "en": "sourceVal",
        "cn": "原始值",
        width: 160,
    },
    "targetVal": {
        "en": "targetVal",
        "cn": "协调值",
        width: 160,
    },
    "startUser": {
        "en": "startUser",
        "cn": "发起人",
        width: 130,
    },
    "startTime": {
        "en": "startTime",
        "cn": "发起时间",
        width: 160,
        defaultSortOrder: 'descend',

    },
    "activityName": {
        "en": "activityName",
        "cn": "当前处理环节",
        width: 170,
    },
    "handler": {
        "en": "handler",
        "cn": "当前处理人",
        width: 140,
    },
    "status": {
        "en": "status",
        "cn": "最终状态",
        width: 100,

    },

}

const HistaskTable = (props) => {

    const [tableLoading, setTableLoading] = useState(false);
    const [refreshBtnLoading, setRefreshBtnLoading] = useState(false);
    // const [dataList, setDataList] = useState(false);

    const timerId = useRef();
    const tableTotalWidth = useRef();

    const { systemPage = {}, myApplicationList } = props;
    const user = systemPage.user || {};
    const userId = user.id || '';
    const loading = myApplicationList.loading || '';

    const refreshData = () => {
        requestMyApplicationDatas(true);
    };

    const updateFilterKey = useCallback(
        debounce((value) => {
            props.myApplicationList.setFilterKey(value.trim().toUpperCase())
            console.log(value)
        }, 500, { 'leading': true, }),
        []
    )
    const updateFilterTimeRange = (value) => {
        props.myApplicationList.setFilterTimeRange(value)
    }

    // 处理错误信息
    const requestErr = useCallback((err, content) => {
        message.error({
            content,
            duration: 8,
        });
    }, []);

    // useEffect(function(){
    //     return function(){
    //         if(myApplicationList.filterKey){
    //             // 清空快速过滤关键字
    //             props.myApplicationList.setFilterKey("")
    //         }

    //     }
    // },[]);

    // 处理 我的申请 数据
    const handleMyApplicationData = useCallback((data) => {
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
            const handler = backLogTask.handler || {};//当前处理人
            const status = backLogTask.status || {};//最终状态


            const businessId = backLogTask.businessId || {};
            const flightObj = flights[businessId] || {};
            const flightsId = flightObj.flightid || {};//目标
            const depap = flightObj.depap || {};//起飞机场
            const flightid = flight.flightid || "";

            const instance = backLogTask.instance || {};
            const type = backLogTask.type || {};//类型

            const handleStatus = backLogTask.handleStatus || {};
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
                flight,
                authorities,
                taskId,
                targetVal
            }

            let obj = {
                flightsId: flightsId,
                key: key,
                handler: handler,
                status: status,
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
                HandleStatus: handleStatus,

                // abc: flightObj,
            }
            tableData.push(obj);
        }

        props.myApplicationList.updateMyApplicationsData(tableData, generateTime);
    }, []);

    //处理 操作 同意/拒绝
    const sendResultRequest = (type, text = "", setLoad) => {

        if (!isValidVariable(userId)) {
            return;
        }
        const dataObj = JSON.parse(text);
        const flightCoorType = dataObj.flightCoorType || '';
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

            //最终状态
            if (en === "status") {
                // tem["fixed"] = 'left'
                tem["render"] = (text, record, index) => {
                    let type = Status[text] || text;
                    return <div title={type}>{type}</div>;
                }
            }

            
            //本席位处理状态
            if (en === "HandleStatus") {
                // tem["fixed"] = 'left'
                tem["render"] = (text, record, index) => {
                    let type = HandleStatus[text] || text;

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
                    } else if (type === 'COBT' || type === 'CTOT' || type === 'FFIXT') {
                        const obj = JSON.parse(text);
                        return <div>
                            {
                                Object.keys(obj).map( key => {
                                    let val = obj[key]
                                    if (isValidVariable(val) && val.length >= 12 && val * 1 > 0) {
                                        return <div>{key}：{getDayTimeFromString(val, "", 2)}</div>
                                    }else{
                                        return <div>{key}：{getLockedCn(val)}</div>
                                    }
                                    
                                })
                            }
                        </div>
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
    //获取我的申请
    const requestMyApplicationDatas = useCallback((triggerLoading) => {

        if (!isValidVariable(userId)) {
            return;
        }
        if (triggerLoading) {
            // setTableLoading(true);
            // setRefreshBtnLoading(true);
            myApplicationList.toggleLoad(true);

        }
        // let url = "http://192.168.243.187:29891/flight/histask/adminflw";
        let url = ReqUrls.histaskTableUrl+user.username;


        const opt = {
            url,
            method: 'GET',
            resFunc: (data) => {
                //更新我的申请数据
                handleMyApplicationData(data);
                // setTableLoading(false);
                // setRefreshBtnLoading(false);
                myApplicationList.toggleLoad(false);
            },
            errFunc: (err) => {
                requestErr(err, '获取办结数据失败');
                // setTableLoading(false);
                // setRefreshBtnLoading(false);
                myApplicationList.toggleLoad(false);

            },
        };
        console.log("fdfd" + opt)
        requestGet(opt);
    }, [user.id]);

    useEffect(() => {

        requestMyApplicationDatas(true);
        timerId.current = setInterval(() => {
            requestMyApplicationDatas(false);
        }, 60 * 1000);
        return () => {
            clearInterval(timerId.current);
            timerId.current = null;
        }
    }, [user.id]);
    return (
        <Suspense fallback={<div className="load_spin"><Spin tip="加载中..." /></div>}>
            <div className="advanced-search-filters">
                <div className="advanced-search-base-input-filter">
                    {/* <Input
                        allowClear
                        className="input-filter-key"
                        placeholder="请输入要查询的关键字"
                        style={{ width: '60%' }}
                        onChange={(e)=> { updateFilterKey(e.target.value) }}
                    /> */}
                </div>
                {/*<div className="advanced-search-base-radio-filter">
                    <Radio.Group value="ALL" onChange={(e)=> { updateFilterTimeRange(e.target.value) }}>
                        <Radio value="ALL">全部时段</Radio>
                        <Radio value="TODAY">今日</Radio>
                        <Radio value="WEEK">最近一周</Radio>
                        <Radio value="ONEMONTH">最近一个月</Radio>
                    </Radio.Group>
                </div>*/}
                {/* <div className="advanced-search-button-refresh">
                    <Button type="primary" loading = { refreshBtnLoading } style={{ marginLeft: "-5rem" }}
                            onClick = { e => { refreshData()  }}
                    >
                        刷新
                    </Button>
                </div> */}
            </div>
            <div>
                <Table
                    columns={getColumns}
                    dataSource={props.myApplicationList.myApplications}
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
                        x: 600,
                        y: 600
                    }}
                    // footer={() => <div className="generateTime">数据时间: {formatTimeString(props.myApplicationList.generateTime)}</div>}
                />
<div className="generateTime" style={{position:"absolute",bottom: "60px",left:"30px"}}>数据时间: {formatTimeString(props.myApplicationList.generateTime)}</div>
            </div>
        </Suspense>
    )
}

export default inject("systemPage", "myApplicationList")(observer(HistaskTable))



