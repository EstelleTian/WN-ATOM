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
    { label: 'J', value: 'TYPE_J' },
    { label: 'H', value: 'TYPE_H' },
    { label: 'B', value: 'TYPE_B' },
    { label: 'C', value: 'TYPE_C' },
    { label: 'M', value: 'TYPE_M' },
    { label: 'L', value: 'TYPE_L' },
    { label: '其他', value: 'TYPE_OTHER' },
];
//航班性质选项
const flowControlMissionType = [
    { label: '内地', value: 'TYPE_DOMESTIC' },
    { label: '港澳台', value: 'TYPE_GAT' },
    { label: '国际', value: 'TYPE_INTERNATIONAL' }
];
//客货类型选项
const flowControlPassengerCargoType = [
    { label: '客班', value: 'TYPE_PASSENGER' },
    { label: '货班', value: 'TYPE_CARGO' }
];
//任务类型选项
const flowControlTaskType = [
    { label: '专机', value: 'TYPE_PRIVATE' },
    { label: '特殊', value: 'TYPE_SPECIAL' },
    { label: '临时', value: 'TYPE_PATCH' },
    { label: '正班', value: 'TYPE_REGULAR' },
];
//航班属性选项
const flowControlMilitaryCivilType = [
    { label: '军航', value: 'TYPE_MILITARY' },
    { label: '民航', value: 'TYPE_CIVIL' }
];
//限制资质选项
const flowControlQualification = [
    { label: 'II类', value: 'TYPE_QUALIFICATION' }
];


//交通流表单
function LimitedCard(props){
    // const index = props.index || "4";
    return (
        <Card title={props.title} size="small">

            <Descriptions size="small"  bordered column={1}>
                <Descriptions.Item label="航班号" >
                    <Form.Item
                        name={`flowControlFlightId`}
                    >

                        <Select
                            disabled={ props.disabledForm }
                            mode="tags"
                            style={{ width: '100%' }}
                            placeholder=""
                            open={ false }
                        >

                        </Select>
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label="尾流类型" >
                    <Form.Item name={`flowControlWakeFlowType`} >
                        <Checkbox.Group options={flowControlWakeFlowType} disabled={ props.disabledForm } />
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label="航班性质" >
                    <Form.Item name={`flowControlMissionType`} >
                        <Checkbox.Group options={flowControlMissionType} disabled={ props.disabledForm } />
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label="客货类型" >
                    <Form.Item name={`flowControlPassengerCargoType`} >
                        <Checkbox.Group options={flowControlPassengerCargoType} disabled={ props.disabledForm } />
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label="任务类型" >
                    <Form.Item name={`flowControlTaskType`} >
                        <Checkbox.Group options={flowControlTaskType} disabled={ props.disabledForm } />
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label="航班属性" >
                    <Form.Item name={`flowControlMilitaryCivilType`} >
                        <Checkbox.Group options={flowControlMilitaryCivilType} disabled={ props.disabledForm } />
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label="限制资质" >
                    <Form.Item name={`flowControlQualification`} >
                        <Checkbox.Group options={flowControlQualification} disabled={ props.disabledForm } />
                    </Form.Item>

                </Descriptions.Item>
                <Descriptions.Item label="受控机型" >
                    <Form.Item
                        name={`flowControlAircraftType`}
                    >
                        <Select
                            disabled={ props.disabledForm }
                            mode="tags"
                            style={{ width: '100%' }}
                            placeholder=""
                            open={ false }
                        >

                        </Select>
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label="受控高度" >
                    <Form.Item
                        name={`rHigh`}
                    >
                        <Input disabled={ props.disabledForm }/>
                    </Form.Item>
                </Descriptions.Item>
            </Descriptions>
        </Card>
    )
}

export default  LimitedCard