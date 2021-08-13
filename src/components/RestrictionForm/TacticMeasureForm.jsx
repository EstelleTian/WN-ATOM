import React, { Fragment, useState, useEffect } from "react";
import { Form, Input, Row, Col, Select } from "antd";
import { inject, observer } from "mobx-react";
import { isValidVariable } from "utils/basic-verify";
import { REGEXP } from "utils/regExpUtil";
import { SchemeFormUtil } from "utils/scheme-form-util";

const { Option } = Select;

//方案措施信息表单
function TacticMeasureForm(props) {
  const restrictionModeOptions = [
    { key: "AFP", text: "AFP", title: "AFP" },
    { key: "MIT", text: "MIT", title: "MIT" },
    { "key": "CR", "text": "CR", "title": "改航"  },
    { key: "GS", text: "GS", title: "GS" },
    { "key": "TC", "text": "TC", "title": "总量控制"  },
    {"key":"GDP", "text": "GDP"},
    // {"key":"AS", "text": "指定时隙"},
    // {"key":"BREQ", "text": "上客申请"},
    // {"key":"REQ", "text": "开车申请"},
    // {"key":"TC", "text": "总量控制"},
    // {"key":"AH", "text": "空中等待"},
    // {"key":"AA", "text": "空域开闭限制"},
  ];

  const { schemeFormData, systemPage, form, pageType } = props;
  // 方案限制方式
  const restrictionMode = schemeFormData.restrictionMode || "";
  // AFP限制方式下限制数值
  const restrictionAFPValueSequence =
    schemeFormData.restrictionAFPValueSequence || "";
  // TC限制方式下限制分钟
  const restrictionTCPeriodDuration =
    schemeFormData.restrictionTCPeriodDuration || "";
  // TC限制方式下限制架次
  const restrictionTCPeriodValue =
    schemeFormData.restrictionTCPeriodValue || "";
  // MIT限制方式下的限制数值
  const restrictionMITValue = schemeFormData.restrictionMITValue || "";
  // MIT限制方式下限制类型 T:时间 D:距离
  const restrictionMITValueUnit = schemeFormData.restrictionMITValueUnit || "";
  // MIT限制方式下时间类型的限制值
  const restrictionMITTimeValue = schemeFormData.restrictionMITTimeValue || "";
  // MIT限制下公里类型限制的速度值
  const distanceToTime = schemeFormData.distanceToTime || "";

  // 方案基础信息
  const basicTacticInfo = schemeFormData.schemeData.basicTacticInfo || {};
  // 方案名称
  const tacticName = basicTacticInfo.tacticName || "";
  // 是否为禁用页面类型
  const isDisabledPageType =
    SchemeFormUtil.getIsDisabledPageType().includes(pageType);
  // 是否禁用
  const disabled = props.disabledForm || isDisabledPageType;
  // 方案名称变更后触发表单更新(方案数据回显)
  useEffect(
    function () {
      //重置表单，用以表单初始值赋值
      form.resetFields();
    },
    [tacticName]
  );
  // 方案限制方式、限制数值变更后触发表单更新(方案模板数据回显)
  useEffect(
    function () {
      //重置表单，用以表单初始值赋值
      form.resetFields();
    },
    [restrictionMode, restrictionAFPValueSequence, restrictionMITValue]
  );

  useEffect(
    function () {
      if (restrictionMode === "MIT" || restrictionMode == "AFP" || restrictionMode == "TC" ) {
        //重置表单，用以表单初始值赋值
        form.resetFields();
      }
    },
    [restrictionMITValueUnit]
  );

  // 依据流控限制方式取流控限制数值方法
  function getRestrictionModeValue() {
    if (restrictionMode == "MIT") {
      return restrictionMITValue;
    } else if (restrictionMode == "AFP") {
      return restrictionAFPValueSequence;
    }
  }

  // 表单初始化默认值
  let initialValues = {
    restrictionMode,
    restrictionAFPValueSequence,
    restrictionTCPeriodDuration,
    restrictionTCPeriodValue,
    restrictionMITValue,
    restrictionMITValueUnit,
    restrictionMITTimeValue,
    distanceToTime,
  };
  /*
   * MIT限制类型下切换限制模式变更
   *
   */
  const handleRestrictionMITValueUnitChange = (modeType) => {
    if (restrictionMode === "AFP") {
      // 重置MIT限制数值
      form.setFieldsValue({ restrictionMITValue: "" });
    }
    schemeFormData.updateTacticRestrictionMITValueUnit(modeType);
    updateDistanceToTimeValueChange(modeType);
  };

  //更新限制方式
  const handleRestrictionModeChange = (mode) => {
    schemeFormData.updateTacticRestrictionMode(mode);
  };

  const updateDistanceToTimeValueChange = (mode) => {
    // 若限制类型为MIT
    if (restrictionMode === "MIT" && mode === "D") {
      props.updateDistanceToTimeValue();
    }
  };

  // 绘制MIT限制类型下限制数值表单
  const drawMITModeValue = () => {
    return (
      <Form.Item
        label="限制值"
        required={true}
        className="MIT-mode-value-unit-form-compact advanced-item"
      >
        <Form.Item name="restrictionMITValueUnit" className="MIT-value-unit">
          <Select
            onChange={handleRestrictionMITValueUnitChange}
            disabled={props.disabledForm}
          >
            <Option key="T">分钟/架</Option>
            <Option key="D">公里/架</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label=""
          required={true}
          name="restrictionMITValue"
          className="value-item"
          rules={[
            {
              required: true,
              message: "请输入限制值",
            },
            {
              type: "string",
              pattern: REGEXP.INTEGER0_999,
              message: "请输入0~999范围内的整数",
            },
          ]}
        >
          <Input
            style={{ width: 70, marginLeft: 5 }}
            onChange={props.updateMITTimeValueChange}
            // onBlur={updateMITTimeValueChange}
            disabled={props.disabledForm}
          />
        </Form.Item>
        <Form.Item
          label=""
          className={restrictionMITValueUnit === "D" ? "" : "hidden"}
        >
          <div className="symbol">/</div>
        </Form.Item>
        <Form.Item
          label=""
          required={true}
          name="distanceToTime"
          className={restrictionMITValueUnit === "D" ? "" : "hidden"}
          rules={[
            {
              required: true,
              message: "请输入速度值",
            },
            {
              type: "string",
              pattern: REGEXP.INTEGER0_999,
              message: "请输入0~999范围内的整数",
            },
          ]}
        >
          <Input style={{ width: 50 }} disabled={true} />
        </Form.Item>
        <Form.Item
          label=""
          className={restrictionMITValueUnit === "D" ? "" : "hidden"}
        >
          <div className="symbol">≈</div>
        </Form.Item>
        <Form.Item
          label=""
          className={restrictionMITValueUnit === "D" ? "" : "hidden"}
          name="restrictionMITTimeValue"
        >
          <Input style={{ width: 50 }} disabled={true} />
        </Form.Item>
        <Form.Item
          label=""
          className={restrictionMITValueUnit === "D" ? "" : "hidden"}
        >
          <div className="">分钟/架</div>
        </Form.Item>
      </Form.Item>
    );
  };

  // 绘制AFP限制类型下限制数值表单
  const drawAFPModeValue = () => {
    return (
      <div className="AFP-mode-value-container">
        <Form.Item
          label="限制值"
          required={true}
          name="restrictionAFPValueSequence"
          className="value-item advanced-item"
          rules={[
            {
              required: true,
              message: "请输入限制值",
            },
            {
              type: "string",
              pattern: REGEXP.INTEGER0_999,
              message: "请输入0~999范围内的整数",
            },
          ]}
        >
          <Input
            style={{ width: 150 }}
            disabled={props.disabledForm}
            // onChange={handleRestrictionModeValueChange}
            addonAfter="架/小时"
          />
        </Form.Item>

        <Form.Item
          label="最小间隔"
          className="MIT-mode-value-unit-form-compact advanced-item"
        >
          <Form.Item name="restrictionMITValueUnit" className="MIT-value-unit">
            <Select
              onChange={handleRestrictionMITValueUnitChange}
              disabled={props.disabledForm}
            >
              <Option key="T">分钟/架</Option>
              <Option key="D">公里/架</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label=""
            required={true}
            name="restrictionMITValue"
            className="value-item"
            rules={[
              // {
              //     required: true,
              //     message: '请输入限制值'
              // },
              {
                type: "string",
                pattern: REGEXP.INTEGER0_999,
                message: "请输入0~999范围内的整数",
              },
            ]}
          >
            <Input
              style={{ width: 70, marginLeft: 5 }}
              onChange={props.updateMITTimeValueChange}
              // onBlur={updateMITTimeValueChange}
              disabled={props.disabledForm}
            />
          </Form.Item>
          <Form.Item
            label=""
            className={restrictionMITValueUnit === "D" ? "" : "hidden"}
          >
            <div className="symbol">/</div>
          </Form.Item>
          <Form.Item
            label=""
            required={true}
            name="distanceToTime"
            className={restrictionMITValueUnit === "D" ? "" : "hidden"}
            rules={[
              {
                required: true,
                message: "请输入速度值",
              },
              {
                type: "string",
                pattern: REGEXP.INTEGER0_999,
                message: "请输入0~999范围内的整数",
              },
            ]}
          >
            <Input style={{ width: 50 }} disabled={true} />
          </Form.Item>
          <Form.Item
            label=""
            className={restrictionMITValueUnit === "D" ? "" : "hidden"}
          >
            <div className="symbol">≈</div>
          </Form.Item>
          <Form.Item
            label=""
            className={restrictionMITValueUnit === "D" ? "" : "hidden"}
            name="restrictionMITTimeValue"
          >
            <Input style={{ width: 50 }} disabled={true} />
          </Form.Item>
          <Form.Item
            label=""
            className={restrictionMITValueUnit === "D" ? "" : "hidden"}
          >
            <div className="">分钟/架</div>
          </Form.Item>
        </Form.Item>
      </div>
    );
  };

  // 绘制TC限制类型下限制数值表单
  const drawTCModeValue = () => {
    return (
      <div className="AFP-mode-value-container">
        <Form.Item
          label="限制值"
          required={true}
          className="value-item TC-mode advanced-item"
        >
          <Form.Item
            required={true}
            name="restrictionTCPeriodDuration"
            className="value-item TC-period-duration"
            rules={[
              {
                required: true,
                message: "请输入限制值分钟数值",
              },
              {
                type: "string",
                pattern: REGEXP.INTEGER0_999,
                message: "请输入0~999范围内的整数",
              },
            ]}
          >
            <Input
              style={{ width: 120 }}
              disabled={props.disabledForm}
              // onChange={handleRestrictionModeValueChange}
              addonAfter="分钟"
            />
          </Form.Item>
          <Form.Item
            required={true}
            name="restrictionTCPeriodValue"
            className="value-item TC-period-value"
            rules={[
              {
                required: true,
                message: "请输入限制值架次",
              },
              {
                type: "string",
                pattern: REGEXP.INTEGER0_999,
                message: "请输入0~999范围内的整数",
              },
            ]}
          >
            <Input
              style={{ width: 100 }}
              disabled={props.disabledForm}
              // onChange={handleRestrictionModeValueChange}
              addonAfter="架"
            />
          </Form.Item>
        </Form.Item>

        <Form.Item
          label="最小间隔"
          className="MIT-mode-value-unit-form-compact advanced-item"
        >
          <Form.Item name="restrictionMITValueUnit" className="MIT-value-unit">
            <Select
              onChange={handleRestrictionMITValueUnitChange}
              disabled={props.disabledForm}
            >
              <Option key="T">分钟/架</Option>
              <Option key="D">公里/架</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label=""
            required={true}
            name="restrictionMITValue"
            className="value-item"
            rules={[
              // {
              //     required: true,
              //     message: '请输入限制值'
              // },
              {
                type: "string",
                pattern: REGEXP.INTEGER0_999,
                message: "请输入0~999范围内的整数",
              },
            ]}
          >
            <Input
              style={{ width: 70, marginLeft: 5 }}
              onChange={props.updateMITTimeValueChange}
              // onBlur={updateMITTimeValueChange}
              disabled={props.disabledForm}
            />
          </Form.Item>
          <Form.Item
            label=""
            className={restrictionMITValueUnit === "D" ? "" : "hidden"}
          >
            <div className="symbol">/</div>
          </Form.Item>
          <Form.Item
            label=""
            required={true}
            name="distanceToTime"
            className={restrictionMITValueUnit === "D" ? "" : "hidden"}
            rules={[
              {
                required: true,
                message: "请输入速度值",
              },
              {
                type: "string",
                pattern: REGEXP.INTEGER0_999,
                message: "请输入0~999范围内的整数",
              },
            ]}
          >
            <Input style={{ width: 50 }} disabled={true} />
          </Form.Item>
          <Form.Item
            label=""
            className={restrictionMITValueUnit === "D" ? "" : "hidden"}
          >
            <div className="symbol">≈</div>
          </Form.Item>
          <Form.Item
            label=""
            className={restrictionMITValueUnit === "D" ? "" : "hidden"}
            name="restrictionMITTimeValue"
          >
            <Input style={{ width: 50 }} disabled={true} />
          </Form.Item>
          <Form.Item
            label=""
            className={restrictionMITValueUnit === "D" ? "" : "hidden"}
          >
            <div className="">分钟/架</div>
          </Form.Item>
        </Form.Item>
      </div>
    );
  };

  return (
    <Fragment>
      <Form form={form} labelAlign="left" initialValues={initialValues}>
            <Row className="info-row">
              <Col span={24}>
                <Form.Item
                  name="restrictionMode"
                  label="限制方式"
                  colon={false}
                  required={true}
                  className="advanced-item"
                  rules={[{ required: true, message: "请选择限制方式" }]}
                >
                  <Select
                    style={{ width: 120 }}
                    onChange={handleRestrictionModeChange}
                    disabled={disabled}
                  >
                    {restrictionModeOptions.map((mode) => (
                      <Option title={mode.title} key={mode.key}>
                        {mode.text}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              </Row>
              <Row className="info-row">
                <Col span={24}>
                  {restrictionMode === "MIT" ? drawMITModeValue() : ""}
                  {restrictionMode === "AFP" ? drawAFPModeValue() : ""}
                  {restrictionMode === "TC" ? drawTCModeValue() : ""}
                </Col>
            </Row>
          </Form>
    </Fragment>
  );
}
export default inject(
  "schemeFormData",
  "systemPage"
)(observer(TacticMeasureForm));
