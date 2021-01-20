/*
 * @Author: your name
 * @Date: 2020-12-15 15:54:57
 * @LastEditTime: 2020-12-21 09:42:52
 * @LastEditors: Please set LastEditors
 * @Description: 航班查询
 * @FilePath: \WN-CDM\src\components\FlightSearch\FlightSearch.jsx
 */
import React, {useState, useEffect, useCallback} from 'react'
import { isValidVariable } from 'utils/basic-verify'
import { List, Divider , Icon, Form, Input,  Select, Drawer, Tooltip, Tag  } from 'antd'
import './SearchWidget.scss'
const { Option } = Select;
const { Search } = Input;

//查询模块
const FlightSearch = (props) => {
    let [searchTootipVisible, setSearchTootipVisible, ] = useState(0)
    let [searchLoadingVisible, setSearchLoadingVisible, ] = useState(0)
    const data = [
        {
            'value': 'ZLXY',
            'text': 'ZLXY-西安/咸阳'
        },
        {
            'value': 'ZLXYAR01',
            'text': 'ZLXYAR01-西安01扇区'
        },
        {
            'value': 'ZLXYAR02',
            'text': 'ZLXYAR02-西安02扇区'
        },
    ];
    let [flightListData, setFlightListData, ] = useState(data)
    useEffect(() => {

    }, [flightListData]);


    return (
        <Select
            // mode="multiple"
            showSearch={ true }
            showArrow={false}
            labelInValue
            autoClearSearchValue={true}
            // value={""}
            placeholder={`输入相关查询信息,如:"ZLXY"`}
            notFoundContent={  null}
            filterOption={false}
            defaultActiveFirstOption={false}
            // onSearch={this.fetchUser}
            // onChange={this.handleChange}
            style={{ width: '100%',  }}
            className="text-uppercase"

        >
            {data.map(d => (
                <Option key={d.value}>{d.text}</Option>
            ))}
        </Select>
    )
}


export default FlightSearch
