/*
 * @Author: your name
 * @Date: 2021-01-26 16:36:46
 * @LastEditTime: 2021-03-15 17:35:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\CapacityManagement\CapacityCont.jsx
 */
import React, { useEffect, useCallback, useRef} from 'react'
import {inject, observer} from 'mobx-react'
import { requestGet, request } from 'utils/request'
import { ReqUrls } from 'utils/request-urls'
import ModalBox from 'components/ModalBox/ModalBox'
import { isValidVariable, getFullTime, formatTimeString } from 'utils/basic-verify'
import CapacityTable from './CapacityTable';
import DynamicWorkSteps from './DynamicWorkSteps';
import { customNotice } from 'utils/common-funcs'
import "./CapacityCont.scss"

//容量管理内容页
function CapacityCont (props){
    const { capacity, pane } = props;
    const elementName = pane.key || "";
    const elementType = pane.type || "";
    let user;
    let staticTimer = useRef();
    let dynamicTimer = useRef();
    const generateTime = capacity.dynamicDataGenerateTime || "";
    
    const requestStaticData = useCallback(() => {
        if( !isValidVariable(elementName) || !isValidVariable(elementType) ){
            return;
        }
        const timerFunc = function(){
            if(nextRefresh){
                
                staticTimer.current = setTimeout( function(){
                    requestStaticData(nextRefresh)
                }, 30*1000)
                
            }
        }
        const opt = {
            url: ReqUrls.capacityBaseUrl+ "static/retrieveCapacityStatic" ,
            method:'POST',
            params:{
                date: getFullTime( new Date(), 4),
                elementName,
                routeName: "",
                firId: "",
                elementType
            },
            resFunc: (data)=> {
                // console.log(data);
                const { capacityMap, generateTime } = data;
                props.capacity.setStaticData( capacityMap[elementName] );
                timerFunc();
            },
            errFunc: (err)=> {
                customNotice({
                    type: 'error',
                    message: '静态容量数据获取失败'
                });
                timerFunc();
            } ,
        };

        request(opt);

    },[]);

    const requestDynamicData = useCallback((nextRefresh) => {
        if( !isValidVariable(elementName) || !isValidVariable(elementType) ){
            return;
        }
        if( !isValidVariable(user) ){
            return;
        }
        const timerFunc = function(){
            if(nextRefresh){
                dynamicTimer.current = setTimeout( function(){
                    requestDynamicData(nextRefresh)
                }, 30*1000)
                // console.log("dynamicTimer.current:"+dynamicTimer.current)
            }
        }
        let userObj = JSON.parse(user);
        const opt = {
            url: ReqUrls.capacityBaseUrl+ "dynamic/retrieveCapacityDynamic/" + userObj.username,
            // url: ReqUrls.capacityBaseUrl+ "dynamic/retrieveCapacityDynamic",
            method:'POST',
            params:{
                date: getFullTime( new Date(), 4),
                elementName,
                routeName: "",
                firId: "",
                elementType
            },
            resFunc: (data)=> {
                // console.log(data);
                const { capacityMap, generateTime } = data;
                props.capacity.setDynamicData( capacityMap[elementName], generateTime );
                if( props.capacity.forceUpdateDynamicData ){
                    //获取数据
                    props.capacity.forceUpdateDynamicData = false;
                }
                timerFunc();
            },
            errFunc: (err)=> {
                customNotice({
                    type: 'error',
                    message: '动态容量数据获取失败'
                });
                if( props.capacity.forceUpdateDynamicData ){
                    //获取数据
                    props.capacity.forceUpdateDynamicData = false;
                }
                timerFunc();
            } ,
        };

        request(opt);

    },[]);
    
    //用户信息获取
    useEffect(function(){
        user = localStorage.getItem("user");
        if( isValidVariable(user) ){
            props.systemPage.setUserData( JSON.parse(user) );
            if( isValidVariable(props.systemPage.user.id) ){
                //获取数据
                // requestStaticData(true);
                requestDynamicData(true);
               }
        }else{
            alert("请先登录");
        }
    }, []);

    useEffect( function(){
        return ()=>{
            console.log("卸载")
            clearTimeout(staticTimer.current);
            staticTimer.current = "";
            clearTimeout(dynamicTimer.current);
            dynamicTimer.current = "";
        }
    }, []);

    useEffect( function(){
        if( props.capacity.forceUpdateDynamicData ){
            //获取数据
            requestDynamicData( false );
        }
    }, [ props.capacity.forceUpdateDynamicData ]);


    return (
            <div style={{ overflowX: 'auto'}}>
                <div className="cap_set_canvas">
                    <div className="set_top">
                        {/* <div className="left_wrapper">
                            <ModalBox
                                title="静态容量——默认配置"
                                style={{
                                    height: 140
                                }}
                                showDecorator = {true}
                                className="static_cap_modal"
                            >
                                <CapacityTable type="line1" kind="default"/>
                            </ModalBox>
                           <ModalBox
                                title="静态容量——时段配置"
                                showDecorator = {true}
                                className="static_cap_modal static_cap_modal_24 modal_static"
                            >
                                <CapacityTable  type="line24" kind="static"/>
                            </ModalBox>
                        </div> */}
                        <div className="right_wrapper">
                            <ModalBox
                                title={`动态容量——时段配置(${formatTimeString(generateTime)})`}
                                showDecorator = {true}
                                className="static_cap_modal static_cap_modal_24 modal_dynamic"
                            >
                                <CapacityTable type="line24" kind="dynamic" airportName={pane.key} paneType={pane.type} />

                            </ModalBox>
                            <DynamicWorkSteps pane={pane}></DynamicWorkSteps>  
                        </div>
                        
                                   
                    </div>
                </div>
            </div>
        
    )
}

export default inject( "capacity", "systemPage" )(observer(CapacityCont));