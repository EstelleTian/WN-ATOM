/*
 * @Author: your name
 * @Date: 2021-01-26 16:36:46
 * @LastEditTime: 2021-03-31 10:29:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\CapacityManagement\CapacityCont.jsx
 */
import React, { useEffect, useCallback, useRef, useState, useMemo } from 'react'
import { Menu } from 'antd';
import {
    BranchesOutlined
  } from '@ant-design/icons';
import {inject, observer} from 'mobx-react'
import { requestGet, request } from 'utils/request'
import { ReqUrls } from 'utils/request-urls'
import { isValidVariable, getFullTime, formatTimeString } from 'utils/basic-verify'
import { customNotice } from 'utils/common-funcs'
import "./CapacityCont.scss"

const { SubMenu } = Menu;

//容量管理内容页
function RouteMenu (props){
    const { capacity, elementName, elementType  } = props;
    const { routeList } = capacity;
    //航路段获取
    const requestRouteGroup = useCallback(() => {
        const opt = {
            url: ReqUrls.capacityBaseUrl+ "dynamic/retrieveRoutElementName/" + elementName,
            method:'GET',
            resFunc: (data)=> {
                const { routeElementNameList = [] } = data;
                props.capacity.setRouteList( routeElementNameList );
                if( props.capacity.selRoute === "" && routeElementNameList.length > 0  ){
                    console.log(routeElementNameList[0])
                    props.capacity.setSelRoute( routeElementNameList[0] );
                }
                
                
            },
            errFunc: (err)=> {
                customNotice({
                    type: 'error',
                    message: '航路段数据获取失败'
                });
            } ,
        };

        requestGet(opt);

    },[]);
    
    useEffect( function(){
        if( isValidVariable(elementType)  && elementType === "ROUTE" && isValidVariable(elementName) ){
            //获取航路段
            requestRouteGroup();
        }
    }, [elementName]);

    return (
        <Menu
            selectedKeys = {[ capacity.selRoute + "" ]}
            defaultOpenKeys={['routeGroup']}
            mode="inline"
            theme="dark"
            onClick={({ item, key, keyPath, selectedKeys, domEvent })=>{
                if( !capacity.editable){
                    capacity.setSelRoute(key);
                }else{
                    customNotice({
                        type: 'warn',
                        message: '容量处于编辑状态，请取消后再操作'
                    });
                }
            }}
        >
            <SubMenu  
                key="routeGroup"
                icon={<BranchesOutlined />} 
                title="航路段"
                className="route_group_menu"
            >
                {
                    routeList.map( route => {
                        return <Menu.Item key={route} key={route} >{route}</Menu.Item>
                    })
                }
            </SubMenu>
        </Menu>    
    )
}

export default inject( "capacity" )(observer(RouteMenu));