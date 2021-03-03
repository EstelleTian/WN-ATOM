
/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-03-03 20:36:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\components\NavBar\NavBar.jsx
 */
import React  from 'react'
import { withRouter } from 'react-router-dom';
import { Layout,  Avatar, Radio, Tag, Button } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import RightNav from "./RightNav";
import LeftNav from "./LeftNav";
import User from "./User";
import NavBellNews from "./NavBellNews";

import './NavBar.scss'

const { Header } = Layout;

//顶部导航模块
function NavBar(props){
    const getHeader =() => {
        const { location, title } = props;
        const pathname = location.pathname || "";
        // console.log( "当前url是：",props.location.pathname );
        //放行监控页面
        if( pathname === "/fangxing" ){
            return <div className="layout-row space-between multi_nav">
                <LeftNav/>
                <h4 style={{ color: 'red'}}>web自动更新 3/3/1800 </h4>
                <RightNav/>
            </div>
        }else {
            return <div className="layout-row space-between simple_nav">
                        <div className="layout-nav-left layout-row">
                            <span>{title}</span>
                        </div>
                        <div className="layout-nav-right layout-row">
                            <div className="single_bell">
                                <NavBellNews />
                            </div>
                            <div className="single_user">
                                <Avatar className="user_icon" icon={<UserOutlined />} />
                                <User />
                            </div>


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


