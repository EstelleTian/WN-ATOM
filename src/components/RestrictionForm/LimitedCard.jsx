import React, {useEffect} from 'react'
import {Card, Checkbox, Col, DatePicker, Descriptions, Form, Input, Radio, Select, Row} from "antd";

// 前序/后序表单
function XuCard(props){
    const { index, type } = props
    return (
        <Descriptions size="small"  bordered column={1}>
            <Descriptions.Item label="机场" >
                <Form.Item
                    name={`${type}-airport`}
                >
                    <Input disabled={ props.disabledForm }/>
                </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="" >
                <Radio.Group buttonStyle="solid">
                    <Radio.Button value="b">陕西省</Radio.Button>
                    <Radio.Button value="c">陕西省</Radio.Button>
                    <Radio.Button value="d">陕西省</Radio.Button>
                    <Radio.Button value="d">陕西省</Radio.Button>
                    <Radio.Button value="d">陕西省</Radio.Button>
                    <Radio.Button value="d">更&nbsp;&nbsp;&nbsp;&nbsp;多</Radio.Button>
                </Radio.Group>
            </Descriptions.Item>
            <Descriptions.Item label="航路" >
                <Form.Item
                    name={`${type}-airline`}
                >
                    <Input disabled={ props.disabledForm }/>
                </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="区域" >
                <Form.Item
                    name={`${type}-area`}
                >
                    <Input disabled={ props.disabledForm }/>
                </Form.Item>
            </Descriptions.Item>
        </Descriptions>
    )
}
//尾流类型选项
const flowControlWakeFlowType = [
    { label: 'J', value: 'J' },
    { label: 'H', value: 'H' },
    { label: 'B', value: 'B' },
    { label: 'C', value: 'C' },
    { label: 'M', value: 'M' },
    { label: 'L', value: 'L' },
    { label: '其他', value: 'OTHER' },
];
//航班性质选项
const flowControlMissionType = [
    { label: '国内', value: 'D' },
    { label: '国际', value: 'I' },
    { label: '飞越', value: 'O' },
    { label: '台湾', value: 'TW' },
    { label: '港澳', value: 'GA' },
    { label: '后续国际', value: 'NI' },
];
//客货类型选项
const flowControlPassengerCargoType = [
    { label: '客班', value: 'PASSENGER' },
    { label: '货班', value: 'CARGO' }
];
//任务类型选项
const flowControlTaskType = [
    { label: '专机', value: 'PRIVATE' },
    { label: '特殊', value: 'SPECIAL' },
    { label: '临时', value: 'PATCH' },
    { label: '正班', value: 'REGULAR' },
];
//航班属性选项
const flowControlMilitaryCivilType = [
    { label: '军航', value: 'MILITARY' },
    { label: '民航', value: 'CIVIL' }
];
//限制资质选项
const flowControlQualification = [
    { label: 'II类', value: 'CAT2' }
];


//交通流表单
function LimitedCard(props){
    // const index = props.index || "4";

    const handleChange = (value, option)=> {
        console.log(value, option)
    }

    return (
        <Card className="inner-card" title={props.title} size="">
            <Row gutter={24}>
                <Col span={24}>
                    <Form.Item
                        name="flowControlFlightId"
                        label="航班号"
                    >
                        <Select
                            disabled={ props.disabledForm }
                            mode="tags"
                            style={{ width: '100%' }}
                            placeholder=""
                            open={ false }
                            onChange={ (val)=> (console.log(val))}
                            onInputKeyDown={ handleChange}
                            className="text-uppercase"
                            allowClear={ true }
                        >
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="flowControlWakeFlowType"
                        label="尾流类型"
                    >
                        <Checkbox.Group options={flowControlWakeFlowType} disabled={ props.disabledForm } />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="flowControlMissionType"
                        label="航班性质"
                    >
                        <Checkbox.Group options={flowControlMissionType} disabled={ props.disabledForm } />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="flowControlPassengerCargoType"
                        label="客货类型"
                    >
                        <Checkbox.Group options={flowControlPassengerCargoType} disabled={ props.disabledForm } />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="flowControlTaskType"
                        label="任务类型"
                    >
                        <Checkbox.Group options={flowControlTaskType} disabled={ props.disabledForm } />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="flowControlMilitaryCivilType"
                        label="航班属性"
                    >
                        <Checkbox.Group options={flowControlMilitaryCivilType} disabled={ props.disabledForm } />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="flowControlQualification"
                        label="限制资质"
                    >
                        <Checkbox.Group options={flowControlQualification} disabled={ props.disabledForm } />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="flowControlAircraftType"
                        label="受控机型"
                    >
                        <Select
                            disabled={ props.disabledForm }
                            mode="tags"
                            style={{ width: '100%' }}
                            placeholder=""
                            open={ false }
                            className="text-uppercase"
                            allowClear={ true }
                        >

                        </Select>
                    </Form.Item>
                </Col>
            </Row>

        </Card>
    )
}

export default  LimitedCard
