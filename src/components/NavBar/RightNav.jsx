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
    
    const { flightTableData , systemPage} = props;
    const exemptLen = flightTableData.getExemptFlights().length || 0;
    const poolLen = flightTableData.getPoolFlights().length || 0;
    const specialLen = flightTableData.getSpecialFlights().length || 0;
    const expiredLen = flightTableData.getExpiredFlights().length || 0;


    const groupRightChange = (e) => {
        const value = e.target.value;
        systemPage.setLeftActiveName(value);
        console.log(e.target.value)
    }
    const groupRightChange2 = (e) => {
        const value = e.target.value;
        systemPage.setRightActiveName(value);
        console.log(e.target.value)
    }
    const handleMenuClick = (e) => {
        console.log(e)
    }

    console.log("systemPage.user", systemPage.user.id)
    return (
        <div className="layout-nav-right layout-row nav_right">
            {
                systemPage.user.id !== "" && <span>
            <RefreshBtn />
            <Button
                type="default"
                
                icon={<SearchOutlined />}
            >航班查询 </Button>
            <Radio.Group value={systemPage.leftActiveName} buttonStyle="solid"  onChange={groupRightChange} >
                {
                    systemPage.userHasAuth(12513) && <Radio.Button value="kpi">执行KPI</Radio.Button>
                }
                {
                    systemPage.userHasAuth(	12501 ) && 
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
                }
                
                {
                    systemPage.userHasAuth(	12502 ) && <Radio.Button value="pool">
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
                }
                {
                    systemPage.userHasAuth(	12503 ) && <Radio.Button value="special">
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
                }
                {
                    systemPage.userHasAuth(	12504 ) && <Radio.Button value="expired">
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
                }

                {
                    systemPage.userHasAuth(	12505 ) && <TodoNav />
                }
                
                </Radio.Group>
                {
                    systemPage.userHasAuth(	12511 ) && <MyApplicationButton />
                }
                
            <Radio.Group value={systemPage.rightActiveName} buttonStyle="solid"  onChange={groupRightChange2} >
                {
                    systemPage.userHasAuth(	12506 ) && <Radio.Button value="scheme">方案列表</Radio.Button>
                }
                {
                    systemPage.userHasAuth(	12507 ) && <Radio.Button value="outer_scheme">外部流控</Radio.Button>
                }

                <Radio.Button value="runway">跑道配置</Radio.Button>

            </Radio.Group>
            {
                    systemPage.userHasAuth(	12508 ) && <Radio.Group buttonStyle="solid" >
                    <Radio.Button value="system">参数设置</Radio.Button>
                </Radio.Group>
            }
                </span>
            }
            
            
            <div className="single_user">
                <Avatar className="user_icon" icon={<UserOutlined />} />
                <User />
            </div>



        </div>
    )
}

export default inject("systemPage", "flightTableData")(observer(RightNav))