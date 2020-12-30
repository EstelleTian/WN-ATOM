
/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2020-12-22 18:35:41
 * @LastEditors: Please set LastEditors
 * @Description: ATOM流控详情
 */
import React, {useEffect, Fragment} from 'react'
import { Tag, Descriptions, Checkbox , Space, Card, List  } from 'antd'


//NTFM流控AFP信息模块

function AFPInfo(props){


    return (
        <Fragment>
            <Card title="空域流量限制信息" size="small" className="advanced-card" bordered={false} >
                <Descriptions  size="small" bordered column={4}>
                    <Descriptions.Item label="开始时间">
                        29/1200
                    </Descriptions.Item>
                    <Descriptions.Item label="结束时间">
                        29/1800
                    </Descriptions.Item>
                    <Descriptions.Item label="限制对象">
                        ENH
                    </Descriptions.Item>
                    <Descriptions.Item label="作用半径">
                        7
                    </Descriptions.Item>
                    <Descriptions.Item label="优先级">
                        1-3
                    </Descriptions.Item>
                    <Descriptions.Item label="限制对象容量" span={3}>
                        {/**
                         TODO 对象容量列表绘制
                         */}
                        <List
                            size="small"
                            dataSource={['29/1200', '29/1400',]}
                            renderItem={item => <List.Item>{item}</List.Item>}
                        />
                    </Descriptions.Item>
                    <Descriptions.Item label="限制描述" span={4}>
                        限制描述ZPPP ACC 起飞落地晋江开车申请
                    </Descriptions.Item>
                </Descriptions>
            </Card>
        </Fragment>
    )
}


export default AFPInfo;


