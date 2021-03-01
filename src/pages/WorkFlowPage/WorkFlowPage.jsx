/*
 * @Author: your name
 * @Date: 2020-12-18 18:39:39
 * @LastEditTime: 2021-02-26 14:23:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\InfoPage\InfoPage.jsx
 */
import React  from 'react'
import {observer, inject} from "mobx-react";
import { Layout, Menu} from 'antd'
import { ClockCircleOutlined, CheckOutlined } from '@ant-design/icons';
import NavBar  from 'components/NavBar/NavBar.jsx';
// import Stomp from 'stompjs'
import WorkFlowList from 'components/WorkFlow/WorkFlowList'
import './WorkFlowPage.scss'

//工作流导航
let WorkFlowNav = inject("workFlowData")(observer((props) => {
    const handleClick = e => {
        console.log('click ', e);
        props.workFlowData.setActiveTab( e.key );
    };
    return (
        <Menu onClick={handleClick} selectedKeys={[props.workFlowData.activeTab]} mode="horizontal" className="work_menu">
            <Menu.Item key="todo" icon={<ClockCircleOutlined />}>
                待办工作
            </Menu.Item>
            <Menu.Item key="finished"  icon={<CheckOutlined />}>
                办结工作
            </Menu.Item>
            {/*<Menu.Item key="guanzhu"  icon={<StarOutlined />}>*/}
            {/*    关注工作*/}
            {/*</Menu.Item>*/}
            {/*<Menu.Item key="guaqi"  icon={<PauseCircleOutlined /> }>*/}
            {/*    挂起工作*/}
            {/*</Menu.Item>*/}
            {/*<Menu.Item key="weituo"  icon={<ExpandAltOutlined />}>*/}
            {/*    委托工作*/}
            {/*</Menu.Item>*/}
            {/*<Menu.Item key="all"  icon={<FontColorsOutlined />}>*/}
            {/*    全部工作*/}
            {/*</Menu.Item>*/}
        </Menu>
    )
}));

//工作流模块
function WorkFlowPage(){
    return (
        <Layout className="work_layout">
            {/*<NavBar className="nav_bar" title="空中交通运行放行监控系统" username="" />*/}
        
            <WorkFlowNav />
            <WorkFlowList />
        </Layout>
    )
}

export default WorkFlowPage;

