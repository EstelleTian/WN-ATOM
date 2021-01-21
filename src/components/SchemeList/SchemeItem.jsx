
import React, { useState, useEffect } from 'react'
import {  observer } from 'mobx-react'
import ReactDom from "react-dom";
import { getTimeFromString, getDayTimeFromString, isValidVariable } from 'utils/basic-verify'
import { Window as WindowDHX } from "dhx-suite";
import { openBaseSchemeFrame } from "utils/client"
import WorkFlowContent from "components/WorkFlow/WorkFlowContent";

//方案状态转化
const convertSatus = (status) => {
    let newStatus = status;
    switch(status){
        case "FUTURE": newStatus = "将要执行";break;
        case "RUNNING": newStatus = "正在执行";break;
        case "PRE_PUBLISH": newStatus = "将要发布";break;
        case "PRE_TERMINATED":
        case "PRE_UPDATE":
            newStatus = "将要终止";break;
        case "TERMINATED":
        case "TERMINATED_MANUAL":
            newStatus = "人工终止";break;
        case "STOP": newStatus = "系统终止";break;
        case "FINISHED": newStatus = "正常结束";break;
        case "DISCARD": newStatus = "已废弃";break;
    }
    return newStatus;
}
//单条方案
function SchemeItem(props){
    const [window, setWindow] = useState("");
    const [windowClass, setWindowClass] = useState("");
    const onChange = (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        props.handleActive( id );
    };
    let { item } = props;
    let { id, tacticName , tacticStatus, tacticPublishUnit, basicTacticInfoReason, basicTacticInfoRemark,
        tacticTimeInfo: { startTime, endTime, publishTime, createTime, startCalculateTime =""},
        sourceFlowcontrol = {}, directionList = []
    } = item;
    if( sourceFlowcontrol === null ){
        sourceFlowcontrol = {};
    }
    let { flowControlMeasure = {} } = sourceFlowcontrol;
    if( flowControlMeasure === null ){
        flowControlMeasure = {};
    }
    let { restrictionMITValue = "", restrictionAFPValueSequence ="", restrictionMode = ""} = flowControlMeasure;
    //限制值
    let interVal = "";
    if( restrictionMode === "MIT"){
        interVal = restrictionMITValue;
    }else if( restrictionMode === "AFP" ){
        interVal = restrictionAFPValueSequence;
    }
    let targetUnits = "";
    let behindUnits = "";
    if( !isValidVariable(directionList) ){
        directionList = [];
    }
    directionList.map((item) => {
        targetUnits += item.targetUnit+",";
        behindUnits += item.behindUnit+",";
    })
    if( targetUnits !== ""){
        targetUnits = targetUnits.substring(0, targetUnits.length-1);
    }
    if( behindUnits !== ""){
        behindUnits = behindUnits.substring(0, targetUnits.length-1);
    }
    const showDetail = function(id){
        props.toggleModalVisible(true, id);
    }
    //工作流详情
    const showWorkFlowDetail = function(id){
        let windowClass = 'win_' + id;
        if( !isValidVariable(id) ){
            windowClass = 'win_' + Math.floor( Math.random()*100000000 );
        }
        if( document.getElementsByClassName(windowClass).length === 0 ){
            const newWindow = new WindowDHX({
                width: 1000,
                height: 665,
                title: "工作流详情(方案ID:"+id+")",
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
    }

    useEffect(function(){
        if( window !== "" ){
            window.show();
            setTimeout(function(){
                const winDom = document.getElementsByClassName(windowClass)[0];
                ReactDom.render(
                    <WorkFlowContent modalId={id} window={window}/>,
                    winDom);
            }, 200)
        }

    },[window]);


    return (
        <div className={`item_container layout-column ${item.active ? 'item_active' : ''}`}
             onClick={(e)=>{
                 onChange(e, id);
                 e.stopPropagation();
             } }
        >
            <div className="layout-row">
                <div className="left-column border-bottom layout-column justify-content-center">
                    <div className="name">
                        <div className="cell">
                            <span className="tactic-name" title={`方案名称: ${tacticName} `}>{tacticName}</span>
                        </div>
                    </div>
                    <div className="state">
                        <div className="cell">
                            <span className={`${tacticStatus} status`} title="方案状态">{ convertSatus(tacticStatus) }</span>
                            <span className="calculate" title="方案计算状态">{ isValidVariable(startCalculateTime) ? "已计算" : "计算中" }</span>
                        </div>
                    </div>
                </div>
                <div className="right-column border-bottom layout-row">
                    <div className="layout-column">
                        <div className="column-box  border-bottom">
                            <div className="cell" title={`发布单位: ${tacticPublishUnit}`}>{tacticPublishUnit}</div>
                        </div>

                        <div className="column-box">
                            <div className="cell" title={`限制方式: ${restrictionMode}`}>{restrictionMode}</div>
                        </div>
                    </div>
                    <div className="layout-column double-column-box">
                        <div className="column-box  border-bottom">
                            <div className="cell" title={startTime+"-"+ endTime}>{getDayTimeFromString(startTime)} - {getDayTimeFromString(endTime)}</div>
                        </div>
                        <div className="layout-row">
                            <div className="column-box">
                                <div className="cell" title={`限制值: ${interVal}`}>{interVal}</div>
                            </div>
                            <div className="column-box">
                                <div className="cell" title={`基准单元: ${targetUnits}`}>{targetUnits}</div>
                            </div>
                            {/*<div className="column-box">*/}
                            {/*    <div className="cell" title={`后续单元: ${behindUnits} `}>{behindUnits}</div>*/}
                            {/*</div>*/}
                        </div>
                    </div>

                </div>
            </div>
            <div className="layout-row">
                <div className="left-column">
                    <div className="summary">
                        <div className="cell">
                            发布时间:<span>{getTimeFromString(publishTime)}</span>
                            &nbsp;&nbsp;
                            创建时间:<span>{getTimeFromString(createTime)}</span>
                            &nbsp;&nbsp;
                            原因:<span>{basicTacticInfoReason}</span>
                            &nbsp;&nbsp;
                            备注:<span>{basicTacticInfoRemark}</span>
                        </div>
                    </div>
                </div>
                <div className="right-column">
                    <div className="options-box layout-row">
                        <div className=" layout-row">
                            <div className="opt"
                            >影响航班</div>
                            <div className="opt" onClick={ e =>{
                                showDetail(id);
                                e.stopPropagation();
                            } }>详情</div>
                            <div className="opt" onClick={ e =>{
                                showDetail(id);
                                e.stopPropagation();
                            } }>调整</div>
                            <div className="opt" onClick={ e =>{
                                openBaseSchemeFrame(id);
                                e.stopPropagation();
                            } }>决策依据</div>
                            <div className="opt" onClick={ e =>{
                                showWorkFlowDetail(id);
                                e.stopPropagation();
                            } }>工作流</div>
                        </div>
                    </div>

                </div>
            </div>
            {/*<Row>*/}
            {/*<Col span={14}>{tacticName}</Col>*/}
            {/*<Col span={5}>{tacticPublishUnit}</Col>*/}
            {/*<Col span={5}>{getTimeFromString(startTime)} - {getTimeFromString(endTime)}</Col>*/}
            {/*</Row>*/}
            {/*<Row>*/}
            {/*<Col span={8}>{ convertSatus(tacticStatus) } - { startCalculateTime == "" ? "计算中" : "已计算"}</Col>*/}
            {/*<Col span={5}>{restrictionMITValue}</Col>*/}
            {/*<Col span={5}>{targetUnits}</Col>*/}
            {/*<Col span={6}>{behindUnits}</Col>*/}
            {/*</Row>*/}
            {/*<Row>*/}
            {/*<Col span={18}>*/}
            {/*创建时间:<span>{getTimeFromString(publishTime)}</span>*/}
            {/*原因:<span>{basicTacticInfoReason}</span>*/}
            {/*备注:<span>{basicTacticInfoRemark}</span>*/}
            {/*</Col>*/}
            {/*<Col span={6}>*/}
            {/*/!*<span className="opt detail">详情</span>*!/*/}
            {/*<span className="opt effect">影响</span>*/}
            {/*</Col>*/}
            {/*</Row>*/}
        </div>
    )
}

export default (observer(SchemeItem))