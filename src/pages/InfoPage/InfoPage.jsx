/*
 * @Author: your name
 * @Date: 2020-12-18 18:39:39
 * @LastEditTime: 2020-12-22 20:36:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\InfoPage\InfoPage.jsx
 */
import React, {Component, Suspense} from 'react'
import { Layout, Button, Icon  } from 'antd'
import { withRouter } from 'react-router-dom';
import { DeleteOutlined, AlertOutlined, WarningOutlined, MailOutlined } from '@ant-design/icons'
import { inject, observer } from 'mobx-react'
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { formatTimeString } from '../../utils/basic-verify'
import {sendMsgToClient} from '../../utils/client'
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
class InfoCard extends Component{
    constructor(props){
        super(props);
        this.removeCard = this.removeCard.bind(this)
        this.state = {
            inProp: true
        }
    }

    removeCard(){
        this.setState({
            inProp: false
        })
        const thisProxy = this;
        setTimeout(function(){
            thisProxy.props.newsList.delNew( thisProxy.props.message );
        }, 1000)

    }
    render (){
        let { message:{level, sendTime, content, dataType}, newsList } = this.props;
        level = getLevel( level );
        return (
            <CSSTransition

                in={ this.state.inProp }
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
                                dataType === "FCDM" ? <Button size="small">查看放行监控</Button> : ""
                            }
                            {
                                (dataType === "OPEI" || dataType === "FTMI") ? <Button size="small">查看容流监控</Button> : ""
                            }
                        </div>
                        <div className="close" onClick={this.removeCard}>X</div>
                    </div>

                    <div className="text">
                        { content }
                    </div>
                </div>
            </div>
            </CSSTransition>
        )
    }
}

//消息模块
@inject("newsList")
@observer
class InfoPage extends Component{
    stompClient = () => {
        console.log("建立连接");
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
            stompClient.subscribe("/exchange/EXCHANGE.EVENT_CENTER_OUTEXCHANGE" , function (d) {
                //收到消息
                console.log("WebSocket收到消息:");
                console.log(d.body);
                const body = d.body;
                const msgObj = JSON.parse(body);
                sendMsgToClient(body);
                const { message } = msgObj;
                thisProxy.props.newsList.addNews(message);
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

    // componentDidMount() {
    //     setTimeout(function () {
    //         const str = JSON.stringify({
    //             "id": 2457111,
    //             "sourceId": "3890389",
    //             "source": "ATOM",
    //             "sourceType": "MIT"
    //         });
    //         console.log("准备推送");
    //         sendMsgToClient(str);
    //         console.log("已推送");
    //
    //     }, 3000)
    // }


    render(){
        const { newsList } = this.props;
        console.log( newsList );
        const len = newsList.list.length;

        const { delNew } = newsList;
        return (
            <Layout className="layout">
                <div className="info_canvas">
                    <div className="info_header">
                        <div className="title">消息推送(共{ len }条，最多100条)</div>
                        <div className="radish">
                            <DeleteOutlined />
                        </div>
                        {/** <div className="scroll"><Checkbox checked>滚屏</Checkbox></div>
                        <div className="to_top"><Checkbox checked>告警置顶</Checkbox></div>*/}
                        <div className="close" >X</div>
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
}


// export default withRouter( InfoPage );
export default InfoPage;

