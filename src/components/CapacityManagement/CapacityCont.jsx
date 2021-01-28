/*
 * @Author: your name
 * @Date: 2021-01-26 16:36:46
 * @LastEditTime: 2021-01-28 13:11:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\CapacityManagement\CapacityCont.jsx
 */
import React, {useState, useEffect, useCallback} from 'react'
import {inject, observer} from 'mobx-react'
import { Radio, Button } from 'antd'
import { isValidVariable } from 'utils/basic-verify'
import ModalBox from 'components/ModalBox/ModalBox'
import DynamicTable from './DynamicTable'
import StaticSetting from './StaticSetting';

import "./CapacityCont.scss"

//容量管理内容页
function CapacityCont (props){
    
    const requestData = useCallback(
        () => {
            // let user = localStorage.getItem("user");
            // user = JSON.parse(user);
            // const userId = user.id || "";
            // if( isValidVariable(userId) ){
    
            // }
    
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
                    <span>日期:</span>
                    <Radio.Group
                        optionType="button"
                        buttonStyle="solid"
                        onChange={e => {
                            capacity.updateDateSel( pane.key ,e.target.value );
                        }} 
                        value={pane.date}
                        options={[
                            { label: '昨日', value: '-1' },
                            { label: '今日', value: '0' },
                            { label: '明日', value: '1' }
                        ]}
                    >
                    </Radio.Group>
                </div>
                <div className="radio_sel type_sel">
                    <span>航班类别:</span>
                    <Radio.Group 
                        optionType="button"
                        buttonStyle="solid"
                        onChange={e => {
                            capacity.updateKindSel( pane.key ,e.target.value );
                        }} 
                        value={pane.kind}
                        options={[
                            { label: '进港', value: 'arr' },
                            { label: '出港', value: 'dep' },
                            { label: '进出港', value: 'all' }
                        ]}
                    >
                    </Radio.Group>
                </div>
                <div className="radio_sel interval_sel">
                    <span>时间间隔:</span>
                    <Radio.Group 
                        optionType="button"
                        buttonStyle="solid"
                        onChange={e => {
                            capacity.updateTimeIntervalSel( pane.key ,e.target.value );
                        }} 
                        value={pane.timeInterval}
                        options={[
                            { label: '15分钟', value: '15' },
                            { label: '30分钟', value: '30' },
                            { label: '60分钟', value: '60' }
                        ]}
                    >
                    </Radio.Group>
                </div>
                <Button type="primary" 
                    // loading = { refreshBtnLoading } 
                    className="refresh_btn"
                    onClick = { e => {
                        
                    }}
                >
                        刷新
                </Button>
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
                        <StaticSetting pane={pane}/>
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