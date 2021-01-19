import React from "react";
import {Button, Radio, Badge} from "antd";
import {observer, inject} from "mobx-react";
import User from "./User";
// import WinBtn from "./WinBtn";
import NavBellNews from "./NavBellNews";
import './RightNav.scss'


function RightNav(props){
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

    const { flightTableData } = props;
    const exemptLen = flightTableData.getExemptFlights.length || 0;
    const poolLen = flightTableData.getPoolFlights.length || 0;
    const specialLen = flightTableData.getSpecialFlights.length || 0;
    const expiredLen = flightTableData.getExpiredFlights.length || 0;
    const todoLen = flightTableData.getTodoFlights.length || 0;

    return (
        <div className="layout-nav-right layout-row nav_right">
            <div className="radio-area">
                <Radio.Group value={props.systemPage.leftActiveName} buttonStyle="solid" size="large" onChange={ groupRightChange } >
                    <Radio.Button value="kpi">执行KPI</Radio.Button>
                    <Radio.Button value="exempt">
                        豁免航班
                        {
                            exemptLen > 0 ?
                                <Badge
                                    className="site-badge-count-109"
                                    count={ exemptLen }
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
                                    count={ poolLen}
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
                                    count={ specialLen }
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
                                    count={ expiredLen }
                                    style={{ backgroundColor: 'rgb(61, 132, 36)' }}
                                />
                                : ""
                        }
                    </Radio.Button>
                    <Radio.Button value="todo">
                        待办事项
                        {
                            todoLen > 0 ?
                                <Badge
                                    className="site-badge-count-109"
                                    count={ todoLen }
                                    style={{ backgroundColor: 'rgb(61, 132, 36)' }}
                                />
                                : ""
                        }
                    </Radio.Button>

                    {/*<WinBtn btnTitle="豁免航班" type="exempt" />*/}
                    {/*<WinBtn btnTitle="等待池" type="pool" />*/}
                </Radio.Group>
            </div>
            <Radio.Group value={props.systemPage.rightActiveName} buttonStyle="solid" size="large" onChange={ groupRightChange2 } >
                <Radio.Button value="scheme">方案列表</Radio.Button>
                <Radio.Button value="outer_scheme">外部流控</Radio.Button>
            </Radio.Group>
            <Radio.Group buttonStyle="solid" size="large">
                <Radio.Button value="system">参数设置</Radio.Button>
            </Radio.Group>
            {/*消息*/}
            <Radio.Group buttonStyle="solid" size="large">
                <Radio.Button value="news"><NavBellNews /></Radio.Button>
            </Radio.Group>
            {/*用户*/}
            <Radio.Group buttonStyle="solid" size="large">
                <Radio.Button value="users"><User /></Radio.Button>
            </Radio.Group>


        </div>
    )
}

export  default  inject("systemPage", "flightTableData")( observer(RightNav))