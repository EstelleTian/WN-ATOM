import React, {useEffect, useState} from "react";
import {Badge, Button, Dropdown, Menu, Radio} from "antd";
import { PoweroffOutlined, SettingOutlined} from "@ant-design/icons";
// import { Window as WindowDHX } from "dhx-suite";
// import WinBtn from "./WinBtn";
import NavBellNews from "./NavBellNews";

import "dhx-suite/codebase/suite.css";
import './RightNav.scss'
import {observer, inject} from "mobx-react";

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

    const groupRightChange = (e) => {
        const value = e.target.value;
        props.systemPage.setLeftActiveName(value);
        console.log(e.target.value)
    }
    return (
        <div className="layout-nav-right layout-row nav_right">
            <div className="radio-area">
                <Radio.Group defaultValue="kpi" buttonStyle="solid" size="large" onChange={ groupRightChange } >
                    <Radio.Button value="kpi">执行KPI</Radio.Button>
                    <Radio.Button value="exempt">豁免航班</Radio.Button>
                    <Radio.Button value="pool">等待池</Radio.Button>
                    <Radio.Button value="special">特殊航班</Radio.Button>
                    <Radio.Button value="expired">失效航班</Radio.Button>
                    <Radio.Button value="todo">待办事项</Radio.Button>

                    {/*<WinBtn btnTitle="豁免航班" type="exempt" />*/}
                    {/*<WinBtn btnTitle="等待池" type="pool" />*/}
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

export  default  inject("systemPage")( observer(RightNav))