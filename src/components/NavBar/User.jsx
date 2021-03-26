/*
 * @Author: your name
 * @Date: 2021-01-12 14:15:12
 * @LastEditTime: 2021-03-26 09:03:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\NavBar\User.jsx
 */
import React, { useEffect }  from "react";
import {  Dropdown, Menu, } from "antd";
import { PoweroffOutlined, SettingOutlined} from "@ant-design/icons";
import {observer, inject} from "mobx-react";
import {withRouter} from "react-router-dom";
import {isValidVariable} from "utils/basic-verify";
import Stomp from 'stompjs'

const menu = (
    <Menu >
        <Menu.Item key="1">
            <SettingOutlined />修改密码
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="2">
            <PoweroffOutlined />
            退出登录
        </Menu.Item>
            
    </Menu>
);
function User(props){
    const { location, systemPage } = props;
    const user = systemPage.user || {};
    const username = user.name || "";
    const descriptionCN = user.descriptionCN || "";
    const pathname = location.pathname || "";

    const stompClientFunc = ( username = "" ) => {
        console.log("建立连接  ", username);
        if( !isValidVariable(username) ){
            return;
        }
        // alert("建立连接:" + username);
        console.log("建立连接");
        // 建立连接
        let ws = new WebSocket('ws://192.168.210.150:15674/ws');
        let stompClient = Stomp.over(ws)
        stompClient.heartbeat.outgoing = 200;
        stompClient.heartbeat.incoming = 0;
        stompClient.debug = null;

        let on_connect = function (x) {
            console.log("放行监控 WebSocket连接成功:");
            // console.log(x);
            //收到限制消息
            const topic1 = "/exchange/EXCHANGE.EVENT_CENTER_TRAFFIC_FLOW_CHANGE";
            stompClient.subscribe( topic1, function (d) {
                //收到消息
                console.log("放行监控 WebSocket收到消息:"+d);
                props.flightTableData.setForceUpdate(true);
            })
        }

        let on_error = function (error) {
            console.log("放行监控 WebSocket连接失败:");
            console.log(error);
            setTimeout(function(){
                stompClientFunc(username);
            }, 5000)
            
        }
        // 连接消息服务器
        stompClient.connect('guest', 'guest', on_connect, on_error, '/');
    }
    
    useEffect(function(){
        const user = localStorage.getItem("user");
        
        if( isValidVariable(user) ){
            props.systemPage.setUserData( JSON.parse(user) );
            if( pathname === "/fangxing" ){
                stompClientFunc(JSON.parse(user).username)
            }
            
        }
        else{
            // props.history.push('/')
        }
    }, []);
    //放行监控页面
    if( pathname === "/fangxing" ){
        if( isValidVariable(user.id) ){
            // return (
            //     <Dropdown overlay={menu} placement="bottomCenter" arrow>
            //         <span  className="user-name">{ descriptionCN }</span>
            //     </Dropdown>
            // )
            return (
                <span  className="user-name">{ descriptionCN }</span>
            )
        }else{
            return (
                <span  className="user-name">{ descriptionCN }</span>
            )
        }

    }else{
        return (
            <span className="user_name">{ descriptionCN }</span>
        )
    }

}

export  default  withRouter(inject("systemPage", "flightTableData")( observer( User)));