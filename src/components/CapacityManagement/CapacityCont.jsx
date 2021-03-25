/*
 * @Author: your name
 * @Date: 2021-01-26 16:36:46
 * @LastEditTime: 2021-03-24 17:53:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\CapacityManagement\CapacityCont.jsx
 */
import React, { useEffect, useCallback, useRef, useState, useMemo } from 'react'
import { Menu } from 'antd';
import {
    CalendarOutlined
  } from '@ant-design/icons';
import {inject, observer} from 'mobx-react'
import { requestGet, request } from 'utils/request'
import { ReqUrls } from 'utils/request-urls'
import ModalBox from 'components/ModalBox/ModalBox'
import { isValidVariable, getFullTime, formatTimeString } from 'utils/basic-verify'
import CapacityTable from './CapacityTable';
import DynamicWorkSteps from './DynamicWorkSteps';
import { customNotice } from 'utils/common-funcs'
import "./CapacityCont.scss"

const { SubMenu } = Menu;

//容量管理内容页
function CapacityCont (props){
    const { capacity, pane, systemPage } = props;
    const dateRange = capacity.dateRange;
    const elementName = pane.key || "";
    const elementType = pane.type || "";
    const firId = pane.firId || "";
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
                firId: firId,
                elementType
            },
            resFunc: (data)=> {
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
        let userObj = systemPage.user || "";
        if( !isValidVariable(userObj.username) ){
            return;
        }
        const timerFunc = function(){
            if(nextRefresh){
                dynamicTimer.current = setTimeout( function(){
                    requestDynamicData(nextRefresh)
                }, 30*1000)
            }
        }
        
        let date = capacity.getDate();
        const opt = {
            url: ReqUrls.capacityBaseUrl+ "dynamic/retrieveCapacityDynamic/" + userObj.username,
            // url: ReqUrls.capacityBaseUrl+ "dynamic/retrieveCapacityDynamic",
            method:'POST',
            params:{
                date,
                elementName,
                routeName: "",
                firId: firId,
                elementType
            },
            resFunc: (data)=> {
                const { capacityMap, generateTime, authMap } = data;
                props.capacity.setDynamicData( capacityMap[elementName], generateTime, authMap );
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
        const user = localStorage.getItem("user");
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
                        <div className="filter_menu">
                            <Menu
                                selectedKeys = {[capacity.dateRange+""]}
                                defaultOpenKeys={['date']}
                                mode="inline"
                                theme="dark"
                                onClick={({ item, key, keyPath, selectedKeys, domEvent })=>{
                                    if( !capacity.editable){
                                        capacity.dateRange =  key*1;
                                        //获取数据
                                        requestDynamicData( false );
                                    }else{
                                        customNotice({
                                            type: 'warn',
                                            message: '容量处于编辑状态，请取消后再操作'
                                        });
                                    }
                                }
                                    
                                }
                                // inlineCollapsed={this.state.collapsed}
                            >
                                <SubMenu key="date" icon={<CalendarOutlined />} title="日期">
                                    <Menu.Item key="-1">昨日</Menu.Item>
                                    <Menu.Item key="0">今日</Menu.Item>
                                    <Menu.Item key="1">明日</Menu.Item>
                                </SubMenu>
                            </Menu>
                        </div>
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