import React, { Fragment, useEffect } from 'react'
import { Form, Input, Row, Col, DatePicker, } from 'antd'
import { inject, observer } from "mobx-react";
import { isValidVariable, parseFullTime, formatTimeString } from 'utils/basic-verify';

import { REGEXP } from 'utils/regExpUtil'
import moment from 'moment'

//方案日期时间表单
function TacticDateTimeForm(props) {
    const dateFormat = 'YYYY-MM-DD';
    const timeFormat = 'HHmm';
    const dateTimeFormat = "YYYYMMDDHHmm"

    const { schemeFormData, systemPage, form } = props;
    // 方案开始时间
    const startTime = schemeFormData.startTime || "";
    // 方案结束时间
    const endTime = schemeFormData.endTime || "";
    // 方案基础信息
    const basicTacticInfo = schemeFormData.schemeData.basicTacticInfo || {};
    // 方案名称
    const tacticName = basicTacticInfo.tacticName || "";
    // 限制方式
    const restrictionMode = schemeFormData.restrictionMode;
    // 终端当前时间+5分钟
    let now = moment().add(5, 'minutes');
    // 若方案开始时间无效则填充当前时间+5分钟
    if (!isValidVariable(startTime)) {
        let timeString = moment(now).format(dateTimeFormat);
        console.log(timeString)
        schemeFormData.updateTacticStartTime(timeString);
    }
    // 开始日期时间字符串(非编辑状态下显示)
    const startDateTimeString = isValidVariable(startTime) ? formatTimeString(startTime) : "";
    // 结束日期时间字符串(非编辑状态下显示)
    const endDateTimeString = isValidVariable(endTime) ? formatTimeString(endTime) : "";
    // 开始日期 Date类型
    const startDate = isValidVariable(startTime) ? moment(startTime, dateFormat) : moment(now, dateFormat);
    // 结束日期 Date类型
    const endDate = isValidVariable(endTime) ? moment(endTime, dateFormat) : "";
    // 结束日期 HHmm
    const startTimeString = isValidVariable(startTime) ? startTime.substring(8, 12) : moment(now).format(dateTimeFormat).substring(8, 12);
    // 结束时间 HHmm
    const endTimeString = isValidVariable(endTime) ? endTime.substring(8, 12) : "";
    // 结束日期和结束时间是否必填标记:限制方式为改航(CR)时为必填
    // const endDateTimeRequired = restrictionMode === "CR";
    const endDateTimeRequired = false;

    //方案名称发生变化触发更新
    useEffect(function () {
        //重置表单，用以表单初始值赋值
        form.resetFields();
    }, [tacticName]);

    //方案限制方式变化触发表单重新校验结束日期和结束时间
    useEffect(function () {
        //重新校验结束日期和结束时间
        form.validateFields(['endDate','endTime']);
    }, [restrictionMode]);




    // 表单初始化默认值
    let initialValues = {
        startDate,
        endDate,
        startTime: startTimeString,
        endTime: endTimeString,
        startDateTimeString,
        endDateTimeString,
    }

    /**
     * 自动填充结束日期
     * */
    const autoFillInEndDate = (value) => {
        const startTime = form.getFieldValue('startTime');
        const startDate = form.getFieldValue('startDate');
        const endTime = form.getFieldValue('endTime');
        const endDate = form.getFieldValue('endDate');
        const startDateString = moment(startDate).format(dateTimeFormat).substring(0, 8);
        const startDateFormatValid = REGEXP.DATE8.test(startDateString);
        const startTimeFormatValid = REGEXP.TIMEHHmm.test(startTime);
        if (startDateFormatValid && startTimeFormatValid && value.length === 4 && !isValidVariable(endDate)) {
            if (value * 1 < startTime * 1 || value * 1 === startTime * 1) {
                const nextDate = moment(startDate).add(1, 'day');
                form.setFieldsValue({ 'endDate': moment(nextDate) })
            } else {
                form.setFieldsValue({ 'endDate': moment(startDate) })
            }
        }
    }
    // 结束时间输入框变化
    const handleEndTimeChange = ({ target: { value } }) => {
        // 自动填充结束日期
        autoFillInEndDate(value);
    };
    // 开始时间输入框变化
    const handleStartTimeChange = ({ target: { value } }) => {
        // 处理开始日期时间变化
        handleUpdateStartDateTimeChange()
    };

    // 开始日期日历插件变化
    const onOpenStartDatePickerChange = (open) => {
        // 当前终端时间
        let now = new Date();
        const startDate = form.getFieldValue('startDate');
        // 若开始日期为空则填充当前日期
        if (open && !isValidVariable(startDate)) {
            form.setFieldsValue({ 'startDate': moment(now) });
            // 更新方案开始时间(用于触发预留时隙表单校验)
            schemeFormData.updateTacticStartTime();
        }

    };
    // 结束日期日历插件变化
    const onOpenEndDatePickerChange = (open) => {
        const startDate = form.getFieldValue('startDate');
        const endDate = form.getFieldValue('endDate');
        // 若结束日期为空且开始日期不为空,则填充结束日期值为开始日期
        if (open && isValidVariable(startDate) && !isValidVariable(endDate)) {
            form.setFieldsValue({ 'endDate': moment(startDate) });
        }
    };

    // 处理开始日期时间变化
    const handleUpdateStartDateTimeChange = () => {
        // 开始时间HHmm
        const startTime = form.getFieldValue('startTime');
        // 开始日期 Date
        const startDate = form.getFieldValue('startDate');
        const startDateString = moment(startDate).format(dateTimeFormat).substring(0, 8);
        //  开始日期时间 12位字符串
        const startDateTimeString = startDateString + startTime;
        // 更新store方案开始时间(用于触发预留时隙表单校验)
        schemeFormData.updateTacticStartTime(startTimeString);
    }

    /**
     * 校验结束日期是否完整
     * */
    const validateEndDateFormat = (getFieldValue) => {
        const validator = (rules, value) => {
            const endTime = getFieldValue('endTime');
            const endDate = getFieldValue('endDate');
            if (!isValidVariable(endDate) && isValidVariable(endTime)) {
                return Promise.reject('请选择结束日期');
            }
            return Promise.resolve();
        };
        return ({
            validator: validator,
        })
    };

    // 结束日期不可选的日期限定
    const disabledEndDate = (currentDate) => {
        const startDate = form.getFieldValue('startDate');
        return currentDate < startDate;
    };

    /**
     * 校验开始时间和结束时间大小
     * */
    const validateTimeRange = (getFieldValue) => {
        const validator = (rules, value) => {
            // 开始时间HHmm
            const startTime = getFieldValue('startTime');
            // 开始日期 Date
            const startDate = getFieldValue('startDate');
            // 结束时间HHmm
            const endTime = getFieldValue('endTime');
            // 结束日期 Date
            const endDate = getFieldValue('endDate');

            if (isValidVariable(endDate)
                && isValidVariable(endTime)
                && isValidVariable(startDate)
            ) {
                const startDateString = moment(startDate).format(dateTimeFormat).substring(0, 8);
                const endDateString = moment(endDate).format(dateTimeFormat).substring(0, 8);
                const startDateTime = startDateString + startTime;
                const endDateTime = endDateString + endTime;
                const startDateFormatValid = REGEXP.DATE8.test(startDateString);
                const startTimeFormatValid = REGEXP.TIMEHHmm.test(startTime);
                const endDateFormatValid = REGEXP.DATE8.test(endDateString);
                const endTimeFormatValid = REGEXP.TIMEHHmm.test(endTime);
                if (startDateFormatValid && startTimeFormatValid && endDateFormatValid && endTimeFormatValid) {
                    if (parseFullTime(startDateTime).getTime() > parseFullTime(endDateTime).getTime()) {
                        return Promise.reject('结束时间不能早于开始时间');
                    } else {
                        return Promise.resolve();
                    }
                }
            }
            return Promise.resolve();
        };
        return ({
            validator: validator,
        })
    };

    // 校验结束日期时间与当前时间+15分钟大小
    const validateEndDateTimeRange = (getFieldValue) => {
        const validator = (rules, value) => {
            // 开始时间HHmm
            const startTime = getFieldValue('startTime');
            // 开始日期 Date
            const startDate = getFieldValue('startDate');
            // 结束时间HHmm
            const endTime = getFieldValue('endTime');
            // 结束日期 Date
            const endDate = getFieldValue('endDate');

            if (isValidVariable(endDate)
                && isValidVariable(endTime)
                && isValidVariable(startDate)
            ) {
                const startDateString = moment(startDate).format(dateTimeFormat).substring(0, 8);
                const endDateString = moment(endDate).format(dateTimeFormat).substring(0, 8);
                const startDateTime = startDateString + startTime;
                const endDateTime = endDateString + endTime;
                const startDateFormatValid = REGEXP.DATE8.test(startDateString);
                const startTimeFormatValid = REGEXP.TIMEHHmm.test(startTime);
                const endDateFormatValid = REGEXP.DATE8.test(endDateString);
                const endTimeFormatValid = REGEXP.TIMEHHmm.test(endTime);

                if (startDateFormatValid && startTimeFormatValid && endDateFormatValid && endTimeFormatValid) {
                    if (parseFullTime(startDateTime).getTime() > parseFullTime(endDateTime).getTime()) {
                        return Promise.resolve();
                    } else {
                        // 当前时间加15分钟
                        let currentTime = moment().add(15, 'minutes').format(dateTimeFormat).substring(0, 12);
                        if (parseFullTime(currentTime).getTime() > parseFullTime(endDateTime).getTime()) {
                            return Promise.reject('结束时间不能早于当前时间+15分钟');
                        } else {
                            return Promise.resolve();
                        }
                    }
                }
            }
            return Promise.resolve();
        };
        return ({
            validator: validator,
        })
    }


    return (
        <Fragment>
            <Form
                form={form}
                initialValues={initialValues}
            >
                <Row gutter={24} >
                    <Col span={8}>
                        {
                            props.disabledForm ? (
                                <Form.Item
                                    label="开始时间"
                                    required={true}
                                    // className="date-time-form-compact"
                                    name="startDateTimeString"
                                >

                                    <Input disabled={props.disabledForm} />
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
                                            { required: true, message: '请选择开始日期' },
                                        ]}
                                    >
                                        <DatePicker
                                            // onChange={updateStartDateString}
                                            format={dateFormat}
                                            // disabledDate={disabledStartDate}
                                            disabled={props.disabledForm}
                                            placeholder={dateFormat}
                                            className="date-picker-form"
                                            showToday={false}
                                            mode="date"
                                            onOpenChange={onOpenStartDatePickerChange}
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
                                            allowClear={true}
                                            placeholder={timeFormat}
                                            onChange={handleStartTimeChange}
                                            disabled={props.disabledForm}
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
                                    name="endDateTimeString"
                                >
                                    <Input disabled={props.disabledForm} />
                                </Form.Item>
                            ) : (
                                <Form.Item
                                    label="结束时间"
                                    className="date-time-form-compact"
                                    required={endDateTimeRequired}
                                >
                                    <Form.Item
                                        name="endDate"
                                        className="date-picker-form"
                                        dependencies={['endTime']}
                                        rules={[
                                            {
                                                required: endDateTimeRequired,
                                                message: '请选择结束日期'
                                            },
                                            ({ getFieldValue }) => validateEndDateFormat(getFieldValue),
                                        ]}
                                    >
                                        <DatePicker
                                            // onChange={updateEndTimeDisplay}
                                            format={dateFormat}
                                            disabledDate={disabledEndDate}
                                            disabled={props.disabledForm}
                                            placeholder={dateFormat}
                                            className="date-picker-form"
                                            showToday={false}
                                            onOpenChange={onOpenEndDatePickerChange}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="endTime"
                                        label=""
                                        className="time-form"
                                        dependencies={['endDate', 'startDate', 'startTime']}
                                        required={endDateTimeRequired}
                                        rules={[
                                            {
                                                required: endDateTimeRequired,
                                                message: '请输入结束时间',
                                            },
                                            {
                                                type: 'string',
                                                pattern: REGEXP.TIMEHHmm,
                                                message: '请输入有效的结束时间',
                                            },
                                            ({ getFieldValue }) => validateTimeRange(getFieldValue),
                                            ({ getFieldValue }) => validateEndDateTimeRange(getFieldValue)
                                        ]}
                                    >
                                        <Input
                                            allowClear={true}
                                            placeholder={timeFormat}
                                            onChange={handleEndTimeChange}
                                            disabled={props.disabledForm}
                                        />
                                    </Form.Item>
                                </Form.Item>
                            )
                        }
                    </Col>
                </Row>
            </Form>
        </Fragment>
    )
}
export default inject("schemeFormData", "systemPage")(observer(TacticDateTimeForm));
