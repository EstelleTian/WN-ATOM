import React, {useEffect} from 'react'
import {Card, Checkbox, Col, DatePicker, Descriptions, Form, Input, Radio, Row} from "antd";

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
const weiliuOptions = [
    { label: 'J', value: 'J' },
    { label: 'H', value: 'H' },
    { label: 'B', value: 'B' },
    { label: 'C', value: 'C' },
    { label: 'M', value: 'M' },
    { label: 'L', value: 'L' },
    { label: '其他', value: '其他' },
];
//航班性质选项
const xingzhiOptions = [
    { label: '内地', value: '内地' },
    { label: '港澳台', value: '港澳台' },
    { label: '国际', value: '国际' }
];
//客货类型选项
const kehuoOptions = [
    { label: '客班', value: '客班' },
    { label: '货班', value: '货班' }
];
//任务类型选项
const renwuOptions = [
    { label: '专机', value: '专机' },
    { label: '特殊', value: '特殊' },
    { label: '临时', value: '临时' },
    { label: '正班', value: '正班' },
];
//航班属性选项
const shuxingOptions = [
    { label: '军航', value: '军航' },
    { label: '民航', value: '民航' }
];
//限制资质选项
const zizhiOptions = [
    { label: 'II类', value: 'II类' }
];


//交通流表单
function StaticFlowCard(props){
    // const index = props.index || "4";
    return (
        <Card title={props.title} size="small">

            <Descriptions size="small"  bordered column={1}>
                <Descriptions.Item label="航班号" >
                    <Form.Item
                        name={`callsign`}
                    >
                        <Input disabled={ props.disabledForm }/>
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label="尾流类型" >
                        {
                            props.disabledForm
                                ? ""
                                : <Form.Item name={`weilliuType`} >
                                    <Checkbox.Group options={weiliuOptions} />
                                </Form.Item>
                        }
                </Descriptions.Item>
                <Descriptions.Item label="航班性质" >
                        {
                            props.disabledForm
                                ? ""
                                : <Form.Item name={`hangbanxingzhi`} >
                                    <Checkbox.Group options={xingzhiOptions} />
                                </Form.Item>
                        }
                </Descriptions.Item>
                <Descriptions.Item label="客货类型" >
                        {
                            props.disabledForm
                                ? ""
                                : <Form.Item name={`kehuoleixing`} >
                                    <Checkbox.Group options={kehuoOptions} />
                            </Form.Item>
                        }
                </Descriptions.Item>
                <Descriptions.Item label="任务类型" >
                        {
                            props.disabledForm
                                ? ""
                                : <Form.Item name={`renwuleixing`} >
                                    <Checkbox.Group options={renwuOptions} />
                                </Form.Item>
                        }
                </Descriptions.Item>
                <Descriptions.Item label="航班属性" >
                        {
                            props.disabledForm
                                ? ""
                                :  <Form.Item name={`hangbanshuxing`} >
                                    <Checkbox.Group options={shuxingOptions} />
                            </Form.Item>
                        }
                </Descriptions.Item>
                <Descriptions.Item label="限制资质" >
                    {
                        props.disabledForm
                            ? ""
                            : <Form.Item name={`xianzhizizhi`} >
                                <Checkbox.Group options={zizhiOptions} />
                            </Form.Item>
                    }

                </Descriptions.Item>
                <Descriptions.Item label="受控机型" >
                    <Form.Item
                        name={`rType`}
                    >
                        <Input disabled={ props.disabledForm }/>
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

export default  StaticFlowCard
