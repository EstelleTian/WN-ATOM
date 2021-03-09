import React from "react";
import { Radio, Badge, Button, Avatar, Dropdown, Menu } from "antd";
import { UserOutlined, SearchOutlined, DownOutlined } from '@ant-design/icons'
import { observer, inject } from "mobx-react";
import TodoNav from './TodoNav'
import RefreshBtn from "components/SchemeList/RefreshBtn";
import MyApplicationButton from "components/MyApplication/MyApplicationButton";
import User from "./User";
import './RightNav.scss'


function RightNav(props) {
    const groupRightChange = (e) => {
        const value = e.target.value;
        props.systemPage.setLeftActiveName(value);
        console.log(e.target.value)
    }
    const groupRightChange2 = (e) => {
        const value = e.target.value;
        props.systemPage.setRightActiveName(value);
        console.log(e.target.value)
    }
    const handleMenuClick = (e) => {
        console.log(e)
    }
    const runwayMenu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="1" >
                1st menu item
        </Menu.Item>
            <Menu.Item key="2" >
                2nd menu item
        </Menu.Item>
            <Menu.Item key="3">
                3rd menu item
        </Menu.Item>
        </Menu>
    )

    const { flightTableData } = props;
    const exemptLen = flightTableData.getExemptFlights.length || 0;
    const poolLen = flightTableData.getPoolFlights.length || 0;
    const specialLen = flightTableData.getSpecialFlights.length || 0;
    const expiredLen = flightTableData.getExpiredFlights.length || 0;

    return (
        <div className="layout-nav-right layout-row nav_right">
            <RefreshBtn />
            <Button
                type="default"
                size="large"
                icon={<SearchOutlined />}
            >航班查询 </Button>
            <Radio.Group value={props.systemPage.leftActiveName} buttonStyle="solid" size="large" onChange={groupRightChange} >
                <Radio.Button value="kpi">执行KPI</Radio.Button>
                <Radio.Button value="exempt">
                    豁免航班
                        {
                        exemptLen > 0 ?
                            <Badge
                                className="site-badge-count-109"
                                count={exemptLen}
                                style={{ backgroundColor: 'rgb(61, 132, 36)' }}
                            />
                            : ""
                    }

                </Radio.Button>
                <Radio.Button value="pool">
                    等待池
                        {
                        poolLen > 0 ?
                            <Badge
                                className="site-badge-count-109"
                                count={poolLen}
                                style={{ backgroundColor: 'rgb(61, 132, 36)' }}
                            />
                            : ""
                    }
                </Radio.Button>
                <Radio.Button value="special">
                    特殊航班
                        {
                        specialLen > 0 ?
                            <Badge
                                className="site-badge-count-109"
                                count={specialLen}
                                style={{ backgroundColor: 'rgb(61, 132, 36)' }}
                            />
                            : ""
                    }
                </Radio.Button>
                <Radio.Button value="expired">
                    失效航班
                        {
                        expiredLen > 0 ?
                            <Badge
                                className="site-badge-count-109"
                                count={expiredLen}
                                style={{ backgroundColor: 'rgb(61, 132, 36)' }}
                            />
                            : ""
                    }
                </Radio.Button>
                <TodoNav />
            </Radio.Group>
            <MyApplicationButton />
            <Radio.Group value={props.systemPage.rightActiveName} buttonStyle="solid" size="large" onChange={groupRightChange2} >
                <Radio.Button value="scheme">方案列表</Radio.Button>
                <Radio.Button value="outer_scheme">外部流控</Radio.Button>
                <Radio.Button value="runway">跑道配置</Radio.Button>
                {/* <Dropdown overlay={runwayMenu} trigger="click" >
                    
                </Dropdown> */}

            </Radio.Group>
            <Radio.Group buttonStyle="solid" size="large">
                <Radio.Button value="system">参数设置</Radio.Button>
            </Radio.Group>
            <div className="single_user">
                <Avatar className="user_icon" icon={<UserOutlined />} />
                <User />
            </div>



        </div>
    )
}

export default inject("systemPage", "flightTableData")(observer(RightNav))