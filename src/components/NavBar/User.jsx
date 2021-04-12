/*
 * @Author: your name
 * @Date: 2021-01-12 14:15:12
 * @LastEditTime: 2021-04-12 14:35:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\NavBar\User.jsx
 */
import React, { useEffect }  from "react";
import {  Dropdown, Menu, } from "antd";
import { PoweroffOutlined, SettingOutlined} from "@ant-design/icons";
import {observer, inject} from "mobx-react";
import {withRouter} from "react-router-dom";
import {isValidVariable} from "utils/basic-verify";

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
function User(props){
    const { location } = props;
    let descriptionCN =  "";
    const pathname = location.pathname || "";

    const user = localStorage.getItem("user");

    if( isValidVariable(user) ){
        if( pathname === "/clearance" ){
            const userObj = JSON.parse(user)
            descriptionCN = userObj.descriptionCN || "";
            props.systemPage.setUserData( userObj );
        }
        
    }
    else{
        // props.history.push('/')
    }

    console.log("User组件更新了")
    
    
    //放行监控页面
    if( pathname === "/clearance" ){
        if( isValidVariable(user.id) ){
            // return (
            //     <Dropdown overlay={menu} placement="bottomCenter" arrow>
            //         <span  className="user-name">{ descriptionCN }</span>
            //     </Dropdown>
            // )
            return (
                <span  className="user-name">{ descriptionCN }</span>
            )
        }else{
            return (
                <span  className="user-name">{ descriptionCN }</span>
            )
        }

    }else{
        return (
            <span className="user_name">{ descriptionCN }</span>
        )
    }

}

export  default  withRouter(inject("systemPage")( observer( User)));
