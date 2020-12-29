/*
 * @Author: your name
 * @Date: 2020-12-18 18:39:39
 * @LastEditTime: 2020-12-22 20:36:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\InfoPage\InfoPage.jsx
 */
import React, {useEffect, useState} from 'react'
import { Layout, Button  } from 'antd'
import { DeleteOutlined, AlertOutlined, WarningOutlined, MailOutlined } from '@ant-design/icons'
import { inject, observer } from 'mobx-react'
import { Link } from  'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { formatTimeString } from 'utils/basic-verify'
import { sendMsgToClient, openTimeSlotFrame, closeMessageDlg } from 'utils/client'
import Stomp from 'stompjs'
import './InfoPage.scss'

function getLevel(level){
    let res = "message";
    switch(level){
        case "LEVEL_MESSAGE": res = "message";break;
        case "LEVEL_NOTICE": res = "notice";break;
        case "LEVEL_WARNING": res = "warn";break;
    }
    return res;
}
function InfoCard(props){
    let [inProp, setInProp] = useState(true);

    const removeCard = (massage) => {
        closeMessageDlg(massage)
        setInProp(false);
        setTimeout(function(){
            props.newsList.delNew( props.message );
        }, 1000)

    }
    let { message } = props;
    let {level, sendTime, content, dataType} = message;
    level = getLevel( level );
    return (
        <CSSTransition
            in={ inProp }
            timeout={1000}
            classNames="item"
        >
            <div className={`info_card `}>
                <div className={`level_icon ${level}`}>
                    { (level === "warn") ? <AlertOutlined /> : "" }
                    { (level === "notice") ? <WarningOutlined /> : "" }
                    { (level === "message") ? <MailOutlined /> : "" }
                </div>
                <div className="card_cont">
                    <div>
                        <div className={`level_text ${level}`}>{level}</div>
                        <div className="date">{ formatTimeString( sendTime ) }</div>
                        <div className="options">
                            {
                                dataType === "FCDM" ? <Button size="small" onClick={ function(e){ openTimeSlotFrame(message) } }>查看放行监控</Button> : ""
                            }
                            {
                                (dataType === "OPEI" || dataType === "FTMI") ?
                                    <div>
                                        <Button size="small" onClick={ function(e){ sendMsgToClient(message) } } >查看容流监控</Button>
                                        <Link to="/restriction"  target="_blank"><Button size="small">查看流控详情</Button></Link>
                                    </div>
                                    : ""
                            }
                        </div>
                        <div className="close" onClick={ removeCard}>X</div>
                    </div>

                    <div className="text">
                        { content }
                    </div>
                </div>
            </div>
        </CSSTransition>
    )
}

//消息模块
function InfoPage(props){
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
    const emptyNews = () =>{
        props.newsList.emptyNews();
    }

    const { newsList } = props;
    console.log( newsList );
    const len = newsList.list.length;
    return (
        <Layout className="layout">
            <div className="info_canvas">
                <div className="info_header">
                    <div className="title">消息推送(共{ len }条，最多100条)</div>
                    <div className="radish">
                        <DeleteOutlined onClick={ emptyNews } />
                    </div>
                    {/** <div className="scroll"><Checkbox checked>滚屏</Checkbox></div>
                     <div className="to_top"><Checkbox checked>告警置顶</Checkbox></div>*/}
                    <div className="close" onClick={()=>{ closeMessageDlg()}}>X</div>
                </div>
                <TransitionGroup className="todo-list">
                    <div className="info_content">
                        {
                            newsList.list.map( (newItem,index) => (
                                <InfoCard key={index}  message={ newItem } newsList={newsList} />
                            ))
                        }
                    </div>
                </TransitionGroup>
            </div>
        </Layout>
    )
}


// export default withRouter( InfoPage );
export default inject("newsList")(observer(InfoPage));

