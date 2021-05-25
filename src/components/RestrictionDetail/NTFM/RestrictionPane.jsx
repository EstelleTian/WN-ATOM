
/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-03-26 15:54:49
 * @LastEditors: Please set LastEditors
 * @Description: NTFM交通流限制-限制
 */
import React, { useEffect, useState } from 'react'
import { Divider, Tag, Tabs } from 'antd'
import TrafficFlow from 'components/RestrictionDetail/NTFM/TrafficFlow'

const { TabPane } = Tabs;

// NTFM交通流限制-限制
function RestrictionPane(props) {
    const dataArr = props.data || [];
    // 整体限制未成功转换标记
    const unConvertedAll = props.unConvertedAll;
    // 未成功转换的限制数据
    const unConvertedData = props.unConverted_trfd || {};
    let [activePaneKey, setActivePaneKey] = useState("INCLUDE");
    // 切换活动tab页
    const changeActiveKeyPane = (activeKey) => {
        setActivePaneKey(activeKey)
    }

    // 遍历绘制tab
    const drawTabItem = (singleData, index) => {
        // 条件数据集合
        const includeData = singleData.conditionTraffic || [];
        // 排除数据集合
        const excludeData = singleData.exemptTraffic || [];

        return (
            <Tabs key={index} onChange={changeActiveKeyPane} defaultActiveKey="INCLUDE" activeKey={activePaneKey}>
                <TabPane tab="条件" key="INCLUDE">
                    {
                        includeData.map((item, ind) => (<TrafficFlow key={ind} index={ind} data={item} unConvertedAll={unConvertedAll} unConvertedData = {unConvertedData} ></TrafficFlow>))
                    }
                </TabPane>
                <TabPane tab="排除" key="EXCLUDE">
                    {
                        excludeData.map((item, ind) => (<TrafficFlow key={ind} index={ind} data={item} unConvertedAll={unConvertedAll}  unConvertedData = {unConvertedData} ></TrafficFlow>))
                    }
                </TabPane>
            </Tabs>
        )
    }

    return (
        <div className="tab-wrapper">
            {
                dataArr.map((item, index) => (
                        drawTabItem(item, index)
                    )
                )
            }
        </div>
    )
}
export default RestrictionPane;


