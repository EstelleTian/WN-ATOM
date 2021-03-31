
/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-03-26 15:54:49
 * @LastEditors: Please set LastEditors
 * @Description: NTFM交通流限制-措施豁免(占量)
 */
import React, { useEffect, useState } from 'react'
import { Divider, Tag,  Tabs,Button,} from 'antd';
import TrafficFlow from 'components/RestrictionDetail/NTFM/TrafficFlow'

const { TabPane } = Tabs;

// NTFM交通流限制-措施豁免(占量)
function ExemptionPane(props) {
    const dataArr = props.data || [];
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
                        includeData.map((item, ind) => (<TrafficFlow key={ind} index={ind} data={item}></TrafficFlow>))
                    }
                </TabPane>
                <TabPane tab="排除" key="EXCLUDE">
                    {
                        excludeData.map((item, ind) => (<TrafficFlow key={ind} index={ind} data={item}></TrafficFlow>))
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
export default ExemptionPane;


