
/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2020-12-22 18:35:41
 * @LastEditors: Please set LastEditors
 * @Description: ATOM流控详情
 */
import React, {useEffect} from 'react'
import { Tag, Descriptions, Checkbox , Space, Card, Collapse  } from 'antd'
import BasicsInfo  from './BasicsInfo.jsx'
import MITInfo  from './MITInfo.jsx'
import GDPInfo  from './GDPInfo.jsx'
import AFPInfo  from './AFPInfo.jsx'
import GSInfo  from './GSInfo.jsx'
import TrafficFlow  from './TrafficFlow.jsx'

import './NTFMDetail.scss'



//NTFM流控模块

function NTFMDetail(props){
    const { Panel } = Collapse;


    const options = [
        { label: '是否同意高度', value: '1' },
        { label: '起飞申请', value: '2' },
        { label: '禁航', value: '3' },
    ];

    return (
        <div>
            <BasicsInfo/>
            <MITInfo/>
            {/*<GDPInfo/>*/}
            {/*<AFPInfo/>*/}
            {/*<GSInfo/>*/}
            <Card  title="限制交通流" size="small" className="advanced-card" bordered={false} >
                <TrafficFlow data={{index: 0}}  />
                <TrafficFlow data={{index: 1}}/>
            </Card>
            <Card title="豁免交通流" size="small" className="advanced-card" bordered={false} >
                <TrafficFlow data={{index: 0}} />
                <TrafficFlow data={{index: 1}}/>
            </Card>
        </div>
    )
}


export default NTFMDetail;


