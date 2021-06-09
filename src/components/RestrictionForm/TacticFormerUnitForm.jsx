import React, { Fragment, useEffect  } from 'react'
import { Form, Input } from 'antd'
import { inject, observer } from "mobx-react";
import { REGEXP } from 'utils/regExpUtil'
import { SchemeFormUtil } from 'utils/scheme-form-util'


//方案前序表单
function TacticExemptFormerUnitForm(props) {

    const { schemeFormData, form, pageType } = props;
    // 方案基础信息
    const basicTacticInfo = schemeFormData.schemeData.basicTacticInfo || {};
    // 方案名称
    const tacticName = basicTacticInfo.tacticName || "";
    // 前序单元
    const formerUnit = schemeFormData.formerUnit;
    //方案交通流录入方式 SHORTCUT:快捷录入  CUSTOM:自定义
    const inputMethod = schemeFormData.inputMethod;
    // 方案限制方式
    const restrictionMode = schemeFormData.restrictionMode || "";
    let isHide = false;
    // 是否为禁用页面类型
    const isDisabledPageType = SchemeFormUtil.getIsDisabledPageType().includes(pageType)
    // 是否禁用
    const disabled = props.disabledForm || isDisabledPageType;
    if(restrictionMode !=="CR" && inputMethod ===SchemeFormUtil.INPUTMETHOD_SHORTCUT){
        isHide = true;
    }
    // 表单初始化默认值
    let initialValues = {
        formerUnit,
    }
    //方案名称发生变化触发更新
    useEffect(function () {
        //重置表单，用以表单初始值赋值
        form.resetFields();
    }, [tacticName,inputMethod, formerUnit]);
    return (
        <Fragment>
            <Form
                form={form}
                initialValues={initialValues}
            >
                <Form.Item
                    name="formerUnit"
                    label="前序单元"
                    className={isHide ? "hidden-form-item" : ""}
                    rules={[
                        {
                            whitespace: true,
                        },
                        {
                            type: 'string',
                            pattern: REGEXP.COMBINEDCHARSET,
                            message: '请输入正确格式的前序单元',
                        },
                    ]}
                >
                    <Input placeholder="选填项，只可录入英文半角字母、数字、问号、分号、逗号、中划线、空格" allowClear={true} className="text-uppercase" disabled={disabled} />
                </Form.Item>
            </Form>
        </Fragment>
    )
}

export default inject("schemeFormData",)(observer(TacticExemptFormerUnitForm));
