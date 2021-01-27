/*
 * @Author: your name
 * @Date: 2021-01-26 16:36:46
 * @LastEditTime: 2021-01-27 17:38:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\CapacityManagement\CapacityCont.jsx
 */
import React, {useState, useEffect, useCallback} from 'react'
import {inject, observer} from 'mobx-react'
import { Radio } from 'antd'
import { isValidVariable } from 'utils/basic-verify'
import ModalBox from 'components/ModalBox/ModalBox'
import DynamicTable from './DynamicTable'
import StaticSetting from './StaticSetting';

import "./CapacityCont.scss"

//容量管理内容页
function CapacityCont (props){
    
    const requestData = useCallback(
        () => {
            let user = localStorage.getItem("user");
            user = JSON.parse(user);
            const userId = user.id || "";
            if( isValidVariable(userId) ){
                
            }
        
        },
        [],
    )

    useEffect( function(){
        const { pane } = props;
        //获取数据
        requestData();
    }, []);

    const { capacity, pane } = props;
    return (
        <div>
            <div className="line_canvas">
                <div className="radio_sel date_sel">
                    <span>日期选择:</span>
                    <Radio.Group onChange={e => {
                        console.log('radio checked', e.target.value);
                        capacity.updateDateSel( pane.key ,e.target.value );
                      }} value={pane.date}>
                        <Radio value="-1">昨日</Radio>
                        <Radio value="0">当日</Radio>
                        <Radio value="1">次日</Radio>
                    </Radio.Group>
                </div>
                <div className="radio_sel type_sel">
                    <span>种类选择:</span>
                    <Radio.Group onChange={e => {
                        console.log('radio checked', e.target.value);
                        capacity.updateKindSel( pane.key ,e.target.value );
                      }} value={pane.kind}>
                        <Radio value="in">进港</Radio>
                        <Radio value="out">出港</Radio>
                        <Radio value="all">进出港</Radio>
                    </Radio.Group>
                </div>
                <div className="radio_sel interval_sel">
                    <span>请选择时间间隔(单位：分钟):</span>
                    <Radio.Group onChange={e => {
                        console.log('radio checked', e.target.value);
                        capacity.updateTimeIntervalSel( pane.key ,e.target.value );
                      }} value={pane.timeInterval}>
                        <Radio value="15">15</Radio>
                        <Radio value="30">30</Radio>
                        <Radio value="60">60</Radio>
                    </Radio.Group>
                </div>
            </div>
            <div className="cap_set_canvas">
                <div className="set_top">
                    <ModalBox
                        title="静态容量配置"
                        style={{
                            height: 330
                        }}
                        showDecorator = {true}
                        className="static_modal"
                    >
                        <StaticSetting/>
                    </ModalBox>
                    <ModalBox
                        title="动态容量配置"
                        style={{
                            height: 330
                        }}
                        showDecorator = {true}
                        className="dynamic_modal"
                    >
                        <DynamicTable />   
                    </ModalBox>
                </div>
                
                <div className="cap_part alert_setting"></div>
                
            </div>
        </div>
    )
}

export default inject( "capacity" )(observer(CapacityCont));