/*
 * @Author: your name
 * @Date: 2020-12-16 09:19:44
 * @LastEditTime: 2020-12-21 15:03:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\components\MiniMonitor\MiniMonitor.jsx
 */
import React from 'react'
import ReactEcharts from 'echarts-for-react'
import ModalBox from '../ModalBox/ModalBox'
import "./MiniMonitor.scss"

function MiniMonitor(props){
    return (
            <div title={props.title} style={{width: '100%', height: '164px', margin: '0px'}}  className={props.className}>
                <ReactEcharts
                option={props.option}
                className='react_for_echarts'
                style={{width: '100%',height:'100%'}}
                />
            </div>
    )
}

export default MiniMonitor