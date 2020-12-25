/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2020-12-22 18:35:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\components\NavBar\NavBar.jsx
 */
import React, {Component} from 'react'
import { inject, observer } from 'mobx-react'
import { Layout, Badge, Avatar, Drawer } from 'antd'
import {
    BellOutlined, UserOutlined
  } from '@ant-design/icons'

import { ppp } from '../../utils/global.js'
import './NavBar.scss'

const { Header } = Layout



//顶部导航模块
@inject("newsList")
@observer
class NavBar extends Component{
    constructor(props){
        super(props)
        this.state = {
            newsLen: 0
        };
        ppp.show = this.addNews.bind(this);
    }
    addNews( num ){
        this.setState({
            newsLen: num
        })
    }
    render(){
        const { newsList, username, title } = this.props;
        const { newsLen } = this.state;
        return (
            <Header className="nav_header">
                <span>{title}</span>
                <div className="nav_right">
                {
                    ( newsLen <= 0 ) 
                    ? <BellOutlined className="bell_icon" style={{"fontSize": "20px"}} />
                    : <Badge count={ newsLen }>
                            <BellOutlined className="bell_icon" style={{"fontSize": "20px"}} />
                        </Badge>
                }
                    
                    <Avatar className="user_icon" icon={<UserOutlined />} />
                    <span className="user_name">{ username }</span>
                </div>
            
            </Header>
        )
    }
    
}

export default NavBar;



