/*
 * @Author: your name
 * @Date: 2020-12-15 15:54:57
 * @LastEditTime: 2020-12-15 15:56:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\components\FlightSearch\FlightSearch.jsx
 */
import React from 'react'
import { Badge } from 'antd';


const List =(props) => {
    const getListData = function () {
        const { listData =[] } = props;

        return listData.map((item, index) => {
            const  { iconType="", color="", des="", value="", unit="",} = item;
            return (
                <li key={item.id} className="list-item">
                    <div className="item">
                        <div className="icon">
                            {/*<Badge className="list-item-dot" size="" color={ color }  />*/}
                            <div className={`list-item-icon ${iconType}`} />
                        </div>
                        <div className="destriction">
                            { des }
                        </div>
                        <div className="value">
                            { value } { unit}
                        </div>
                    </div>

                </li>
            )
        })
    };
    return(
        <ul className="ant-list-items">
            { getListData() }
        </ul>
    )
}


export default List
