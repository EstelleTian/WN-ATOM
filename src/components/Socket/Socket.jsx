/*
 * @Author: your name
 * @Date: 2020-12-21 18:33:06
 * @LastEditTime: 2020-12-22 13:14:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\components\Socket\Socket.jsx
 */
import React, {Component} from 'react'
import { inject, observer } from 'mobx-react'
import Stomp from 'stompjs'

@inject("newsList")
@observer
 class Socket extends Component{

    stompClient = () => {
        // 建立连接
        let ws = new WebSocket('ws://192.168.210.150:15674/ws');
        let stompClient = Stomp.over(ws)
        stompClient.heartbeat.outgoing = 200;
        stompClient.heartbeat.incoming = 0;
        let thisProxy = this;
        
        let on_connect = function (x) {
            
            console.log("WebSocket连接成功:");
            console.log(x);

            //收到限制消息
            stompClient.subscribe("/exchange/1001/testExchange" , function (d) {
                //收到消息
                console.log("WebSocket收到消息:");
                console.log(d.body);
                const message =  [{
                    "generateTime": "20201222094724",
                    "sendTime": "20201222094725",
                    "name": "动态容量人工调整",
                    "Content": "ARGUK-HRB航路段 04/0853 次日  60min 多个时间点 动态容量 人工调整完成",
                    "data": "{\"id\":6285759,\"version\":1,\"generateTime\":\"201807050000\",\"elementName\":\"ARGUK-HRB\",\"elementType\":\"ROUTE\",\"lastModifyTime\":\"201807040853\",\"publishUser\":\"adccdev\",\"status\":\"PUBLISH\",\"unique\":\"ARGUK-HRB_PASS_20180705\",\"capacityType\":\"PASS\",\"capacity15\":\"26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26\",\"capacity30\":\"27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27\",\"capacity60\":\"28,28,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280,280\",\"routeName\":\"G212\",\"capacityBase15\":26,\"capacityBase30\":27,\"capacityBase60\":280,\"progMaintenanceInitStatus\":\"MAINTENANCE_INIT_SUCCESS\",\"manualMaintenanceStatus\":\"USER_UPDATE_SUCCESS\",\"progMaintenanceInitTime\":\"201807040005\",\"manualMaintenanceTime\":\"201807040853\"}",
                    "dataType": "ROUTE_ARGUK-HRB",
                    "level": "LEVEL_MESSAGE",
                    "publishUser": "ZBAA",
                    "receiveUser": "5655454,5544",
                    "receiveRole": "Z2B154,5215646",
                    "source": "ATMM-SYSTEM"
                }]
                thisProxy.props.newsList.addNews(message)
                
            })
        }

        let on_error = function (error) {
            console.log("WebSocket连接失败:");
            console.log(error);
        }
        // 连接消息服务器
        stompClient.connect('guest', 'guest', on_connect, on_error, '/');
        
      }
    componentWillMount(){
        this.stompClient();
    }

     render(){
         return <div></div>
     }
 }

 export default Socket