import React, {useEffect} from 'react'
import "moment/locale/zh-cn"
import { Descriptions, Collapse, DatePicker, Card, Form, Input,} from 'antd'

//方案信息
function StaticInfoCard(props){
    return (
        <Card title="方案信息" size="small">
            <Descriptions size="small"  bordered column={2}>
                <Descriptions.Item label="方案名称">
                    <Form.Item
                        name="staticName"
                    >
                        <Input/>
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label="原始流控">
                    <Form.Item
                        name="origFlowContent"
                    >
                        <Input/>
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label="发布单位" >
                    <Form.Item
                        name="publicUnit"
                    >
                        <Input/>
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label="发布用户" >
                    <Form.Item
                        name="publicUser"
                    >
                        <Input/>
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label="开始时间" >
                    <Form.Item
                        name="startTime"
                    >
                        <DatePicker showTime format="YYYY-MM-DD HH:mm"/>
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label="结束时间" >
                    <Form.Item
                        name="endTime"
                    >
                        <DatePicker showTime format="YYYY-MM-DD HH:mm"/>
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label="基准单元"  span={2}>
                    <Form.Item
                        name="unit"
                    >
                        <Input/>
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label="前序单元">
                    <Form.Item
                        name="prevUnit"
                    >
                        <Input/>
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label="后序单元">
                    <Form.Item
                        name="nextUnit"
                    >
                        <Input/>
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label="豁免前序">
                    <Form.Item
                        name="prevExempt"
                    >
                        <Input/>
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label="豁免后序">
                    <Form.Item
                        name="nextExempt"
                    >
                        <Input/>
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label="限制高度" span={2}>
                    <Form.Item
                        name="resHigh"
                    >
                        <Input/>
                    </Form.Item>
                </Descriptions.Item>
            </Descriptions>
        </Card>
    )
}

export default  StaticInfoCard