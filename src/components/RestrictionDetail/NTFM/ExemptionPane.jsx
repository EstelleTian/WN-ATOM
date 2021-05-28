
/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-03-26 15:54:49
 * @LastEditors: Please set LastEditors
 * @Description: NTFM交通流限制-措施豁免(占量)
 */
import React, { useState } from 'react'
import {  Tabs, Badge} from 'antd';
import {  isValidVariable } from 'utils/basic-verify'

import TrafficFlow from 'components/RestrictionDetail/NTFM/TrafficFlow'

const { TabPane } = Tabs;

// NTFM交通流限制-措施豁免(占量)
function ExemptionPane(props) {
    // 整体限制未成功转换标记
    const unConvertedAll = props.unConvertedAll;
    // 未成功转换的措施豁免字段数据
    const unConvertedData = props.unConverted_expd || [];
    const dataArr = props.data || [];
    let [activePaneKey, setActivePaneKey] = useState("INCLUDE");

    // 切换活动tab页
    const changeActiveKeyPane = (activeKey) => {
        setActivePaneKey(activeKey)
    }

    // 检查数据中是否包含未成功转换的字段项
    const checkIsIncludesUnConvertedField = (data) => {
        for (let i = 0; i < data.length; i++) {
            let id = data[i].id + "";
            if (isValidVariable(unConvertedData[id])) {
                return true;
            }
        }
        return false;

    }

    // 遍历绘制tab
    const drawTabItem = (singleData, index) => {
        // 条件数据集合
        const includeData = singleData.conditionTraffic || [];
        // 排除数据集合
        const excludeData = singleData.exemptTraffic || [];
        // 条件数据里是否包含未成功转换的字段项
        const includeData_isIncludesUnConvertedField = unConvertedAll || checkIsIncludesUnConvertedField(includeData);
        // 排除数据里是否包含未成功转换的字段项
        const excludeData_isIncludesUnConvertedField = unConvertedAll || checkIsIncludesUnConvertedField(excludeData);

        return (
            <Tabs key={index} onChange={changeActiveKeyPane} defaultActiveKey="INCLUDE" activeKey={activePaneKey}>
                <TabPane tab={includeData_isIncludesUnConvertedField ? <Badge offset={[8,0]} dot><span>条件</span></Badge> : "条件"} key="INCLUDE">
                    {
                        includeData.map((item, ind) => (<TrafficFlow key={ind} index={ind} data={item} unConvertedAll={unConvertedAll} unConvertedData = {unConvertedData} ></TrafficFlow>))
                    }
                </TabPane>
                <TabPane tab={excludeData_isIncludesUnConvertedField ? <Badge offset={[8,0]} dot><span>排除</span></Badge> : "排除"} key="EXCLUDE">
                    {
                        excludeData.map((item, ind) => (<TrafficFlow key={ind} index={ind} data={item} unConvertedAll={unConvertedAll} unConvertedData = {unConvertedData} ></TrafficFlow>))
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


