import React, {useEffect, useState, Fragment} from 'react'
import "moment/locale/zh-cn"
import { Button, Radio, DatePicker, Card, Form, Input, Row, Col, Select, Tooltip } from 'antd'
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

    // 起飞机场
    let depAp= "";
    if(isValidObject(form)){
        depAp = form.getFieldsValue()['depAp'] || '';
    }
    // 降落机场
    let arrAp= "";
    if(isValidObject(form)){
        arrAp = form.getFieldsValue()['arrAp'] || '';
    }

    // 豁免起飞机场
    let exemptDepAp= "";
    if(isValidObject(form)){
        exemptDepAp = form.getFieldsValue()['exemptDepAp'] || '';
    }
    // 豁免降落机场
    let exemptArrAp= "";
    if(isValidObject(form)){
        exemptArrAp = form.getFieldsValue()['exemptArrAp'] || '';
    }

    // 更新限制数值单位
    let [ modeUnit, setModeUnit] = useState(unit);
    // 起飞机场
    let [ depApValue, setDepApValue] = useState(depAp);
    let [ arrApValue, setArrApValue] = useState(arrAp);
    let [ exemptDepApValue, setExemptDepApValue] = useState(exemptDepAp);
    let [ exemptArrApValue, setExemptArrApValue] = useState(exemptArrAp);

    useEffect(function(){
        setModeUnit(unit);
    },[restrictionMode,])

    /**
     * 区域机场数据
     *
     * */
    const areaAirportData = {
        'ZLLL':'ZBAL;ZBAR;ZBEN;ZBUH;ZLDH;ZLDL;ZLGL;ZLGM;ZLGY;ZLHB;ZLHX;ZLIC;ZLJC;ZLJQ;ZLLL;ZLLN;ZLTS;ZLXH;ZLXN;ZLYS;ZLZW;ZLZY',
        'ZLXY':'ZLAK;ZLHZ;ZLQY;ZLXY;ZLYA;ZLYL',
    };

    function areaBlockChange(e) {
        let value =  e.target.value;
        const arr = value.split('-');
        const field = arr[0];
        const val = arr[1];
        let valueString = areaAirportData[val] || '';
        updateFormAPFieldValue(field, valueString);
    }

    function areaBlock(field) {
        return (
            <Radio.Group onChange={areaBlockChange} buttonStyle="solid">
                <Radio.Button value={`${field}-ZLLL`}>兰州</Radio.Button>
                <Radio.Button value={`${field}-ZLXY`}>西安</Radio.Button>
                <Radio.Button value={`${field}-ZBSD`}>山东</Radio.Button>
                <Radio.Button value={`${field}-MORE`}>更多</Radio.Button>
            </Radio.Group>
        )
    }



    /**
     * 更新表单字段数值
     * */
    const updateFormAPFieldValue =(field, value) => {
        if( props.hasOwnProperty("updateFormAPFieldValue") ){
            props.updateFormAPFieldValue(field, value);
        }
        if(field ==='depAp'){
            setDepApValue(value);
        } else if(field ==='arrAp'){
            setArrApValue(value);
        }else if(field ==='exemptDepAp'){
            setExemptDepApValue(value)
        }else if(field ==='exemptArrAp'){
            setExemptArrApValue(value)
        }
    };

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
                <Col span={21}>
                    <Form.Item
                        name="tacticName"
                        label="方案名称"
                        required={true}
                        rules={[{ required: true }]}
                    >
                        <Input disabled={ props.disabledForm }/>
                    </Form.Item>
                </Col>
                <Col span={3}>
                    <Form.Item >
                        <Button type="primary">自动命名</Button>
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
                        name="formerUnit"
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
            </Row>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item
                        name="exemptFormerUnit"
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
            </Row>
            <Row gutter={24}>
                <Col span={8}>

                    <Form.Item
                        name="depAp"
                        label="起飞机场"
                    >
                        <Input title={depApValue} className="text-uppercase" disabled={ props.disabledForm }/>
                    </Form.Item>

                </Col>
                <Col span={8}>
                    <Form.Item
                        name="highLimit"
                        label="高度"
                    >
                        <Input className="text-uppercase" disabled={ props.disabledForm }/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="arrAp"
                        label="降落机场"
                    >
                        <Input title={arrApValue} className="text-uppercase" disabled={ props.disabledForm }/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item
                        className="hidden-label"
                        name="depAp-area"
                        label={` `}
                    >
                        {areaBlock('depAp')}
                    </Form.Item>
                </Col>
                <Col span={8} className=""></Col>
                <Col span={8}>
                    <Form.Item
                        className="hidden-label"
                        name="arrAp-area"
                        label={` `}
                    >
                        {areaBlock('arrAp')}
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item
                        name="exemptDepAp"
                        label="豁免起飞机场"
                    >
                        <Input title={exemptDepApValue} className="text-uppercase" disabled={ props.disabledForm }/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="exemptHeight"
                        label="豁免高度"
                    >
                        <Input className="text-uppercase" disabled={ props.disabledForm }/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="exemptArrAp"
                        label="豁免降落机场"
                    >
                        <Input title={exemptArrApValue} className="text-uppercase" disabled={ props.disabledForm }/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item
                        className="hidden-label"
                        name="exemptDepAp-area"
                        label={` `}
                    >
                        {areaBlock('exemptDepAp')}
                    </Form.Item>
                </Col>
                <Col span={8} className=""></Col>
                <Col span={8}>
                    <Form.Item
                        className="hidden-label"
                        name="exemptArrAp-area"
                        label={` `}
                    >
                        {areaBlock('exemptArrAp')}
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