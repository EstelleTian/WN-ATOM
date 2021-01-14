/*
 * @Author: liutianjiao
 * @Date:
 * @LastEditTime: 2021-01-14 10:08:49
 * @LastEditors: liutianjiao
 * @Description:  全局刷新按钮
 * @FilePath: RefreshBtn.jsx
 */
import React  from 'react'
import {inject, observer} from "mobx-react";
import { Button } from 'antd'
//顶部导航模块
function RefreshBtn(props){
    const pageRefresh = props.systemPage.pageRefresh;
    return (
        <Button value="a" loading={pageRefresh}  size="large" style={{ fontSize: "0.75rem" }} onClick={()=>{
            props.systemPage.pageRefresh = true;
        }}>刷新 </Button>
    )
}

export default inject("systemPage")(observer(RefreshBtn));


