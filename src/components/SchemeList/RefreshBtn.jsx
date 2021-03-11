/*
 * @Author: liutianjiao
 * @Date:
 * @LastEditTime: 2021-03-11 15:04:40
 * @LastEditors: Please set LastEditors
 * @Description:  全局刷新按钮
 * @FilePath: RefreshBtn.jsx
 */
import React from 'react'
import { UserOutlined, SearchOutlined, RedoOutlined } from '@ant-design/icons'
import {inject, observer} from "mobx-react";
import { Button } from 'antd'
//顶部导航模块
function RefreshBtn(props){
    // const pageRefresh = props.systemPage.pageRefresh;
    const pageRefresh = ()=> {
        // 刷新页面
        window.location.reload()
    };

    return (
        <Button
            icon={<RedoOutlined />}
            // size="large"
            onClick={() => {
                pageRefresh()
            }}>
            刷新
        </Button>
    )
}

export default inject("systemPage")(observer(RefreshBtn));


