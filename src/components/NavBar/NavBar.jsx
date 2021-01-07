
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
import { withRouter } from 'react-router-dom';
import { Layout, Badge, Avatar, Radio, Tag, Dropdown, Button, Menu } from 'antd'
import { BellOutlined, UserOutlined, PoweroffOutlined, SettingOutlined } from '@ant-design/icons'
import Stomp from "stompjs";
import { openMessageDlg } from 'utils/client.js'
import './NavBar.scss'

const { Header } = Layout

//顶部导航模块

function NavBar(props){
    const stompClient = () => {
        // 建立连接
        let ws = new WebSocket('ws://192.168.210.150:15674/ws');
        let stompClient = Stomp.over(ws)
        stompClient.heartbeat.outgoing = 200;
        stompClient.heartbeat.incoming = 0;
        stompClient.debug = null;
        let on_connect = function (x) {
            console.log("WebSocket连接成功:");
            //收到限制消息
            stompClient.subscribe("/exchange/EXCHANGE.EVENT_CENTER_OUTEXCHANGE" , function (d) {
                //收到消息
                console.log("WebSocket收到消息:");
                console.log(d.body);
                const body = d.body;
                const msgObj = JSON.parse(body);
                const { message } = msgObj;
                props.newsList.addNews(message);
                openMessageDlg()
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
        // props.newsList.emptyNews();
    }

    const getHeader =() => {
        const pathname = props.location.pathname;
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

        if(pathname === "/fangxing"){
            return <div className="layout-row space-between">
                <div className="layout-nav-left layout-row">
                    <div className="seat ">
                        <Radio.Group defaultValue="a" buttonStyle="solid" size="large" >
                            <Radio.Button value="a">全部席位</Radio.Button>
                            <Radio.Button value="b">席位1</Radio.Button>
                            <Radio.Button value="c">席位2</Radio.Button>
                            <Radio.Button value="d">席位3</Radio.Button>
                            <Radio.Button value="e">席位4</Radio.Button>
                        </Radio.Group>
                    </div>
                    <div className="time-range">
                        <Radio.Group defaultValue="a" buttonStyle="solid" size="large" >
                            <Radio.Button value="a">计划范围 <Tag color="#87d068">29/00-29/23</Tag></Radio.Button>
                        </Radio.Group>
                    </div>

                </div>
                <div className="layout-nav-right layout-row">
                    <div className="radio-area">
                        <Radio.Group defaultValue="" buttonStyle="solid" size="large" >
                            <Radio.Button value="a">豁免航班</Radio.Button>
                            <Radio.Button value="b">等待池</Radio.Button>
                            <Radio.Button value="c">特殊航班</Radio.Button>
                            <Radio.Button value="d">失败航班</Radio.Button>
                            <Radio.Button value="e">待办事项</Radio.Button>
                        </Radio.Group>
                    </div>
                    <div className="">
                        <Button size="large">
                            方案列表
                        </Button>
                        <Button size="large">
                            外部流控
                        </Button>
                        <Button size="large">
                            参数设置
                        </Button>
                        <Button size="large">
                            {/*{*/}
                            {/*    ( newsLen <= 0 )*/}
                            {/*        ? <span className="bell_icon" onClick = {openMsg}>消息中心</span>*/}
                            {/*        : <Badge count={ newsLen }>*/}
                            {/*            <span className="bell_icon" onClick = {openMsg}>消息中心</span>*/}
                            {/*        </Badge>*/}
                            {/*}*/}
                            {
                                ( newsLen <= 0 )
                                    ? <BellOutlined className="bell_icon" style={{"fontSize": "20px"}} onClick = {openMsg} />
                                    : <Badge count={ newsLen }>
                                        <BellOutlined className="bell_icon" style={{"fontSize": "20px"}}  onClick = {openMsg}/>
                                    </Badge>
                            }

                        </Button>
                    </div>
                    <div className="user">
                        <Dropdown overlay={menu} placement="bottomCenter" arrow>
                            <span  className="user-name">{ username }</span>
                        </Dropdown>
                    </div>

                </div>
            </div>
        }else {
            return <div>
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
            </div>
        }
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

    const { newsList, username, title } = props;
    let newsLen = newsList.newsLength;
    console.log( "当前url是：",props.location.pathname );
    return (
        <Header className="nav_header">
            { getHeader() }
        </Header>
    )
}


export default withRouter(inject("newsList")(observer( NavBar) ));


