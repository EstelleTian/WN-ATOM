/*
 * @Author: your name
 * @Date: 2021-01-26 14:17:55
 * @LastEditTime: 2021-03-10 09:00:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\CapacityManagement\CapacityTabs.jsx
 */

import React, {useState, useEffect, useCallback} from 'react'
import {inject, observer} from 'mobx-react'
import {Tabs} from 'antd';
import CapacityCont from './CapacityCont.jsx';
import { NWGlobal } from 'utils/global';

const { TabPane } = Tabs;


  
//容量管理tab页
function CapacityTabs (props){
    const { capacity } = props;
    const { panes, getActivePane, activePane, delPane } = capacity;
    let activeKey = "";
    if( getActivePane.length > 0){
        activeKey = getActivePane[0].key;
    }
    
    NWGlobal.setCapacityPane = function( str ){
        const obj = JSON.parse(str) || {
            title: "ZLXY-西安/咸阳",
            key: "ZLXY",
            type: "airport",
            active: true,
            date: "0", 
            kind: 'all',
            timeInterval: "60"
         };
        props.capacity.setPane(obj);
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
                    {
                        activeKey === pane.key && <CapacityCont pane={pane}/> 
                    }
                    
                </TabPane>
            ))}
      </Tabs>

    )
}

export default inject("capacity")(observer(CapacityTabs));