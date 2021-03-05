/*
 * @Author: your name
 * @Date: 2021-03-03 20:22:17
 * @LastEditTime: 2021-03-05 10:26:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\NavBar\LeftBar.jsx
 */

import React  from 'react'
import {observer, inject} from "mobx-react";
import { Radio } from 'antd'

//顶部 左导航模块
function LeftNav(props){
    const groupNameChange = (e) => {
        const value = e.target.value;
        console.log(e.target.value);
        if( props.systemPage.leftNavSelectedName !== value ){
            props.systemPage.setLeftNavSelectedName(value);
            props.schemeListData.toggleSchemeActive(value);
        }else{
            props.systemPage.setLeftNavSelectedName("");
            props.schemeListData.toggleSchemeActive("");
        }
    }
    return (
        <div className="layout-nav-left layout-row">
            <Radio.Group 
                value={props.systemPage.leftNavSelectedName} 
                buttonStyle="solid" 
                size="large"
                
             >
                <Radio.Button value="focus-ZLXY" onClick={ groupNameChange } >ZLXY</Radio.Button>
            </Radio.Group>

            {/*<div className="time-range">*/}
                <Radio.Group defaultValue="a" buttonStyle="solid" size="large" >
                    <Radio.Button value="a">计划范围
                        {/*<Tag color="#3d8424">29/00-29/23</Tag>*/}
                        </Radio.Button>
                </Radio.Group>
            {/*</div>*/}


        </div>
    )
}

export  default  inject("systemPage", "schemeListData")( observer(LeftNav))


