/*
 * @Author: your name
 * @Date: 2020-12-10 11:08:04
 * @LastEditTime: 2020-12-24 19:19:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\components\SchemeList\SchemeList.jsx
 */
import React, { useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, message } from 'antd'
import { request } from 'utils/request'
import { getTimeFromString } from 'utils/basic-verify'
import { NWGlobal } from  'utils/global'
import './SchemeItem.scss'

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
        case "TERMINATED": newStatus = "人工终止";break;
        case "STOP": newStatus = "系统终止";break;
        case "FINISHED": newStatus = "正常结束";break;
        case "DISCARD": newStatus = "已废弃";break;
    }

    return newStatus;
}
//单条方案
function  sItem(props){
    const onChange = (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        props.handleActive( id );
    };
     let { item } = props;
     let { id, tacticName , tacticStatus, tacticPublishUnit, basicTacticInfoReason, basicTacticInfoRemark,
         tacticTimeInfo: { startTime, endTime, publishTime, startCalculateTime =""},
         sourceFlowcontrol = {}, directionList = []
     } = item;
     if( sourceFlowcontrol === null ){
         sourceFlowcontrol = {};
     }
     let { flowControlMeasure = {} } = sourceFlowcontrol;
     if( flowControlMeasure === null ){
         flowControlMeasure = {};
     }
     let { restrictionMITValue = ""} = flowControlMeasure;
     let targetUnits = "";
     let behindUnits = "";
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
     return (
         <div className={`item_container ${item.active ? 'item_active' : ''}`}  onClick={(e)=>{ onChange(e, id) } }>
             <Row>
                 <Col span={14}>{tacticName}</Col>
                 <Col span={5}>{tacticPublishUnit}</Col>
                 <Col span={5}>{getTimeFromString(startTime)} - {getTimeFromString(endTime)}</Col>
             </Row>
             <Row>
                 <Col span={8}>{ convertSatus(tacticStatus) } - { startCalculateTime == "" ? "计算中" : "已计算"}</Col>
                 <Col span={5}>{restrictionMITValue}</Col>
                 <Col span={5}>{targetUnits}</Col>
                 <Col span={6}>{behindUnits}</Col>
             </Row>
             <Row>
                 <Col span={18}>
                     创建时间:<span>{getTimeFromString(publishTime)}</span>
                     原因:<span>{basicTacticInfoReason}</span>
                     备注:<span>{basicTacticInfoRemark}</span>
                 </Col>
                 <Col span={6}>
                     {/*<span className="opt detail">详情</span>*/}
                     <span className="opt effect">影响</span>
                 </Col>
             </Row>
         </div>
     )
}

let SchemeItem = (observer(sItem))

//方案列表
function SchemeList (props){
    const setSchemeId = id  => {
        handleActive( id )
    }
    NWGlobal.setSchemeId = setSchemeId;
    //更新方案列表数据
    const updateSchemeListData = data => {
        let { tacticProcessInfos, status } = data;
        if( status === 500 ){
            message.error('获取的方案列表数据为空');
        }else{
            const { schemeListData } = props;
            if( tacticProcessInfos === null ){
                tacticProcessInfos = [];
            }
            const list = tacticProcessInfos.map((item) => {
                const { basicTacticInfo } = item;
                return basicTacticInfo;
            })
            schemeListData.updateList(list)
            if( schemeListData.activeScheme == "" && list.length > 0 ){
                let id = list[0].id + "";
                handleActive(id)
            }
        }
    }
    const requestErr = (err, content) => {
        message.error({
            content,
            duration: 4,
        });
    }
    const getSchemeList = () => {
        const opt = {
            url:'http://192.168.194.21:58189/schemeFlow/DB/xian',
            method:'GET',
            params:{},
            resFunc: (data)=> updateSchemeListData(data),
            errFunc: (err)=> requestErr(err, '方案列表数据获取失败' ),
        };
        request(opt);
    }
    useEffect(function(){
        getSchemeList();
    }, [])

    const updateFlightTableData = flightData => {
        let  { flights, generateTime } = flightData;
        console.log(flights)
        if( flights !== null ){
            props.flightTableData.updateList(flights, generateTime)
        }
    };
    //航班列表数据获取
    const requestFlightTableData = id => {
        // id = props.schemeId;
        console.log("航班列表 requestFlightTableData---",  id);
        const opt = {
            url:'http://192.168.194.21:29890/tactic/' + id,
            method:'GET',
            params:{},
            resFunc: (data)=> updateFlightTableData(data),
            errFunc: (err)=> requestErr(err, '航班列表数据获取失败'),
        };
        request(opt);
    }
    //高亮方案并获取航班数据
    const handleActive = ( id ) => {
        props.schemeListData.toggleSchemeActive( id+"" );
        requestFlightTableData(id+"");
    }

    const schemeListData = props.schemeListData;
    const { list } = schemeListData;
    console.log( "方案list改变了");
    return (
        <div className="list_container">
            {
                list.map( (item, index) => (
                    <SchemeItem
                        item={item}
                        handleActive={handleActive}
                        key={index}>
                    </SchemeItem>
                    )
                )
            }
        </div>
    )
 }


export default inject("schemeListData","flightTableData")(observer(SchemeList))