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
    const { location, systemPage } = props;
    const user = systemPage.user || {};
    const username = user.name || "";
    const descriptionCN = user.descriptionCN || "";
    const pathname = location.pathname || "";
    useEffect(function(){
        const user = localStorage.getItem("user");
        if( isValidVariable(user) ){
            props.systemPage.setUserData( JSON.parse(user) );
        }
        else{
            props.history.push('/')
        }
    }, []);
    //放行监控页面
    if( pathname === "/fangxing" ){
        if( isValidVariable(user.id) ){
            return (
                <Dropdown overlay={menu} placement="bottomCenter" arrow>
                    <span  className="user-name">{ descriptionCN }</span>
                </Dropdown>
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