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
            const  { color="", des="", value="", unit="",} = item;
            return (
                <li className="list-item">
                    <Badge className="list-item-dot" size="" color={ color } text={ des } />
                    <div className="ant-divider-vertical"></div>
                    <span className="value">{ value }</span>
                    <span className="value">{ unit}</span>
                </li>
            )
        })


    };

    return(
        <div>
            <ul className="ant-list-items">
                { getListData() }
            </ul>
        </div>
    )
}


export default List
