import React, {useEffect, useState} from "react";
import {Badge, Button, Dropdown, Menu, Radio} from "antd";
import { PoweroffOutlined, SettingOutlined} from "@ant-design/icons";
import { Window as WindowDHX } from "dhx-suite";
import NavBellNews from "./NavBellNews";
import WinBtn from "./WinBtn";
import "dhx-suite/codebase/suite.css";
import './RightNav.scss'

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
function RightNav(props){
    const { username } = props;


    return (
        <div className="layout-nav-right layout-row nav_right">
            <div className="radio-area">
                <Radio.Group defaultValue="" buttonStyle="solid" size="large" >
                    <WinBtn btnTitle="豁免航班" type="exempt" />
                    <WinBtn btnTitle="等待池" type="pool" />
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
                {/*消息*/}
                <Button size="large">
                    <NavBellNews />
                </Button>

            </div>
            <div className="user">
                <Dropdown overlay={menu} placement="bottomCenter" arrow>
                    <span  className="user-name">{ username }</span>
                </Dropdown>
            </div>
        </div>
    )
}

export  default  RightNav