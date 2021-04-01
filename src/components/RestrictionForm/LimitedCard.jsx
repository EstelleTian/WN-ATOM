import React, {useEffect} from 'react'
import {Card, Checkbox, Col, DatePicker, Descriptions, Form, Input, Radio, Select, Row, Tag, Tooltip  } from "antd";

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
const wakeFlowLevel = [
    { label: 'G', value: 'G' },
    { label: 'H', value: 'H' },
    { label: 'M', value: 'M' },
    { label: 'L', value: 'L' },
];
//运营人
const auType = [
    { label: '内机', value: 'DOMESTIC_AU' },
    { label: '外机', value: 'FOREIGN_AU' },
    { label: '台湾机', value: 'TAIWAN_AU' },
    { label: '港澳机', value: 'HKANDMC_AU' },
    { label: '未知', value: 'UNKNOWN' },
]

//航班类型选项
const airlineType = [
    { label: '国内', value: 'DOMESTIC_AIRLINE' },
    { label: '国际', value: 'INTERNATIONAL_AIRLINE'},
    { label: '台湾地区', value: 'TAIWAN_AIRLINE' },
    { label: '港澳特区', value: 'HKANDMC_AIRLINE' },
    { label: '飞越', value: 'OVERFLY_AIRLINE' },
    { label: '未知', value: 'UNKNOWN' },
];
//客货类型选项
const missionType = [
    { label: '客班', value: 'AIRLINE_MISSION'},
    { label: '货班', value: 'CARGO_MISSION' },
    { label: '未知', value: 'UNKNOWN' },
];
//任务类型选项
const task = [
    { label: '正班', value: 'REGULAR' },
    { label: '补班', value: 'PATCH' },
    { label: '加班包机', value: 'PAXCHARTER' },
    { label: '调机', value: 'FERRY' },
    { label: '校飞', value: 'CHECK' },
    { label: '急救', value: 'AMBULANCE' },
    { label: '公务机', value: 'BUSINESS' },
    { label: '其他', value: 'OTHER' },
];
//军民航选项
const organization = [
    { label: '军航', value: 'MILITARY' },
    { label: '民航', value: 'CIVIL' },
    { label: '未知', value: 'UNKNOWN' },
];
//限制资质选项
const ability = [
    { label: 'II类', value: 'CAT2' }
];


//交通流表单
function LimitedCard(props){
    // const index = props.index || "4";


    return (
        <Card className="inner-card" title={props.title} size="">
            <Row gutter={24}>
                <Col span={24}>
                    <Form.Item
                        name="flightId"
                        label="航班号"
                    >
                        <Select
                            disabled={ props.disabledForm }
                            mode="tags"
                            style={{ width: '100%' }}
                            placeholder=""
                            open={ false }
                            onChange={ (val)=> (console.log(val))}
                            className="text-uppercase"
                            allowClear={ true }
                        >
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="wakeFlowLevel"
                        label="尾流类型"
                    >
                        <Checkbox.Group options={wakeFlowLevel} disabled={ props.disabledForm } />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="auType"
                        label="运营人"
                    >
                        <Checkbox.Group options={auType} disabled={ props.disabledForm } />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="airlineType"
                        label="航班类型"
                    >
                        <Checkbox.Group options={airlineType} disabled={ props.disabledForm } />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="missionType"
                        label="客货类型"
                    >
                        <Checkbox.Group options={missionType} disabled={ props.disabledForm } />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="task"
                        label="任务类型"
                    >
                        <Checkbox.Group options={task} disabled={ props.disabledForm } />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="organization"
                        label="军民航"
                    >
                        <Checkbox.Group options={organization} disabled={ props.disabledForm } />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="ability"
                        label="限制资质"
                    >
                        <Checkbox.Group options={ability} disabled={ props.disabledForm } />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="aircraftType"
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
                <Col span={24}>
                    <Form.Item
                        name="flowControlAltitude"
                        label="受控高度"
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
