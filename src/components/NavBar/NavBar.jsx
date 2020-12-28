/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2020-12-22 18:35:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\components\NavBar\NavBar.jsx
 */
import React, {useEffect} from 'react'
import { inject, observer } from 'mobx-react'
import { Layout, Badge, Avatar } from 'antd'
import { BellOutlined, UserOutlined } from '@ant-design/icons'
import Stomp from "stompjs";
import { openMessageDlg } from 'utils/client.js'
import './NavBar.scss'

const { Header } = Layout

//顶部导航模块

function NavBar(props){
    const stompClient = () => {
        console.log("建立连接");
        // 建立连接
        let ws = new WebSocket('ws://192.168.210.150:15674/ws');
        let stompClient = Stomp.over(ws)
        stompClient.heartbeat.outgoing = 200;
        stompClient.heartbeat.incoming = 0;
        stompClient.debug = null;

        let on_connect = function (x) {
            console.log("WebSocket连接成功:");
            console.log(x);
            //收到限制消息
            stompClient.subscribe("/exchange/EXCHANGE.EVENT_CENTER_OUTEXCHANGE" , function (d) {
                //收到消息
                // console.log("WebSocket收到消息:");
                // console.log(d.body);
                const body = d.body;
                const msgObj = JSON.parse(body);
                const { message } = msgObj;
                props.newsList.addNews(message);
            })
        }

        let on_error = function (error) {
            console.log("WebSocket连接失败:");
            console.log(error);
        }
        // 连接消息服务器
        stompClient.connect('guest', 'guest', on_connect, on_error, '/');

    }
    useEffect(function(){
        stompClient();
    }, [])
    const openMsg = () => {
        openMessageDlg();
        props.newsList.emptyNews();
    }
    const { newsList, username, title } = props;
    const { list } = newsList;
    let newsLen = list.length;
    return (
        <Header className="nav_header">
            <span>{title}</span>
            <div className="nav_right">
                {
                    ( newsLen <= 0 )
                        ? <BellOutlined className="bell_icon" style={{"fontSize": "20px"}} onClick = {openMsg} />
                        : <Badge count={ newsLen }>
                            <BellOutlined className="bell_icon" style={{"fontSize": "20px"}}  onClick = {openMsg}/>
                        </Badge>
                }
                <Avatar className="user_icon" icon={<UserOutlined />} />
                <span className="user_name">{ username }</span>
            </div>
        </Header>
    )
}


export default inject("newsList")(observer(NavBar));



