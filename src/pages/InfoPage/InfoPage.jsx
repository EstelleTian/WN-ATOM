/*
 * @Author: your name
 * @Date: 2020-12-18 18:39:39
 * @LastEditTime: 2020-12-22 20:36:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\InfoPage\InfoPage.jsx
 */
import React, {useEffect, useState} from 'react'
import { Layout, Button, Collapse, Row, Col } from 'antd'
import { DeleteOutlined, AlertOutlined, WarningOutlined, MailOutlined } from '@ant-design/icons'
import { inject, observer } from 'mobx-react'
import { Link } from  'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { formatTimeString } from 'utils/basic-verify'
import { sendMsgToClient, openTimeSlotFrame, closeMessageDlg } from 'utils/client'
import Stomp from 'stompjs'
import './InfoPage.scss'

const { Panel } = Collapse;

function getLevel(level){
    let res = "message";
    switch(level){
        case "LEVEL_MESSAGE": res = "message";break;
        case "LEVEL_NOTICE": res = "notice";break;
        case "LEVEL_WARNING": res = "warn";break;
    }
    return res;
}

//单个消息-消息头
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
                                dataType === "FCDM" ? <Button className="info_btn btn_blue" size="small" onClick={ function(e){ openTimeSlotFrame(message) } }>查看放行监控</Button> : ""
                            }
                            {
                                (dataType === "OPEI" || dataType === "FTMI") ?
                                        <span>
                                            <Button className="info_btn btn_blue" size="small" onClick={ function(e){ sendMsgToClient(message) } } >查看容流监控</Button>
                                            <Link to="/restriction" target="_blank"><Button size="small" onClick={ (e)=>{
                                                sessionStorage.setItem("newsid", Math.random() )
                                            }}>编辑</Button></Link>
                                        </span>
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

//单个消息模块下详情
function InfoCardDetail(props){
    let { message } = props;
    let {sendTime, content, name, source } = message;
    return (
        <div className="card_detail">
            <Row>
                <Col span={2} className="name">时间：</Col>
                <Col span={8} className="text send_time">{ formatTimeString( sendTime ) }</Col>
                <Col span={14} className="text send_time">

                </Col>
            </Row>
            <Row>
                <Col span={2} className="name">名称：</Col>
                <Col span={22} className="text send_time">{ name }</Col>
            </Row>
            <Row>
                <Col span={2} className="name">来源：</Col>
                <Col span={22} className="text send_time">{ source }</Col>
            </Row>
            <Row>
                <Col span={2} className="name">内容：</Col>
                <Col span={22} className="text send_time">{  content  }</Col>
            </Row>
        </div>
    )
}

//单个消息-panel模块
function PanelList(props){
    return (
        <TransitionGroup className="todo-list">
            <Collapse accordion className="info_content">
                {
                    props.newsList.list.map( (newItem,index) => (
                        <Panel
                            showArrow={false}
                            header={ <InfoCard message={ newItem } newsList={props.newsList} /> }
                            key={ index }
                        >
                            <InfoCardDetail message={ newItem  }/>
                        </Panel>
                    ))
                }
            </Collapse>
        </TransitionGroup>
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
        setTimeout(function(){
            const msgObj = {
                "message":[
                    {
                        "id":2460917,
                        "timestamp":"Dec 29, 2020 12:58:06 PM",
                        "generateTime":"20201229125806",
                        "sendTime":"20201229125806",
                        "name":"外区流控信息",
                        "content":"202012291300  过P40往武汉方向15分钟一架   发布单位：ZHHH 202012291600-202012292000",
                        "data":'{ "id":2460917, "sourceId":"557877", "source":"ATOM", "sourceType":"MIT" }',
                        "dataCode":"DATACODE_FCAO",
                        "dataType":"FTMI",
                        "level":"LEVEL_NOTICE",
                        "source":"ATOM"
                    }
                ]
            };
            const { message } = msgObj;
            props.newsList.addNews(message);
        },2000 );
        stompClient();
    }, [])
    const emptyNews = () =>{
        props.newsList.emptyNews();
    }


    const { newsList } = props;

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
                <PanelList newsList={newsList}/>

            </div>
        </Layout>
    )
}


// export default withRouter( InfoPage );
export default inject("newsList")(observer(InfoPage));

