/*
 * @Author: your name
 * @Date: 2020-12-14 13:47:11
 * @LastEditTime: 2021-03-05 11:01:38
 * @LastEditors: Please set LastEditors
 * @Description: 执行KPI
 * @FilePath: WN-ATOM\src\components\FlightDetail\FlightDetail.jsx
 */
import React, { useEffect, useCallback, useState } from 'react'
import { Form, Tag, Space, Card, Row, Col, Checkbox, DatePicker, Tabs, Radio, Tooltip } from 'antd';
import { inject, observer } from 'mobx-react'
const { TabPane } = Tabs;


//航班详情
const FlightDetail = (props) => {
    return (
        <div className="">
            <Tabs className="traffic-flow-tab" defaultActiveKey="1" type="card">
                <TabPane tab="基本信息" key="1">
                 基本信息
                </TabPane>
                <TabPane tab="前序信息" key="2">
                    前序信息
                </TabPane>
                <TabPane tab="航迹信息" key="3">
                    航迹信息
                </TabPane>
                <TabPane tab="命中方案" key="4">
                    命中方案
                </TabPane>
                <TabPane tab="引接信息" key="5">
                    引接信息
                </TabPane>
            </Tabs>

        </div>
    )
}

export default FlightDetail
