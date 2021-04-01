
import React, { useState, useEffect, useCallback, memo } from 'react'
import { observer } from 'mobx-react'
import ReactDom from "react-dom";
import { getTimeFromString, getDayTimeFromString, isValidVariable } from 'utils/basic-verify'
import { Tag, Menu, Dropdown } from 'antd'
import { DownOutlined } from '@ant-design/icons';

//获取屏幕宽度，适配 2k
let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;

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
    createTime,
    basicTacticInfoReasonZh,
    basicTacticInfoRemark
}) => {
    const [visible, setVisible] = useState(false);

    const handleVisibleChange = flag => {
        setVisible(flag);
    };

    const menu = (
        <Menu>
            <Menu.Item key="2">创建时间: {getTimeFromString(createTime)}</Menu.Item>
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
                    fontSize: '0.8rem',
                }}>有效时间:</span>{} <DownOutlined />
            </span>
        </Dropdown>
    )

})

//单条方案
function RunwayItem(props) {
    const [window, setWindow] = useState("");
    const [windowClass, setWindowClass] = useState("");

    // 跑道类型转换
    const covertRunwayType = (type) => {
        let typeZH = "";
        if (type === "default") {
            typeZH = "默认"
        } else if (type === "dynamic") {
            typeZH = "动态"
        }
        return typeZH
    }
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
        }else if (logicRWDef === logicRWNameB) {
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
        }else if (logicRWDef === logicRWNameB) {
            val = data.logicRWTaxitimeB;
        }
        return val;
    };

    // 获取跑道有效时间
    const getEffectiveTimeRange = (list) => {
        let firstRunwayData = list[0] || {};
        debugger
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
    let typeZH = covertRunwayType(type);
    // 跑道集合
    let runway = singleGroupRunwayData.runway || [];
    // 单个跑道组名称
    let runwayName = `(${airportName}) ${typeZH}配置`;


    let startTime = "";
    let endTime = "";
    let generateTime = "";
    let updateTime = "";
    // 执行情况
    let isExecuting =  "";
    let runwayType = "";
    let ids = [];
    runway.map( item => {
         startTime = item.startTime || ""; //起始时间
         endTime = item.endTime || ""; //结束时间
         generateTime = item.generateTime || ""; //创建时间
         updateTime = item.updateTime || "";//终止时间
        
        isExecuting = item.isExecuting || "";

        runwayType = item.type || "";

        const operationMode = item.operationmode; 
        let operationModeStr = "";//运行模式
        if( operationMode != "" ){
            if( operationMode*1 == 100){
                operationModeStr = "就近模式";
            }else if( operationMode*1 == 200){
                operationModeStr = "走廊口模式";
            }
        }

        ids.push(item.id);
    })

    // 跑道集合长度
    let len = runway.length;
    // 跑道集合最大索引值
    let maxIndex = len-1;

    const showDetail = useCallback((e) => {
        let params = {
            airportStr: airportName,
            ids: ids.join(","),
            validTime0: "有效时间:"+ startTime.substring(6,8) + startTime.substring(8) + '-' + endTime.substring(6,8) + endTime.substring(8),
            sign0: "",
            typeZH
        }
        console.log(params)

        props.toggleModalVisible(true, params);
        props.toggleModalType('DETAIL');
        e.preventDefault();
        e.stopPropagation();
    }, [id]);

    const showModify = useCallback((e) => {
        return
        props.toggleModalVisible(true, id);
        props.toggleModalType('MODIFY');
        e.preventDefault();
        e.stopPropagation();
    }, [id]);



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
                            <span className={`status`}>{`状态`}</span>
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
                                    <div key={`space-${item.id}`} className={(index != maxIndex && len > 1 )  ? `column-box border-bottom` : `column-box`}>
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
                                    <div key={`taxi-${item.id}`} className={(index != maxIndex && len > 1)  ? `column-box border-bottom` : `column-box`}>
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
                        createTime={`111`}
                        basicTacticInfoReasonZh={`111`}
                        basicTacticInfoRemark={`111`}
                    />
                </div>
                <div className="right-column2">
                    <div className="options-box layout-row">
                        <div className="opt" onClick={e => {
                            showDetail(e)
                            e.stopPropagation();
                        }}>详情</div>
                        <div className="opt" onClick={showModify}>修改</div>
                        {/* <div className="opt" onClick={e => {
                            
                            e.stopPropagation();
                        }
                        }>终止</div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default (observer(RunwayItem))