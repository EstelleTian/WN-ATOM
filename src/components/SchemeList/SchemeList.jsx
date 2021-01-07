/*
 * @Author: your name
 * @Date: 2020-12-10 11:08:04
 * @LastEditTime: 2020-12-24 19:19:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\components\SchemeList\SchemeList.jsx
 */
import React, { useEffect, useCallback,useState } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, message, Modal , Empty} from 'antd'
import { SyncOutlined } from '@ant-design/icons';
import { requestGet, request } from 'utils/request'
import { getTimeFromString, getDayTimeFromString, isValidVariable, isValidObject } from 'utils/basic-verify'
import { NWGlobal } from  'utils/global'
import  SchemeModal  from "./SchemeModal";
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
function sItem(props){
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
     return (
         <div className={`item_container layout-column ${item.active ? 'item_active' : ''}`}
              // onClick={(e)=>{
              //     onChange(e, id);
              //     e.stopPropagation();
              // } }
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
                             <span className="status" title="方案状态">{ convertSatus(tacticStatus) }</span>
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
                                  onClick={(e)=>{
                                      onChange(e, id);
                                      e.stopPropagation();
                                  } }
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
                                 showDetail(id);
                                 e.stopPropagation();
                             } }>决策依据</div>
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

let SchemeItem = (observer(sItem))

//方案列表
function SchemeList (props){
    const [visible, setVisible] = useState(false);
    const [modalId, setModalId] = useState("");
    let [ manualRefresh, setManualRefresh ] = useState( false );
    NWGlobal.setSchemeId = id  => {
        // alert("收到id:"+id);
        handleActive( id )
    }
    //更新方案列表数据
    const updateSchemeListData = useCallback(data => {
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
            //更新 方案 store
            schemeListData.updateList(list)
            if( (schemeListData.activeScheme.id === "" || schemeListData.activeScheme.id === undefined)  && list.length > 0 ){
                let id = list[0].id + "";
                handleActive(id)
            }
        }
        // setTimeout(function(){
        //     getSchemeList()
        // },30 * 1000)
    })
    //请求错误处理
    const requestErr = useCallback((err, content) => {
        message.error({
            content,
            duration: 4,
        });
    })
    //获取方案列表
    const getSchemeList = useCallback(() => {
        const opt = {
            url:'http://192.168.194.21:58189/implementTactics',
            method: 'GET',
            params:{
                status: "RUNNING,FUTURE",
                startTime: "",
                endTIme: "",
                userId: "443"
            },
            resFunc: (data)=> {
                updateSchemeListData(data)
                setManualRefresh(false);
            },
            errFunc: (err)=> {
                requestErr(err, '方案列表数据获取失败' );
                setManualRefresh(false);},
        };
        requestGet(opt);
    });
    // DidMount 获取一次方案列表
    useEffect(function(){
        if( props.schemeListData.activeScheme !== modalId ){
            getSchemeList();
        }

    }, [] )

    //更新航班store数据
    const updateFlightTableData = useCallback(flightData => {
        let  { flights, generateTime } = flightData;
        if( flights !== null ){
            props.flightTableData.updateList(flights, generateTime)
        }else{
            props.flightTableData.updateList([], generateTime)
        }
    });
    //更新执行KPIstore数据
    const updateExecuteKPIData = useCallback(executeKPIData => {
        if( isValidObject(executeKPIData) ){
            props.flightTableData.updateExecuteKPIData(executeKPIData)
        }else{
            props.flightTableData.updateList({})
        }
    });
    //航班列表数据获取
    const requestFlightTableData = useCallback(id => {
        const opt = {
            url:'http://192.168.194.21:29890/tactic/' + id,
            method:'GET',
            params:{},
            resFunc: (data)=> {
                updateFlightTableData(data)
                props.flightTableData.toggleLoad(false)
            },
            errFunc: (err)=> {
                requestErr(err, '航班列表数据获取失败')
                props.flightTableData.toggleLoad(false)
            } ,
        };
        request(opt);
    })
    //方案执行KPI数据获取
    const requestExecuteKPIData = useCallback(id => {
        const opt = {
            // url:'http://192.168.194.21:29890/performkpi/' + id,
            url:'http://192.168.243.8:29890/performkpi/' + id,
            method:'GET',
            params:{},
            resFunc: (data)=> {
                updateExecuteKPIData(data)
                props.executeKPIData.toggleLoad(false)
            },
            errFunc: (err)=> {
                requestErr(err, 'KPI数据获取失败')
                props.executeKPIData.toggleLoad(false)
            } ,
        };
        request(opt);
    })
    //高亮方案并获取航班数据
    const handleActive = useCallback(( id ) => {
        props.schemeListData.toggleSchemeActive( id+"" );
        props.flightTableData.toggleLoad(true)
        requestFlightTableData(id+"");
        debugger
        requestExecuteKPIData(id+"");

    })

    const schemeListData = props.schemeListData;

    const { sortedList } = schemeListData;
    const toggleModalVisible = useCallback(( flag, id )=>{
        setVisible(flag);
        setModalId(id);
    })
    const  length = sortedList.length;
    return (
        <div className="list_container">
            <div className="manual_refresh">
                <SyncOutlined spin={manualRefresh}  onClick={()=>{
                    setManualRefresh(true);
                    getSchemeList();
                }}/>
            </div>
            {
                (length > 0) ?
                    sortedList.map( (item, index) => (
                    <SchemeItem
                        item={item}
                        handleActive={handleActive}
                        key={index}
                        toggleModalVisible={toggleModalVisible}
                    >
                    </SchemeItem>
                    )
                ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} imageStyle={{ color:"#fff"}} />

            }
            <SchemeModal visible={visible} setVisible={setVisible} modalId={modalId} />
        </div>
    )
 }


export default inject("schemeListData","flightTableData")(observer(SchemeList))