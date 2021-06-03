import React, { Fragment, useEffect, useState } from 'react'
import { Form, Select, Tooltip, Tag, Space, Button } from 'antd'
import { inject, observer } from "mobx-react";
import { isValidVariable } from 'utils/basic-verify';
import { SchemeFormUtil } from 'utils/scheme-form-util'
import { REGEXP } from 'utils/regExpUtil'
import moment from 'moment'


//方案预留时隙表单
function TacticReserveSlotForm(props) {

    const dateTimeFormat = "YYYYMMDDHHmm"
    const { schemeFormData, form, pageType, tacticDateTimeForm } = props;
    // 方案基础信息
    const basicTacticInfo = schemeFormData.schemeData.basicTacticInfo || {};
    // 方案名称
    const tacticName = basicTacticInfo.tacticName || "";

    // 方案开始时间
    const startTime = schemeFormData.startTime || "";

    console.log(startTime);

    // 限制方式
    const restrictionMode = schemeFormData.restrictionMode;
    // 是否隐藏
    let isHide = false;
    if (restrictionMode === "CT" || restrictionMode === "GS") {
        isHide = true;
    }
    // 预留时隙
    let reserveSlot = isValidVariable(schemeFormData.reserveSlot) ? schemeFormData.reserveSlot.split(',') : [];

    // 是否为禁用页面类型
    const isDisabledPageType = SchemeFormUtil.getIsDisabledPageType().includes(pageType)
    // 是否禁用
    const disabled = props.disabledForm || isDisabledPageType;
    // 表单初始化默认值
    let initialValues = {
        reserveSlot: reserveSlot,
    }
    //方案名称发生变化触发更新
    useEffect(function () {
        //重置表单，用以表单初始值赋值
        form.resetFields();
    }, [tacticName]);

    //方案名称发生变化触发更新
    useEffect(function () {
        // 预留时隙数值 
        const reserveSlotValue = form.getFieldValue('reserveSlot')
        // 处理预留时隙数值变化
        handleReserveSlotValueChange(reserveSlotValue);
    }, [startTime]);

    // 处理起飞机场数值
    const handleValue = (value) => {
        handleReserveSlotValueChange(value);
    }
    // 处理预留时隙数值变化
    const handleReserveSlotValueChange = (value) => {
        let newValue = [];
        if (Array.isArray(value) && value.length > 0) {
            let len = value.length;
            for (let i = 0; i < len; i++) {
                let item = value[i];
                if (isValidVariable(item)) {
                    if (item.length === 4) {
                        // 校验4位字符串数值格式是否满足hhmm 
                        const valid = REGEXP.TIMEHHmm.test(item);
                        if (valid) {
                            // 自动填充日期值
                            item = autoFillInDateValue(item);
                        }
                    }
                    newValue.push(item);
                }
            }
        }

        // 去重
        let uniqueValue = newValue.reduce((prev, cur) => prev.includes(cur) ? prev : [...prev, cur], []);
        // 更新表单数值
        form.setFieldsValue({ 'reserveSlot': uniqueValue });
        // 触发表单验证	
        form.validateFields(['reserveSlot'])
    }

    /**
     * @param value 4位时间 hhmm
     * @returns newValue 12位时间
     * 
     *  */
    const autoFillInDateValue = (value) => {
        let newValue = value;
        // 开始时间
        const startTime = tacticDateTimeForm.getFieldValue('startTime');
        // 开始日期
        const startDate = tacticDateTimeForm.getFieldValue('startDate');
        // 开始日期8位字符串
        const startDateString = moment(startDate).format(dateTimeFormat).substring(0, 8);
        // 校验开始日期格式 
        const startDateFormatValid = REGEXP.DATE8.test(startDateString);
        // 校验开始时间格式
        const startTimeFormatValid = REGEXP.TIMEHHmm.test(startTime);
        if (startDateFormatValid && startTimeFormatValid && value.length === 4) {
            // 若小于开始时间则拼接为开始日期后一天日期
            if (value * 1 < startTime * 1) {
                const nextDate = moment(startDate).add(1, 'day');
                const nextDateString = moment(nextDate).format(dateTimeFormat).substring(0, 8);
                newValue = nextDateString + value;
            } else {
                // 反之拼接为开始日期
                newValue = startDateString + value;
            }
        }
        return newValue;
    }


    /**
     * 校验预留时隙数值格式是否有效
     * */
    const validateReserveSlotFormat = (getFieldValue) => {
        const validator = (rules, value) => {

            // 开始时间
            const startTime = tacticDateTimeForm.getFieldValue('startTime');
            // 开始日期
            const startDate = tacticDateTimeForm.getFieldValue('startDate');
            // 开始日期8位字符串
            const startDateString = moment(startDate).format(dateTimeFormat).substring(0, 8);
            // 校验开始日期格式 
            const startDateFormatValid = REGEXP.DATE8.test(startDateString);
            // 校验开始时间格式
            const startTimeFormatValid = REGEXP.TIMEHHmm.test(startTime);
            // 若开始日期有效
            if (startDateFormatValid && startTimeFormatValid) {
                // 校验预留时隙各数值格式是否正确
                const reserveSlotFormatValid = validateReserveSlotMultipleDateTimeFormat(value);
                if (reserveSlotFormatValid === true) {
                    return Promise.resolve();
                } else {
                    return Promise.reject(reserveSlotFormatValid + '不是有效的时间');
                }
            } else {
                // 开始日期无效则提示
                return Promise.reject('请输入有效的开始时间')
            }  
        };
        return ({
            validator: validator,
        })
    };

    /**
     * 校验预留时隙数值格式是否有效
     * */
    const validateReserveSlotMultipleDateTimeFormat = (value) => {
        if (Array.isArray(value) && value.length > 0) {
            let inValidValArray = value.filter(item => {
                if (isValidVariable(item) && (item.length == 12 || item.length == 4)) {
                    if (item.length == 12) {
                        let date = item.substring(0, 8);
                        let time = item.substring(8, 12);
                        const dateFormatValid = REGEXP.DATE8.test(date);
                        const timeFormatValid = REGEXP.TIMEHHmm.test(time);
                        let valid = dateFormatValid && timeFormatValid;
                        return !valid
                    } else if (item.length == 4) {
                        return !REGEXP.TIMEHHmm.test(item)
                    }
                } else {
                    return true;
                }
            })
            if (inValidValArray.length === 0) {
                return true;
            } else {
                return inValidValArray.join(',');
            }
        } else {
            return true;
        }
    }

    /**
     * 校验预留时隙数值是否在开始和结束时间范围内
     * */
    const validateReserveSlotMultipleDateTimeRange = (value, fieldData) => {

        if (Array.isArray(value) && value.length > 0) {
            const {
                startDate,
                startTime,
                endDate,
                endTime,
            } = fieldData;
            // 开始日期
            const startDateString = moment(startDate).format(dateTimeFormat).substring(0, 8);
            // 开始时间
            const startDateTimeString = startDateString + startTime
            // 结束时间
            let endDateTimeString = (isValidVariable(moment(endDate).format("YYYYMMDDHHmm")) && isValidVariable(endTime)) ?
                moment(endDate).format("YYYYMMDDHHmm").substring(0, 8) + endTime : "";

            let inValidValArray = value.filter(item => {
                if (isValidVariable(item) && (item.length == 12)) {
                    if (isValidVariable(startDateTimeString) && isValidVariable(endDateTimeString)) {
                        return item * 1 < startDateTimeString * 1 || item * 1 > endDateTimeString * 1;
                    } else if (isValidVariable(startDateTimeString) && !isValidVariable(endDateTimeString)) {
                        return item * 1 < startDateTimeString * 1
                    }
                } else {
                    return false;
                }
            })
            if (inValidValArray.length === 0) {
                return true;
            } else {
                return inValidValArray.join(',');
            }
        } else {
            return true;
        }
    }


    return (
        <Fragment>
            <Form
                form={form}
                initialValues={initialValues}
            >
                <Form.Item
                    name="reserveSlot"
                    label="预留时隙"
                    className={isHide ? "hidden-form-item" : ""}
                    rules={[
                        ({ getFieldValue }) => validateReserveSlotFormat(getFieldValue),
                    ]}
                >
                    <Select
                        disabled={disabled}
                        mode="tags"
                        style={{ width: '100%' }}
                        open={false}
                        onChange={(val) => (handleValue(val))}
                        // className="text-uppercase"
                        allowClear={true}
                        placeholder="选填项，可输入HHmm格式或者YYYYMMDDHHmm格式有效时间，按回车键分隔多个值"
                    >
                    </Select>
                </Form.Item>
            </Form>
        </Fragment>
    )
}

export default inject("schemeFormData",)(observer(TacticReserveSlotForm));
