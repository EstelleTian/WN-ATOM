import React, { useEffect }  from "react";
import {  Dropdown, Menu, } from "antd";
import { PoweroffOutlined, SettingOutlined} from "@ant-design/icons";
import {observer, inject} from "mobx-react";
import {withRouter} from "react-router-dom";

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
        // setTimeout(function(){
        //     const msgObj = {
        //         "message":[
        //             {
        //                 "id":2460915,
        //                 "sendTime":"20210104095703",
        //                 "name":"外区流控信息-新增",
        //                 "content":"新增-外区流控信息（前台推送自测）",
        //                 "data":"{\"id\":2460915,\"sourceId\":\"125478\",\"source\":\"ATOM\",\"sourceType\":\"MIT\"}",
        //                 "dataCode":"AFAO",
        //                 "dataType":"FTMI",
        //                 "level":"NOTICE",
        //                 "source":"ATOM"
        //             },
        //             {
        //                 "id":2460917,
        //                 "timestamp":"Dec 29, 2020 12:58:06 PM",
        //                 "generateTime":"20201229125806",
        //                 "sendTime":"20201229125806",
        //                 "name":"更新-外区流控信息",
        //                 "content":"更新-外区流控信息（前台推送自测）",
        //                 "data":'{ "id":2460917, "sourceId":"557877", "source":"ATOM", "sourceType":"MIT"}',
        //                 "dataCode":"UFAO",
        //                 "dataType":"FTMI",
        //                 "level":"NOTICE",
        //                 "source":"ATOM"
        //             },
        //             {
        //                 "id":2460922,
        //                 "timestamp":"Dec 29, 2020 12:58:06 PM",
        //                 "generateTime":"20201229125806",
        //                 "sendTime":"20201229125806",
        //                 "name":"终止-外区流控信息",
        //                 "content":"终止-外区流控信息（前台推送自测）",
        //                 "data":'{ "id":2460917, "sourceId":"557877", "source":"ATOM", "sourceType":"MIT" }',
        //                 "dataCode":"TFAO",
        //                 "dataType":"FTMI",
        //                 "level":"NOTICE",
        //                 "source":"ATOM"
        //             }
        //         ]
        //     };
        //     const { message } = msgObj;
        //     props.newsList.addNews(message);
        // },2000 );
        const user = localStorage.getItem("user");
        props.systemPage.setUserData( JSON.parse(user) );
    }, []);
    //放行监控页面
    if( pathname === "/fangxing" ){
        return (
            <Dropdown overlay={menu} placement="bottomCenter" arrow>
                <span  className="user-name">{ descriptionCN }</span>
            </Dropdown>
        )
    }else{
        return (
            <span className="user_name">{ descriptionCN }</span>
        )
    }

}

export  default  withRouter(inject("systemPage")( observer(User)))