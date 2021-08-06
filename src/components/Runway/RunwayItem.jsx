
import React, { useState, useEffect, useCallback, memo } from 'react'
import { inject, observer } from 'mobx-react'
import { getTimeFromString, getDayTimeFromString, isValidVariable, isValidObject } from 'utils/basic-verify'
import { Modal, Menu, Dropdown } from 'antd'
import { DownOutlined } from '@ant-design/icons';
import { RunwayConfigUtil } from "utils/runway-config-util";
import { request2 } from "utils/request";
import { ReqUrls } from 'utils/request-urls'



//方案状态转化
const convertSatus = (status) => {
    let newStatus = status;
    switch (status) {
        case "FUTURE": newStatus = "将要执行"; break;
        case "RUNNING": newStatus = "正在执行"; break;
        case "PRE_PUBLISH": newStatus = "将要发布"; break;
        case "PRE_TERMINATED":
        case "PRE_UPDATE":
            newStatus = "将要终止"; break;
        case "TERMINATED":
        case "TERMINATED_MANUAL":
            newStatus = "人工终止"; break;
        case "STOP": newStatus = "系统终止"; break;
        case "FINISHED": newStatus = "正常结束"; break;
        case "DISCARD": newStatus = "已废弃"; break;
    }
    return newStatus;
}

const SummaryCell = memo(({
    startTime,
    endTime,
    generateTime
}) => {
    const [visible, setVisible] = useState(false);

    const handleVisibleChange = flag => {
        setVisible(flag);
    };

    const menu = (
        <Menu>
            <Menu.Item key="2">有效时间: {`${getDayTimeFromString(startTime, false, 2)}-${getDayTimeFromString(endTime, false, 2)}`}</Menu.Item>
            <Menu.Item key="2">创建时间: {getDayTimeFromString(generateTime, false, 2)}</Menu.Item>
        </Menu>
    );
    return (
        <Dropdown
            overlay={menu}
            onVisibleChange={handleVisibleChange}
            visible={visible}
        >
            <span className="ant-dropdown-link">
                <span style={{
                    padding: '0 10px',
                    fontSize: '14px'
                }}>有效时间:{`${getDayTimeFromString(startTime, false, 2)}-${getDayTimeFromString(endTime, false, 2)}`}</span> <DownOutlined />
            </span>
        </Dropdown>
    )

})

//单条方案
function RunwayItem(props) {
    const {systemPage, runwayListData, RunwayDynamicEditFormData, RunwayDefaultEditFormData } = props;

    // 转换跑道使用情况
    const covertRunwayUseStatus = (isDepRWs) => {
        var isUse = "";
        switch (isDepRWs) {
            case 1: isUse = "起飞";
                break;
            case -1: isUse = "降落";
                break;
            case 2: isUse = "起降";
                break;
            case 0: isUse = "关闭";
                break;
        }
        return isUse;
    };

    // 转换跑道起飞间隔
    const covertTakeoffSpace = (data) => {
        var val = "";
        var logicRWDef = data.logicRWDef;
        var logicRWNameA = data.logicRWNameA;
        var logicRWNameB = data.logicRWNameB;
        if (logicRWDef === logicRWNameA) {
            val = data.logicRWValueA;
        } else if (logicRWDef === logicRWNameB) {
            val = data.logicRWValueB;
        }
        return val;
    };

    // 转换跑道起飞间隔
    const covertTaxi = (data) => {
        var val = "";
        var logicRWDef = data.logicRWDef;
        var logicRWNameA = data.logicRWNameA;
        var logicRWNameB = data.logicRWNameB;
        if (logicRWDef === logicRWNameA) {
            val = data.logicRWTaxitimeA;
        } else if (logicRWDef === logicRWNameB) {
            val = data.logicRWTaxitimeB;
        }
        return val;
    };

    // 获取跑道有效时间
    const getEffectiveTimeRange = (list) => {
        let firstRunwayData = list[0] || {};

        let startTime = firstRunwayData.startTime || "";
        let endTime = firstRunwayData.endTime || "";
        return `${getDayTimeFromString(startTime)}-${getDayTimeFromString(endTime)}`
    };
    // 单个跑道组数据
    let { singleGroupRunwayData } = props;
    // id
    let id = singleGroupRunwayData.id || "";
    // 单个跑道组所属机场
    let airportName = singleGroupRunwayData.airportName || "";
    //  单个跑道组类型 default:默认 dynamic:动态
    let type = singleGroupRunwayData.type || "";
    let typeZH = RunwayConfigUtil.getRunwayTypeZh(type);
    // 跑道集合
    let runway = singleGroupRunwayData.runway || [];
    // 单个跑道组名称
    let runwayName = `(${airportName}) ${typeZH}配置`;
    //  跑道执行状态
    let status = RunwayConfigUtil.getExecutionStatus(singleGroupRunwayData, type);
    // 跑道执行状态中文
    let statusZh = RunwayConfigUtil.getExecutionStatusZH(singleGroupRunwayData, type);
    // 跑道使用状态文字className
    let statusClassName = RunwayConfigUtil.getExecutionStatusClassName(singleGroupRunwayData, type);
    // 开始时间
    let startTime = singleGroupRunwayData.startTime || "";
    // 结束时间
    let endTime = singleGroupRunwayData.endTime || "";
    // 创建时间
    let generateTime = singleGroupRunwayData.generateTime || "";



    let updateTime = "";
    // 执行情况
    let isExecuting = "";
    let runwayType = "";
    let ids = [];
    runway.map(item => {
        updateTime = item.updateTime || "";//终止时间
        isExecuting = item.isExecuting || "";

        runwayType = item.type || "";

        const operationMode = item.operationmode;
        let operationModeStr = "";//运行模式
        if (operationMode != "") {
            if (operationMode * 1 == 100) {
                operationModeStr = "就近模式";
            } else if (operationMode * 1 == 200) {
                operationModeStr = "走廊口模式";
            }
        }

        ids.push(item.id);
    })

    // 跑道集合长度
    let len = runway.length;
    // 跑道集合最大索引值
    let maxIndex = len - 1;
    // 显示详情模态框
    const showDetail = useCallback((e, type) => {
        let params = {
            type,
            airportStr: airportName,
            ids: ids.join(","),
            validTime0: "有效时间:" + startTime.substring(6, 8) + startTime.substring(8) + '-' + endTime.substring(6, 8) + endTime.substring(8),
            sign0: "",
            typeZH
        }
        props.toggleModalVisible(true, params);
        props.toggleModalType('DETAIL');
        e.preventDefault();
        e.stopPropagation();
    }, [id]);
    // 显示修改模态框
    const showModify = useCallback((e, type) => {
        let params = {
            airportStr: airportName,
            ids: ids.join(","),
            validTime0: "有效时间:" + startTime.substring(6, 8) + startTime.substring(8) + '-' + endTime.substring(6, 8) + endTime.substring(8),
            sign0: "",
        }

        if (type === RunwayConfigUtil.TYPE_DYNAMIC) {
            RunwayDynamicEditFormData.updateRequestParams(params);
            RunwayDynamicEditFormData.toggleModalVisible(true);

        } else if (type === RunwayConfigUtil.TYPE_DEFAULT) {
            RunwayDefaultEditFormData.updateRequestParams(params);
            RunwayDefaultEditFormData.toggleModalVisible(true);
        }
        e.preventDefault();
        e.stopPropagation();
    }, [id]);
    // 跑道终止按钮点击
    const terminate = useCallback((e, type) => {
        Modal.confirm({
            title: '提示',
            centered: true,
            closable: true,
            content: <div><p> 确认终止{runwayName} ?</p></div>,
            okText: '确认',
            cancelText: `取消`,
            onOk: () => {
                console.log("dddd")
                return new Promise((resolve, reject) => {
                    terminateRunway(resolve, reject,)
                }).catch(() => console.log('Oops errors!'));
            },
        });
    }, [id]);

    // 终止跑道
    const terminateRunway = async (resolve, reject) => {
        try {
            let url = ReqUrls.runwayDynamicTerminateUrl + "?ids=" + ids;
            // 发送终止请求
            const data = await request2({
                url,
                method: "GET",
                params: {},
            });
            resolve(data);
            // 触发获取跑道列表数据
            runwayListData.triggerRequest();
            Modal.success({
                title: "终止成功",
                content: (
                    <span>
                        <span>{runwayName}终止成功</span>
                    </span>
                ),
                centered: true,
                okText: "确定",
            })
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
            let errMsg = "";
            if (isValidObject(errorInfo) && isValidVariable(err.message)) {
                errMsg = errorInfo.message;
            } else if (isValidVariable(errorInfo)) {
                errMsg = errorInfo;
            }
            reject("")
            Modal.error({
                title: "终止失败",
                content: (
                    <span>
                        <span>{runwayName}终止失败</span>
                        <br />
                        <span>{errMsg}</span>
                    </span>
                ),
                centered: true,
                okText: "确定",
            });
        }
    };

    // 绘制详情按钮
    const drawDetailOpt = () => {
        if (type == RunwayConfigUtil.TYPE_DEFAULT && systemPage.userHasAuth(16111) ||
            type == RunwayConfigUtil.TYPE_DYNAMIC && systemPage.userHasAuth(16122)) {
            return <div className="opt" onClick={e => {
                showDetail(e, type)
                e.stopPropagation();
            }}>详情</div>
        } else {
            return ""
        }
    }
    // 绘制修改按钮
    const drawModifyOpt = () => {
        // 状态是否符合
        let statusQualified = [RunwayConfigUtil.EXECUTION_STATUS_EXECUTING,
        RunwayConfigUtil.EXECUTION_STATUS_FUTURE,
        RunwayConfigUtil.EXECUTION_STATUS_OUT_OF_DYNAMIC_RANGE_EXECUTING,
        ].includes(status);
        // 默认跑道修改权限
        let defaultTypeAuth = (type == RunwayConfigUtil.TYPE_DEFAULT && systemPage.userHasAuth(16110));
        // 动态跑道修改权限
        let dynamicTypeAuth = (type == RunwayConfigUtil.TYPE_DYNAMIC && systemPage.userHasAuth(16120));
        if (statusQualified && (defaultTypeAuth || dynamicTypeAuth)) {
            return <div className="opt" onClick={(e) => { showModify(e, type) }}>修改</div>
        } else {
            return ""
        }
    }
    // 绘制终止按钮
    const drawTerminateOpt = () => {
        // 状态是否符合
        let statusQualified = [RunwayConfigUtil.EXECUTION_STATUS_EXECUTING,
        RunwayConfigUtil.EXECUTION_STATUS_FUTURE,
        RunwayConfigUtil.EXECUTION_STATUS_OUT_OF_DYNAMIC_RANGE_EXECUTING,
        ].includes(status);
        // 动态跑道终止权限
        let dynamicTypeAuth = (type == RunwayConfigUtil.TYPE_DYNAMIC && systemPage.userHasAuth(16121));
        if (statusQualified && dynamicTypeAuth) {
            return <div className="opt" onClick={e => {
                terminate(e, type);
                e.stopPropagation();
            }
            }>终止</div>
        } else {
            return ""
        }
    }


    return (
        <div className={`item_container layout-column`}>
            <div className="layout-row">
                <div className="left-column border-bottom layout-column justify-content-center">
                    <div className="name">
                        <div className="cell">
                            <span className="runway-name" >{runwayName}</span>
                        </div>
                    </div>
                    <div className="state">
                        <div className="cell">
                            <span className={`runway-status ${statusClassName}`}>{statusZh}</span>
                        </div>
                    </div>
                </div>
                <div className="right-column border-bottom layout-row">
                    {/* 跑道方向 */}
                    <div className="layout-column">
                        {
                            runway.map((item, index) => {
                                return (
                                    <div key={`logicRWDef-${item.id}`} className={(index != maxIndex && len > 1) ? `column-box border-bottom` : `column-box`}>
                                        <div className="cell" >{item.logicRWDef || ""}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    {/* 使用情况 */}
                    <div className="layout-column">
                        {
                            runway.map((item, index) => {
                                return (
                                    <div key={`useStatus-${item.id}`} className={(index != maxIndex && len > 1) ? `column-box border-bottom` : `column-box`}>
                                        <div className="cell" >{covertRunwayUseStatus(item.isDepRW)}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    {/* 起飞间隔 */}
                    <div className="layout-column">
                        {
                            runway.map((item, index) => {
                                return (
                                    <div key={`space-${item.id}`} className={(index != maxIndex && len > 1) ? `column-box border-bottom` : `column-box`}>
                                        <div className="cell" >{covertTakeoffSpace(item)}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    {/* 滑行时间 */}
                    <div className="layout-column">
                        {
                            runway.map((item, index) => {
                                return (
                                    <div key={`taxi-${item.id}`} className={(index != maxIndex && len > 1) ? `column-box border-bottom` : `column-box`}>
                                        <div className="cell" >{covertTaxi(item)}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <div className="layout-row">
                <div className="summary">
                    <SummaryCell
                        startTime={startTime}
                        endTime={endTime}
                        generateTime={generateTime}
                    />
                </div>
                <div className="right-column2">
                    <div className="options-box layout-row">
                        {
                            drawDetailOpt()
                        }
                        {
                            drawModifyOpt()
                        }
                        {
                            drawTerminateOpt()
                        }
                        {/* {

                            systemPage.userHasAuth(12518) && <div className="opt" onClick={e => {
                                showDetail(e, type)
                                e.stopPropagation();
                            }}>详情</div>
                        }
                        {

                        }

                        {
                            [RunwayConfigUtil.EXECUTION_STATUS_EXECUTING,
                            RunwayConfigUtil.EXECUTION_STATUS_FUTURE,
                            RunwayConfigUtil.EXECUTION_STATUS_OUT_OF_DYNAMIC_RANGE_EXECUTING,
                            ].includes(status) && <div className="opt" onClick={(e) => { showModify(e, type) }}>修改</div>
                        }

                        {
                            type === RunwayConfigUtil.TYPE_DYNAMIC && [RunwayConfigUtil.EXECUTION_STATUS_EXECUTING,
                            RunwayConfigUtil.EXECUTION_STATUS_FUTURE,
                            RunwayConfigUtil.EXECUTION_STATUS_OUT_OF_DYNAMIC_RANGE_EXECUTING,
                            ].includes(status) && <div className="opt" onClick={e => {
                                terminate(e, type);
                                e.stopPropagation();
                            }
                            }>终止</div>
                        } */}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default inject("systemPage", "runwayListData", "RunwayDynamicEditFormData", "RunwayDefaultEditFormData")(observer(RunwayItem))