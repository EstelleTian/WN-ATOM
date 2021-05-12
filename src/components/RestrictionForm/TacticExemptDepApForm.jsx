import React, { Fragment, useEffect } from 'react'
import { Form, Select, Tooltip, Tag, Space, Button } from 'antd'
import { inject, observer } from "mobx-react";
import { isValidVariable } from 'utils/basic-verify';


//方案豁免起飞机场表单
function TacticExemptDepApForm(props) {
    

    const { schemeFormData, form, areaLabelAirport } = props;
    // 方案基础信息
    const basicTacticInfo = schemeFormData.schemeData.basicTacticInfo || {};
    // 方案名称
    const tacticName = basicTacticInfo.tacticName || "";
    let exemptDepAp = isValidVariable(schemeFormData.exemptDepAp) ? schemeFormData.exemptDepAp.split(';') : [];
    // 表单初始化默认值
    let initialValues = {
        exemptDepAp: formatAreaLabel(areaLabelAirport, exemptDepAp),
    }
    //方案名称发生变化触发更新
    useEffect(function () {
        //重置表单，用以表单初始值赋值
        form.resetFields();
    }, [tacticName]);

    // 自定义 tag 内容 render
    const tagRender = ({ label, closable, onClose, value }) => {
        // 过滤出当前录入的标签下的机场集合
        let airport = filterAreaAirport(value);
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

    // 过滤区域标签机场集合中指定标签对应的机场
    const filterAreaAirport = (label) => {
        for (let i = 0; i < areaLabelAirport.length; i++) {
            let item = areaLabelAirport[i];
            if (item.label.trim() === label.trim()) {
                // 找到第一个匹配的则直接return
                return item.airport;
            }
        }
        return ''
    }
    // 快速录入指定区域机场
    const shortcutInputValue = (label) => {
        // 获取当前字段值
        let fieldValue = form.getFieldValue('exemptDepAp');
        // 若当前字段值中包含此标签label,则不作操作
        if (fieldValue.indexOf(label) > -1) {
            return;
        }
        // 反之将当前label追加到当前字段值中去
        let valueArr = [...fieldValue, label];
        // 更新表单数值
        form.setFieldsValue({ 'exemptDepAp': valueArr });
    }

    // 转换成区域标签
    function formatAreaLabel (labelData, airport) {
        let array = labelData.reduce(reducer, airport);
        let sortedArray = [...new Set(array)].sort((a, b) => a.localeCompare(b));
        return sortedArray
    }
    // 筛选机场
    function reducer(accumulator, currentValue, index, array) {
        let currentArr = currentValue.airport.split(';');
        let len = currentArr.length;
        let includesArr = currentArr.filter((v) => accumulator.includes(v));
        if (includesArr.length === len) {
            accumulator =  accumulator.map((item)=>(currentArr.includes(item) ? currentValue.label : item  ))    
        }
        return accumulator
    }
    return (
        <Fragment>
            <Form
                form={form}
                initialValues={initialValues}
            >
                <Form.Item
                    name="exemptDepAp"
                    label="豁免起飞机场"
                >
                    <Select
                        disabled={props.disabledForm}
                        mode="tags"
                        style={{ width: '100%' }}
                        placeholder=""
                        open={false}
                        // onChange={(val) => (console.log(val))}
                        className="text-uppercase"
                        allowClear={true}
                        tagRender={tagRender}
                    >
                    </Select>
                </Form.Item>
            </Form>
            {
                props.disabledForm ? "" : 
                <div className="ant-row shortcut-input-row">
                    <div className="ant-col ant-form-item-label"></div>
                    <div className="ant-col ant-form-item-control">
                        <div className="ant-form-item-control-input">
                            <div className="ant-form-item-control-input-content">
                                <Space>
                                    <Tooltip placement="bottom" title={filterAreaAirport("兰州")}>
                                        <Button size="small" onClick={() => { shortcutInputValue('兰州') }}>兰州</Button>
                                    </Tooltip>
                                    <Tooltip placement="bottom" title={filterAreaAirport("西安")}>
                                        <Button size="small" onClick={() => { shortcutInputValue('西安') }}>西安</Button>
                                    </Tooltip>
                                    <Tooltip placement="bottom" title={filterAreaAirport("山东")}>
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

export default inject("schemeFormData",)(observer(TacticExemptDepApForm));
