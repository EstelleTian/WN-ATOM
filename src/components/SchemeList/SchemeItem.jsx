
import React, { useState, useEffect, useCallback, memo } from 'react'
import {  observer } from 'mobx-react'
import ReactDom from "react-dom";
import { getTimeFromString, getDayTimeFromString, isValidVariable } from 'utils/basic-verify'
import { handleStopControl } from 'utils/client'
import { Window as WindowDHX } from "dhx-suite";
import { openBaseSchemeFrame } from "utils/client"
import WorkFlowContent from "components/WorkFlow/WorkFlowContent";
import { Tag, Menu, Dropdown  } from 'antd'
import { DownOutlined } from '@ant-design/icons';

//获取屏幕宽度，适配 2k
let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;

const reasonType = {
    "AIRPORT": "机场",
    "MILITARY":"军事活动",
    "CONTROL":"流量",
    "WEATHER":"天气",
    "AIRLINE":"航空公司",
    "SCHEDULE":"航班时刻",
    "JOINT_INSPECTION":"联检",
    "OIL":"油料",
    "DEPART_SYSTEM":"离港系统",
    "PASSENGER":"旅客",
    "PUBLIC_SECURITY":"公共安全",
    "MAJOR_SECURITY_ACTIVITIES":"重大保障活动",
    "OTHER":"其它",
};

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

const SummaryCell = memo(( {
    publishTime,
    createTime,
    basicTacticInfoReasonZh,
    basicTacticInfoRemark
} ) => {
    const [ visible, setVisible ] = useState( false );

    const handleVisibleChange = flag => {
        setVisible(flag);
    };
    
    const menu = (
        <Menu>
          <Menu.Item key="2">创建时间: {getTimeFromString(createTime)}</Menu.Item>
          <Menu.Item key="3">原因: {basicTacticInfoReasonZh}</Menu.Item>
          <Menu.Item key="4">备注: {basicTacticInfoRemark}</Menu.Item>
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
                }}>发布时间:</span>{getTimeFromString(publishTime)} <DownOutlined />
            </span>
        </Dropdown>
      )

})

//单条方案
function SchemeItem(props){
    const [window, setWindow] = useState("");
    const [windowClass, setWindowClass] = useState("");
   
    let { item, activeSchemeId, userHasAuth } = props;
    let { id, tacticName , tacticStatus, tacticPublishUnit, basicTacticInfoReason, basicTacticInfoRemark,
        tacticTimeInfo: { startTime, endTime, publishTime, createTime, startCalculateTime =""},
        basicFlowcontrol = {}, directionList = []
    } = item;
    let isActive = ( activeSchemeId === id);

    basicTacticInfoRemark = basicTacticInfoRemark || "";
    if( basicFlowcontrol === null ){
        basicFlowcontrol = {};
    }
    let { flowControlMeasure = {} } = basicFlowcontrol;
    if( flowControlMeasure === null ){
        flowControlMeasure = {};
    }
    let basicTacticInfoReasonZh = reasonType[basicTacticInfoReason] || "";
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

    const showDetail = useCallback((e)=>{
        props.toggleModalVisible(true, id);
        props.toggleModalType('DETAIL');
        e.preventDefault();
        e.stopPropagation();
    },[id]);

    const showModify = useCallback((e) => {
        props.toggleModalVisible(true, id);
        props.toggleModalType('MODIFY');
        e.preventDefault();
        e.stopPropagation();
    },[id]);


    const onChange = useCallback((e) => {
        props.handleActive( id );
        e.preventDefault();
        e.stopPropagation();
    },[id]);

    //工作流详情
    const showWorkFlowDetail = useCallback((id) => {
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
    })
    //工作流详情
    const stopControl = useCallback((id) => {
        handleStopControl(id);
    })

    useEffect(function(){
        if( window !== "" ){
            window.show();
            setTimeout(function(){
                const winDom = document.getElementsByClassName(windowClass)[0];
                ReactDom.render(
                    <WorkFlowContent modalId={id} window={window} source="fangxing" />,
                    winDom);
            }, 200)
        }

    },[window]);



    const menu = (
        <Menu>
          <Menu.Item>
             <div className="menu_opt" onClick={ showModify }>模拟方案调整</div>
          </Menu.Item>
        </Menu>
      );

   

    return (
        <div className={`item_container layout-column ${isActive ? 'item_active' : ''}`}
             onClick={onChange}
        >
            <div className="layout-row">
                <div className="left-column border-bottom layout-column justify-content-center">
                    <div className="name">
                        <div className="cell">
                            <span className="tactic-name" title={`方案名称: ${tacticName} ID:${id} `}>{tacticName}</span>
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
                                <div className="cell" style={{ color: '#f5f5f5'}} title={`限制值: ${interVal}`}>{interVal}</div>
                            </div>
                            <div className="column-box">
                                <div className="cell" style={{ color: '#f5f5f5'}} title={`基准单元: ${targetUnits}`}>{targetUnits}</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className="layout-row">
                <div className="summary">
                    <SummaryCell 
                        publishTime= {publishTime}
                        createTime= {createTime}
                        basicTacticInfoReasonZh= {basicTacticInfoReasonZh}
                        basicTacticInfoRemark= {basicTacticInfoRemark}
                    />
                </div>
                <div className="right-column2">
                    <div className="options-box layout-row">
                        <div className="opt" onClick={ e =>{
                            showDetail(e)
                            e.stopPropagation();
                        } }>详情</div>
                        <div className="opt" onClick={ showModify}>调整</div>
                        <div className="opt" onClick={ e =>{
                            showWorkFlowDetail(id);
                            e.stopPropagation();
                        } }>工作流</div>
                        <div className="opt" onClick={ e =>{
                            openBaseSchemeFrame(id);
                            e.stopPropagation();
                        } }>决策依据</div>
                        <div className="opt" onClick={ e=>{
                            stopControl(id);
                            e.stopPropagation();
                        }
                        }>终止</div>
                        {
                            // (screenWidth > 1920)
                            // ? <div className="opt" onClick={ showModify}>调整</div>
                            // : <div className="opt">
                            //     <Dropdown overlay={menu}>
                            //         <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                            //         <DownOutlined />
                            //         </a>
                            //     </Dropdown>
                            // </div>
                        }
                        
                        
                    </div>

                </div>
            </div>
            
        </div>
    )
}

export default (observer(SchemeItem))