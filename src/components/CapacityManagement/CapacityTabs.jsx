/*
 * @Author: your name
 * @Date: 2021-01-26 14:17:55
 * @LastEditTime: 2021-01-26 16:41:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\CapacityManagement\CapacityTabs.jsx
 */

import React, {useState, useEffect, useCallback} from 'react'
import {inject, observer} from 'mobx-react'
import {Tabs} from 'antd';
import CapacityCont from './CapacityCont.jsx';

const { TabPane } = Tabs;

  
//容量管理tab页
function CapacityTabs (props){
    const { capacity } = props;
    const { panes, getActivePane, activePane, delPane } = capacity;
    let activeKey = "";
    if( getActivePane.length > 0){
        activeKey = getActivePane[0].key;
    }
    
    const onChange = useCallback(aKey => {
        props.capacity.activePane(aKey);
    },[]);

    //移出按钮
    const remove = useCallback( targetKey => {
        props.capacity.delPane(targetKey);
    },[]);
    
    return (
        <Tabs
            hideAdd
            type="editable-card"
            onChange={onChange}
            activeKey={activeKey}
            onEdit={(targetKey, action) => {
                remove(targetKey);
            }}
        >
            { panes.map(pane => (
                <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
                    <CapacityCont pane={pane}/>
                </TabPane>
            ))}
      </Tabs>

    )
}

export default inject("capacity")(observer(CapacityTabs));