import React, {useEffect, useState, Fragment} from 'react'
import "moment/locale/zh-cn"
import { Descriptions, Collapse, DatePicker, Card, Form, Input, Row, Col, Select} from 'antd'
import ExemptCard from './ExemptCard'
import LimitedCard from './LimitedCard'
import  moment  from 'moment'
import { formatTimeString, getDateFromString, isValidObject, isValidVariable } from '../../utils/basic-verify'

const { Option } = Select;


//方案信息
function StaticInfoCard(props){

    const dateFormat = 'YYYY-MM-DD';
    const timeFormat = 'HHmm';

    const form = props.form;

    // 限制数值单位集合
    const restrictionModeUnit = {
        "MIT":"分钟",
        "AFP":"架",
    }

    // 限制方式
    let restrictionMode="";
    // 限制数值单位
    let unit = "";
    if(isValidObject(form)){
        restrictionMode = form.getFieldsValue()['restrictionMode']
        unit = restrictionModeUnit[restrictionMode] || "";
    }

    // 更新限制数值单位
    let [ modeUnit, setModeUnit] = useState(unit);
    useEffect(function(){
        setModeUnit(unit);
    },[restrictionMode])

    const updateStartDateString =(date) => {
        if( props.hasOwnProperty("updateStartDateString") ){
            let dateString = moment(date).format("YYYYMMDDHHmm");
            props.updateStartDateString(dateString);
        }

    };
    const updateStartTimeString =( { target: { value } } ) => {
        if( props.hasOwnProperty("updateStartTimeString") ){
            props.updateStartTimeString(value);
        }

    };

    const updateEndTimeDisplay =(date) => {
        if( props.hasOwnProperty("updateEndDateString") ){
            let dateString = moment(date).format("YYYYMMDDHHmm");
            props.updateEndDateString(dateString);
        }

    };


    const updateEndTimeString =( { target: { value } } ) => {
        if( props.hasOwnProperty("updateEndTimeString") ){
            props.updateEndTimeString(value);
        }

    };

    const handleRestrictionModeChange =(mode) => {
        // 更新表单限制方式字段数值
        props.updateRestrictionMode(mode);
        // 限制数值单位
        const unit = restrictionModeUnit[mode];
        // 更新限制数值单位
        setModeUnit(unit);

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
    const reasonData = [
        {"key":"AIRPORT", "text": "机场"},
        {"key":"MILITARY", "text": "军事活动"},
        {"key":"CONTROL", "text": "流量"},
        {"key":"WEATHER", "text": "天气"},
        {"key":"AIRLINE", "text": "航空公司"},
        {"key":"SCHEDULE", "text": "航班时刻"},
        {"key":"JOINT_INSPECTION", "text": "联检"},
        {"key":"OIL", "text": "油料"},
        {"key":"DEPART_SYSTEM", "text": "离港系统"},
        {"key":"PASSENGER", "text": "旅客"},
        {"key":"PUBLIC_SECURITY", "text": "公共安全"},
        {"key":"MAJOR_SECURITY_ACTIVITIES", "text": "重大保障活动"},
        {"key":"OTHER", "text": "其它"},
    ]

    return (
    <Fragment>

        <Card title="方案信息"  bordered={ false } size="">
            <Row gutter={24}>
                <Col span={24}>
                    <Form.Item
                        name="tacticName"
                        label="方案名称"
                        required={true}
                        rules={[{ required: true }]}
                    >
                        <Input disabled={ props.disabledForm }/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="tacticPublishUnit"
                        label="发布单位"
                        required={true}
                        rules={[{ required: true }]}
                    >
                        <Input className="text-uppercase" disabled={ props.disabledForm }/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="tacticPublishUser"
                        label="发布用户"
                    >
                        <Input className="text-uppercase" disabled={ props.disabledForm }/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="flowControlReason"
                        label="原因"
                    >
                        <Select style={{ width: 120 }}  disabled={ props.disabledForm } >
                            {reasonData.map(mode => (
                                <Option key={mode.key}>{mode.text}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={8}>

                    {
                        props.disabledForm ? (
                            <Form.Item
                                label="开始时间"
                                required={true}
                                // className="date-time-form-compact"
                                name="basicStartTimeDisplay"
                            >


                                <Input disabled={ props.disabledForm }/>
                            </Form.Item>
                        ) : (
                            <Form.Item
                                label="开始时间"
                                required={true}
                                className="date-time-form-compact"
                            >


                                <Form.Item
                                    name="startDate"
                                    // rules={[{ required: true }]}
                                    className="date-picker-form"
                                    rules={[{ required: true, message:'请选择开始日期' }]}
                                >
                                    <DatePicker
                                        allowClear={ false }
                                        onChange={ updateStartDateString }
                                        format={dateFormat}
                                        disabled={ props.disabledForm }
                                        placeholder={ dateFormat }
                                        className="date-picker-form"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="startTime"
                                    label=""
                                    className="time-form"
                                    rules={[{ required: true, message:'请输入开始时间' }]}
                                    // rules={[{ required: true }]}
                                >
                                    <Input
                                        placeholder={ timeFormat }
                                        onChange={ updateStartTimeString }

                                        disabled={ props.disabledForm }

                                    />
                                </Form.Item>
                            </Form.Item>
                        )
                    }

                </Col>
                <Col span={8}>

                    {
                        props.disabledForm ? (
                            <Form.Item
                                label="结束时间"
                                name="basicEndTimeDisplay"
                            >
                                <Input disabled={ props.disabledForm }/>
                            </Form.Item>
                        ) : (
                            <Form.Item
                                label="结束时间"
                                className="date-time-form-compact"
                            >
                                <Form.Item
                                    name="endDate"
                                    className="date-picker-form"
                                >
                                    <DatePicker
                                        allowClear={ false }
                                        onChange={ updateEndTimeDisplay }
                                        format={dateFormat}
                                        disabled={ props.disabledForm }
                                        placeholder={ dateFormat }
                                        className="date-picker-form"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="endTime"
                                    label=""
                                    className="time-form"

                                >
                                    <Input
                                        placeholder={ timeFormat }
                                        onChange={ updateEndTimeString }
                                        disabled={ props.disabledForm }
                                    />
                                </Form.Item>
                            </Form.Item>
                        )
                    }


                </Col>
            </Row>
        </Card>

        <Card title="措施信息" bordered={ false } size="">
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item
                        name="restrictionMode"
                        label="限制方式"
                        required={true}
                        rules={[{ required: true,  message: '请选择限制方式'  }]}
                    >
                        <Select style={{ width: 120 }} onChange={handleRestrictionModeChange} disabled={ props.disabledForm } >
                            {restrictionModeData.map(mode => (
                                <Option key={mode.key}>{mode.text}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="restrictionModeValue"
                        label="限制值"
                        rules={[{ required: true, message: '请输入限制值' }]}
                    >
                        <Input
                            style={{ width: 150 }}
                            disabled={ props.disabledForm }
                            addonAfter={ modeUnit }
                        />
                    </Form.Item>
                </Col>
            </Row>
        </Card>


        <Card title="交通流信息" bordered={ false } className="flow-control-flight">
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item
                        name="preorderUnit"
                        label="前序单元"
                    >
                        <Input className="text-uppercase" disabled={ props.disabledForm }/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="targetUnit"
                        label="基准单元"
                        required={true}
                        rules={[{ required: true }]}
                    >
                        <Input className="text-uppercase" disabled={ props.disabledForm }/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="behindUnit"
                        label="后序单元"
                    >
                        <Input className="text-uppercase" disabled={ props.disabledForm }/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="exemptPreUnit"
                        label="豁免前序"
                    >
                        <Input className="text-uppercase" disabled={ props.disabledForm }/>
                    </Form.Item>
                </Col>
                <Col span={8} className="">

                </Col>
                <Col span={8}>
                    <Form.Item
                        name="exemptbehindUnit"
                        label="豁免后序"
                    >
                        <Input className="text-uppercase" disabled={ props.disabledForm }/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="a"
                        label="起飞机场"
                    >
                        <Input className="text-uppercase" disabled={ props.disabledForm }/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="b"
                        label="高度"
                    >
                        <Input className="text-uppercase" disabled={ props.disabledForm }/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="c"
                        label="降落机场"
                    >
                        <Input className="text-uppercase" disabled={ props.disabledForm }/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="d"
                        label="豁免起飞机场"
                    >
                        <Input className="text-uppercase" disabled={ props.disabledForm }/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="e"
                        label="豁免高度"
                    >
                        <Input className="text-uppercase" disabled={ props.disabledForm }/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="f"
                        label="豁免降落机场"
                    >
                        <Input className="text-uppercase" disabled={ props.disabledForm }/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={12}>
                <Col span={12}>
                    <LimitedCard title="包含"  disabledForm={props.disabledForm}   />
                </Col>
                <Col span={12}>
                    <ExemptCard title="不包含"  disabledForm={props.disabledForm} />
                </Col>
            </Row>
        </Card>

    </Fragment>
    )
}

export default  StaticInfoCard