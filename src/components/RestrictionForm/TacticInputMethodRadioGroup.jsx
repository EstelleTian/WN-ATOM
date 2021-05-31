import React, { Fragment, useEffect } from 'react'
import { Form, Radio } from 'antd'
import { ThunderboltFilled, EditFilled } from '@ant-design/icons'
import { SchemeFormUtil } from 'utils/scheme-form-util'

import { inject, observer } from "mobx-react";

//方案交通流录入方式单选按钮组
function TacticInputMethodRadioGroup(props) {

    const { schemeFormData, disabledForm } = props;
    // 方案基础信息
    const basicTacticInfo = schemeFormData.schemeData.basicTacticInfo || {};
    // 方案名称
    const tacticName = basicTacticInfo.tacticName || "";
    const value =schemeFormData.inputMethod;
    const onChange = (e)=> {
        const val = e.target.value;
        // 更新录入方式
        schemeFormData.updateInputMethod(val);
        // 清空stores中记录的快捷录入表单勾选中的复选框值集合
        schemeFormData.updateShortcutFormSelecedData([])
    }

    //方案名称发生变化触发更新
    // useEffect(function () {
        
    // }, [tacticName]);
    return (
        <Radio.Group onChange={onChange} value={value} disabled={disabledForm}>
            <Radio value={SchemeFormUtil.INPUTMETHOD_SHORTCUT}><ThunderboltFilled />快捷录入</Radio>
            <Radio value={SchemeFormUtil.INPUTMETHOD_CUSTOM}><EditFilled />自定义录入</Radio>
        </Radio.Group>
    )
}

export default inject("schemeFormData",)(observer(TacticInputMethodRadioGroup));
