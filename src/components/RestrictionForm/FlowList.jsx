import React, {useEffect} from 'react'
import {Card, Collapse, Col, Descriptions, Form, Radio, Row, Input, DatePicker} from "antd";
import StaticFlowCard from './StaticFlowCard'

const { Panel } = Collapse;
//流控信息
function FlowList(props){
    return (
        <Collapse className="info_content"  defaultActiveKey={['0']}>
            {
                [1,2,3].map(( item, index) => (
                    <Panel
                        key={index}
                        header={`流控${index+1}`}
                    >
                        <Card title="基本信息" size="small" bordered={false}>
                            <Descriptions size="small" bordered column={4}>
                                <Descriptions.Item label="流控名称" >
                                    <Form.Item
                                        name={`resName${index+1}`}
                                    >
                                        <Input/>
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label="流控发布类型">
                                    <Form.Item
                                        name={`resType${index+1}`}
                                    >
                                        <Input/>
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label="流控原因">
                                    <Form.Item
                                        name={`resReason${index+1}`}
                                    >
                                        <Input/>
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label="流控备注">
                                    <Form.Item
                                        name={`resComment${index+1}`}
                                    >
                                        <Input/>
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label="开始时间" span={2} >
                                    <Form.Item
                                        name={`resStartTime${index+1}`}
                                    >
                                        <DatePicker showTime format="YYYY-MM-DD HH:mm"/>
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label="结束时间" span={2} >
                                    <Form.Item
                                        name={`resEndTime${index+1}`}
                                    >
                                        <DatePicker showTime format="YYYY-MM-DD HH:mm"/>
                                    </Form.Item>
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                        <Card title="流控措施信息" size="small" bordered={false}>
                            <Descriptions size="small"  bordered column={2}>
                                <Descriptions.Item label="流控限制方式">
                                    <Form.Item
                                        name={`resMethod${index+1}`}
                                    >
                                        <Input/>
                                    </Form.Item>
                                </Descriptions.Item>
                                <Descriptions.Item label="流控限制值">
                                    <Form.Item
                                        name={`resValue${index+1}`}
                                    >
                                        <Input/>
                                    </Form.Item>
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                        <Card title="流控交通信息" size="small" bordered={false}>
                            <Row>
                                <Col span={12}>
                                    <StaticFlowCard title="包含" index={index}/>
                                </Col>
                                <Col span={12}>
                                    <StaticFlowCard title="不包含"  index={index}/>
                                </Col>
                            </Row>
                        </Card>
                    </Panel>
                ))
            }
        </Collapse>
    )
}

export default FlowList