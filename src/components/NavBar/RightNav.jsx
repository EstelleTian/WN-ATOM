import React from "react";
import { Button, Radio} from "antd";
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
    return (
        <div className="layout-nav-right layout-row nav_right">
            <div className="radio-area">
                <Radio.Group value={props.systemPage.leftActiveName} buttonStyle="solid" size="large" onChange={ groupRightChange } >
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
                <Button size="large"
                        type={`${ props.systemPage.rightActiveName === "scheme" ? "primary" : "default"}`}
                        onClick={ (e) => {
                            props.systemPage.setRightActiveName("scheme");
                        } }
                >
                    方案列表
                </Button>
                <Button size="large"
                        type={`${ props.systemPage.rightActiveName === "outer_scheme" ? "primary" : "default"}`}
                        onClick={ (e) => {
                            props.systemPage.setRightActiveName("outer_scheme");
                        } }
                >
                    外部流控
                </Button>
                <Button size="large">
                    参数设置
                </Button>
                {/*消息*/}
                <Button size="large">
                    <NavBellNews />
                </Button>
                <User />
            </div>

        </div>
    )
}

export  default  inject("systemPage")( observer(RightNav))