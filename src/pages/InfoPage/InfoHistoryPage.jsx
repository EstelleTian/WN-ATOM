/*
 * @Author: your name
 * @Date: 2021-01-22 16:08:06
 * @LastEditTime: 2021-01-26 13:33:43
 * @LastEditors: Please set LastEditors
 * @Description: 消息历史数据
 * @FilePath: \WN-ATOM\src\pages\InfoPage\InfoHistoryPage.jsx
 */
import React from 'react'
import { Layout } from 'antd'
import InfoHistoryList from 'components/Info/InfoHistoryList'

//消息历史模块
function InfoHistoryPage(props){
    return (
        <Layout className="layout">
            <InfoHistoryList />
        </Layout>
    )
}

export default  InfoHistoryPage ;