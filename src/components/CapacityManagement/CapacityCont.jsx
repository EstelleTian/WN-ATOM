/*
 * @Author: your name
 * @Date: 2021-01-26 16:36:46
 * @LastEditTime: 2021-03-10 16:06:24
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
    let user;
    let staticTimer = useRef();
    let dynamicTimer = useRef();
    const generateTime = capacity.dynamicDataGenerateTime || "";
    
    const requestStaticData = useCallback(() => {
        const type = pane.type.toUpperCase(); //类型
        const airportName = pane.key;//机场名称
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
                elementName: airportName,
                routeName: "",
                firId: "",
                elementType: type
            },
            resFunc: (data)=> {
                // console.log(data);
                const { capacityMap, generateTime } = data;
                props.capacity.setStaticData( capacityMap[airportName] );
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
        const type = pane.type.toUpperCase();
        const airportName = pane.key;
        const timerFunc = function(){
            if(nextRefresh){
                dynamicTimer.current = setTimeout( function(){
                    requestDynamicData(nextRefresh)
                }, 30*1000)
            }
        }
        const opt = {
            url: ReqUrls.capacityBaseUrl+ "dynamic/retrieveCapacityDynamic",
            method:'POST',
            params:{
                date: getFullTime( new Date(), 4),
                elementName: airportName,
                routeName: "",
                firId: "",
                elementType: type
            },
            resFunc: (data)=> {
                // console.log(data);
                const { capacityMap, generateTime } = data;
                props.capacity.setDynamicData( capacityMap[airportName], generateTime );
                timerFunc();
            },
            errFunc: (err)=> {
                customNotice({
                    type: 'error',
                    message: '动态容量数据获取失败'
                });
                timerFunc();
            } ,
        };

        request(opt);

    },[])
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
                                <CapacityTable  type="line24" kind="dynamic" airportName={pane.key}/>

                            </ModalBox>
                            <DynamicWorkSteps pane={pane}></DynamicWorkSteps>  
                        </div>
                        
                                   
                    </div>
                </div>
            </div>
        
    )
}

export default inject( "capacity", "systemPage" )(observer(CapacityCont));