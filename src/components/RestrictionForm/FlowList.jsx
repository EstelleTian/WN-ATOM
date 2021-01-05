import React, {useEffect} from 'react'
import {Card, Collapse, Col, Descriptions, Form, Radio, Row, Input, DatePicker} from "antd";
import StaticFlowCard from './StaticFlowCard'

const { Panel } = Collapse;
//流控信息
function FlowList(props){
    return (
        <div>
            <Card title="流控基本信息" size="small" bordered={false}>
                <Descriptions size="small" bordered column={4}>
                    <Descriptions.Item label="流控名称" >
                        <Form.Item
                            name={`resName`}
                        >
                            <Input disabled={ props.disabledForm }/>
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label="流控发布类型">
                        <Form.Item
                            name={`resType`}
                        >
                            <Input disabled={ props.disabledForm }/>
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label="流控原因">
                        <Form.Item
                            name={`resReason`}
                        >
                            <Input disabled={ props.disabledForm }/>
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label="流控备注">
                        <Form.Item
                            name={`resComment`}
                        >
                            <Input disabled={ props.disabledForm }/>
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label="开始时间" span={2} >
                        {
                            props.disabledForm
                                ? ""
                                :  <Form.Item
                                    name={`resStartTime`}
                                >
                                    <DatePicker showTime format="YYYY-MM-DD HH:mm"/>
                                </Form.Item>
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="结束时间" span={2} >
                        {
                            props.disabledForm
                                ? ""
                                :  <Form.Item
                                    name={`resEndTime`}
                                >
                                    <DatePicker showTime format="YYYY-MM-DD HH:mm"/>
                                </Form.Item>
                        }
                    </Descriptions.Item>
                </Descriptions>
            </Card>
            <Card title="流控措施信息" size="small" bordered={false}>
                <Descriptions size="small"  bordered column={2}>
                    <Descriptions.Item label="流控限制方式">
                        <Form.Item
                            name={`resMethod`}
                        >
                            <Input disabled={ props.disabledForm }/>
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label="流控限制值">
                        <Form.Item
                            name={`resValue`}
                        >
                            <Input disabled={ props.disabledForm }/>
                        </Form.Item>
                    </Descriptions.Item>
                </Descriptions>
            </Card>
            <Card title="流控交通信息" size="small" bordered={false}>
                <Row>
                    <Col span={12}>
                        <StaticFlowCard title="包含"  disabledForm={props.disabledForm}/>
                    </Col>
                    <Col span={12}>
                        <StaticFlowCard title="不包含"  disabledForm={props.disabledForm}/>
                    </Col>
                </Row>
            </Card>
        </div>
        // <Collapse className="info_content"  defaultActiveKey={['0']}>
        //     {
        //         [1,2,3].map(( item, index) => (
        //             <Panel
        //                 key={index}
        //                 header={`流控`}
        //             >
        //
        //             </Panel>
        //         ))
        //     }
        // </Collapse>
    )
}

export default FlowList