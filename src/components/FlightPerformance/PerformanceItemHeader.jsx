/*
 * @Author: your name
 * @Date: 2020-12-15 15:54:57
 * @LastEditTime: 2020-12-15 15:56:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\components\FlightSearch\FlightSearch.jsx
 */
import React from 'react'
import './PerformanceItemHeader.scss'
const PerformanceItemHeader =(props) => {

    const { style={}, title="", value="", unit=""  } = props;

    return(
        <div className="header">
            <div className="title" style={ style }> { title }</div>
            <div className="description" style={{ color: style.color }}>
                <span className="value">{ value }</span>
                <span className="unit">{ unit }</span>
            </div>
        </div>
    )
}


export default PerformanceItemHeader
