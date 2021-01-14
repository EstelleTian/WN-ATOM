
/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2020-12-22 18:35:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\components\NavBar\NavBar.jsx
 */
import React  from 'react'
import { withRouter } from 'react-router-dom';
import { Layout,  Avatar, Radio, Tag, Button } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import RightNav from "./RightNav";
import User from "./User";
import NavBellNews from "./NavBellNews";
import RefreshBtn from "components/SchemeList/RefreshBtn";

import './NavBar.scss'

const { Header } = Layout;

//顶部导航模块
function NavBar(props){
    const getHeader =() => {
        const { location, title } = props;
        const pathname = location.pathname || "";
        console.log( "当前url是：",props.location.pathname );
        //放行监控页面
        if( pathname === "/fangxing" ){
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
                    {/*<div className="time-range">*/}
                        <Radio.Group defaultValue="a" buttonStyle="solid" size="large" >
                            <Radio.Button value="a">计划范围 <Tag color="#3d8424">29/00-29/23</Tag></Radio.Button>
                        </Radio.Group>
                    {/*</div>*/}
                    {/*<div className="">*/}
                        <Radio.Group  buttonStyle="solid" size="large" >
                            <RefreshBtn />
                        </Radio.Group>
                    {/*</div>*/}

                </div>
                <RightNav/>
            </div>
        }else {
            return <div>
                <span>{title}</span>
                <div className="nav_right">
                    {/*消息*/}
                    <NavBellNews />
                    <Avatar className="user_icon" icon={<UserOutlined />} />
                    <User />
                </div>
            </div>
        }
    }

    return (
        <Header className="nav_header">
            { getHeader() }
        </Header>
    )
}

export default withRouter( NavBar );


