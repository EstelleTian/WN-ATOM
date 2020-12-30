
/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2020-12-22 18:35:41
 * @LastEditors: Please set LastEditors
 * @Description: ATOM流控详情
 */
import React, {useEffect, Fragment} from 'react'
import { Tag, Descriptions, Checkbox , Space, Card  } from 'antd'


//NTFM流控MIT信息模块

function MITInfo(props){


    return (
        <Fragment>
            <Card title="总量间隔限制信息" size="small" className="advanced-card" bordered={false} >
                <Descriptions   size="small" bordered column={4}>
                    <Descriptions.Item label="开始时间">
                        29/1200
                    </Descriptions.Item>
                    <Descriptions.Item label="结束时间">
                        29/1800
                    </Descriptions.Item>
                    <Descriptions.Item label="限制对象">
                        ENH
                    </Descriptions.Item>
                    <Descriptions.Item label="计算模式">
                        传统模式
                    </Descriptions.Item>
                    <Descriptions.Item label="间隔限制类型">
                        刚性间隔
                    </Descriptions.Item>
                    <Descriptions.Item label="总量时间片" >
                        60分钟
                    </Descriptions.Item>
                    <Descriptions.Item label="单位时间片总量架次">
                        12架次
                    </Descriptions.Item>
                    <Descriptions.Item label="间隔类型">
                        时间限制
                    </Descriptions.Item>
                    <Descriptions.Item label="间隔值">
                        5分钟
                    </Descriptions.Item>
                    <Descriptions.Item label="最小间隔类型">
                        时间限制
                    </Descriptions.Item>
                    <Descriptions.Item label="最小间隔值">
                        3分钟
                    </Descriptions.Item>
                    <Descriptions.Item label="是否为同高度限制">
                        非同高度
                    </Descriptions.Item>
                    <Descriptions.Item label="高度限制类型">
                        无
                    </Descriptions.Item>
                    <Descriptions.Item label="限制高度值">

                    </Descriptions.Item>
                    <Descriptions.Item label="特殊限制">
                        开车申请
                    </Descriptions.Item>
                    <Descriptions.Item label="优先级">
                        1-3
                    </Descriptions.Item>
                    <Descriptions.Item label="限制属性" span={4}>
                        转发
                    </Descriptions.Item>
                    <Descriptions.Item label="限制描述" span={4}>
                        ZPPP ACC 起飞落地晋江开车申请
                    </Descriptions.Item>
                </Descriptions>
            </Card>
        </Fragment>
    )
}


export default MITInfo;


