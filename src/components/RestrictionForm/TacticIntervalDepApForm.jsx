import React, { Fragment, useEffect } from 'react'
import { Form, Select, Tooltip, Tag, Space, Button, Popover } from 'antd'
import { inject, observer } from "mobx-react";
import TacticAreaProvinceAirportList from 'components/RestrictionForm/TacticAreaProvinceAirportList'
import { isValidVariable } from 'utils/basic-verify';
import { SchemeFormUtil } from 'utils/scheme-form-util'


//方案半数起飞机场表单
function tacticIntervalDepApForm(props) {


    const { schemeFormData, form, pageType } = props;
    // 方案基础信息
    const basicTacticInfo = schemeFormData.schemeData.basicTacticInfo || {};
    const basicFlowcontrol = basicTacticInfo.basicFlowcontrol|| {};
    const flowControlMeasure = basicFlowcontrol.flowControlMeasure|| {};

    // 方案名称
    const tacticName = basicTacticInfo.tacticName || "";
    // 所有区域标签机场数据
    const areaAirportListData = schemeFormData.areaAirportListData;
    // 特殊区域机场列表
    const specialAreaAirportListData = schemeFormData.specialAreaAirportListData;
    let intervalDepFlight = isValidVariable(flowControlMeasure.intervalDepFlight) ? flowControlMeasure.intervalDepFlight.split(';') : [];
    // 格式化后的半数起飞机场数值
    let formatIntervalDepAp = SchemeFormUtil.formatAreaLabel(intervalDepFlight, areaAirportListData);
    // 是否为禁用页面类型
    const isDisabledPageType = SchemeFormUtil.getIsDisabledPageType().includes(pageType)
    // 是否禁用
    const disabled = props.disabledForm || isDisabledPageType;
    // 表单初始化默认值
    let initialValues = {
        intervalDepFlight: formatIntervalDepAp,
    }
    /* 
    方案名称变更后触发表单更新(方案数据回显)
    方案半数起飞机场发生变化触发更新(方案模板数据回显)
    */
    useEffect(function () {
        //重置表单，用以表单初始值赋值
        form.resetFields();
    }, [tacticName, intervalDepFlight]);

    // 自定义 tag 内容 render
    const tagRender = ({ label, closable, onClose, value }) => {
        // 过滤出当前录入的标签下的机场集合
        let airport = SchemeFormUtil.filterAreadLabelAirport(value, areaAirportListData);
        return (
            <Tooltip title={airport}>
                <Tag
                    closable={closable}
                    onClose={onClose}
                >
                    {label.props ? label.props.children : value}
                </Tag>
            </Tooltip>
        )
    }

    // 快速录入指定区域机场
    const shortcutInputValue = (label) => {
        // 获取当前字段值
        let fieldValue = form.getFieldValue('intervalDepFlight');
        // 若当前字段值中包含此标签label,则不作操作
        if (fieldValue.indexOf(label) > -1) {
            return;
        }
        // 反之将当前label追加到当前字段值中去
        let valueArr = [...fieldValue, label];
        // 处理机场数值
        valueArr = SchemeFormUtil.handleAirportSelectInputValue(valueArr, areaAirportListData);
        // 更新表单数值
        form.setFieldsValue({ 'intervalDepFlight': valueArr });
    }
    // 处理起飞机场数值
    const handleValue = (val) => {
        // 处理机场数值
        let newValue = SchemeFormUtil.handleAirportSelectInputValue(val, areaAirportListData);
        // 更新表单数值
        form.setFieldsValue({ 'intervalDepFlight': newValue });
    }
    // 绘制单个区域按钮
    const drawSingleSpecialAreaAirport = (area) => {
        const {
            provinceName,
            provinceNameZH,
            value,
        } = area;
        return (
            <Tooltip placement="bottom" title={value} key={provinceName}>
                <Button size="small" onClick={() => { shortcutInputValue(provinceNameZH) }}>{provinceNameZH}</Button>
            </Tooltip>
        )
    }
    return (
        <Fragment>
            <Form
                form={form}
                labelAlign='left'
                initialValues={initialValues}
            >
                <Form.Item
                    name="intervalDepFlight"
                    className="advanced-item"
                    colon={false}
                    label="半数起飞机场"
                >
                    <Select
                        disabled={disabled}
                        mode="tags"
                        style={{ width: '100%' }}
                        placeholder=""
                        open={false}
                        onChange={(val) => (handleValue(val))}
                        className="text-uppercase"
                        allowClear={true}
                        placeholder="选填项"
                        tagRender={tagRender}
                    >
                    </Select>
                </Form.Item>
            </Form>
            {
                disabled ? "" :
                    <div className="ant-row">
                        <div className="ant-col ant-form-item-label"></div>
                        <div className="ant-col ant-form-item-control advanced-item-control">
                            <div className="ant-form-item-control-input">
                                <div className="ant-form-item-control-input-content">
                                    <Space>
                                        {
                                            specialAreaAirportListData.map((item) => {
                                                return drawSingleSpecialAreaAirport(item)
                                            })
                                        }

                                        <Popover
                                            trigger="click"
                                            placement="rightTop"
                                            content={
                                                <TacticAreaProvinceAirportList
                                                    shortcutInputValue={shortcutInputValue}
                                                    targetForm={form}
                                                />
                                            } >
                                            <Button size="small">省份</Button>
                                        </Popover>
                                    </Space>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </Fragment>
    )
}

export default inject("schemeFormData",)(observer(tacticIntervalDepApForm));
