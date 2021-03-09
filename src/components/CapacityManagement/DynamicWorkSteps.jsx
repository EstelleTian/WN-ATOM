/*
 * @Author: your name
 * @Date: 2021-01-26 14:17:55
 * @LastEditTime: 2021-03-09 14:38:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\CapacityManagement\CapacityTabs.jsx
 */

import React, {useState, useEffect, useCallback, useRef, useMemo} from 'react'
import {inject, observer} from 'mobx-react'
import { Steps, Spin,Button } from 'antd';
import { requestGet, request } from 'utils/request'
import { isValidVariable, formatTimeString } from 'utils/basic-verify'
import { ReqUrls } from 'utils/request-urls'
import { customNotice } from 'utils/common-funcs'
import ModalBox from 'components/ModalBox/ModalBox'
import './DynamicWorkSteps.scss'
import { clearTimeout } from 'highcharts';
const { Step } = Steps;

const WStep = (props) =>{
    const { task = {}, user = {} } = props;
    const { name = '', } = task;
    const taskLocalVariables = task.taskLocalVariables || {};
    const agree = taskLocalVariables.agree || "";
    const userNameCn = taskLocalVariables.userNameCn || "";
    // <Step title={name} description={userNameCn} />
    return (
        <Step title="Finished" description="This is a description." />
    )
}
const Wstep = inject("capacity")(observer(WStep));
function stepsList (props){
    const {  user = {}, hisInstance ={}, hisTasks =[], generateTime="" } = props;

    return ( 
        <div className="work_cont">
            <div>流水号:{ hisInstance.id || ""}({formatTimeString(generateTime)})</div>
            <Steps direction="vertical" current={ hisTasks.length - 1}>
            {
                    hisTasks.map( task => {
                        return  <Wstep key={task.id} task={task} />
                    }
                    )
                }
                {
                    hisTasks.map( task => {
                        let { name = '', } = task;
                        if( name === "" ){
                            name = task.assigneeName || "";
                        }
                        const taskLocalVariables = task.taskLocalVariables || {};
                        const agree = taskLocalVariables.agree;
                        const comments = taskLocalVariables.comments || "";
                        let resCn = "";
                        if( agree === undefined ){
                            resCn = comments;
                        }else if( agree === true ){
                            resCn = "同意"
                        }else if( agree === false ){
                            resCn = "拒绝"
                        }
                        const userNameCn = taskLocalVariables.userNameCn || "";
                        return  <Step key={task.id} title={name} subTitle = {resCn} description={userNameCn} />
                    }
                    )
                }
            </Steps>

        </div>
)
}
const StepsList = inject("capacity")(observer(stepsList));

//容量管理-工作流详情
function DynamicWorkSteps (props){
    const {  pane = {} } = props;
    const user = props.systemPage.user || {};
    const username = user.username || "";
    const [ loading, setLoading ] = useState(false);
    const [ dataLoaded, setDataLoaded ] = useState(false);
    const timer = useRef();
    
    const { hisInstance ={}, hisTasks =[], generateTime="" } = useMemo( ()=> {
        const taskMap = props.capacity.dynamicWorkFlowData.taskMap || {};
        const generateTime = props.capacity.dynamicWorkFlowData.generateTime || {};
        const values = Object.values(taskMap) || [];
        if( values.length > 0 ){
            const taskObj = values[0] || {};
            const hisTasks = taskObj.hisTasks || [];
            const hisInstance = taskObj.hisInstance || [];
            console.log(hisTasks)
            return  { hisInstance, hisTasks, generateTime };
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
                timerFunc();
            },
            errFunc: (err)=> {
                customNotice({
                    type: 'error',
                    message: '动态容量工作流数据获取失败'
                });
                setDataLoaded(false);
                setLoading(false);
                timerFunc();
            } ,
        };

        if( !dataLoaded ){
            setDataLoaded(true);
            request(opt);
        }
       

    },[username]);

    //处理 操作 同意/拒绝
    const sendResultRequest = ( type,  setLoad) => {
        if( !isValidVariable(userId) ){
            return;
        }
        const taskId = dahisInstancetaObj.taskId || ""; //流水号
        
        let url = "";
        let params = {
            username,
            businessKey, //流程id
            taskId,  //任务id
        }
        let title = "动态容量调整";
        if(type === "agree"){
            //容量审核同意
            url = ReqUrls.capacityBaseUrl + "simulationTactics/approve";
        }else if(type === "refuse"){
            //容量审核拒绝
            url = ReqUrls.capacityBaseUrl + "simulationTactics/refuse";
        }
        if( isValidVariable(url) ){
            const opt = {
                url,
                method: 'POST',
                params: params,
                resFunc: (data)=> {
                    requestSuccess(data, title + '成功', key)
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
            // requestDynamicWorkFlowData( true );
            requestDynamicWorkFlowData( false );
        }
        return ()=>{
            clearTimeout(timer.current);
            timer.current = null;
        }
    }, [username]);

    return <div className="dynamic_workflow">
        {
            hisTasks.length > 0 &&
            (
                <ModalBox
                    title="工作流详情"
                    showDecorator = {true}
                    className="static_cap_modal"
                >
                    <Spin spinning={loading} >
                        <StepsList user={user} hisTasks={hisTasks} generateTime={generateTime} hisInstance={hisInstance}/>
                        <div className="btn_opts">
                            <OptionBtn  type="agree" text="同意" callback = {
                                (setLoad)=>{ 
                                    sendResultRequest("agree", setLoad) 
                                }
                            } />
                            <OptionBtn type="refuse"  text="拒绝" callback = {
                                (setLoad)=>{ 
                                    sendResultRequest("refuse", setLoad) 
                                }
                            } />
                        </div>
                    </Spin>
                </ModalBox>
            )
        }
    </div>
}

export default inject("capacity","systemPage")(observer(DynamicWorkSteps));