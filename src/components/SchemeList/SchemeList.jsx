/*
 * @Author: your name
 * @Date: 2020-12-10 11:08:04
 * @LastEditTime: 2020-12-24 19:19:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\components\SchemeList\SchemeList.jsx
 */
import React from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, message } from 'antd'
import { request } from '../../utils/request'
import { getTimeFromString } from '../../utils/basic-verify'
import './SchemeItem.scss'

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

@observer
class SchemeItem extends React.Component{
    constructor(props) {
        super(props) ;

    }
    onChange = (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        this.props.handleActive( id );
    };
    render(){
        let { item, toggleSchemeActive } = this.props;
        let { id, tacticName , tacticStatus, tacticPublishUnit, basicTacticInfoReason, basicTacticInfoRemark,
            tacticTimeInfo: { startTime, endTime, publishTime, startCalculateTime =""},
            sourceFlowcontrol = {}
        } = item;
        if( sourceFlowcontrol === null ){
            sourceFlowcontrol = {};
        }
        let { flowControlMeasure = {}, directionList = []  } = sourceFlowcontrol;
        if( flowControlMeasure === null ){
            flowControlMeasure = {};
        }
        let { restrictionMITValue = ""} = flowControlMeasure;
        let targetUnits = "";
        let behindUnits = "";
        directionList.map((item)=>{
            targetUnits += item.targetUnit+",";
            behindUnits += item.behindUnit+",";
        })
        if( targetUnits !== ""){
            targetUnits.substring(0, targetUnits.length-1);
        }
        if( behindUnits !== ""){
            behindUnits.substring(0, targetUnits.length-1);
        }
        

        return (
            <div className={`item_container ${item.active ? 'item_active' : ''}`}  onClick={(e)=>{ this.onChange(e, id) } }>
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
                        <span className="opt detail">详情</span>
                        <span className="opt effect">影响</span>
                    </Col>
                </Row>
            </div>
        )
    }
}


@inject("schemeListData","flightTableData")
@observer
class SchemeList extends React.Component{
    constructor( props ){
        super(props);
    }
    updateSchemeListData(data){
        const {tacticProcessInfos} = data;
        const list = tacticProcessInfos.map((item) => {
            const { basicTacticInfo } = item;
            return basicTacticInfo;
        })
        this.props.schemeListData.updateList(list)
    }
    requestErr(err){
        message.error('方案列表获取失败'+err);
    }
    requestErr2(err) {
        message.error('航班列表数据获取失败' + err);
    }
        componentWillMount(){
        const opt = {
            url:'http://192.168.194.21:58189/schemeFlow/DB/xian',
            method:'GET',
            params:{},
            resFunc: (data)=> this.updateSchemeListData(data),
            errFunc: (err)=> this.requestErr(err),
        };
        request(opt);
    }

    updateFlightTableData = flightData => {
        let  { flights } = flightData;
        console.log(flights)
        if( flights !== null ){
            this.props.flightTableData.updateList(flights)
        }

    };

    requestFlightTableData(id) {
        // id = this.props.schemeId;
        console.log("航班列表 requestFlightTableData---",  id);
        const opt = {
            url:'http://192.168.243.8:29890/tactic/' + id,
            method:'GET',
            params:{},
            resFunc: (data)=> this.updateFlightTableData(data),
            errFunc: (err)=> this.requestErr2(err),
        };
        request(opt);
    }

    handleActive = ( id ) => {
        this.props.schemeListData.toggleSchemeActive( id );
        this.requestFlightTableData(id);
    }

    render(){
        console.log("SchemeList render");
        const schemeListData = this.props.schemeListData;
        const { list } = schemeListData;
        return (
            <div className="list_container">
            {
                list.map( (item, index) => (
                    <SchemeItem 
                        item={item}
                        handleActive={this.handleActive}
                        key={index}>
                    </SchemeItem>
                    )
                )
            }
            </div>
        )
    }
}




export default SchemeList