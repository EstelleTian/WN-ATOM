import React, { Fragment, useEffect, useState } from 'react'
import { Form, Select, Tooltip, Tag, Space, Button } from 'antd'
import { inject, observer } from "mobx-react";
import { isValidVariable } from 'utils/basic-verify';
import { SchemeFormUtil } from 'utils/scheme-form-util'


//方案起飞机场表单
function TacticDepApForm(props) {
    
    const { schemeFormData, form, pageType } = props;
    // 方案基础信息
    const basicTacticInfo = schemeFormData.schemeData.basicTacticInfo || {};
    // 方案名称
    const tacticName = basicTacticInfo.tacticName || "";
    let depAp = isValidVariable(schemeFormData.depAp) ? schemeFormData.depAp.split(';') : [];
    // 格式化后的起飞机场数值
    let formatDepAp = SchemeFormUtil.formatAreaLabel(depAp);
    // 是否为禁用页面类型
    const isDisabledPageType = SchemeFormUtil.getIsDisabledPageType().includes(pageType)
    // 是否禁用
    const disabled = props.disabledForm || isDisabledPageType;
    // 表单初始化默认值
    let initialValues = {
        depAp:formatDepAp,
    }
    //方案名称发生变化触发更新
    useEffect(function () {
        //重置表单，用以表单初始值赋值
        form.resetFields();
    }, [tacticName]);

    // 自定义 tag 内容 render
    const tagRender = ({ label, closable, onClose, value }) => {
        // 过滤出当前录入的标签下的机场集合
        let airport = SchemeFormUtil.filterAreadLabelAirport(value);
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
        let fieldValue = form.getFieldValue('depAp');
        // 若当前字段值中包含此标签label,则不作操作
        if (fieldValue.indexOf(label) > -1) {
            return;
        }
        // 反之将当前label追加到当前字段值中去
        let valueArr = [...fieldValue, label];
        // 处理机场数值
        valueArr = SchemeFormUtil.handleAirportSelectInputValue(valueArr);
        // 更新表单数值
        form.setFieldsValue({ 'depAp': valueArr });
    }
    // 处理起飞机场数值
    const handleValue = (val)=> {
        // 处理机场数值
        let newValue = SchemeFormUtil.handleAirportSelectInputValue(val);
        // 更新表单数值
        form.setFieldsValue({ 'depAp': newValue });
    }
    return (
        <Fragment>
            <Form
                form={form}
                initialValues={initialValues}
            >
                <Form.Item
                    name="depAp"
                    label="起飞机场"
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
                        placeholder="可选填项"
                        tagRender={tagRender}
                    >
                    </Select>
                </Form.Item>
            </Form>
            {
                disabled ? "" : 
                <div className="ant-row shortcut-input-row">
                    <div className="ant-col ant-form-item-label"></div>
                    <div className="ant-col ant-form-item-control">
                        <div className="ant-form-item-control-input">
                            <div className="ant-form-item-control-input-content">
                                <Space>
                                    <Tooltip placement="bottom" title={SchemeFormUtil.filterAreadLabelAirport("兰州")}>
                                        <Button size="small" onClick={() => { shortcutInputValue('兰州') }}>兰州</Button>
                                    </Tooltip>
                                    <Tooltip placement="bottom" title={SchemeFormUtil.filterAreadLabelAirport("西安")}>
                                        <Button size="small" onClick={() => { shortcutInputValue('西安') }}>西安</Button>
                                    </Tooltip>
                                    <Tooltip placement="bottom" title={SchemeFormUtil.filterAreadLabelAirport("山东")}>
                                        <Button size="small" onClick={() => { shortcutInputValue('山东') }}>山东</Button>
                                    </Tooltip>
                                    <Button size="small" onClick={() => { }}>更多</Button>
                                </Space>
                            </div>
                        </div>
                    </div>
                </div>
            }

        </Fragment>
    )
}

export default inject("schemeFormData",)(observer(TacticDepApForm));
