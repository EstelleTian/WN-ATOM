
/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2020-12-22 18:35:41
 * @LastEditors: Please set LastEditors
 * @Description: ATOM流控详情
 */
import React, {useEffect} from 'react'
import { Tag, Descriptions, Checkbox , Space, Card  } from 'antd'
import './ATOMDetail.scss'



//顶部导航模块

function ATOMDetail(props){

    const options = [
        { label: '是否同意高度', value: '1' },
        { label: '起飞申请', value: '2' },
        { label: '禁航', value: '3' },
    ];

    return (
        <div>

            <Card title="基本信息" size="small" className="advanced-card" bordered={false} >
                <Descriptions  bordered column={{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
                    <Descriptions.Item label="流控名称" span={3}>
                        ZPPP ACC起飞落地晋江
                    </Descriptions.Item>
                    <Descriptions.Item label="流控ID">
                        4543035
                    </Descriptions.Item>
                    <Descriptions.Item label="流控类型">
                        原发
                    </Descriptions.Item>
                    <Descriptions.Item label="发布单位">
                        ZGGG
                    </Descriptions.Item>
                    <Descriptions.Item label="受控单位">
                        ZUUU
                    </Descriptions.Item>
                    <Descriptions.Item label="流控原因" >
                        军事活动
                    </Descriptions.Item>
                    <Descriptions.Item label="事发地">
                        广州
                    </Descriptions.Item>
                </Descriptions>
            </Card>
            <Card title="流控内容" size="small" className="advanced-card" bordered={false}  >
                <Descriptions title="" bordered column={{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
                    <Descriptions.Item label="交接点(入点)">
                        LAGEX
                    </Descriptions.Item>
                    <Descriptions.Item label="开始时间">
                        29/1137
                    </Descriptions.Item>
                    <Descriptions.Item label="结束时间">
                        29/2100
                    </Descriptions.Item>
                    <Descriptions.Item label="交接点(出点)">
                        P40
                    </Descriptions.Item>
                    <Descriptions.Item label="开始时间">
                        29/1312
                    </Descriptions.Item>

                    <Descriptions.Item label="结束时间">
                        29/1935
                    </Descriptions.Item>
                    <Descriptions.Item label="起飞机场">
                        ZLXY
                    </Descriptions.Item>
                    <Descriptions.Item label="飞越区域">
                        {""}
                    </Descriptions.Item>

                    <Descriptions.Item label="起飞机场豁免">
                        ZLYA
                    </Descriptions.Item>
                    <Descriptions.Item label="落地机场">
                        ZLXY
                    </Descriptions.Item>
                    <Descriptions.Item label="进...区域">
                        {""}
                    </Descriptions.Item>

                    <Descriptions.Item label="落地机场豁免">
                        ZLYA
                    </Descriptions.Item>
                    <Descriptions.Item label="高度限制" span={3}>
                        <Space size={ 50 }>
                        <span>
                            {"5600,7200,11300"}
                        </span>
                            <span>
                            <Checkbox.Group options={options} defaultValue={['1','3']}  />
                        </span>

                        </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="航路">
                        LAGEX
                    </Descriptions.Item>
                    <Descriptions.Item label="持续时间">
                        120分钟
                    </Descriptions.Item>
                    <Descriptions.Item label="迟发时间">
                        62分钟
                    </Descriptions.Item>
                    <Descriptions.Item label="自由编辑" span={3}>
                        过LAGEX落深圳 珠海 澳门 30分钟 2 架且不小于100公里
                    </Descriptions.Item>
                    <Descriptions.Item label="备注" span={3}>

                    </Descriptions.Item>
                    <Descriptions.Item label="CRS流控" span={3}>
                        <Tag style={{ fontSize: "14px" }}>OMBON 落地5分钟/架 </Tag>
                        <Tag style={{ fontSize: "14px" }}>P127 限制间隔 5分钟 </Tag>
                    </Descriptions.Item>


                </Descriptions>
            </Card>




        </div>
    )
}


export default ATOMDetail;


