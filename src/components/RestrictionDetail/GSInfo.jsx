
/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2020-12-22 18:35:41
 * @LastEditors: Please set LastEditors
 * @Description: ATOM流控详情
 */
import React, {useEffect, Fragment} from 'react'
import { Tag, Descriptions, Checkbox , Space, Card  } from 'antd'


//NTFM流控GS信息模块

function GSInfo(props){


    return (
        <Fragment>
            <Card title="地面停止限制信息" size="small" className="advanced-card" bordered={false} >
                <Descriptions  bordered column={{ xxl: 4, xl: 4, lg: 4, md: 3, sm: 2, xs: 1 }}>
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
                        2
                    </Descriptions.Item>
                    <Descriptions.Item label="优先级">
                        1-3
                    </Descriptions.Item>
                    <Descriptions.Item label="限制描述" span={4}>
                        限制描述ZPPP ACC 起飞落地晋江开车申请
                    </Descriptions.Item>
                </Descriptions>
            </Card>
        </Fragment>
    )
}


export default GSInfo;


