import React, {useEffect, useState, Fragment} from 'react'
import "moment/locale/zh-cn"
import { Button, Radio, DatePicker, Card, Form, Input, Row, Col, Select, Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons';

import ExemptCard from './ExemptCard'
import LimitedCard from './LimitedCard'
import  moment  from 'moment'
import { formatTimeString, parseFullTime, isValidObject, isValidVariable } from '../../utils/basic-verify'
import { REGEXP } from '../../utils/regExpUtil'

const { Option } = Select;


//方案信息
function StaticInfoCard(props){

    const dateFormat = 'YYYY-MM-DD';
    const timeFormat = 'HHmm';

    const form = props.form;

    // 限制数值单位集合
    const restrictionModeUnit = {
        "MIT":"分钟一架",
        "AFP":"架",
    };
    /**
     * 区域机场数据
     *
     * */
    const areaAirportData = {
        'ZLLL':'ZBAL;ZBAR;ZBEN;ZBUH;ZLDH;ZLDL;ZLGL;ZLGM;ZLGY;ZLHB;ZLHX;ZLIC;ZLJC;ZLJQ;ZLLL;ZLLN;ZLTS;ZLXH;ZLXN;ZLYS;ZLZW;ZLZY',
        'ZLXY':'ZLAK;ZLHZ;ZLQY;ZLXY;ZLYA;ZLYL',
    };

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



    function areaBlockChange(e) {
        let value =  e.target.value;
        const arr = value.split('-');
        const field = arr[0];
        const val = arr[1];
        let valueString = areaAirportData[val] || '';
        updateFormAirportFieldValue(field, valueString);
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
     * 更新机场表单字段数值
     * */
    const updateFormAirportFieldValue =(field, value) => {
        if( props.hasOwnProperty("updateFormAirportFieldValue") ){
            props.updateFormAirportFieldValue(field, value);
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
            if(isValidObject(date)){
                let dateString = moment(date).format("YYYYMMDDHHmm");
                props.updateEndDateString(dateString);
            }else {
                props.updateEndDateString("");
            }
        }
    };
    /**
     * 自动填充结束日期
     * */
    const autoFillInEndDate =( value ) => {
        const startTime =  form.getFieldsValue()['startTime'];
        const startDate =  form.getFieldsValue()['startDate'];
        const endTime = form.getFieldsValue()['endTime'];
        const endDate =  form.getFieldsValue()['endDate'];
        const startDateString = moment(startDate).format("YYYYMMDDHHmm").substring(0,8);
        const startDateTime = startDateString+startTime;
        const startDateTimeFormatValid = REGEXP.DATETTIME12.test(startDateTime);
        if(startDateTimeFormatValid && value.length === 4 && !isValidVariable(endDate)){
            if(value*1 < startTime*1 || value*1 === startTime*1){
                const nextDate = moment(startDate).add(1, 'day');
                form.setFieldsValue({'endDate': moment(nextDate)})
                let dateString = moment(nextDate).format("YYYYMMDDHHmm");
                props.updateEndDateString(dateString);
            }else {
                form.setFieldsValue({'endDate': moment(startDate)})
                let dateString = moment(startDate).format("YYYYMMDDHHmm");
                props.updateEndDateString(dateString);
            }
        }
    }

    const updateEndTimeString =( { target: { value } } ) => {
        // 更新结束时间
        if( props.hasOwnProperty("updateEndTimeString") ){
            props.updateEndTimeString(value);
        }
        // 自动填充结束日期
        autoFillInEndDate(value);
    };

    const onOpenEndDatePickerChange =( open ) => {
        const startTime =  form.getFieldsValue()['startTime'];
        const startDate =  form.getFieldsValue()['startDate'];
        const endTime = form.getFieldsValue()['endTime'];
        const endDate =  form.getFieldsValue()['endDate'];
        if(open && isValidVariable(startDate) && !isValidVariable(endDate)) {
            form.setFieldsValue({'endDate': moment(startDate)});
            let dateString = moment(startDate).format("YYYYMMDDHHmm");
            console.log(dateString)
            props.updateEndDateString(dateString);
        }

    };

    const handleRestrictionModeChange =(mode) => {
        // 限制数值单位
        const unit = restrictionModeUnit[mode];
        // 更新限制数值单位
        setModeUnit(unit);

    };
    /**
     *
     * */
    const setRestrictionModeValueRules =()=> {
        if(restrictionMode ===""){

        }
    };

    /**
     * 自动命名
     * */
    const handleAutofillName =() => {
        // 更新表单方案名称数值
        props.autofillTacticName();
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
    /**
     * 校验开始时间和结束时间大小
     * */
    const validateTimeRange = (getFieldValue)=>{
        const validator =(rules, value)=> {
            const startTime =  getFieldValue('startTime');
            const startDate =  getFieldValue('startDate');
            const endTime = getFieldValue('endTime');
            const endDate =  getFieldValue('endDate');

             if(isValidVariable(endDate)
                && isValidVariable(endTime)
                && isValidVariable(startDate)
            ) {
                const startDateString = moment(startDate).format("YYYYMMDDHHmm").substring(0,8);
                const endDateString = moment(endDate).format("YYYYMMDDHHmm").substring(0,8);
                const startDateTime = startDateString+startTime;
                const endDateTime = endDateString+endTime;
                const startDateTimeFormatValid = REGEXP.DATETTIME12.test(startDateTime);
                const endDateTimeFormatValid = REGEXP.DATETTIME12.test(endDateTime);
                if(startDateTimeFormatValid && endDateTimeFormatValid){
                    if(parseFullTime(startDateTime).getTime() > parseFullTime(endDateTime).getTime()){
                        return Promise.reject('结束时间不能早于开始时间');
                    }else {
                        return Promise.resolve();
                    }
                }
            }
            return Promise.resolve();
        };
        return ({
            validator:validator,
        })
    };
    /**
     * 校验结束时间是否完整
     * */
    const validateEndTimeFormat = (getFieldValue)=>{
        const validator =(rules, value)=> {
            const endTime = getFieldValue('endTime');
            const endDate =  getFieldValue('endDate');
            if(isValidVariable(endDate) && !isValidVariable(endTime)) {
                return Promise.reject('请输入结束时间');
            }
            return Promise.resolve();
        };
        return ({
            validator:validator,
        })
    };
    /**
     * 校验结束日期是否完整
     * */
    const validateEndDateFormat = (getFieldValue)=>{
        const validator =(rules, value)=> {
            const endTime = getFieldValue('endTime');
            const endDate =  getFieldValue('endDate');
            if(!isValidVariable(endDate) && isValidVariable(endTime)) {
                return Promise.reject('请选择结束日期');
            }
            return Promise.resolve();
        };
        return ({
            validator:validator,
        })
    };

    const  disabledStartDate=(currentDate) => {
        return currentDate < moment().startOf('day') || currentDate > moment().add(2, 'day');
    };

    const disabledEndDate=(currentDate) => {
        const startDate = form.getFieldsValue()['startDate'];
        return currentDate < startDate || currentDate > moment(startDate).add(2, 'day');
    };

    return (
    <Fragment>
        <Card title="方案信息"  bordered={ false } size="">
            <Row gutter={24}>
                <Col span={20}>
                    <Form.Item
                        name="tacticName"
                        label="方案名称"
                        required={true}
                        rules={[{ required: true }]}
                    >
                        <Input  disabled={ props.disabledForm }/>
                    </Form.Item>
                </Col>
                {
                    props.disabledForm ? ""
                    : <Col span={3}>
                        <Form.Item >
                            <Button type="primary" onClick={ handleAutofillName } >自动命名</Button>
                        </Form.Item>
                    </Col>
                }
                
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
                                    className="date-picker-form"
                                    rules={[
                                        { required: true, message:'请选择开始日期' },
                                        ]}
                                >
                                    <DatePicker
                                        onChange={ updateStartDateString }
                                        format={dateFormat}
                                        disabledDate = { disabledStartDate }
                                        disabled={ props.disabledForm }
                                        placeholder={ dateFormat }
                                        className="date-picker-form"
                                        showToday={false}
                                        mode="date"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="startTime"
                                    label=""
                                    className="time-form"
                                    rules={[
                                        {
                                            type: 'string',
                                            pattern: REGEXP.TIMEHHmm,
                                            message: '请输入有效的开始时间',
                                        },
                                        {
                                            required: true,
                                            message: '请输入开始时间',
                                        },
                                    ]}
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
                                    dependencies={['endTime']}
                                    rules={[
                                        ({ getFieldValue }) => validateEndDateFormat(getFieldValue),
                                    ]}
                                >
                                    <DatePicker
                                        onChange={ updateEndTimeDisplay }
                                        format={dateFormat}
                                        disabledDate = { disabledEndDate }
                                        disabled={ props.disabledForm }
                                        placeholder={ dateFormat }
                                        className="date-picker-form"
                                        showToday={false}
                                        onOpenChange={ onOpenEndDatePickerChange }
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="endTime"
                                    label=""
                                    className="time-form"
                                    dependencies={['endDate', 'startDate', 'startTime']}
                                    rules={[
                                        {
                                            type: 'string',
                                            pattern: REGEXP.TIMEHHmm,
                                            message: '请输入有效的结束时间',
                                        },
                                        ({ getFieldValue }) => validateEndTimeFormat(getFieldValue),
                                        ({ getFieldValue }) => validateTimeRange(getFieldValue),
                                    ]}

                                >
                                    <Input
                                        allowClear={true}
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
                        rules={[
                            {
                                required: true,
                                message: '请输入限制值'
                            },
                            {
                                type: 'string',
                                pattern: REGEXP.INTEGER0_999,
                                message: '请输入0~999范围内的整数',
                            },
                            ]}
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
            {
                props.disabledForm ? "":
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
            }

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
            {
                props.disabledForm ? "":
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
            }
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