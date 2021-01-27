/*
 * @Author: your name
 * @Date: 2020-12-15 15:54:57
 * @LastEditTime: 2021-01-27 10:29:01
 * @LastEditors: Please set LastEditors
 * @Description: 航班查询
 * @FilePath: \WN-CDM\src\components\FlightSearch\FlightSearch.jsx
 */
import React, {useState, useEffect, useCallback} from 'react'
import {inject, observer} from 'mobx-react'
import { isValidVariable } from 'utils/basic-verify'
import { List   } from 'antd'

import './FilterList.scss'

//过滤列表模块
const FilterList = (props) => {
    // let [searchTootipVisible, setSearchTootipVisible, ] = useState(0)
    //区域
    const listData = [
        {
            'key': 'ZLXY',
            'value': 'ZLXY',
            'text': 'ZLXY-西安/咸阳'
        },
        {
            'key': 'ZLXYAR01',
            'value': 'ZLXYAR01',
            'text': 'ZLXYAR01-西安01扇区'
        },
        {
            'key': 'ZLXYAR02',
            'value': 'ZLXYAR02',
            'text': 'ZLXYAR02-西安02扇区'
        },

    ];
    const data=[];
    let [flightListData, setFlightListData, ] = useState(data)
    useEffect(() => {
        
    }, [flightListData]);


    return (
        <div className="list-wrapper">
            <List
                bordered={false}
                itemLayout="horizontal"
                dataSource={listData}
                className="filter-list"
                renderItem={item => (
                    <List.Item
                        key={item.key}
                        className="filter-list-item"
                        onClick={()=>{
                            console.log(item);
                            props.capacity.setPane(item.text, item.key, "airport")
                        }}
                    >
                        {item.text}
                    </List.Item>
                )}
            />
        </div>
    )
}


export default inject("capacity")(observer(FilterList));
