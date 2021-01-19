/*
 * @Author: your name
 * @Date: 2020-12-16 13:58:33
 * @LastEditTime: 2020-12-16 14:11:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\components\MiniMonitor\AddMonitorCard.jsx
 */
import React from 'react'
import ModalBox from '../ModalBox/ModalBox'
import { PlusCircleOutlined } from '@ant-design/icons';

import './AddMonitorCard.scss'
function AddMonitorCard(props){
   
    return (
        <div className="monitor layout-column">
            <div className="chart-container">
                <div className="action">
                    <PlusCircleOutlined className="add-icon" />
                    <div className="text">
                        新增自定义监控
                    </div>
                </div>


            </div>
            <div className="options">
                <div className="normal-rate">
                    <div className="rate-progress">

                    </div>
                    <div className="rate-text">
                        {` `}
                    </div>
                </div>
                <div className="weather">{``}</div>
            </div>
        </div>

    )
}

export default AddMonitorCard