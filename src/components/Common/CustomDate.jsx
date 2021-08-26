/*
 * @Author: your name
 * @Date: 2020-12-18 18:39:39
 * @LastEditTime: 2021-08-26 15:10:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\MDRS\MSRSForm.jsx
 */
import React, { useEffect, useState, Fragment, memo } from "react";
import moment from "moment";
import "moment/locale/zh-cn";
import { DatePicker, Form, Input, Row, Col } from "antd";
import {
  formatTimeString,
  parseFullTime,
  isValidObject,
  isValidVariable,
} from "utils/basic-verify";
import { REGEXP } from "utils/regExpUtil";
import "./CustomDate.scss";

const dateFormat = "YYYY-MM-DD";
const timeFormat = "HHmm";
const dateTimeFormat = "YYYYMMDDHHmm";

//将时间转换为时间控件格式---startTime 12位时间字符串
const convertToFormData = (startTime = "", endTime = "") => {
  // 终端当前时间
  let now = moment();
  // 开始日期 Date类型
  const startDate = isValidVariable(startTime)
    ? moment(startTime, dateFormat)
    : moment(now, dateFormat);
  // 结束日期 Date类型
  const endDate = isValidVariable(endTime) ? moment(endTime, dateFormat) : "";
  // 开始时间 HHmm
  const startTimeString = isValidVariable(startTime)
    ? startTime.substring(8, 12)
    : moment(now).format(dateTimeFormat).substring(8, 12);
  // 结束时间 HHmm
  const endTimeString = isValidVariable(endTime)
    ? endTime.substring(8, 12)
    : "";
  // 开始日期时间字符串(非编辑状态下显示)
  const startDateTimeString = isValidVariable(startTime)
    ? formatTimeString(startTime)
    : "";
  // 结束日期时间字符串(非编辑状态下显示)
  const endDateTimeString = isValidVariable(endTime)
    ? formatTimeString(endTime)
    : "";
  return {
    startDate,
    endDate,
    startTime: startTimeString,
    endTime: endTimeString,
    startDateTimeString,
    endDateTimeString,
  };
};
//起止时间模块
const CustomDate = memo(({ setDateForm }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    setDateForm(form);
  }, []);

  // 表单初始化默认值
  let initialValues = convertToFormData();

  const updateEndTimeString = ({ target: { value } }) => {
    // 自动填充结束日期
    autoFillInEndDate(value);
  };
  /**
   * 自动填充结束日期
   * */
  const autoFillInEndDate = (value) => {
    const startTime = form.getFieldValue("startTime");
    const startDate = form.getFieldValue("startDate");
    const endTime = form.getFieldValue("endTime");
    const endDate = form.getFieldValue("endDate");
    const startDateString = moment(startDate)
      .format("YYYYMMDDHHmm")
      .substring(0, 8);
    const startDateFormatValid = REGEXP.DATE8.test(startDateString);
    const startTimeFormatValid = REGEXP.TIMEHHmm.test(startTime);
    if (
      startDateFormatValid &&
      startTimeFormatValid &&
      value.length === 4 &&
      !isValidVariable(endDate)
    ) {
      if (value * 1 < startTime * 1 || value * 1 === startTime * 1) {
        const nextDate = moment(startDate).add(1, "day");
        form.setFieldsValue({ endDate: moment(nextDate) });
      } else {
        form.setFieldsValue({ endDate: moment(startDate) });
      }
    }
  };
  const disabledEndDate = (currentDate) => {
    const startDate = form.getFieldValue("startDate");
    return currentDate < startDate;
  };
  /**
   * 校验结束日期是否完整
   * */
  const validateEndDateFormat = (getFieldValue) => {
    const validator = (rules, value) => {
      const endTime = getFieldValue("endTime");
      const endDate = getFieldValue("endDate");
      if (!isValidVariable(endDate) && isValidVariable(endTime)) {
        return Promise.reject("请选择结束日期");
      }
      return Promise.resolve();
    };
    return {
      validator: validator,
    };
  };

  const onOpenStartDatePickerChange = (open) => {
    // 当前终端时间
    let now = new Date();
    const startDate = form.getFieldValue("startDate");
    if (open && !isValidVariable(startDate)) {
      form.setFieldsValue({ startDate: moment(now) });
    }
  };

  const onOpenEndDatePickerChange = (open) => {
    const startDate = form.getFieldValue("startDate");
    const endDate = form.getFieldValue("endDate");
    if (open && isValidVariable(startDate) && !isValidVariable(endDate)) {
      form.setFieldsValue({ endDate: moment(startDate) });
    }
  };
  /**
   * 校验开始时间和结束时间大小
   * */
  const validateTimeRange = (getFieldValue) => {
    const validator = (rules, value) => {
      // 开始时间HHmm
      const startTime = getFieldValue("startTime");
      // 开始日期 Date
      const startDate = getFieldValue("startDate");
      // 结束时间HHmm
      const endTime = getFieldValue("endTime");
      // 结束日期 Date
      const endDate = getFieldValue("endDate");

      if (
        isValidVariable(endDate) &&
        isValidVariable(endTime) &&
        isValidVariable(startDate)
      ) {
        const startDateString = moment(startDate)
          .format("YYYYMMDDHHmm")
          .substring(0, 8);
        const endDateString = moment(endDate)
          .format("YYYYMMDDHHmm")
          .substring(0, 8);
        const startDateTime = startDateString + startTime;
        const endDateTime = endDateString + endTime;
        const startDateFormatValid = REGEXP.DATE8.test(startDateString);
        const startTimeFormatValid = REGEXP.TIMEHHmm.test(startTime);
        const endDateFormatValid = REGEXP.DATE8.test(endDateString);
        const endTimeFormatValid = REGEXP.TIMEHHmm.test(endTime);

        if (
          startDateFormatValid &&
          startTimeFormatValid &&
          endDateFormatValid &&
          endTimeFormatValid
        ) {
          if (
            parseFullTime(startDateTime).getTime() >
            parseFullTime(endDateTime).getTime()
          ) {
            return Promise.reject("结束时间不能早于开始时间");
          } else {
            return Promise.resolve();
          }
        }
      }
      return Promise.resolve();
    };
    return {
      validator: validator,
    };
  };

  // 校验结束日期时间与当前时间+15分钟大小
  const validateEndDateTimeRange = (getFieldValue) => {
    const validator = (rules, value) => {
      // 开始时间HHmm
      const startTime = getFieldValue("startTime");
      // 开始日期 Date
      const startDate = getFieldValue("startDate");
      // 结束时间HHmm
      const endTime = getFieldValue("endTime");
      // 结束日期 Date
      const endDate = getFieldValue("endDate");

      if (
        isValidVariable(endDate) &&
        isValidVariable(endTime) &&
        isValidVariable(startDate)
      ) {
        const startDateString = moment(startDate)
          .format("YYYYMMDDHHmm")
          .substring(0, 8);
        const endDateString = moment(endDate)
          .format("YYYYMMDDHHmm")
          .substring(0, 8);
        const startDateTime = startDateString + startTime;
        const endDateTime = endDateString + endTime;
        const startDateFormatValid = REGEXP.DATE8.test(startDateString);
        const startTimeFormatValid = REGEXP.TIMEHHmm.test(startTime);
        const endDateFormatValid = REGEXP.DATE8.test(endDateString);
        const endTimeFormatValid = REGEXP.TIMEHHmm.test(endTime);

        if (
          startDateFormatValid &&
          startTimeFormatValid &&
          endDateFormatValid &&
          endTimeFormatValid
        ) {
          if (
            parseFullTime(startDateTime).getTime() >
            parseFullTime(endDateTime).getTime()
          ) {
            return Promise.resolve();
          } else {
            // 当前时间加15分钟
            let currentTime = moment()
              .add(15, "minutes")
              .format("YYYYMMDDHHmm")
              .substring(0, 12);
            if (
              parseFullTime(currentTime).getTime() >
              parseFullTime(endDateTime).getTime()
            ) {
              return Promise.reject("结束时间不能早于当前时间+15分钟");
            } else {
              return Promise.resolve();
            }
          }
        }
      }
      return Promise.resolve();
    };
    return {
      validator: validator,
    };
  };

  return (
    <Form
      form={form}
      // initialValues={initialValues}
      className="custom_date_form"
    >
      <Form.Item
        name="startDate"
        className="date_item date_picker_form"
        rules={[{ required: true, message: "请选择开始日期" }]}
      >
        <DatePicker
          format={dateFormat}
          placeholder={dateFormat}
          showToday={false}
          mode="date"
          onOpenChange={onOpenStartDatePickerChange}
        />
      </Form.Item>
      <Form.Item
        name="startTime"
        label=""
        className="date_item time_form"
        rules={[
          {
            type: "string",
            pattern: REGEXP.TIMEHHmm,
            message: "请输入有效的开始时间",
          },
          {
            required: true,
            message: "请输入开始时间",
          },
        ]}
      >
        <Input allowClear={true} placeholder={timeFormat} />
      </Form.Item>
      <span className="date_item date_line">——</span>
      <Form.Item
        name="endDate"
        className="date_item date_picker_form"
        dependencies={["endTime"]}
        rules={[({ getFieldValue }) => validateEndDateFormat(getFieldValue)]}
      >
        <DatePicker
          format={dateFormat}
          disabledDate={disabledEndDate}
          placeholder={dateFormat}
          showToday={false}
          onOpenChange={onOpenEndDatePickerChange}
        />
      </Form.Item>
      <Form.Item
        name="endTime"
        label=""
        className="date_item time_form"
        dependencies={["endDate", "startDate", "startTime"]}
        rules={[
          {
            required: true,
            message: "请输入结束时间",
          },
          {
            type: "string",
            pattern: REGEXP.TIMEHHmm,
            message: "请输入有效的结束时间",
          },
          ({ getFieldValue }) => validateTimeRange(getFieldValue),
          ({ getFieldValue }) => validateEndDateTimeRange(getFieldValue),
        ]}
      >
        <Input
          allowClear={true}
          placeholder={timeFormat}
          onChange={updateEndTimeString}
        />
      </Form.Item>
    </Form>
  );
});

export { CustomDate, convertToFormData };
