/*
 * @Author: your name
 * @Date: 2020-12-18 18:39:39
 * @LastEditTime: 2021-02-24 13:17:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\InfoPage\InfoPage.jsx
 */
import React, {useEffect, useState} from 'react'
import { Layout, Tooltip, Checkbox, Button } from 'antd'
import { DeleteOutlined, CloseOutlined} from '@ant-design/icons'
import { inject, observer } from 'mobx-react'
import { isValidVariable } from 'utils/basic-verify'
import { closeMessageDlg, openMessageDlg } from 'utils/client'
import Stomp from 'stompjs'
import InfoList from 'components/Info/InfoList'
import './InfoPage.scss'

//消息模块
function InfoPage(props){
    const [ login, setLogin ] = useState(false);
    const [ scrollChecked, setScrollChecked ] = useState(true);
    const stompClient = ( username = "" ) => {
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
            console.log("WebSocket连接成功:");
            console.log(x);
            //收到限制消息
            const topic1 = "/exchange/EXCHANGE.EVENT_CENTER_OUTEXCHANGE_"+username;
            stompClient.subscribe( topic1, function (d) {
                //收到消息
                console.log(topic1 + "  WebSocket收到消息:");
                console.log(d.body);
                const body = d.body;
                const msgObj = JSON.parse(body);
                const { message } = msgObj;
                //工作流类别消息，不显示
                let newMsg = message.filter( msg => ( "WFPI" !== msg.dataType ) )
                props.newsList.addNews(newMsg);
                
                openMessageDlg();
            })
        }

        let on_error = function (error) {
            console.log("WebSocket连接失败:");
            console.log(error);
        }
        // 连接消息服务器
        stompClient.connect('guest', 'guest', on_connect, on_error, '/');
    }
    const emptyNews = () =>{
        props.newsList.emptyNews();
    };

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

    const { newsList, systemPage } = props;
    const { user } = systemPage;
    useEffect(function(){
        const user = localStorage.getItem("user");
        if( isValidVariable(user) ){
            props.systemPage.setUserData( JSON.parse(user) );
        }

    }, []);
    useEffect(function(){
        const id = user.id;
        if( isValidVariable(id) ){
            setLogin(true);
            stompClient(user.username);
        }
        else{
            //TODO 测试用，正式去掉该else
            // setTimeout(function(){
            //             //     if( !isValidVariable( props.systemPage.user.id ) ){
            //             //         // alert("未登录成功:" + props.systemPage.user.id);
            //             //         props.systemPage.setUserData({
            //             //             id: 14,
            //             //             descriptionCN: "--",
            //             //             username: 'lanzhouflw'
            //             //         });
            //             //         setLogin(true);
            //             //         stompClient('lanzhouflw');
            //             //     }
            //             // },1)
        }
    },[ user.id ]);
    const len = newsList.list.length;

    useEffect(function(){
        //收到消息后，如果滚屏，自动置顶
        console.log("scrollChecked",scrollChecked);
        if( newsList.list.length > 1 && scrollChecked ){
            const listDom = document.getElementsByClassName("todo-list");
            if( listDom.length > 0 ){
                listDom[0].scrollTop = 0;
            }
            
        }
    },[ newsList.list.length ]);

    return (
        <Layout className="layout">
            {
                login ? <div className="info_canvas">
                    <div className="info_header">
                        <div className="title">消息推送(共{ len }条，最多100条)</div>
                        <div className="scroll">
                            <Checkbox checked={ scrollChecked } onChange={ e => {
                                setScrollChecked(e.target.checked);
                            }}>滚屏</Checkbox>
                        </div>

                        <Tooltip title="清除">
                            <div className="radish">
                                {/*<DeleteOutlined onClick={ add } />*/}
                                <DeleteOutlined onClick={ emptyNews } />
                            </div>
                        </Tooltip>
                    
                        <Button type="primary" size="small"  className="more"
                            onClick={ e => {
                                window.open("./#/today_news");
                            }}
                        >
                            更多
                        </Button>
                        {/** <div className="to_top"><Checkbox checked>告警置顶</Checkbox></div>*/}
                        <Tooltip title="关闭">
                            <div className="close" onClick={()=>{ closeMessageDlg("")}}><CloseOutlined /> </div>
                        </Tooltip>

                    </div>
                    <InfoList newsList={newsList}/>

                </div> : ""
            }

        </Layout>
    )
}


// export default withRouter( InfoPage );
export default inject("newsList", "systemPage")(observer(InfoPage));

