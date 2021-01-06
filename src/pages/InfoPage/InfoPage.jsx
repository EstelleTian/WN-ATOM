/*
 * @Author: your name
 * @Date: 2020-12-18 18:39:39
 * @LastEditTime: 2020-12-22 20:36:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\InfoPage\InfoPage.jsx
 */
import React, {useEffect, useState, Fragment} from 'react'
import { Layout, Button, Collapse, Row, Col, Tooltip } from 'antd'
import { DeleteOutlined, AlertOutlined, WarningOutlined, MailOutlined, CloseOutlined} from '@ant-design/icons'
import { inject, observer } from 'mobx-react'
import { Link } from  'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { formatTimeString } from 'utils/basic-verify'
import { sendMsgToClient, openTimeSlotFrame, closeMessageDlg, openControlDetail } from 'utils/client'
import Stomp from 'stompjs'
import './InfoPage.scss'

const { Panel } = Collapse;

function getLevel(level){
    let res = "message";
    switch(level){
        case "MESSAGE": res = "message";break;
        case "NOTICE": res = "notice";break;
        case "WARNING": res = "warn";break;
    }
    return res;
}
const convertStatus = ( sourceStatus ) => {
    let cn = "";
    switch ( sourceStatus ) {
        case "ADD" : cn="新增";break;
        case "UPDATE" : cn="更新";break;
        case "DELETE" : cn="终止";break;
    }
    return cn;
}
//单个消息-消息头
function InfoCard(props){
    let [inProp, setInProp] = useState(true);
    let [active, setActive] = useState(true);

    const removeCard = (massage) => {
        closeMessageDlg(massage)
        setInProp(false);
        // setTimeout(function(){
        //     props.newsList.delNew( props.message );
        // }, 1000)
    }
    useEffect(function(){
        setTimeout(function(){
            setActive(false)
        },3000)
    },[])
    let { message, index } = props;
    let {level, sendTime, content, dataType, dataCode, id,  name, data =""} = message;
    data = JSON.parse(data);
    let { sourceStatus, startTime, endTime, publishUnit } = data;
    let dataContent = data.content || "";
    console.log( message. data);
    level = getLevel( level );
    return (
        <CSSTransition
            in={ inProp }
            timeout={0}
            classNames="item"
            key = { id }
            unmountOnExit={ true }
            onExited={(node) => {
                //动画出场之后的回调
                // 移除该项
                props.newsList.delNew( props.message );
            }}
        >
            <div className={`info_card  ${ active ? "active" : "" } ${dataType}`}>
                <div className={`level_icon ${level}`}>
                    <div className={`message-icon ${dataType} ${level}`} />
                </div>
                <div className="card_cont">
                    {/*{ id+"-"+index }*/}
                    <div className="title">
                        <div className={`level_text ${level}`}>{level}</div>
                        <div className="date">{ formatTimeString( sendTime ) }</div>
                        <div className="options">
                            {
                                dataType === "FCDM" ? <Button className="info_btn btn_blue" size="small" onClick={ function(e){ openTimeSlotFrame(message) } }>查看放行监控</Button> : ""
                            }
                            {
                                (dataType === "OPEI" || dataType === "PROI") ?
                                    <Button className="info_btn btn_blue" size="small" onClick={ function(e){
                                        sendMsgToClient(message)
                                        e.stopPropagation()
                                    } } >查看容流监控</Button>
                                    :""
                            }
                            {
                                (dataType === "FTMI") ?
                                    <span>
                                        <Button className="info_btn btn_blue" size="small" onClick={ function(e){
                                            sendMsgToClient(message)
                                            e.stopPropagation()
                                        } } >查看容流监控</Button>
                                        {/*<Link to="/restriction" target="_blank">*/}
                                            <Button size="small" onClick={ (e)=>{
                                                //将data转换为对象再生成字符串对象传递，否则接收后转换不成正确的json
                                                let { data } = message;
                                                data = JSON.parse( data);
                                                data = Object.assign({}, data )
                                               let newMsg =  Object.assign({}, message);
                                                newMsg.data = data;
                                                let str = JSON.stringify(newMsg)
                                                // console.log( str )
                                                // sessionStorage.setItem("message", str );
                                                openControlDetail( str )
                                                e.stopPropagation()
                                            }}>查看流控详情</Button>
                                        {/*</Link>*/}
                                    </span>
                                : ""
                            }
                        </div>
                        <Tooltip title="关闭">
                            <div className="close" onClick={ (e) =>{
                                removeCard(message);
                                e.stopPropagation()
                            }} ><CloseOutlined /> </div>
                        </Tooltip>
                    </div>
                    {
                        (dataType === "FTMI")
                            ? <div>
                                <div className="text">
                                    <span className={`${sourceStatus} sourceStatus`}>{convertStatus(sourceStatus)}</span>-{ name }
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <span className="publishUnit">发布单位：{publishUnit}</span>
                                </div>
                                <div className="text">
                                    { dataContent }
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    {formatTimeString(startTime)}- {formatTimeString(endTime)}
                                    {/*&nbsp;&nbsp;&nbsp;&nbsp;*/}

                                </div>
                            </div>
                            : <div>
                                <div className="text">
                                    { name }
                                </div>

                                <div className="text">
                                    { content }
                                </div>
                            </div>
                    }

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
function PanelList(props) {
    return (
        <TransitionGroup className="todo-list">
            <Collapse accordion className="info_content">
                {
                    props.newsList.list.map((newItem, index) => (

                        <Panel
                            showArrow={false}
                            header={ <InfoCard message={ newItem } newsList={props.newsList} index={index}/> }
                            key={ newItem.id }
                        >
                            <InfoCardDetail message={ newItem }/>
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
    useEffect(function(){
        // setTimeout(function(){
        //     const msgObj = {
        //         "message":[
        //             {
        //                 "id":2460915,
        //                 "sendTime":"20210104095703",
        //                 "name":"外区流控信息-新增",
        //                 "content":"新增-外区流控信息（前台推送自测）",
        //                 "data":"{\"id\":2460915,\"sourceId\":\"125478\",\"source\":\"ATOM\",\"sourceType\":\"MIT\"}",
        //                 "dataCode":"AFAO",
        //                 "dataType":"FTMI",
        //                 "level":"NOTICE",
        //                 "source":"ATOM"
        //             },
        //             {
        //                 "id":2460917,
        //                 "timestamp":"Dec 29, 2020 12:58:06 PM",
        //                 "generateTime":"20201229125806",
        //                 "sendTime":"20201229125806",
        //                 "name":"更新-外区流控信息",
        //                 "content":"更新-外区流控信息（前台推送自测）",
        //                 "data":'{ "id":2460917, "sourceId":"557877", "source":"ATOM", "sourceType":"MIT"}',
        //                 "dataCode":"UFAO",
        //                 "dataType":"FTMI",
        //                 "level":"NOTICE",
        //                 "source":"ATOM"
        //             },
        //             {
        //                 "id":2460922,
        //                 "timestamp":"Dec 29, 2020 12:58:06 PM",
        //                 "generateTime":"20201229125806",
        //                 "sendTime":"20201229125806",
        //                 "name":"终止-外区流控信息",
        //                 "content":"终止-外区流控信息（前台推送自测）",
        //                 "data":'{ "id":2460917, "sourceId":"557877", "source":"ATOM", "sourceType":"MIT" }',
        //                 "dataCode":"TFAO",
        //                 "dataType":"FTMI",
        //                 "level":"NOTICE",
        //                 "source":"ATOM"
        //             }
        //         ]
        //     };
        //     const { message } = msgObj;
        //     props.newsList.addNews(message);
        // },2000 );
        stompClient();
    }, [])
    const emptyNews = () =>{
        props.newsList.emptyNews();
    }

    const  add =() => {
        const id = new Date().getTime();
        const msgObj = {
            "message":[
                {"id":1607,"timestamp":"Jan 5, 2021 8:11:14 PM","generateTime":"20210105201114","sendTime":"20210105201119","name":"外区流控信息","content":"过P62进郑州区域20分钟一架 新增 发布单位：ZHHH 2021-01-05 19:00-2021-01-05 23:00","data":"{\"id\":2460918,\"sourceId\":\"547787\",\"source\":\"ATOM\",\"sourceType\":\"MIT\",\"sourceStatus\":\"ADD\",\"content\":\"过P62进郑州区域20分钟一架\",\"publishUnit\":\"ZHCC\",\"publishTime\":\"202101051730\",\"startTime\":\"202101051900\",\"endTime\":\"202101052300\"}","dataCode":"AFAO","dataType":"FTMI","level":"NOTICE","source":"ATOM"},
                {"id":1618,"timestamp":"Jan 5, 2021 8:22:14 PM","generateTime":"20210105202214","sendTime":"20210105202219","name":"外区流控信息","content":"过P62进郑州区域10分钟一架 修改  发布单位：ZHCC 2021-01-05 19:00-2021-01-05 23:00","data":"{\"id\":2460923,\"formerId\":2460922,\"tacticId\":\"519b4432-a7ba-4915-a934-e39c3dfb6911\",\"sourceId\":\"2554478\",\"source\":\"ATOM\",\"sourceType\":\"MIT\",\"sourceStatus\":\"UPDATE\",\"content\":\"过P62进郑州区域10分钟一架\",\"publishUnit\":\"ZHCC\",\"publishTime\":\"202101051400\",\"startTime\":\"202101051900\",\"endTime\":\"202101052300\"}","dataCode":"UFAO","dataType":"FTMI","level":"NOTICE","source":"ATOM"},
                {"id":1618,"timestamp":"Jan 5, 2021 8:22:14 PM","generateTime":"20210105202214","sendTime":"20210105202219","name":"外区流控信息","content":"过P62进郑州区域10分钟一架 修改  发布单位：ZHCC 2021-01-05 19:00-2021-01-05 23:00","data":"{\"id\":2460923,\"formerId\":2460922,\"tacticId\":\"519b4432-a7ba-4915-a934-e39c3dfb6911\",\"sourceId\":\"2554478\",\"source\":\"ATOM\",\"sourceType\":\"MIT\",\"sourceStatus\":\"DELETE\",\"content\":\"过P62进郑州区域10分钟一架\",\"publishUnit\":\"ZHCC\",\"publishTime\":\"202101051400\",\"startTime\":\"202101051900\",\"endTime\":\"202101052300\"}","dataCode":"UFAO","dataType":"FTMI","level":"NOTICE","source":"ATOM"},
            ]
        };
        const { message } = msgObj;
        props.newsList.addNews(message);
    }

    const { newsList } = props;

    const len = newsList.list.length;
    return (
        <Layout className="layout">
            <div className="info_canvas">
                <div className="info_header">
                    <div className="title">消息推送(共{ len }条，最多100条)</div>
                    <Tooltip title="清除">
                        <div className="radish">
                            <DeleteOutlined onClick={ emptyNews } />
                        </div>
                    </Tooltip>
                    {/** <div className="scroll"><Checkbox checked>滚屏</Checkbox></div>
                     <div className="to_top"><Checkbox checked>告警置顶</Checkbox></div>*/}
                    <Tooltip title="关闭">
                        <div className="close" onClick={()=>{ closeMessageDlg("")}}><CloseOutlined /> </div>
                    </Tooltip>

                </div>
                <PanelList newsList={newsList}/>

            </div>
        </Layout>
    )
}


// export default withRouter( InfoPage );
export default inject("newsList")(observer(InfoPage));

