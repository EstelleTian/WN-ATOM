/*
 * @Author: your name
 * @Date: 2020-12-18 18:39:39
 * @LastEditTime: 2020-12-22 20:36:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\InfoPage\InfoPage.jsx
 */
import React, {useEffect, useState, Fragment} from 'react'
import { Layout, Button, Menu, Row, Col, Search } from 'antd'
import { ClockCircleOutlined, CheckOutlined, StarOutlined, PauseCircleOutlined, ExpandAltOutlined, FontColorsOutlined } from '@ant-design/icons'
import { formatTimeString } from 'utils/basic-verify'
import { sendMsgToClient, openTimeSlotFrame, closeMessageDlg, openControlDetail, openMessageDlg } from 'utils/client'
import Stomp from 'stompjs'
import WorkFlowList from 'components/WorkFlow/WorkFlowList'
import './WorkFlowPage.scss'

//消息模块
function WorkFlowPage(props){
    const [ menuVal, setMenuVal ] = useState("todo")
    const handleClick = e => {
        console.log('click ', e);
        setMenuVal(e.key);
    };
    const onSearch = value => console.log(value);


    return (
        <Layout className="layout">
            <Menu onClick={handleClick} selectedKeys={[menuVal]} mode="horizontal" className="work_menu">
                <Menu.Item key="todo" icon={<ClockCircleOutlined />}>
                    待办工作
                </Menu.Item>
                <Menu.Item key="finished"  icon={<CheckOutlined />}>
                    办结工作
                </Menu.Item>
                <Menu.Item key="guanzhu"  icon={<StarOutlined />}>
                    关注工作
                </Menu.Item>
                <Menu.Item key="guaqi"  icon={<PauseCircleOutlined /> }>
                    挂起工作
                </Menu.Item>
                <Menu.Item key="weituo"  icon={<ExpandAltOutlined />}>
                    委托工作
                </Menu.Item>
                <Menu.Item key="all"  icon={<FontColorsOutlined />}>
                    全部工作
                </Menu.Item>
            </Menu>
            <WorkFlowList menuVal={menuVal}/>



        </Layout>
    )
}


// export default withRouter( InfoPage );
export default WorkFlowPage;

