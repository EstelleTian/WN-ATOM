/*
 * @Author: your name
 * @Date: 2021-01-12 14:15:12
 * @LastEditTime: 2021-04-07 15:58:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\NavBar\Topic.jsx
 */
import React, { useEffect }  from "react";
import {observer, inject} from "mobx-react";
import {withRouter} from "react-router-dom";
import {isValidVariable} from "utils/basic-verify";
import Stomp from 'stompjs'


function Topic(props){
    const { location } = props;

    const pathname = location.pathname || "";
    const user = localStorage.getItem("user");
    const stompClientFunc = ( username = "" ) => {
        console.log("建立连接  ", username);
        if( !isValidVariable(username) ){
            return;
        }
        // alert("建立连接:" + username);
        // console.log("建立连接");
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
                console.log("收到FLOW_CHANGE消息:"+d);
                console.timeEnd("cod");
                props.flightTableData.setForceUpdate(true);
                props.todoList.setForceUpdate(true);
                props.myApplicationList.setForceUpdate(true);
            })

            const topic2 = "/exchange/EXCHANGE.EVENT_CENTER_OUTEXCHANGE_"+username;
            stompClient.subscribe( topic2, function (d) {
                //收到消息
                // console.log(topic2 + "  WebSocket收到消息:");
                // console.log(d.body);
                const body = d.body;
                const msgObj = JSON.parse(body);
                const { message } = msgObj;
                //工作流类别消息，不显示
                message.map( msg => {
                    if( "FCDM" !== msg.dataType ){
                        console.log("收到OUTEXCHANGE消息:");
                        console.timeEnd("cod");
                        props.flightTableData.setForceUpdate(true);
                        props.todoList.setForceUpdate(true);
                        props.myApplicationList.setForceUpdate(true);
                    }
                } )
                
                
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
    if( isValidVariable(user) ){
        if( pathname === "/fangxing" ){
            const userObj = JSON.parse(user)
            stompClientFunc(userObj.username);
        }
    }


    
    
    return ("")

}

export  default  withRouter(inject("flightTableData", "todoList", "myApplicationList")( observer( Topic )));
