/*
 * @Author: your name
 * @Date: 2021-01-26 14:17:55
 * @LastEditTime: 2021-03-23 09:06:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\CapacityManagement\CapacityTabs.jsx
 */

import React, {useState, useEffect, useCallback, useRef, useMemo} from 'react'
import {inject, observer} from 'mobx-react'
import { ClockCircleOutlined } from '@ant-design/icons'
import { Steps, Spin, Button, Collapse  } from 'antd';
import { requestGet, request } from 'utils/request'
import { getFullTime,isValidVariable, formatTimeString } from 'utils/basic-verify'
import { ReqUrls } from 'utils/request-urls'
import { customNotice } from 'utils/common-funcs'
import ModalBox from 'components/ModalBox/ModalBox'
import { OptionBtn } from "components/Common/OptionBtn";
import './DynamicWorkSteps.scss'
import { clearTimeout } from 'highcharts';
const { Step } = Steps;
const { Panel } = Collapse;

function stepsList (props){
    const {  user = {}, hisInstance ={}, hisTasks =[], generateTime="" } = props;

    return ( 
        <div className="work_cont">
            {/* <div style={{margin: '0 0 10px 0'}}>流水号:{ hisInstance.id || ""}</div> */}
            <Steps direction="vertical" current={ hisTasks.length - 1}>
                {
                    hisTasks.map( task => {
                        let { name = '', } = task;
                        if( name === "" ){
                            name = task.assigneeName || "";
                        }
                        let endTime = task.endTime || "";
                        endTime = isValidVariable(endTime) ? getFullTime(new Date(endTime), 1) : ""
                        const taskLocalVariables = task.taskLocalVariables || {};
                        const processVariables = task.processVariables || {};
                        const agree = taskLocalVariables.agree;
                        const comments = taskLocalVariables.comments || "";
                        // const comment = processVariables.comment || "";
                        let resCn = "";
                        if( agree === undefined && comments != "" ){
                            resCn = (<span style={{color: '#ffffff', padding: '0 3px', backgroundColor: 'green'}}>{comments}</span>);
                        }else if( agree === true ){
                            resCn = (<span style={{color: '#ffffff', padding: '0 3px', backgroundColor: 'green'}}>同意</span>);
                        }else if( agree === false ){
                            resCn = (<span style={{color: '#ffffff', padding: '0 3px', backgroundColor: '#ec4747'}}>拒绝</span>);
                        }
                        const userNameCn = taskLocalVariables.userNameCn || "";
                        let desDom = (<div>
                            <div>{userNameCn} { endTime !== "" && `(${endTime})` } </div>
                            <div> { comments != "" && `原因: ${ comments } ` }</div>
                            </div>
                        )
                        return  <Step key={task.id} icon={ endTime ==="" ?  <ClockCircleOutlined style={{ fontSize: '34px'}} /> : "" } title={name} subTitle = {resCn} description={desDom} />
                    })
                }
            </Steps>

        </div>
)
}
const StepsList = inject("capacity")(observer(stepsList));

//折叠面板
const StepCollapse = function(props){
    const text = `
    A dog is a type of domesticated animal.
    Known for its loyalty and faithfulness,
    it can be found as a welcome guest in many households across the world.
  `;
    return (
        <Collapse accordion>
            <Panel header="This is panel header 1" key="1">
            <p>{text}</p>
            </Panel>
            <Panel header="This is panel header 2" key="2">
            <p>{text}</p>
            </Panel>
            <Panel header="This is panel header 3" key="3">
            <p>{text}</p>
            </Panel>
        </Collapse>
    )
}



//容量管理-工作流详情
function DynamicWorkSteps (props){
    const {  pane = {} } = props;
    const user = props.systemPage.user || {};
    const username = user.username || "";
    const [ loading, setLoading ] = useState(false);
    const [ dataLoaded, setDataLoaded ] = useState(false);
    const timer = useRef();
    
    const { hisInstance ={}, hisTasks =[], generateTime="", authMap={} } = useMemo( ()=> {
        const taskMap = props.capacity.dynamicWorkFlowData.taskMap || {};
        const generateTime = props.capacity.dynamicWorkFlowData.generateTime || {};
        const values = Object.values(taskMap) || [];
        if( values.length > 0 ){
            const taskObj = values[values.length-1] || {};
            const hisTasks = taskObj.hisTasks || [];
            const hisInstance = taskObj.hisInstance || [];
            const authMap = taskObj.authMap || {};
            return  { hisInstance, hisTasks, generateTime, authMap };
        }
        return [];
    }, [props.capacity.dynamicWorkFlowData])
    
    const requestDynamicWorkFlowData = useCallback(( nextRefresh ) => {
        const type = pane.type.toUpperCase();
        const airportName = pane.key;
        const timerFunc = function(){
            if(nextRefresh){
                timer.current = setTimeout( function(){
                    requestDynamicWorkFlowData(nextRefresh)
                }, 30*1000)
            }
        }
        const opt = {
            url: ReqUrls.capacityBaseUrl+ "simulationTactics/retrieveSchemeFlows/"+ username,
            method: 'POST',
            params:{
                "date": "",
                "elementName": airportName,
                "routeName":"",
                "firId":"",
                "elementType": type
                    
                },
            resFunc: (data)=> {
                props.capacity.updateDynamicWorkFlowData( data );
                setDataLoaded(false);
                setLoading(false);
                if( props.capacity.forceUpdateDynamicWorkFlowData ){
                    props.capacity.forceUpdateDynamicWorkFlowData = false;
                }
                timerFunc();
            },
            errFunc: (err)=> {
                customNotice({
                    type: 'error',
                    message: '动态容量工作流数据获取失败'
                });
                setDataLoaded(false);
                setLoading(false);
                if( props.capacity.forceUpdateDynamicWorkFlowData ){
                    props.capacity.forceUpdateDynamicWorkFlowData = false;
                }
                timerFunc();
            } ,
        };

        if( !dataLoaded ){
            setDataLoaded(true);
            request(opt);
        }
       

    },[username]);

    //请求错误处理
    const requestErr = useCallback((err, content) => {
        customNotice({
            type: "error",
            message: content,
        });
    },[]);
    //数据提交成功回调
    const requestSuccess = useCallback( ( data, content, key ) => {
        console.log("协调成功：",data);
        //重新请求数据
        requestDynamicWorkFlowData( false );

        customNotice({
            type: 'success',
            message: content,
            duration: 8
        });

    });
    
    //处理 操作 同意/拒绝
    const sendResultRequest = ( type,  setLoad) => {
        if( !isValidVariable(username) ){
            return;
        }
        const len = hisTasks.length;
        let taskId = ""
        if( len > 1 ){
            taskId = hisTasks[len-1].id || "";
        }
        const businessKey = hisInstance.businessKey || ""; //流程id
        
        let url = "";
        let params = {
            businessKey, //流程id
            taskId,  //任务id
        }
        let title = "动态容量调整";
        if(type === "agree"){
            //容量审核同意
            url = ReqUrls.capacityBaseUrl + "simulationTactics/approve/"+username;
        }else if(type === "refuse"){
            //容量审核拒绝
            url = ReqUrls.capacityBaseUrl + "simulationTactics/refuse/"+username;
        }
        if( isValidVariable(url) ){
            const opt = {
                url,
                method: 'POST',
                params: params,
                resFunc: (data)=> {
                    requestSuccess(data, title + '成功')
                    setLoad(false);
                },
                errFunc: (err)=> {
                    if( isValidVariable(err) ){
                        requestErr(err, err )
                    }else{
                        requestErr(err, title + '失败' )
                    }
                    setLoad(false);
                },
            };
            request(opt);
            
        }
        

    }

    useEffect( function(){
        if( username !== ""){
            setLoading(true);
            //获取数据
            requestDynamicWorkFlowData( true );
        }
        return ()=>{
            clearTimeout(timer.current);
            timer.current = null;
        }
    }, [username]);

    useEffect( function(){
        if( props.capacity.forceUpdateDynamicWorkFlowData){
            setLoading(true);
            //获取数据
            requestDynamicWorkFlowData( false );
        }
    }, [props.capacity.forceUpdateDynamicWorkFlowData]);

    useEffect( function(){
        return ()=>{
            clearTimeout(timer.current);
            timer.current = "";
        }
    }, []);

    return <div className="dynamic_workflow">
        {
            hisTasks.length > 0 &&
            (
                <ModalBox
                    title={`待办工作流(${formatTimeString(generateTime)})`}
                    showDecorator = {false}
                    className="static_cap_modal"
                >
                    <Spin spinning={loading} >
                        <StepsList user={user} hisTasks={hisTasks} generateTime={generateTime} hisInstance={hisInstance}/>
                        <div className="btn_opts">
                            {/* {
                                authMap.AGREE && <OptionBtn  type="agree" text="同意" callback = {
                                    (setLoad)=>{ 
                                        sendResultRequest("agree", setLoad) 
                                    }
                                } />
                            }
                            {
                                authMap.REFUSE && <OptionBtn type="refuse"  text="拒绝" callback = {
                                    (setLoad)=>{ 
                                        sendResultRequest("refuse", setLoad) 
                                    }
                                } />
                            } */}
                            {
                                authMap.CONFIRM && <OptionBtn type="agree"  text="确认" callback = {
                                    (setLoad)=>{ 
                                        sendResultRequest("agree", setLoad) 
                                    }
                                } />
                            }
                            
                            
                        </div>
                    </Spin>
                </ModalBox>
            )
        }
    </div>
}

export default inject("capacity","systemPage")(observer(DynamicWorkSteps));