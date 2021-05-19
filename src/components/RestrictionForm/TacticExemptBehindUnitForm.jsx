import React, { Fragment, useEffect } from 'react'
import { Form, Input } from 'antd'
import { inject, observer } from "mobx-react";
import { REGEXP } from 'utils/regExpUtil'


//方案豁免后序表单
function TacticExemptBehindUnitForm(props) {

    const { schemeFormData, form } = props;
    // 方案基础信息
    const basicTacticInfo = schemeFormData.schemeData.basicTacticInfo || {};
    // 方案名称
    const tacticName = basicTacticInfo.tacticName || "";
    // 豁免后序
    const exemptBehindUnit = schemeFormData.exemptBehindUnit;
    //方案交通流录入方式 shortcut:快捷录入  custom:自定义
    const inputMethod = schemeFormData.inputMethod || "custom";
    // 方案限制方式
    const restrictionMode = schemeFormData.restrictionMode || "";

    let isHide = false;
    if(restrictionMode !=="CT" && inputMethod ==="shortcut"){
        isHide = true;
    }
    // 表单初始化默认值
    let initialValues = {
        exemptBehindUnit,
    }
    //方案名称发生变化触发更新
    useEffect(function () {
        //重置表单，用以表单初始值赋值
        form.resetFields();
    }, [tacticName, inputMethod]);
    return (
        <Fragment>
            <Form
                form={form}
                initialValues={initialValues}
            >
                <Form.Item
                    className={isHide ? "hidden-form-item" : ""}
                    name="exemptBehindUnit"
                    label="豁免后序"
                    rules={[
                        {
                            type: 'string',
                            pattern: REGEXP.COMBINEDCHARSET,
                            message: '请输入正确格式的豁免后序单元',
                        },
                    ]}
                >
                    <Input placeholder="可选填项，只可录入英文半角字母、数字、问号、分号、逗号" allowClear={true} className="text-uppercase" disabled={props.disabledForm} />
                </Form.Item>
            </Form>
        </Fragment>
    )
}

export default inject("schemeFormData",)(observer(TacticExemptBehindUnitForm));
