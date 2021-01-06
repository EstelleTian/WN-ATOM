import React, {useEffect} from 'react'
import {Card, Collapse, Col, Descriptions, Form, Radio, Row, Input, DatePicker, Select } from "antd";
import StaticFlowCard from './StaticFlowCard'
import ExemptCard from './ExemptCard'
import LimitedCard from './LimitedCard'
import  moment  from 'moment'

const { Option } = Select;
const { Panel } = Collapse;
//流控信息
function FlowList(props){
    const dateFormat = 'YYYYMMDD HHmm';

    const { defaultValue={} } = props;

    const updateStartTimeDisplay =(date) => {
        let dateString = moment(date).format("YYYYMMDDHHmm");
        props.updateFlowControlStartTimeDisplay(dateString);
    };



    const updateEndTimeDisplay =(date) => {
        let dateString = moment(date).format("YYYYMMDDHHmm");
        props.updateFlowControlEndTimeDisplay(dateString);
    };

    const handleRestrictionModeChange =(mode) => {
        props.updateRestrictionMode(mode);
    };

    const handlePublishTypeChange =(type) => {
        props.updatePublishType(type);
    };

    const restrictionModeData = [
        {"key":"AFP", "text": "AFP"},
        // {"key":"GDP", "text": "GDP"},
        {"key":"MIT", "text": "MIT"},
        // {"key":"GS", "text": "地面停止"},
        // {"key":"AS", "text": "指定时隙"},
        // {"key":"BREQ", "text": "上客申请"},
        // {"key":"REQ", "text": "开车申请"},
        // {"key":"TC", "text": "总量控制"},
        // {"key":"AH", "text": "空中等待"},
        // {"key":"CT", "text": "改航"},
        // {"key":"AA", "text": "空域开闭限制"},
    ]

    const publishTypeData = [
        {"key":"ORIGINAL", "text": "原发"},
        {"key":"FORWARDING", "text": "转发"},
    ]





    return (
        <div>
            <Card title="流控基本信息" size="small" bordered={false}>
                <Descriptions size="small" bordered   span={4}>
                    <Descriptions.Item label="流控名称" >
                        <Form.Item
                            name={`flowControlName`}
                        >
                            <Input disabled={ props.disabledForm }/>
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label="流控发布类型" >
                        <Form.Item
                            name={`flowControlPublishType`}


                        >
                            <Select style={{ width: 120 }} onChange={handlePublishTypeChange} disabled={ props.disabledForm } >
                                {publishTypeData.map(type => (
                                    <Option key={type.key}>{type.text}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label="流控原因">
                        <Form.Item
                            name={`flowControlReason`}
                        >
                            <Input disabled={ props.disabledForm }/>
                        </Form.Item>
                    </Descriptions.Item>

                    <Descriptions.Item label="开始时间" >
                        {
                            props.disabledForm
                                ? <Form.Item name="flowControlStartTimeDisplay">
                                    <Input disabled={ props.disabledForm }/>
                                </Form.Item>
                                :  <Form.Item
                                    name={`flowControlStartTimeEdit`}
                                >
                                    <DatePicker showTime onChange={ updateStartTimeDisplay } format={dateFormat}/>
                                </Form.Item>
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="结束时间" >
                        {
                            props.disabledForm
                                ? <Form.Item name="flowControlEndTimeDisplay">
                                    <Input disabled={ props.disabledForm }/>
                                </Form.Item>
                                :  <Form.Item
                                    name={`flowControlEndTimeEdit`}
                                >
                                    <DatePicker showTime  onChange={ updateEndTimeDisplay } format={dateFormat}/>
                                </Form.Item>
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="流控备注">
                        <Form.Item
                            name={`restrictionRemark`}
                        >
                            <Input disabled={ props.disabledForm }/>
                        </Form.Item>
                    </Descriptions.Item>
                </Descriptions>
            </Card>
            <Card title="流控措施信息" size="small" bordered={false}>
                <Descriptions size="small"  bordered >
                    <Descriptions.Item label="流控限制方式">
                        <Form.Item
                            name={`restrictionMode`}
                        >
                            <Select style={{ width: 120 }} onChange={handleRestrictionModeChange} disabled={ props.disabledForm } >
                                {restrictionModeData.map(mode => (
                                    <Option key={mode.key}>{mode.text}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                    </Descriptions.Item>
                    <Descriptions.Item label="流控限制值">
                        <Form.Item
                            name={`restrictionModeValue`}
                        >
                            <Input disabled={ props.disabledForm } />
                        </Form.Item>
                    </Descriptions.Item>
                </Descriptions>
            </Card>
            <Card title="流控交通信息" size="small" bordered={false}>
                <Row>
                    <Col span={12}>
                        <LimitedCard title="包含"  disabledForm={props.disabledForm}   />
                    </Col>
                    <Col span={12}>
                        <ExemptCard title="不包含"  disabledForm={props.disabledForm} />
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