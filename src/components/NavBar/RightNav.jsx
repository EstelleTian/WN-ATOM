import React, {useEffect, useState} from "react";
import {Badge, Button, Dropdown, Menu, Radio} from "antd";
import { PoweroffOutlined, SettingOutlined} from "@ant-design/icons";
import { Window as WindowDHX } from "dhx-suite";
import NavBellNews from "./NavBellNews";
// import "dhx-suite/codebase/suite.min.css";

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
    let [ window, setWindow ] = useState();
    // eslint-disable-next-line no-undef
    useEffect(function () {
        const windowHtml = `<p>Here is a neat and flexible JavaScript window system with a fast and simple initialization.</p><p>Inspect all the DHTMLX window samples to discover each and every feature.</p><img style='display: block; width: 200px; height: 200px; margin-top: 20px; margin-left: auto; margin-right: auto' src='${process.env.PUBLIC_URL}/static/developer.svg'>`;
        setWindow( new WindowDHX({
            width: 440,
            height: 520,
            title: "Window",
            html: windowHtml,
            closable: true,
        }) );
    }, []);

    return (
        <div className="layout-nav-right layout-row nav_right">
            <div className="radio-area">
                <Radio.Group defaultValue="" buttonStyle="solid" size="large" >
                    <Radio.Button value="a" onClick={() => window.show()} >豁免航班</Radio.Button>
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