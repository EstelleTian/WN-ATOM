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
import { Radio, Checkbox,   } from 'antd'
import { CloseOutlined, CheckOutlined, } from '@ant-design/icons';


import './FilterWidget.scss'


//查询模块
const FilterWidget = (props) => {
    // let [searchTootipVisible, setSearchTootipVisible, ] = useState(0)
    //区域
    const areaType = [
        { label: '华北', value: 'a' },
        { label: '华东', value: 'b' },
        { label: '东北', value: 'c' },
        { label: '中南', value: 'd' },
        { label: '西北', value: 'e' },
        { label: '新疆', value: 'f' },
        { label: '西南', value: 'g' },
        { label: '三亚', value: 'h' },
        { label: '港澳台', value: 'i' },
    ];
    const data=[];
    let [flightListData, setFlightListData, ] = useState(data)
    useEffect(() => {

    }, [flightListData]);


    return (
        <div className="filter-container">
            <div className="radio-filter">
                <Radio.Group defaultValue="a" buttonStyle="solid">
                    <Radio.Button value="a">机场</Radio.Button>
                    <Radio.Button value="b">航路</Radio.Button>
                    <Radio.Button value="c">扇区</Radio.Button>
                    <Radio.Button value="d">航路点</Radio.Button>
                    <Radio.Button value="e">进近扇区</Radio.Button>
                </Radio.Group>
            </div>
            <div className="checkbox-filter">
                <Checkbox
                    indeterminate={true}
                    // onChange={onCheckAllChange}
                    // checked={checkAll}
                >
                    全部
                </Checkbox>
                <Checkbox.Group
                    options={areaType}
                    defaultValue={[]
                    }
                    // onChange={onChange}
                />
            </div>

            <div className="checkbox-filter">
                <Checkbox
                    // onChange={onCheckAllChange}
                    // checked={checkAll}
                >
                   时刻协调机场置顶显示
                </Checkbox>
            </div>

        </div>
    )
}


export default FilterWidget
