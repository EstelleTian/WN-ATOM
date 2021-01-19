import {Badge, Button } from "antd";
import {BellOutlined} from "@ant-design/icons";
import React, {useEffect} from "react";
import {inject, observer} from "mobx-react";
import { openMessageDlg } from 'utils/client.js'
import {  isValidVariable  } from 'utils/basic-verify'
import Stomp from "stompjs";

function NavBellNews(props){

    const stompClient = ( username = "" ) => {
        if( !isValidVariable(username) ){
            return;
        }
        // 建立连接
        let ws = new WebSocket('ws://192.168.210.150:15674/ws');
        let stompClient = Stomp.over(ws)
        stompClient.heartbeat.outgoing = 200;
        stompClient.heartbeat.incoming = 0;
        stompClient.debug = null;
        let on_connect = function (x) {
            console.log("WebSocket连接成功:");
            //收到限制消息
            const topic1 = "/exchange/EXCHANGE.EVENT_CENTER_OUTEXCHANGE_"+username;
            stompClient.subscribe( topic1, function (d) {
                //收到消息
                console.log("WebSocket收到消息:");
                console.log(d.body);
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
    const openMsg = () => {
        openMessageDlg();
        // props.newsList.emptyNews();
    }
    const  add =() => {
        const id = new Date().getTime();
        const msgObj = {
            "message":[
                {"id":1607,"timestamp":"Jan 5, 2021 8:11:14 PM","generateTime":"20210105201114","sendTime":"20210105201119","name":"外区流控信息","content":"过P62进郑州区域20分钟一架 新增 发布单位：ZHHH 2021-01-05 19:00-2021-01-05 23:00","data":"{\"id\":2460918,\"sourceId\":\"547787\",\"source\":\"ATOM\",\"sourceType\":\"MIT\",\"sourceStatus\":\"ADD\",\"content\":\"过P62进郑州区域20分钟一架\",\"publishUnit\":\"ZHCC\",\"publishTime\":\"202101051730\",\"startTime\":\"202101051900\",\"endTime\":\"202101052300\"}","dataCode":"AFAO","dataType":"FTMI","level":"NOTICE","source":"ATOM"},
                // {"id":1618,"timestamp":"Jan 5, 2021 8:22:14 PM","generateTime":"20210105202214","sendTime":"20210105202219","name":"外区流控信息","content":"过P62进郑州区域10分钟一架 修改  发布单位：ZHCC 2021-01-05 19:00-2021-01-05 23:00","data":"{\"id\":2460923,\"formerId\":2460922,\"tacticId\":\"519b4432-a7ba-4915-a934-e39c3dfb6911\",\"sourceId\":\"2554478\",\"source\":\"ATOM\",\"sourceType\":\"MIT\",\"sourceStatus\":\"UPDATE\",\"content\":\"过P62进郑州区域10分钟一架\",\"publishUnit\":\"ZHCC\",\"publishTime\":\"202101051400\",\"startTime\":\"202101051900\",\"endTime\":\"202101052300\"}","dataCode":"UFAO","dataType":"FTMI","level":"NOTICE","source":"ATOM"},
                // {"id":1618,"timestamp":"Jan 5, 2021 8:22:14 PM","generateTime":"20210105202214","sendTime":"20210105202219","name":"外区流控信息","content":"过P62进郑州区域10分钟一架 修改  发布单位：ZHCC 2021-01-05 19:00-2021-01-05 23:00","data":"{\"id\":2460923,\"formerId\":2460922,\"tacticId\":\"519b4432-a7ba-4915-a934-e39c3dfb6911\",\"sourceId\":\"2554478\",\"source\":\"ATOM\",\"sourceType\":\"MIT\",\"sourceStatus\":\"DELETE\",\"content\":\"过P62进郑州区域10分钟一架\",\"publishUnit\":\"ZHCC\",\"publishTime\":\"202101051400\",\"startTime\":\"202101051900\",\"endTime\":\"202101052300\"}","dataCode":"UFAO","dataType":"FTMI","level":"NOTICE","source":"ATOM"},
            ]
        };
        const { message } = msgObj;
        console.log(222);
        props.newsList.addNews(message);
    }
    const { newsList, systemPage } = props;
    const { user } = systemPage;
    useEffect(function(){
        const id = user.id;
        if( isValidVariable(id) ){
            stompClient(user.username);
        }
    },[ user.id ]);
    let newsLen = newsList.newsLength;
    return (
            <div className="bell-news">
            {
                ( newsLen <= 0 )
                    ? <BellOutlined className="bell_icon" style={{"fontSize": "20px"}} onClick = {openMsg} />
                    : <Badge count={ newsLen }>
                        <BellOutlined className="bell_icon" style={{"fontSize": "20px"}}  onClick = {openMsg}/>
                    </Badge>
            }
            </div>

    )
}

export  default  inject("newsList", "systemPage")(observer( NavBellNews) )