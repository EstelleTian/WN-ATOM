import React, { Fragment, useState, useEffect } from 'react'
import { Form, Checkbox, Row, Col, } from 'antd'
import { inject, observer } from "mobx-react";
import { isValidVariable, isValidObject } from 'utils/basic-verify';
import { request } from 'utils/request'
import { ReqUrls } from 'utils/request-urls'
import { SchemeFormUtil } from 'utils/scheme-form-util'
import { customNotice } from 'utils/common-funcs'

//方案措施信息表单
function TacticShortcutInputForm(props) {

    const { schemeFormData, systemPage, form, pageType } = props;
    // 用户信息
    const user = systemPage.user || {};
    // 用户机场 
    const region = user.region || ""; 

    // 方案基础信息
    const basicTacticInfo = schemeFormData.schemeData.basicTacticInfo || {};
    // 方案名称
    const tacticName = basicTacticInfo.tacticName || "";
    //方案交通流录入方式 shortcut:快捷录入  custom:自定义
    const inputMethod = schemeFormData.inputMethod || SchemeFormUtil.INPUTMETHOD_CUSTOM;
    // 表单基础数据
    const shortcutFormData = schemeFormData.shortcutFormData || [];
    // 选中的复选框
    const shortcutFormSelecedData = schemeFormData.shortcutFormSelecedData || [];
    const checkedList = shortcutFormSelecedData;
    // 是否为禁用页面类型
    const isDisabledPageType = SchemeFormUtil.getIsDisabledPageType().includes(pageType)
    // 是否禁用
    const disabled = props.disabledForm || isDisabledPageType;
    // 初始化获取数据
    useEffect(() => {
        // 请求交通流快捷录入表单依赖数据
        requeShortcutInputFormData();
    }, [region]);

    // 录入方式变更后重置快捷录入表单
    useEffect(() => {
        //重置表单，用以表单初始值赋值
        form.resetFields();
    }, [inputMethod]);
    //方案名称发生变化触发更新
    useEffect(function () {
        //重置表单，用以表单初始值赋值
        form.resetFields();
    }, [tacticName]);

    //方案名称发生变化触发更新
    useEffect(function () {
        //重置表单，用以表单初始值赋值
        form.resetFields();
    }, [shortcutFormSelecedData]);

    // 表单初始化默认值
    let initialValues = {
        // 勾选数值
        shortcutInputCheckboxSet: checkedList,
    }

    //更新方案快捷录入表单基础数据
    const updateShortcutInputFormData = data => {
        if (isValidObject(data) && isValidObject(data.resultMap)) {
            schemeFormData.updateShortcutFormData(data.resultMap)
        }else {
            customNotice({
                type: 'error',
                message: <div>
                    <p>获取到的方案快捷录入表单数据为空</p>
                </div>
            })
        }
    };

    // 请求交通流快捷录入表单依赖数据失败
    const requestErr = (err, content) => {
        let errMsg = ""
        if (isValidObject(err) && isValidVariable(err.message)) {
            errMsg = err.message;
        } else if (isValidVariable(err)) {
            errMsg = err;
        }
        customNotice({
            type: 'error',
            message: <div>
                < p>{`${content}`}</p>
                <p>{errMsg}</p>
            </div>
        })
    };

    // 绘制复选按钮
    const drawCheckbox = (list) => {
        return (
            list.map((item) => {
                return <Checkbox disabled={disabled} key={item.label} value={item.label}>{item.label}</Checkbox>
            })
        )
    }
    // 绘制单条方向表单项
    const drawSingleDirectionFields = (directionData) => {
        const options = directionData.options;
        // return (
        //     <Row gutter={24} key={directionData.description} >
        //         <Col span={24} className="checkbox-items-col" >
        //             <Form.Item
        //                 name={directionData.description}
        //                 label={directionData.descriptionZh}
        //             >
        //                 <Checkbox.Group options={options} onChange={(list) => onChange(list, directionData.description)} />

        //             </Form.Item>
        //         </Col>
        //     </Row>
        // )
        return (
            <div className="ant-row info-row" key={directionData.description} >
                <div className="ant-col ant-form-item-label ant-form-item-label-left">
                    <label htmlFor={directionData.description} className="ant-form-item-no-colon" title={directionData.descriptionZh}>{directionData.descriptionZh}</label>
                </div>
                <div className="ant-col ant-form-item-control" style={{padding:"2px 8px"  }}>
                    <div className="ant-form-item-control-input">
                        <div className="ant-form-item-control-input-content">
                            <div className="ant-checkbox-group" >
                                {
                                    drawCheckbox(options)
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // 请求交通流快捷录入表单依赖数据
    const requeShortcutInputFormData = () => {
        
        // 请求参数
        const opt = {
            url: ReqUrls.shortcutInputFormDataUrl+"input?region="+region,
            method: 'GET',
            params: {},
            resFunc: (data) => updateShortcutInputFormData(data),
            errFunc: (err) => requestErr(err, '快捷录入表单数据获取失败'),
        };
        // 发送请求
        request(opt);
    };
    // 复选框变化时回调函数
    const onChange = (list) => {
        // 更新stores
        schemeFormData.updateShortcutFormSelecedData(list);
    };

    return (
        <Fragment>
            <Form
                form={form}
                initialValues={initialValues}
                labelAlign='left'
                className="shortcut-input-form"
            >
                <Form.Item
                    name="shortcutInputCheckboxSet"
                    colon={false}
                    className="checkbox-complex"
                    rules={[{ required: true, message: '至少勾选一项基准点' }]}
                >
                    <Checkbox.Group value={checkedList}  onChange={(list) => onChange(list)}  style={{width: "100%"}}>
                        {
                            shortcutFormData.length > 0 ? shortcutFormData.map(item => {
                                return drawSingleDirectionFields(item)
                            }) : ""
                        }
                    </Checkbox.Group>
                </Form.Item>

            </Form>
        </Fragment>
    )
}
export default inject("schemeFormData", "systemPage")(observer(TacticShortcutInputForm));
