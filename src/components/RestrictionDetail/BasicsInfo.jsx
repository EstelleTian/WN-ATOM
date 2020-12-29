
/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2020-12-22 18:35:41
 * @LastEditors: Please set LastEditors
 * @Description: ATOM流控详情
 */
import React, {useEffect, Fragment} from 'react'
import { Tag, Descriptions, Checkbox , Space, Card  } from 'antd'


//NTFM流控基础信息模块

function BasicsInfo(props){


    return (
        <Fragment>
            <Card title="基本信息" size="small" className="advanced-card" bordered={false} >
                <Descriptions  bordered column={{ xxl: 4, xl: 4, lg: 4, md: 3, sm: 2, xs: 1 }}>
                    <Descriptions.Item label="流控名称" span={4}>
                        ZPPP ACC起飞落地晋江
                    </Descriptions.Item>
                    <Descriptions.Item label="流控制定单位">
                        运管中心
                    </Descriptions.Item>
                    <Descriptions.Item label="流控接收单位">
                        ZWWWCTA,ZLXYAPP
                    </Descriptions.Item>
                    <Descriptions.Item label="流控发布单位">
                        ZGGGCTA
                    </Descriptions.Item>
                    <Descriptions.Item label="流控发布时间">
                        29/1100
                    </Descriptions.Item>
                    <Descriptions.Item label="是否参与计算" >
                        参与计算
                    </Descriptions.Item>
                    <Descriptions.Item label="流控类型">
                        总量间隔
                    </Descriptions.Item>
                    <Descriptions.Item label="流控状态">
                        新增
                    </Descriptions.Item>
                    <Descriptions.Item label="流控原因代码" >
                        军事活动
                    </Descriptions.Item>
                    <Descriptions.Item label="流控原因正文" span={4} >
                        原因正文原因正文原因正文原因正文原因正文
                    </Descriptions.Item>
                    <Descriptions.Item label="流控原因补充说明" span={4}>
                        原因补充说明原因补充说明原因补充说明
                    </Descriptions.Item>
                </Descriptions>
            </Card>
        </Fragment>
    )
}


export default BasicsInfo;


