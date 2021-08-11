import React, { Fragment, useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import "moment/locale/zh-cn"
import { Button, Modal, Form, Card, Radio, Tag, Row, Col, Space } from 'antd'
import { ThunderboltFilled, ExclamationCircleOutlined } from '@ant-design/icons'

import TacticInputMethodRadioGroup from './TacticInputMethodRadioGroup'
import TacticShortcutInputForm from './TacticShortcutInputForm'
import TacticModeForm from './TacticModeForm'
import TacticNameForm from './TacticNameForm'
import TacticPublishUnitForm from './TacticPublishUnitForm'
import TacticPublishUserForm from './TacticPublishUserForm'
import TacticReasonForm from './TacticReasonForm'
import TacticDateTimeForm from './TacticDateTimeForm'
import TacticMeasureForm from './TacticMeasureForm'
import TacticReserveSlotForm from './TacticReserveSlotForm'
import TacticFormerUnitForm from './TacticFormerUnitForm'
import TacticTargetUnitForm from './TacticTargetUnitForm'
import TacticBehindUnitForm from './TacticBehindUnitForm'
import TacticExemptFormerUnitForm from './TacticExemptFormerUnitForm'
import TacticExemptBehindUnitForm from './TacticExemptBehindUnitForm'
import TacticAreaProvinceAirportInit from './TacticAreaProvinceAirportInit'
import TacticSpecialAreaAirportInit from './TacticSpecialAreaAirportInit'
import TacticDepApForm from './TacticDepApForm'
import TacticArrApForm from './TacticArrApForm'
import TacticExemptDepApForm from './TacticExemptDepApForm'
import TacticExemptArrApForm from './TacticExemptArrApForm'
import TacticUseHeightForm from './TacticUseHeightForm'
import TacticExemptHeightForm from './TacticExemptHeightForm'
import TacticOriginRouteForm from './TacticOriginRouteForm'
import TacticAlterRouteForm from './TacticAlterRouteForm'
import TacticLimitedFlightForm from './TacticLimitedFlightForm'
import TacticExemptFlightForm from './TacticExemptFlightForm'
import TacticTemplateForm from './TacticTemplateForm'
import TacticTemplateNameForm from './TacticTemplateNameForm'
import { handleImportControl, handleImportControlForUpdate, handleUpdateFlowControl, handleCreateSchemeBySimulation } from 'utils/client'
import { parseFullTime, isValidObject, isValidVariable } from 'utils/basic-verify'
import { request } from 'utils/request'
import { ReqUrls } from 'utils/request-urls'
import { SchemeFormUtil } from 'utils/scheme-form-util'

import './SchemeForm.scss'
import { inject, observer } from "mobx-react";
import { element } from 'prop-types'
import { schemeTemplateData } from '../../stores/schemeTemplateStores'
//方案表单
function SchemeForm(props) {
    // 可显示快捷录入表单的页面类型集合
    const isShowShortcutFormPageType = SchemeFormUtil.getIsShowShortcutFormPageType();
    // 原航路表单字段配置
    let [originRouteField, setOriginRouteField] = useState(SchemeFormUtil.InitialOriginRouteFieldData)

    // 备选航路表单字段配置集合
    let [alterRoutesField, setAlterRoutesField] = useState(SchemeFormUtil.InitialAlterRoutesFieldData);
    // 主按钮是否禁用
    let [primaryBtnDisabled, setPrimaryBtnDisabled] = useState(false);
    // 另存为模板框态框是否显示
    let [saveAsTemplateModalVisible, setSaveAsTemplateModalVisible] = useState(false);
    const { systemPage, schemeFormData, pageType, primaryButtonName, operationDescription, clearSimIdFlag } = props;
    // 编辑按钮
    const showEditBtn = props.showEditBtn || false;
    // 忽略按钮
    const showIgnoreBtn = props.showIgnoreBtn || false;
    // 另存为模拟按钮
    const showSaveAsTemplateBtn = props.showSaveAsTemplateBtn || false;
    // 设置表单父级模态框是否可见(正式方案进行模拟调整操作)
    const setModalVisible = props.setModalVisible || {};

    // 快捷录入表单基础数据
    const shortcutFormData = schemeFormData.shortcutFormData || [];
    // 快捷录入表单勾选的复选框集合
    const shortcutFormSelecedData = schemeFormData.shortcutFormSelecedData || [];
    // 用户信息
    const user = systemPage.user || {};
    // 用户名
    const userName = user.username || ""
    // 所有区域标签机场数据
    const areaAirportListData = schemeFormData.areaAirportListData;
    // 限制方式
    const restrictionMode = schemeFormData.restrictionMode;
    // MIT限制类型单位(T:时间 D:距离)
    const restrictionMITValueUnit = schemeFormData.restrictionMITValueUnit;
    // 速度值
    const distanceToTime = schemeFormData.distanceToTime;
    // 基准点
    const targetUnit = schemeFormData.targetUnit;

    //方案交通流录入方式 shortcut:快捷录入  custom:自定义
    const inputMethod = schemeFormData.inputMethod;
    // 方案模式表单
    const [tacticModeForm] = Form.useForm();
    // 方案名称表单
    const [tacticNameForm] = Form.useForm();
    // 方案发布单位表单
    const [tacticPublishUnitForm] = Form.useForm();
    // 方案发布用户表单
    const [tacticPublishUserForm] = Form.useForm();
    // 方案原因表单
    const [tacticReasonForm] = Form.useForm();
    // 方案日期时间表单
    const [tacticDateTimeForm] = Form.useForm();
    // 方案措施信息表单
    const [tacticMeasureForm] = Form.useForm();
    // 方案预留时隙表单
    const [tacticReserveSlotForm] = Form.useForm();
    // 方案前序单元表单
    const [tacticFormerUnitForm] = Form.useForm();
    // 方案基准单元表单
    const [tacticTargetUnitForm] = Form.useForm();
    // 方案后序单元表单
    const [tacticBehindUnitForm] = Form.useForm();
    // 方案豁免前序表单
    const [tacticExemptFormerUnitForm] = Form.useForm();
    // 方案豁免后序表单
    const [tacticExemptBehindUnitForm] = Form.useForm();
    // 方案起飞机场表单
    const [tacticDepApForm] = Form.useForm();
    // 方案降落机场表单
    const [tacticArrApForm] = Form.useForm();
    // 方案豁免起飞机场表单
    const [tacticExemptDepApForm] = Form.useForm();
    // 方案豁免降落机场表单
    const [tacticExemptArrApForm] = Form.useForm();
    // 方案高度表单
    const [tacticUseHeightForm] = Form.useForm();
    // 方案豁免高度表单
    const [tacticExemptHeightForm] = Form.useForm();
    // 方案原航路表单
    const [tacticOriginRouteForm] = Form.useForm();
    // 备选原航路表单
    const [tacticAlterRouteForm] = Form.useForm();
    // 快捷录入表单
    const [tacticShortcutInputForm] = Form.useForm();
    // 包含航班表单
    const [tacticLimitedFlightForm] = Form.useForm();
    // 不包含航班表单
    const [tacticExemptFlightForm] = Form.useForm();
    // 方案模板名称表单
    const [tacticTemplateNameForm] = Form.useForm();

    // 方案区域机场表单
    const [tacticAreaAirportForm] = Form.useForm();

    // 自动命名按钮点击事件
    const autofillTacticName = async () => {
        try {
            // 触发必要校验表单项表单验证取表单数据
            const fieldsValueArray = await getNecessaryFieldsValue();
            // 转换表单数值 
            const fieldsValue = convertFieldsValue(fieldsValueArray)
            // 拼接方案名称    
            let tacticName = spliceName(fieldsValue);
            // 更新方案名称表单数值
            tacticNameForm.setFieldsValue({ 'tacticName': tacticName });
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    // 自动命名获取必要校验表单项字段值
    const getNecessaryFieldsValue = () => {
         // console.log(restrictionMode); // restrictionMode 是String形式的限制方式
        let promiseArray = [];
        if (restrictionMode === "CR") {
            promiseArray = [
                tacticOriginRouteFormValidatePromise(),
                tacticAlterRouteFormValidatePromise(),
            ];
        } else {
            if (inputMethod === SchemeFormUtil.INPUTMETHOD_SHORTCUT) {
                promiseArray = [
                    tacticShortcutInputFormValidatePromise(),
                    tacticMeasureFormValidatePromise(),
                    tacticArrApFormValidatePromise(),
                    tacticExemptArrApFormValidatePromise(),
                ]
            } else if (inputMethod === SchemeFormUtil.INPUTMETHOD_CUSTOM) {
                promiseArray = [
                    tacticTargetUnitFormValidatePromise(),
                    tacticBehindtUnitFormValidatePromise(),
                    tacticExemptBehindUnitFormValidatePromise(),
                    tacticArrApFormValidatePromise(),
                    tacticMeasureFormValidatePromise(),
                    tacticExemptArrApFormValidatePromise(),
                ]
            }
        }
        return Promise.all(promiseArray)
    }
    // 校验并获取所有表单项字段值
    const getAllFieldsValue = () => {
        let promiseArray = [
            tacticModeFormValidatePromise(),
            tacticNameFormValidatePromise(),
            tacticDateTimeFormValidatePromise(),
            tacticMeasureFormValidatePromise(),
        ];
        if (restrictionMode === "CR") {
            promiseArray = [
                ...promiseArray,
                tacticOriginRouteFormValidatePromise(),
                tacticAlterRouteFormValidatePromise(),
            ];
        } else {
            if (inputMethod === SchemeFormUtil.INPUTMETHOD_SHORTCUT) {
                promiseArray = [
                    ...promiseArray,
                    tacticShortcutInputFormValidatePromise(),
                    tacticArrApFormValidatePromise(),
                    tacticExemptArrApFormValidatePromise(),
                ]
            } else if (inputMethod === SchemeFormUtil.INPUTMETHOD_CUSTOM) {
                promiseArray = [
                    ...promiseArray,
                    tacticTargetUnitFormValidatePromise(),
                    tacticExemptFormerUnitFormValidatePromise(),
                    tacticFormerUnitFormValidatePromise(),
                    tacticBehindtUnitFormValidatePromise(),
                    tacticExemptBehindUnitFormValidatePromise(),
                    tacticArrApFormValidatePromise(),
                    tacticExemptArrApFormValidatePromise(),
                ]
            }
        }
        if (restrictionMode === "AFP" || restrictionMode === "MIT") {
            // AFP 或 MIT 限制类型增加校验预留时隙表单
            promiseArray = [
                ...promiseArray,
                tacticReserveSlotFormValidatePromise()
            ]
        }
        return Promise.all(promiseArray)
    }

    // 另存为模板获取必要校验表单项字段值
    const getSaveAsTemplateNecessaryFieldsValue = () => {
        let promiseArray = [
            tacticMeasureFormValidatePromise(),
        ];
        if (restrictionMode === "CR") {
            promiseArray = [
                ...promiseArray,
                tacticOriginRouteFormValidatePromise(),
                tacticAlterRouteFormValidatePromise(),
            ];
        } else {
            if (inputMethod === SchemeFormUtil.INPUTMETHOD_SHORTCUT) {
                promiseArray = [
                    ...promiseArray,
                    tacticShortcutInputFormValidatePromise(),
                    tacticArrApFormValidatePromise(),
                    tacticExemptArrApFormValidatePromise(),
                ]
            } else if (inputMethod === SchemeFormUtil.INPUTMETHOD_CUSTOM) {
                promiseArray = [
                    ...promiseArray,
                    tacticTargetUnitFormValidatePromise(),
                    tacticExemptFormerUnitFormValidatePromise(),
                    tacticFormerUnitFormValidatePromise(),
                    tacticBehindtUnitFormValidatePromise(),
                    tacticExemptBehindUnitFormValidatePromise(),
                    tacticArrApFormValidatePromise(),
                    tacticExemptArrApFormValidatePromise(),
                ]
            }
        }
        return Promise.all(promiseArray)
    }

    // 转换表单字段数值格式
    const convertFieldsValue = (fieldsValueArray) => {
        let result = {};
        if (Array.isArray(fieldsValueArray)) {
            for (let i = 0; i < fieldsValueArray.length; i++) {
                let item = fieldsValueArray[i];
                result = { ...result, ...item }
            }
        }
        return result;
    }
    // 拼接名称
    const spliceName = (fieldData) => {
        // 限制数值单位集合
        const restrictionModeUnit = {
            "AFP": "架/小时",
        };
        // 限制数值单位
        let unit = "";
        let { targetUnit = "", behindUnit = "",
            exemptBehindUnit = "",
            arrAp = [], exemptArrAp = [],
            restrictionAFPValueSequence = "", 
            restrictionTCPeriodDuration="",
            restrictionTCPeriodValue="",
            restrictionMITValue = "", restrictionMITValueUnit = [], originRoute = "",
            shortcutInputCheckboxSet = [],

        } = fieldData;

        let autoName = "";
        // 改航限制类型
        if (restrictionMode == "CR") {
            // 拼接名称
            autoName = `${originRoute} 改航`;
            return autoName
        }

        //基准点
        targetUnit = targetUnit.toUpperCase();
        // 后序单元
        behindUnit = isValidVariable(behindUnit) ? behindUnit.toUpperCase() : "";
        // 豁免后序单元
        exemptBehindUnit = isValidVariable(exemptBehindUnit) ? exemptBehindUnit.toUpperCase() : "";
        // 限制数值单位
        unit = restrictionModeUnit[restrictionMode];
        if (restrictionMode === "MIT") {
            if (restrictionMITValueUnit === 'T') {
                unit = '分钟'
            } else if (restrictionMITValueUnit === 'D') {
                unit = '公里'
            }
        }
        // 降落机场 
        arrAp = (isValidVariable(arrAp) && isValidVariable(arrAp.join(';'))) ? arrAp.join(';').toUpperCase() : "";
        // 豁免降落机场
        exemptArrAp = (isValidVariable(exemptArrAp) && isValidVariable(exemptArrAp.join(';'))) ? exemptArrAp.join(';').toUpperCase() : "";
        // 快捷录入勾选中的复选框
        shortcutInputCheckboxSet = (isValidVariable(shortcutInputCheckboxSet) && isValidVariable(shortcutInputCheckboxSet.join(';'))) ? shortcutInputCheckboxSet.join(';').toUpperCase() : "";
        let behindUnitLabel = isValidVariable(behindUnit) ? `去往${behindUnit} ` : "";
        let exemptBehindUnitLabel = isValidVariable(exemptBehindUnit) ? `(${exemptBehindUnit}除外), ` : "";
        let arrApLabel = isValidVariable(arrAp) ? `落地(${arrAp}) ` : "";
        let exemptArrApLabel = isValidVariable(exemptArrAp) ? `(${exemptArrAp}除外) ` : "";
        let descriptions = `${exemptArrApLabel}${behindUnitLabel}${exemptBehindUnitLabel}${arrApLabel}`
        //  快捷录入
        if (inputMethod === SchemeFormUtil.INPUTMETHOD_SHORTCUT) {
            // AFP限制类型
            if (restrictionMode === "AFP") {
                // 拼接名称
                autoName = `${shortcutInputCheckboxSet} ${descriptions}${restrictionAFPValueSequence}${unit}`;
                //  若restrictionMITValue有值则追加最小间隔显示
                if (isValidVariable(restrictionMITValue)) {
                    let subunit = "";
                    if (restrictionMITValueUnit === 'T') {
                        subunit = '分钟'
                    } else if (restrictionMITValueUnit === 'D') {
                        subunit = '公里'
                    }
                    // 拼接名称
                    autoName = `${shortcutInputCheckboxSet} ${descriptions}${restrictionAFPValueSequence}${unit} 最小间隔${restrictionMITValue}${subunit}`;
                }

            } else if (restrictionMode === "MIT") {
                // 拼接名称
                autoName = `${shortcutInputCheckboxSet} ${descriptions}${restrictionMITValue}${unit}`;
            } else if (restrictionMode == "GS") { // GS限制类型
                // 拼接名称
                autoName = `${shortcutInputCheckboxSet} ${descriptions}停放`;
            } else if(restrictionMode === "TC"){
                // 拼接名称
                autoName = `${shortcutInputCheckboxSet} ${descriptions}${restrictionTCPeriodDuration}分钟${restrictionTCPeriodValue}架次`;
                //  若restrictionMITValue有值则追加最小间隔显示
                if (isValidVariable(restrictionMITValue)) {
                    let subunit = "";
                    if (restrictionMITValueUnit === 'T') {
                        subunit = '分钟'
                    } else if (restrictionMITValueUnit === 'D') {
                        subunit = '公里'
                    }
                    // 拼接名称
                    autoName = `${shortcutInputCheckboxSet} ${descriptions}${restrictionTCPeriodDuration}分钟${restrictionTCPeriodValue}架次 最小间隔${restrictionMITValue}${subunit}`;
                }
            }
        } else if (inputMethod === SchemeFormUtil.INPUTMETHOD_CUSTOM) { // 自定义录入
            // MIT或AFP限制类型
            if (restrictionMode === "AFP") {
                // 拼接名称
                autoName = `${targetUnit} ${descriptions}${restrictionAFPValueSequence}${unit}`;
                //  若restrictionMITValue有值则追加最小间隔显示
                if (isValidVariable(restrictionMITValue)) {
                    let subunit = "";
                    if (restrictionMITValueUnit === 'T') {
                        subunit = '分钟'
                    } else if (restrictionMITValueUnit === 'D') {
                        subunit = '公里'
                    }
                    // 拼接名称
                    autoName = `${targetUnit} ${descriptions}${restrictionAFPValueSequence}${unit} 最小间隔${restrictionMITValue}${subunit}`;
                }
            } else if (restrictionMode === "MIT") {
                // 拼接名称
                autoName = `${targetUnit} ${descriptions}${restrictionMITValue}${unit}`;
            } else if (restrictionMode == "GS") { // GS限制类型
                // 拼接名称
                autoName = `${targetUnit} ${descriptions}停放`;
            }else if(restrictionMode === "TC"){
                // 拼接名称
                autoName = `${targetUnit} ${descriptions}${restrictionTCPeriodDuration}分钟${restrictionTCPeriodValue}架次`;
                //  若restrictionMITValue有值则追加最小间隔显示
                if (isValidVariable(restrictionMITValue)) {
                    let subunit = "";
                    if (restrictionMITValueUnit === 'T') {
                        subunit = '分钟'
                    } else if (restrictionMITValueUnit === 'D') {
                        subunit = '公里'
                    }
                    // 拼接名称
                    autoName = `${targetUnit} ${descriptions}${restrictionTCPeriodDuration}分钟${restrictionTCPeriodValue}架次 最小间隔${restrictionMITValue}${subunit}`;
                }
            }
        }
        return autoName;
    }
    // 方案名称表单校验Promise
    const tacticModeFormValidatePromise = () => {
        return new Promise((resolve, reject) => {
            tacticModeFormValidate(resolve, reject)
        })
    }
    // 方案名称表单校验
    const tacticModeFormValidate = async (resolve, reject) => {
        try {
            // 必要校验字段
            const fields = [
                'tacticMode',
            ];
            // 触发表单验证取表单数据
            const fieldData = await tacticModeForm.validateFields(fields);
            resolve(fieldData)
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    // 方案名称表单校验Promise
    const tacticNameFormValidatePromise = () => {
        return new Promise((resolve, reject) => {
            tacticNameFormValidate(resolve, reject)
        })
    }
    // 方案名称表单校验
    const tacticNameFormValidate = async (resolve, reject) => {
        try {
            // 必要校验字段
            const fields = [
                'tacticName',
            ];
            // 触发表单验证取表单数据
            const fieldData = await tacticNameForm.validateFields(fields);
            resolve(fieldData)
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };
    // 方案时间表单校验Promise
    const tacticDateTimeFormValidatePromise = () => {
        return new Promise((resolve, reject) => {
            tacticDateTimeFormValidate(resolve, reject)
        })
    }
    // 方案时间表单校验
    const tacticDateTimeFormValidate = async (resolve, reject) => {
        try {
            // 必要校验字段
            const fields = [
                'startDate',
                'endDate',
                'startTime',
                'endTime',
            ];
            // 触发表单验证取表单数据
            const fieldData = await tacticDateTimeForm.validateFields(fields);
            resolve(fieldData)
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    // 基准单元表单校验Promise
    const tacticTargetUnitFormValidatePromise = () => {
        return new Promise((resolve, reject) => {
            tacticTargetUnitFormValidate(resolve, reject)
        })
    }
    // 基准单元表单校验
    const tacticTargetUnitFormValidate = async (resolve, reject) => {
        try {
            // 必要校验字段
            const fields = [
                'targetUnit',
            ];
            // 触发表单验证取表单数据
            const fieldData = await tacticTargetUnitForm.validateFields(fields);
            resolve(fieldData)
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    // 后序单元表单校验Promise
    const tacticBehindtUnitFormValidatePromise = () => {
        return new Promise((resolve, reject) => {
            tacticBehindUnitFormValidate(resolve, reject)
        })
    }
    // 后序单元表单校验
    const tacticBehindUnitFormValidate = async (resolve, reject) => {
        try {
            // 必要校验字段
            const fields = [
                'behindUnit',
            ];
            // 触发表单验证取表单数据
            const fieldData = await tacticBehindUnitForm.validateFields(fields);
            resolve(fieldData)
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };
    // 豁免后序单元表单校验Promise
    const tacticExemptBehindUnitFormValidatePromise = () => {
        return new Promise((resolve, reject) => {
            tacticExemptBehindUnitFormValidate(resolve, reject)
        })
    }
    // 豁免后序单元表单校验
    const tacticExemptBehindUnitFormValidate = async (resolve, reject) => {
        try {
            // 必要校验字段
            const fields = [
                'exemptBehindUnit',
            ];
            // 触发表单验证取表单数据
            const fieldData = await tacticExemptBehindUnitForm.validateFields(fields);
            resolve(fieldData)
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    // 前序单元表单校验Promise
    const tacticFormerUnitFormValidatePromise = () => {
        return new Promise((resolve, reject) => {
            tacticFormerUnitFormValidate(resolve, reject)
        })
    }
    // 前序单元表单校验
    const tacticFormerUnitFormValidate = async (resolve, reject) => {
        try {
            // 必要校验字段
            const fields = [
                'formerUnit',
            ];
            // 触发表单验证取表单数据
            const fieldData = await tacticFormerUnitForm.validateFields(fields);
            resolve(fieldData)
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    // 豁免前序单元表单校验Promise
    const tacticExemptFormerUnitFormValidatePromise = () => {
        return new Promise((resolve, reject) => {
            tacticExemptFormerUnitFormValidate(resolve, reject)
        })
    }
    // 豁免前序单元表单校验
    const tacticExemptFormerUnitFormValidate = async (resolve, reject) => {
        try {
            // 必要校验字段
            const fields = [
                'exemptFormerUnit',
            ];
            // 触发表单验证取表单数据
            const fieldData = await tacticExemptFormerUnitForm.validateFields(fields);
            resolve(fieldData)
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };



    // 降落机场表单校验Promise
    const tacticArrApFormValidatePromise = () => {
        return new Promise((resolve, reject) => {
            tacticArrApFormValidate(resolve, reject)
        })
    }
    // 降落机场表单校验
    const tacticArrApFormValidate = async (resolve, reject) => {
        try {
            // 必要校验字段
            const fields = [
                'arrAp',
            ];
            // 触发表单验证取表单数据
            const fieldData = await tacticArrApForm.validateFields(fields);
            resolve(fieldData)
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };
    // 豁免降落机场表单校验Promise
    const tacticExemptArrApFormValidatePromise = () => {
        return new Promise((resolve, reject) => {
            tacticExemptArrApFormValidate(resolve, reject)
        })
    }
    // 豁免降落机场表单校验
    const tacticExemptArrApFormValidate = async (resolve, reject) => {
        try {
            // 必要校验字段
            const fields = [
                'exemptArrAp',
            ];
            // 触发表单验证取表单数据
            const fieldData = await tacticExemptArrApForm.validateFields(fields);
            resolve(fieldData)
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };
    // 措施信息表单校验Promise
    const tacticMeasureFormValidatePromise = () => {
        return new Promise((resolve, reject) => {
            tacticMeasureFormValidate(resolve, reject)
        })
    }
    // 措施信息表单校验
    const tacticMeasureFormValidate = async (resolve, reject) => {
        try {
            // 必要校验字段
            const fields = [
                'restrictionMode',
                'restrictionAFPValueSequence',
                'restrictionTCPeriodDuration',
                'restrictionTCPeriodValue',
                'restrictionMITValue',
                'restrictionMITValueUnit',
            ];
            // 触发表单验证取表单数据
            const fieldData = await tacticMeasureForm.validateFields(fields);
            resolve(fieldData)
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    // 快捷录入表单校验Promise
    const tacticShortcutInputFormValidatePromise = () => {
        return new Promise((resolve, reject) => {
            tacticShortcutInputFormValidate(resolve, reject)
        })
    }
    // 快捷录入表单校验
    const tacticShortcutInputFormValidate = async (resolve, reject) => {
        try {
            // 必要校验字段
            const fields = [
                'shortcutInputCheckboxSet',
            ];
            // 触发表单验证取表单数据
            const fieldData = await tacticShortcutInputForm.validateFields(fields);
            resolve(fieldData)
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    // 原航路表单校验Promise
    const tacticOriginRouteFormValidatePromise = () => {
        return new Promise((resolve, reject) => {
            tacticOriginRouteFormValidate(resolve, reject)
        })
    }
    // 原航路表单校验
    const tacticOriginRouteFormValidate = async (resolve, reject) => {
        try {
            // 必要校验字段
            const fields = [
                'originRoute',
            ];
            // 触发表单验证取表单数据
            const fieldData = await tacticOriginRouteForm.validateFields(fields);
            resolve(fieldData)
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    // 备选航路表单校验Promise
    const tacticAlterRouteFormValidatePromise = () => {
        return new Promise((resolve, reject) => {
            tacticAlterRouteFormValidate(resolve, reject)
        })
    }
    
    // 备选路表单校验
    const tacticAlterRouteFormValidate = async (resolve, reject) => {
        try {
            // 必要校验字段
            const fields = [
                'alterRoute1',
                'alterRoute2',
                'alterRoute3',
                'alterRoute4',
                'alterRoute5',
            ];
            // 触发表单验证取表单数据
            const fieldData = await tacticAlterRouteForm.validateFields(fields);
            resolve(fieldData)
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    // 方案预留时隙表单校验Promise
    const tacticReserveSlotFormValidatePromise = () => {
        return new Promise((resolve, reject) => {
            tacticReserveSlotFormValidate(resolve, reject)
        })
    }
    // 方案预留时隙表单校验
    const tacticReserveSlotFormValidate = async (resolve, reject) => {
        try {
            // 必要校验字段
            const fields = [
                'reserveSlot',
            ];
            // 触发表单验证取表单数据
            const fieldData = await tacticReserveSlotForm.validateFields(fields);
            resolve(fieldData)
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };



    /*********************改航相关start**************************/

    // 获取备选航路请求参数
    const getRouteValueParams = () => {

        // 原航路表单值
        let originRoute = tacticOriginRouteForm.getFieldValue('originRoute');
        originRoute = originRoute ? originRoute.toUpperCase() : "";
        let originRouteObj = {
            originRoute: originRoute
        }
        let alterRouteObj = {}
        // 遍历备选航路表单配置集合拼接参数
        for (let i = 0; i < SchemeFormUtil.InitialAlterRoutesFieldData.length; i++) {
            let val = tacticAlterRouteForm.getFieldValue(SchemeFormUtil.InitialAlterRoutesFieldData[i].name);
            val = val ? val.toUpperCase() : "";
            let key = `alterRoute${i + 1}`
            let obj = {
                [key]: val
            }
            alterRouteObj = {
                ...alterRouteObj,
                ...obj
            }

        }
        let result = {
            ...originRouteObj,
            ...alterRouteObj
        }
        return result
    }

    // 绘制备选航路表单
    const drawAlterRoutes = () => {
        return (
            <TacticAlterRouteForm
                pageType={pageType}
                form={tacticAlterRouteForm}
                disabledForm={props.disabledForm}
                alterRoutesFieldData={alterRoutesField}
                validateSingleRouteFormat={validateSingleRouteFormat}
            // validateMultiRouteFormat={validateMultiRouteFormat}
            >
            </TacticAlterRouteForm>
        )
    }

    // 更新单条备选航路表单配置数据
    const updateSingleAlterRouteData = (item, validateResult) => {
        let name = item.name;
        let value = tacticAlterRouteForm.getFieldValue(name);
        value = value ? value.toUpperCase() : "";
        let data = null;
        if (isValidVariable(validateResult) && Array.isArray(validateResult) && validateResult.length > 0) {
            // 从校验结果集合中查找与此表单匹配的项:遍历校验结果每项的paramIndex值(传递参数时的数字), 当alterRoute+paramIndex 与当前表单name相同则匹配
            data = validateResult.find(element => `alterRoute${element.paramIndex}` === name) || {};
        }
        // 返回值
        let obj = {
            name: name
        };
        // 若找到与此表单相匹配的结果项
        if (isValidObject(data)) {
            // 若correct值为true,则此表单为校验通过
            if (data.correct) {
                obj.help = `排名${data.routeRank}  航路总长度${data.distance}千米`;
                obj.validateStatus = "success";
            } else {
                // 反之,此表单未校验通过
                tacticAlterRouteForm.setFields([{ name: name, errors: [`${data.errorReason}`] }])
                obj.help = `${data.errorReason}`;
                obj.validateStatus = "error";
            }
        } else {
            obj.help = ``;
            obj.validateStatus = '';
        }
        return obj;
    }
    // 获取转换后的备选航路表单配置数据集合
    const getRouteFieldList = (validateResult) => {

        const data = SchemeFormUtil.InitialAlterRoutesFieldData.map(item => {
            return updateSingleAlterRouteData(item, validateResult)
        })
        return data;
    }

    /**
     * 校验原航路格式
     * */
    const validateOriginRouteFormat = (getFieldValue) => {
        const validator = (rules, value, callback) => {
            // 原航路表单值
            value = value ? value.toUpperCase() : "";
            // 校验请求参数
            let routsParams = getRouteValueParams();

            return new Promise((resolve, reject) => {
                // 请求校验
                const opt = {
                    url: ReqUrls.validateRouteUrl,
                    method: 'POST',
                    params: routsParams,
                    resFunc: (data) => {
                        updateRouteData(data);
                        if (isValidObject(data) && isValidObject(data.originRoute)) {

                            if (data.originRoute.correct) {
                                resolve()
                            } else {
                                reject(data.originRoute.errorReason || "")
                            }
                        } else {
                            reject("校验失败")
                        }
                    },
                    errFunc: (err) => {
                        let errMsg = ""
                        if (isValidObject(err) && isValidVariable(err.message)) {
                            errMsg = err.message;
                        } else if (isValidVariable(err)) {
                            errMsg = err;
                        }

                        reject("校验失败" + errMsg)
                    },
                };
                // 发送请求
                request(opt);
            })
        };
        return ({
            validator: validator,
        })
    };

    /**
     * 校验单条备选航路格式
     * */
    const validateSingleRouteFormat = (getFieldValue) => {
        const validator = (rules, value, callback) => {
            let field = rules.field;
            // 校验请求参数
            let routsParams = getRouteValueParams();
            return new Promise((resolve, reject) => {
                // 请求校验
                const opt = {
                    url: ReqUrls.validateRouteUrl,
                    method: 'POST',
                    params: routsParams,
                    resFunc: (data) => {
                        updateRouteData(data);
                        if (isValidObject(data) && Array.isArray(data.alterRoutes) && data.alterRoutes.length > 0) {
                            let validateResult = data.alterRoutes;
                            // 从校验结果集合中查找与此表单匹配的项:遍历校验结果每项的paramIndex值(传递参数时的数字), 当alterRoute+paramIndex 与当前表单field相同则匹配
                            let routeValidate = validateResult.find(element => `alterRoute${element.paramIndex}` === field) || {};
                            if (isValidObject(routeValidate)) {
                                if (routeValidate.correct) {
                                    resolve()
                                } else {
                                    reject(routeValidate.errorReason || "")
                                }
                            } else {
                                resolve()
                            }

                        } else {
                            resolve()
                        }
                    },
                    errFunc: (err) => {
                        resolve()
                    },
                };
                // 发送请求
                request(opt);
            })
        };
        return ({
            validator: validator,
        })
    };


    // 更新航路数据
    const updateRouteData = (data) => {
        data = data || {}
        const { alterRoutes, originRoute } = data;
        if (Array.isArray(alterRoutes)) {
            // 获取备选航路表单配置数据
            let routes = getRouteFieldList(alterRoutes);
            // 更新备选航路表单配置数据
            setAlterRoutesField(routes)
            // 更新备选航路数据信息
            schemeFormData.updateTacticAlterRoutesData(alterRoutes);
        } else {
            // 获取备选航路表单配置数据
            let routes = getRouteFieldList(alterRoutes);
            // 备选航路表单配置数据
            setAlterRoutesField(routes)
            // props.updateRouteFieldList(routes)
            // 更新备选航路数据信息
            props.updateTacticAlterRoutesData([]);
        }
        // 更新原航路数据信息
        if (isValidObject(originRoute)) {
            let distance = originRoute.distance;
            let correct = originRoute.correct;
            let errorReason = originRoute.errorReason;
            if (correct) {
                setOriginRouteField({
                    validateStatus: "success",
                    help: `航路总长度${distance}千米`
                })
            } else {
                setOriginRouteField({
                    validateStatus: "error",
                    help: `${errorReason}`
                })
            }

            schemeFormData.updateTacticOriginRouteData(originRoute)
        } else {
            schemeFormData.updateTacticOriginRouteData({})
        }
    }



    /*********************改航相关end**************************/
    // 交通卡片标题
    const getTitle = () => {
        if (restrictionMode != "CR" && isShowShortcutFormPageType.includes(pageType)) {
            // 除改航限制类型外的且操作为可显示快捷录入的
            return <Space size={20}>交通流信息 <TacticInputMethodRadioGroup disabledForm={props.disabledForm} /></Space>
        } else {
            return (
                <Space size={20}>交通流信息</Space>
            )
        }
    }


    /**
     * 主按钮
     *
     * */
    const drawprimaryBtn = () => {
        //  若表单为不可编辑状态且为MODIFYSIM(模拟状态的方案修改)操作
        if (props.disabledForm && pageType === SchemeFormUtil.PAGETYPE_MODIFYSIM) {
            return ""
        } else {
            return (
                <div className="button-container">
                    <Button
                        type="primary"
                        disabled={primaryBtnDisabled}
                        onClick={handlePrimaryBtnClick}
                    >
                        {primaryButtonName}
                    </Button>

                </div>
            )
        }
    };

    // 绘制另存为模板按钮
    const drawSaveAsTemplateBtn = () => {
        return (
            <div className="button-container">
                <Button
                    type="primary"
                    onClick={handleSaveAsTemplateBtnClick}
                >
                    另存为模板
                </Button>
            </div>
        )
    }

    /**
     * 操作栏
     * */
    const drawOperation = () => {
        return (
            <div className={props.operationBarClassName ? `operation-bar ${props.operationBarClassName}` : "operation-bar"}>
                <Space>
                    {
                        showEditBtn ? (drawEditBtn()) : ""
                    }
                    {
                        isValidVariable(primaryButtonName) ? (drawprimaryBtn()) : ""
                    }

                    {
                        showIgnoreBtn ? (drawIgnoreBtn()) : ""
                    }
                    {
                        showSaveAsTemplateBtn ? (drawSaveAsTemplateBtn()) : ""
                    }
                </Space>
            </div>
        )
    };

    /**
     * 编辑按钮
     *
     * */
    const drawEditBtn = () => {
        return (
            props.disabledForm ?
                <div className="button-container">
                    <Button
                        className="btn_edit"
                        type="primary"
                        onClick={handleOpenEdit}>
                        编辑
                    </Button>
                </div>
                : ""
        )
    };
    /**
    * 打开编辑
    * */
    const handleOpenEdit = () => {
        if (props.hasOwnProperty("setDisabledForm")) {
            props.setDisabledForm(false);
        }
    };

    /**
     * 忽略
     *
     * */
    const drawIgnoreBtn = () => {
        return (
            <div className="button-container">
                <Button
                    className="r_btn btn_ignore"
                    onClick={() => {
                        Modal.confirm({
                            title: '忽略',
                            icon: <ExclamationCircleOutlined />,
                            centered: true,
                            closable: true,
                            content: <div><p>确定忽略当前流控</p></div>,
                            okText: '确定',
                            cancelText: '取消',
                            onOk: () => {
                                window.close();
                            },

                        });
                    }}
                >
                    忽略
                </Button>
            </div>
        )
    };

    // 主按钮点击事件
    const handlePrimaryBtnClick = async () => {
        try {
            // 触发所有表单验证并获取表单数据
            const fieldsValueArray = await getAllFieldsValue();
            // 转换表单数值 
            const fieldsValue = convertFieldsValue(fieldsValueArray);
            // 检查开始时间与当前时间大小
            checkStartDateTimeRange(fieldsValue);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    // 关闭另存为模板确认框
    const handleSaveAsTemplateModalClose = () => {
        // 清空模板名称表单数值
        tacticTemplateNameForm.setFieldsValue({ 'templateName': "" })
        setSaveAsTemplateModalVisible(false);
    }

    // 另存为模板确认按钮点击事件
    const handleSaveAsTemplateModalOk = async () => {
        // 校验模板名称表单
        try {
            // 必要校验字段
            const fields = [
                'templateName',
            ];
            // 触发表单验证取表单数据
            const fieldData = await tacticTemplateNameForm.validateFields(fields);
            // 模板名称
            let templateName = fieldData.templateName || "";
            // 去首尾空格
            templateName = templateName.trim();

            checkTemplateName(templateName);

            // 提交
            // saveAsTemplateData(templateName)

        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    // 另存为模板按钮点击事件
    const handleSaveAsTemplateBtnClick = async () => {
        try {
            // 触发所有表单验证并获取表单数据
            const fieldsValueArray = await getSaveAsTemplateNecessaryFieldsValue();
            // 转换表单数值 
            const fieldsValue = convertFieldsValue(fieldsValueArray);
            // 显示另存为模板模态框
            setSaveAsTemplateModalVisible(true)
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };
    // 检查方案名称是否已经存在
    const checkTemplateName = (templateName) => {
        let repeatTemplate = schemeTemplateData.getRepeatTemplateData(templateName);
        let len = repeatTemplate.length;

        if (len > 0) {
            // 重名模板id
            let templateId = repeatTemplate[0].id;
            Modal.confirm({
                title: '提示',
                icon: <ExclamationCircleOutlined />,
                centered: true,
                closable: true,
                content: <div><p>已存在同名模板,保存将覆盖同名模板数据</p></div>,
                okText: '修改模板名称',
                cancelText: '保存',
                onOk: () => { },
                onCancel: (close) => {
                    // 若close为函数则为取消按钮点击触发，反之为关闭按钮触发
                    if (typeof close === 'function') {
                        // 提交存为模板
                        saveAsTemplateData(templateName, templateId);
                        // 关闭模态框
                        close();
                    }
                },
            });
        } else {
            // 提交存为模板
            saveAsTemplateData(templateName);
        }
    }

    // 提交存为模板
    const saveAsTemplateData = (templateName, templateId) => {
        // 方案表单数据
        const formData = handleFormData();
        // 将方案数据转换为JSON字符串
        const value = JSON.stringify(formData);
        let templateData = {
            // 模板名称
            name: templateName,
            // 用户名
            operator: userName,
            // 模板类型
            type: "schemeTemplateData",
            generateTime: new Date().getTime(),
            value
        }

        const opt = {
            url: ReqUrls.schemeTemplateDataUrl,
            // "POST" 为新增模板; "PUT"为修改模板
            method: 'POST',
            params: templateData,
            resFunc: (data) => {
                saveAsTemplateSuccess(data);
            },
            errFunc: (err) => {
                saveAsTemplateErr(err)
            },
        };
        // 若templateId有效则为存在同名模板，即为修改模板数据
        if (isValidVariable(templateId)) {
            // 增加id参数，值为已存在同名模板id
            templateData.id = templateId;
            // 请求方式要改为"PUT"
            opt.method = 'PUT'
        }
        request(opt);
    }
    // 另存为模板失败
    const saveAsTemplateErr = (err) => {
        let errMsg = ""
        if (isValidObject(err) && isValidVariable(err.message)) {
            errMsg = err.message;
        } else if (isValidVariable(err)) {
            errMsg = err;
        }
        Modal.error({
            title: '保存失败',
            content: (
                <span>
                    <span>模板保存失败</span>
                    <br />
                    <span>{errMsg}</span>
                </span>
            ),
            okText: "确认",
        });

    }
    // 另存为模板成功
    const saveAsTemplateSuccess = (data) => {
        console.log(data);
        if (isValidObject(data)) {
            // 更新方案模板store计数器值,用于触发模板下拉框组件重新获取模板数据
            schemeTemplateData.triggerCounterChange();
            // 提示
            Modal.success({
                title: '保存成功',
                content: '模板保存成功',
                okText: "确认",
                onOk: () => { setSaveAsTemplateModalVisible(false) }
            });
        }
    }


    // 检查开始时间与当前时间大小
    const checkStartDateTimeRange = (fieldData) => {
        // 验证开始时间是否晚于当前时间
        let valided = validateStartDateTimeRange();
        if (valided) {
            // 校验方案名称是否与限制条件相符
            checkTacticName(fieldData, false);
        } else {
            Modal.confirm({
                title: '提示',
                icon: <ExclamationCircleOutlined />,
                centered: true,
                closable: true,
                content: <div><p>{`开始时间早于当前时间，建议修改`}</p></div>,
                okText: '手动修改',
                cancelText: `提交`,
                onOk: () => {
                    handleOpenEdit()
                },
                onCancel: (close) => {
                    // 若close为函数则为取消按钮点击触发，反之为关闭按钮触发
                    if (typeof close === 'function') {
                        // 校验方案名称是否与限制条件相符
                        checkTacticName(fieldData, true);
                        // 关闭模态框
                        close();
                    }
                },
            });
        }
    };

    // 校验结束日期时间与当前时间大小
    const validateStartDateTimeRange = () => {
        // 当前时间
        let currentTime = moment().format("YYYYMMDDHHmm").substring(0, 12);
        const startTime = tacticDateTimeForm.getFieldValue('startTime');
        const startDate = tacticDateTimeForm.getFieldValue('startDate');
        let startDateTimeString = moment(startDate).format("YYYYMMDDHHmm").substring(0, 8) + startTime;
        if (parseFullTime(currentTime).getTime() > parseFullTime(startDateTimeString).getTime()) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 方案名称检查
     * 
     * @param fieldData 表单数据
     * @param skipConfirm 跳过确认提示框 boolean
     *
     * */
    const checkTacticName = (fieldData, skipConfirm) => {
        // 方案名称
        const tacticName = tacticNameForm.getFieldValue('tacticName');
        let autoName = spliceName(fieldData);
        let isValid = autoName.trim() === tacticName.trim()
        // 若方案名称比对通过
        if (isValid) {
            // 若跳过确认提示框则直接提交
            if (skipConfirm) {
                submitData();
                return
            }
            // 弹出确认提交提示框
            Modal.info({
                title: `${primaryButtonName}`,
                // icon: <ExclamationCircleOutlined />,
                centered: true,
                closable: true,
                content: <div><p>确定{primaryButtonName}?</p></div>,
                okText: '确定',
                cancelText: '取消',
                onOk: () => { submitData() },
                // onCancel: (close)=>{ },
            });
        } else {
            Modal.confirm({
                title: '提示',
                icon: <ExclamationCircleOutlined />,
                centered: true,
                closable: true,
                content: <div><p>{`限制条件与方案名称不相符，建议自动命名`}</p></div>,
                okText: `自动命名并提交`,
                cancelText: `提交`,
                onOk: () => { handleAutoFillTacticNameSubmitFormData(fieldData) },
                onCancel: (close) => {
                    // 若close为函数则为取消按钮点击触发，反之为关闭按钮触发
                    if (typeof close === 'function') {
                        // 调用提交函数
                        submitData();
                        // 关闭模态框
                        close();
                    }
                },
            });
        }
    };

    /**
     * 自动命名并提交方案
     *
     * */
    const handleAutoFillTacticNameSubmitFormData = (fieldData) => {
        let autoName = spliceName(fieldData);
        // 更新方案名称
        tacticNameForm.setFieldsValue({ 'tacticName': autoName });
        // 提交
        submitData();
    }


    /**
     * 数据提交
     * */
    const submitData = () => {
        const data = handleFormData();
        const { basicTacticInfo = {} } = schemeFormData.schemeData;
        // 方案id
        const { id } = basicTacticInfo;
        const opt = {
            url: ReqUrls.importSchemeUrl + user.id,
            method: 'POST',
            params: JSON.stringify(data),
            resFunc: (data) => requestSuccess(id, data),
            errFunc: (err) => requestErr(err),
        };
        // 若为手动创建、修改正式的方案操作，则使用createSchemeUrl
        if (pageType === SchemeFormUtil.PAGETYPE_CREATE ||
            pageType === SchemeFormUtil.PAGETYPE_MODIFY) {
            opt.url = ReqUrls.createSchemeUrl + user.id;
            opt.method = "POST";
        } else if (pageType === SchemeFormUtil.PAGETYPE_MODIFYSIM) {
            // 若为模拟状态的方案修改，则使用modifySimulationSchemeUrl
            if(isValidVariable(clearSimIdFlag)){
                // 若clearSimIdFlag 有效则url要接上clearSimIdFlag,用于后端通过此参数判断是否需要清除方案的simId
                opt.url = ReqUrls.modifySimulationSchemeUrl + user.id+"/"+ clearSimIdFlag;
            }else {
                opt.url = ReqUrls.modifySimulationSchemeUrl + user.id;
            }
            opt.method = "PUT";
        } else if (pageType === SchemeFormUtil.PAGETYPE_IMPORT
            || pageType === SchemeFormUtil.PAGETYPE_IMPORTWITHFORMER) {
            // 外区流控导入、 外区流控导入方案已有关联的方案
            opt.url = ReqUrls.importSchemeUrl + user.id;
            opt.method = "POST";
        } else if (pageType === SchemeFormUtil.PAGETYPE_CREATEBYSIM) {
            // 依据已有模拟状态方案创建方案
            opt.url = ReqUrls.createSchemeBySimulationUrl + user.id;
            opt.method = "POST";
        }
        // 禁用主按钮
        setPrimaryBtnDisabled(true);
        request(opt);
    };


    // 处理表单数据
    const handleFormData = () => {
        // 复制方案原始数据对象
        let schemeData = JSON.parse(JSON.stringify(schemeFormData.schemeData));
        // 方案基本信息数据对象
        let basicTacticInfo = schemeData.basicTacticInfo;
        if (!isValidObject(basicTacticInfo)) {
            schemeData.basicTacticInfo = {};
            basicTacticInfo = schemeData.basicTacticInfo
        }
        // 方案时间信息对象
        let tacticTimeInfo = basicTacticInfo.tacticTimeInfo;
        if (!isValidObject(tacticTimeInfo)) {
            basicTacticInfo.tacticTimeInfo = {};
            tacticTimeInfo = basicTacticInfo.tacticTimeInfo
        }

        // 方案流控领域对象
        let basicFlowcontrol = basicTacticInfo.basicFlowcontrol;
        if (!isValidObject(basicFlowcontrol)) {
            basicTacticInfo.basicFlowcontrol = {};
            basicFlowcontrol = basicTacticInfo.basicFlowcontrol
        }
        // 方案方向数据信息集合
        let directionList = basicTacticInfo.directionList;
        if (!isValidVariable(directionList)) {
            directionList = [];
            basicTacticInfo.directionList = [];
        }

        // 方案流控航班类型条件数据对象
        let flightPropertyDomain = basicFlowcontrol.flightPropertyDomain;
        if (!isValidObject(flightPropertyDomain)) {
            basicFlowcontrol.flightPropertyDomain = {};
            flightPropertyDomain = basicFlowcontrol.flightPropertyDomain
        }

        // 方案流控限制措施信息对象
        let flowControlMeasure = basicFlowcontrol.flowControlMeasure;
        if (!isValidObject(flowControlMeasure)) {
            basicFlowcontrol.flowControlMeasure = {};
            flowControlMeasure = basicFlowcontrol.flowControlMeasure
        }
        // 方案流控时间信息对象
        let flowControlTimeInfo = basicFlowcontrol.flowControlTimeInfo;
        if (!isValidObject(flowControlTimeInfo)) {
            basicFlowcontrol.flowControlTimeInfo = {};
            flowControlTimeInfo = basicFlowcontrol.flowControlTimeInfo
        }
        // 所有表单数值
        let formDataValue = getAllFormValue();
        // 转换为大写
        formDataValue = SchemeFormUtil.toUpperCaseValues(formDataValue);

        const {
            tacticMode,
            tacticName,
            tacticPublishUnit,
            tacticPublishUnitCH,
            tacticPublishUser,
            tacticPublishUserCH,
            flowControlReason,
            startTime,
            endTime,
            restrictionAFPValueSequence,
            restrictionTCPeriodDuration,
            restrictionTCPeriodValue,
            restrictionMITValue,
            restrictionMITTimeValue,
            reserveSlot,
            flightId,
            wakeFlowLevel,
            auType,
            airlineType,
            missionType,
            task,
            organization,
            ability,
            aircraftType,
            exemptionFlightId,
            exemptionWakeFlowLevel,
            exemptionAirlineType,
            exemptionAuType,
            exemptionMissionType,
            exemptionTask,
            exemptionOrganization,
            exemptionAbility,
            exemptionAircraftType,

        } = formDataValue;

        // 更新方案模式
        basicTacticInfo.tacticMode = tacticMode;
        // 更新方案录入方式
        basicTacticInfo.inputMethod = inputMethod;
        // 更新方案名称
        basicTacticInfo.tacticName = tacticName;
        // 方案发布单位
        basicTacticInfo.tacticPublishUnit = tacticPublishUnit;
        // 方案发布单位中文
        basicTacticInfo.tacticPublishUnitCH = tacticPublishUnitCH;
        // 方案发布用户
        basicTacticInfo.tacticPublishUser = tacticPublishUser;
        // 方案发布用户中文
        basicTacticInfo.tacticPublishUserCH = tacticPublishUserCH;
        // 更新流控限制原因
        basicFlowcontrol.flowControlReason = flowControlReason;

        // 更新方案开始时间
        tacticTimeInfo.startTime = startTime;
        // 更新方案结束时间
        tacticTimeInfo.endTime = endTime;
        // AFP 或 MIT 限制类型增加预留时隙值
        if (restrictionMode === "AFP" || restrictionMode === "MIT") {
            tacticTimeInfo.reserveSlot = reserveSlot;
        }

        // 更新流控限制方式
        flowControlMeasure.restrictionMode = restrictionMode;
        // 获取表单中方案方向信息数据
        let formDirectionData = getDirectionListData(formDataValue);
        // 方案方向信息集合中第一条数据
        let directionData = directionList[0] || {};
        // 将表单中方案方向数据字段值替换原方案方向数据字段值
        directionData = {
            ...directionData,
            ...formDirectionData
        }
        // 更新方案方向信息集合
        basicTacticInfo.directionList[0] = directionData;

        // 更新流控交通流-包含-航班号
        flightPropertyDomain.flightId = flightId;
        // 更新流控交通流-包含-尾流类型
        flightPropertyDomain.wakeFlowLevel = wakeFlowLevel;
        // 更新流控交通流-包含-运营人
        flightPropertyDomain.auType = auType;
        // 更新流控交通流-包含-航班类型
        flightPropertyDomain.airlineType = airlineType;
        // 更新流控交通流-包含-客货类型
        flightPropertyDomain.missionType = missionType;
        // 更新流控交通流-包含-任务类型
        flightPropertyDomain.task = task;
        // 更新流控交通流-包含-军民航
        flightPropertyDomain.organization = organization;
        // 更新流控交通流-包含-限制资质
        flightPropertyDomain.ability = ability;
        // 更新流控交通流-包含-受控机型
        flightPropertyDomain.aircraftType = aircraftType;

        // 更新流控交通流-不包含-航班号
        flightPropertyDomain.exemptionFlightId = exemptionFlightId;
        // 更新流控交通流-不包含-尾流类型
        flightPropertyDomain.exemptionWakeFlowLevel = exemptionWakeFlowLevel;
        // 更新流控交通流-不包含-航班类型
        flightPropertyDomain.exemptionAirlineType = exemptionAirlineType;
        // 更新流控交通流-不包含-运营人
        flightPropertyDomain.exemptionAuType = exemptionAuType;
        // 更新流控交通流-不包含-客货类型
        flightPropertyDomain.exemptionMissionType = exemptionMissionType;
        // 更新流控交通流-不包含-任务类型
        flightPropertyDomain.exemptionTask = exemptionTask;
        // 更新流控交通流-不包含-军民航
        flightPropertyDomain.exemptionOrganization = exemptionOrganization;
        // 更新流控交通流-不包含-限制资质
        flightPropertyDomain.exemptionAbility = exemptionAbility;
        // 更新流控交通流-不包含-受控机型
        flightPropertyDomain.exemptionAircraftType = exemptionAircraftType;
        // 更新AFP限制值
        flowControlMeasure.restrictionAFPValueSequence = restrictionAFPValueSequence;
        // 更新TC限制分钟值
        flowControlMeasure.restrictionTCPeriodDuration = restrictionTCPeriodDuration;
        // 更新TC限制架次值
        flowControlMeasure.restrictionTCPeriodValue = restrictionTCPeriodValue;
        // 更新MIT限制值
        flowControlMeasure.restrictionMITValue = restrictionMITValue;
        // 更新MIT限制单位
        flowControlMeasure.restrictionMITValueUnit = restrictionMITValueUnit;
        // 更新MIT流控时间间隔字段数值
        flowControlMeasure.restrictionMITTimeValue = restrictionMITTimeValue;
        // 更新速度字段数值(从store中取)
        flowControlMeasure.distanceToTime = schemeFormData.distanceToTime;
        // 改航限制相关数值更新
        if (restrictionMode === "CR") {
            // 更新原航路数据信息
            flowControlMeasure.originRouteData = schemeFormData.originRouteData;
            // 备选航路数据信息
            let alterRoutesData = schemeFormData.alterRoutesData;
            // 表单提交要按routeRank字段排序
            let sortedAlterRouteData = alterRoutesData.sort((item1, item2) => {
                let nameA = item1.routeRank; // ignore upper and lowercase
                let nameB = item2.routeRank; // ignore upper and lowercase
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                // names must be equal
                return 0;
            })
            // 更新备选航路数据信息
            flowControlMeasure.alterRouteData1 = sortedAlterRouteData[0]
            flowControlMeasure.alterRouteData2 = sortedAlterRouteData[1]
            flowControlMeasure.alterRouteData3 = sortedAlterRouteData[2]
            flowControlMeasure.alterRouteData4 = sortedAlterRouteData[3]
            flowControlMeasure.alterRouteData5 = sortedAlterRouteData[4]
        }

        return schemeData;
    }
    // 获取方案方向数据
    const getDirectionListData = (formDataValue) => {

        let directionData = {};
        // 从所有表单数值取出指定项
        const {
            useHeight,
            exemptHeight,
            targetUnit,
            formerUnit,
            behindUnit,
            exemptFormerUnit,
            exemptBehindUnit,
            depAp,
            arrAp,
            exemptDepAp,
            exemptArrAp,
        } = formDataValue;
        // 自定义录入模式下取值
        if (inputMethod === SchemeFormUtil.INPUTMETHOD_CUSTOM) {
            directionData = {
                useHeight,
                exemptHeight,
                targetUnit,
                formerUnit,
                behindUnit,
                exemptFormerUnit,
                exemptBehindUnit,
                depAp,
                arrAp,
                exemptDepAp,
                exemptArrAp,
            }
        } else if (inputMethod === SchemeFormUtil.INPUTMETHOD_SHORTCUT) {
            // 快捷录入模式取值
            directionData = getSingleDirectionListDataByShortcutFormSelecedData(formDataValue);
        }
        return directionData;
    }
    // 快捷录入模式获取方案方向信息集合数据(单方向)
    const getSingleDirectionListDataByShortcutFormSelecedData = (formDataValue) => {
        const {
            useHeight,
            exemptHeight,
            depAp,
            arrAp,
            exemptDepAp,
            exemptArrAp,
        } = formDataValue;
        // 基准单元
        let targetUnit = [];
        // 前序单元
        let formerUnit = [];
        // 后序单元
        let behindUnit = [];
        // 豁免前序
        let exemptFormerUnit = [];
        // 豁免后序
        let exemptBehindUnit = [];
        // 全部基准点
        let points = [];
        for (let i = 0; i < shortcutFormData.length; i++) {
            let directionData = shortcutFormData[i];
            points = [...points, ...directionData.options]
        }
        // 勾选的基准点
        let selecedPoints = points.filter((item) => {
            return shortcutFormSelecedData.includes(item.value);
        })

        for (let j = 0; j < selecedPoints.length; j++) {
            let element = selecedPoints[j].directionCriteria;
            if (isValidVariable(element.targetUnit)) {
                targetUnit = [...targetUnit, element.targetUnit];
            }
            if (isValidVariable(element.formerUnit)) {
                formerUnit = [...formerUnit, element.formerUnit];
            }
            if (isValidVariable(element.behindUnit)) {
                behindUnit = [...behindUnit, element.behindUnit];
            }
            if (isValidVariable(element.exemptFormerUnit)) {
                exemptFormerUnit = [...exemptFormerUnit, element.exemptFormerUnit];
            }
            if (isValidVariable(element.exemptBehindUnit)) {
                exemptBehindUnit = [...exemptBehindUnit, element.exemptBehindUnit];
            }
        }

        let data = {
            targetUnit: targetUnit.join(';'),
            formerUnit: formerUnit.join(';'),
            behindUnit: behindUnit.join(';'),
            exemptFormerUnit: exemptFormerUnit.join(';'),
            exemptBehindUnit: exemptBehindUnit.join(';'),
            useHeight,
            exemptHeight,
            depAp,
            arrAp,
            exemptDepAp,
            exemptArrAp,
        }

        return data;
    }

    // 快捷录入模式获取方案方向信息集合数据(多方向)(暂未使用，预留方法)
    const getMultipleDirectionListDataByShortcutFormSelecedData = (formDataValue) => {
        let list = [];
        const {
            useHeight,
            exemptHeight,
            depAp,
            arrAp,
            exemptDepAp,
            exemptArrAp,
        } = formDataValue;

        // 全部基准点
        let points = [];
        for (let i = 0; i < shortcutFormData.length; i++) {
            // 快捷录入数据中单条方向数据
            let data = shortcutFormData[i];
            // 拷贝单条方向数据中的options数据到points数组中
            points = [...points, ...data.options]
        }
        // 勾选的基准点
        let selecedPoints = points.filter((item) => {
            return shortcutFormSelecedData.includes(item.value);
        })
        for (let j = 0; j < selecedPoints.length; j++) {
            // 单个基准点对应的directionCriteria数据，里面包括基准点、前序、后序、豁免前序、豁免后序字段
            let element = selecedPoints[j].directionCriteria;
            let singleDirection = {
                useHeight,
                exemptHeight,
                depAp,
                arrAp,
                exemptDepAp,
                exemptArrAp,
                targetUnit: element.targetUnit || "",
                formerUnit: element.formerUnit || "",
                behindUnit: element.behindUnit || "",
                exemptFormerUnit: element.exemptFormerUnit || "",
                exemptBehindUnit: element.exemptBehindUnit || "",
            }
            list.push(singleDirection);
        }
        return list;
    }


    // 获取所有表单数据
    const getAllFormValue = () => {
        // 方案模式
        const tacticMode = tacticModeForm.getFieldValue('tacticMode');
        // 方案名称
        const tacticName = tacticNameForm.getFieldValue('tacticName');
        // 发布单位
        const tacticPublishUnit = tacticPublishUnitForm.getFieldValue('tacticPublishUnit');
        // 发布单位中文
        const tacticPublishUnitCH = tacticPublishUnitForm.getFieldValue('tacticPublishUnitCH');
        // 发布用户
        const tacticPublishUser = tacticPublishUserForm.getFieldValue('tacticPublishUser');
        // 发布用户中文
        const tacticPublishUserCH = tacticPublishUserForm.getFieldValue('tacticPublishUserCH');

        // 限制原因
        const flowControlReason = tacticReasonForm.getFieldValue('flowControlReason');

        // 开始日期
        const startDate = tacticDateTimeForm.getFieldValue('startDate');
        // 开始时间
        const startTime = tacticDateTimeForm.getFieldValue('startTime');
        // 结束日期
        const endDate = tacticDateTimeForm.getFieldValue('endDate');
        // 结束时间
        const endTime = tacticDateTimeForm.getFieldValue('endTime');
        // 预留时隙
        const reserveSlot = tacticReserveSlotForm.getFieldValue('reserveSlot');
        // AFP限制数值
        const restrictionAFPValueSequence = tacticMeasureForm.getFieldValue('restrictionAFPValueSequence');
        // TC限制分钟数值
        const restrictionTCPeriodDuration = tacticMeasureForm.getFieldValue('restrictionTCPeriodDuration');
        // TC限制架次数值
        const restrictionTCPeriodValue = tacticMeasureForm.getFieldValue('restrictionTCPeriodValue');
        // MIT限制数值
        const restrictionMITValue = tacticMeasureForm.getFieldValue('restrictionMITValue');
        // MIT时间间隔字段数值
        const restrictionMITTimeValue = tacticMeasureForm.getFieldValue('restrictionMITTimeValue');
        // 基准单元
        let targetUnit = "";
        // 前序单元
        let formerUnit = "";
        // 后序单元
        let behindUnit = "";
        // 豁免前序
        let exemptFormerUnit = "";
        // 豁免后序
        let exemptBehindUnit = "";
        // 改航以外的限制类型且为自定义录入的
        if (restrictionMode !== "CR" && inputMethod === SchemeFormUtil.INPUTMETHOD_CUSTOM) {
            // 更新基准单元数值
            targetUnit = tacticTargetUnitForm.getFieldValue('targetUnit');
            // 更新前序单元数值
            formerUnit = tacticFormerUnitForm.getFieldValue('formerUnit');
            // 更新后序单元数值
            behindUnit = tacticBehindUnitForm.getFieldValue('behindUnit');
            // 更新豁免前序数值
            exemptFormerUnit = tacticExemptFormerUnitForm.getFieldValue('exemptFormerUnit');
            // 更新豁免后序数值
            exemptBehindUnit = tacticExemptBehindUnitForm.getFieldValue('exemptBehindUnit');
        }

        // 起飞机场
        const depAp = tacticDepApForm.getFieldValue('depAp');
        // 降落机场
        const arrAp = tacticArrApForm.getFieldValue('arrAp');
        // 豁免起飞机场
        const exemptDepAp = tacticExemptDepApForm.getFieldValue('exemptDepAp');
        // 豁免降落机场
        const exemptArrAp = tacticExemptArrApForm.getFieldValue('exemptArrAp');

        // 限制高度
        const useHeight = tacticUseHeightForm.getFieldValue('useHeight');
        // 豁免高度
        const exemptHeight = tacticExemptHeightForm.getFieldValue('exemptHeight');
        // 包含-航班号
        const flightId = tacticLimitedFlightForm.getFieldValue('flightId');
        // 包含-尾流类型
        const wakeFlowLevel = tacticLimitedFlightForm.getFieldValue('wakeFlowLevel');
        // 包含-运营人
        const auType = tacticLimitedFlightForm.getFieldValue('auType');
        // 包含-航班类型
        const airlineType = tacticLimitedFlightForm.getFieldValue('airlineType');
        // 包含-客货类型
        const missionType = tacticLimitedFlightForm.getFieldValue('missionType');
        // 包含-任务类型
        const task = tacticLimitedFlightForm.getFieldValue('task');
        // 包含-军民航
        const organization = tacticLimitedFlightForm.getFieldValue('organization');
        // 包含-限制资质
        const ability = tacticLimitedFlightForm.getFieldValue('ability');
        // 包含-受控机型
        const aircraftType = tacticLimitedFlightForm.getFieldValue('aircraftType');

        // 不包含-航班号
        const exemptionFlightId = tacticExemptFlightForm.getFieldValue('exemptionFlightId');
        // 不包含-尾流类型
        const exemptionWakeFlowLevel = tacticExemptFlightForm.getFieldValue('exemptionWakeFlowLevel');
        // 不包含-航班类型
        const exemptionAirlineType = tacticExemptFlightForm.getFieldValue('exemptionAirlineType');
        // 不包含-运营人
        const exemptionAuType = tacticExemptFlightForm.getFieldValue('exemptionAuType');
        // 不包含-客货类型
        const exemptionMissionType = tacticExemptFlightForm.getFieldValue('exemptionMissionType');
        // 不包含-任务类型
        const exemptionTask = tacticExemptFlightForm.getFieldValue('exemptionTask');
        // 不包含-军民航
        const exemptionOrganization = tacticExemptFlightForm.getFieldValue('exemptionOrganization');
        // 不包含-限制资质
        const exemptionAbility = tacticExemptFlightForm.getFieldValue('exemptionAbility');
        // 不包含-受控机型
        const exemptionAircraftType = tacticExemptFlightForm.getFieldValue('exemptionAircraftType');


        // 结束时间
        let endDateTime = (isValidVariable(moment(endDate).format("YYYYMMDDHHmm")) && isValidVariable(endTime)) ?
            moment(endDate).format("YYYYMMDDHHmm").substring(0, 8) + endTime : "";

        let result = {
            tacticMode,
            tacticName,
            tacticPublishUnit,
            tacticPublishUnitCH,
            tacticPublishUser,
            tacticPublishUserCH,
            flowControlReason,
            startTime: moment(startDate).format("YYYYMMDDHHmm").substring(0, 8) + startTime,
            endTime: endDateTime,
            useHeight,
            exemptHeight,
            targetUnit,
            formerUnit,
            behindUnit,
            exemptFormerUnit,
            exemptBehindUnit,
            reserveSlot: isValidVariable(reserveSlot) ? reserveSlot.join(',') : "",
            restrictionAFPValueSequence,
            restrictionTCPeriodDuration,
            restrictionTCPeriodValue,
            restrictionMITValue,
            restrictionMITTimeValue,
            // 起飞机场
            depAp: SchemeFormUtil.parseAreaLabelAirport(depAp, areaAirportListData).join(';'),
            // 降落机场
            arrAp: SchemeFormUtil.parseAreaLabelAirport(arrAp, areaAirportListData).join(';'),
            // 豁免起飞机场
            exemptDepAp: SchemeFormUtil.parseAreaLabelAirport(exemptDepAp, areaAirportListData).join(';'),
            // 豁免降落机场
            exemptArrAp: SchemeFormUtil.parseAreaLabelAirport(exemptArrAp, areaAirportListData).join(';'),

            flightId: flightId.join(';'),
            wakeFlowLevel: wakeFlowLevel.join(';'),
            auType: auType.join(';'),
            airlineType: airlineType.join(';'),
            missionType: missionType.join(';'),
            task: task.join(';'),
            organization: organization.join(';'),
            ability: ability.join(';'),
            aircraftType: aircraftType.join(';'),

            exemptionFlightId: exemptionFlightId.join(';'),
            exemptionWakeFlowLevel: exemptionWakeFlowLevel.join(';'),
            exemptionAirlineType: exemptionAirlineType.join(';'),
            exemptionAuType: exemptionAuType.join(';'),
            exemptionMissionType: exemptionMissionType.join(';'),
            exemptionTask: exemptionTask.join(';'),
            exemptionOrganization: exemptionOrganization.join(';'),
            exemptionAbility: exemptionAbility.join(';'),
            exemptionAircraftType: exemptionAircraftType.join(';'),
        }
        return result
    }

    // 获取快捷录入方式下勾选中的基准点
    const getTargetUnitByshortcutFormSelecedData = () => {
        // 基准单元
        let targetUnit = [];
        // 全部基准点
        let points = [];
        for (let i = 0; i < shortcutFormData.length; i++) {
            // 单条方向数据
            let directionData = shortcutFormData[i];
            // 拷贝单条方向数据中的options数据到points数组中
            points = [...points, ...directionData.options]
        }
        // 勾选的基准点
        let selecedPoints = points.filter((item) => {
            return shortcutFormSelecedData.includes(item.value);
        })
        // 遍历勾选的基准点数据
        for (let j = 0; j < selecedPoints.length; j++) {
            // 单个基准点对应的directionCriteria数据，里面包括基准点、前序、后序、豁免前序、豁免后序字段
            let element = selecedPoints[j].directionCriteria;
            if (isValidVariable(element.targetUnit)) {
                targetUnit = [...targetUnit, element.targetUnit];
            }
        }
        let units = targetUnit.join(';');
        return units
    }

    /**
    * 数据提交成功回调
    * @param oldId 原方案id(正式方案, 方案列表-点击方案调整弹出的页面)
    * @param data 提交请求响应回的方案数据
    * */
    const requestSuccess = (oldId, data) => {
        // 正式方案修改操作仅修改相应字段值，不进行模拟流程接口返回code标记
        const RESPONSECODE = "2002102000"
        const { tacticProcessInfo = {}, code = "" } = data;
        const { basicTacticInfo = {} } = tacticProcessInfo;
        // 方案id
        const id = basicTacticInfo.id || "";
        // 方案simTacticId 
        const simTacticId = basicTacticInfo.simTacticId || "";

        if (pageType === SchemeFormUtil.PAGETYPE_MODIFY && code === RESPONSECODE) {
            // 当前活动方案id
            let activeSchemeId = props.schemeListData.activeSchemeId || "";
            if (id === activeSchemeId) {
                // 强制刷新航班表格
                props.flightTableData.setForceUpdate(true);
            }
            Modal.success({
                title: '方案修改成功',
                content: '方案修改成功',
                okText: "确认",
                onOk: () => {
                    // 关闭窗口
                    if (typeof (setModalVisible) === 'function') {
                        setModalVisible(false)
                    }
                },
            });
            return;
        }
        //发送到客户端
        if (pageType === SchemeFormUtil.PAGETYPE_CREATE) { // 方案创建
            handleImportControl(id);
        } else if (pageType === SchemeFormUtil.PAGETYPE_IMPORT) { // 外区流控导入方案 
            handleImportControl(id, props.message.id);
        } else if (pageType === SchemeFormUtil.PAGETYPE_MODIFY) { // 正式方案进行模拟修改操作
            if (code !== RESPONSECODE) {
                /**
                * @param oldID 正式方案id
                * @param newId 生成的新的模拟状态的方案id
                * 
                * */
                handleImportControlForUpdate(oldId, id);
            }
        } else if (pageType === SchemeFormUtil.PAGETYPE_IMPORTWITHFORMER) { //  外区流控导入方案，且已有关联的方案
            handleImportControlForUpdate(formerId, id);
        } else if (pageType === SchemeFormUtil.PAGETYPE_MODIFYSIM) { // 模拟的方案进行修改操作
            handleUpdateFlowControl(id, simTacticId);
        } else if (pageType === SchemeFormUtil.PAGETYPE_CREATEBYSIM) {
            // 依据已有模拟状态方案创建模拟方案
            handleCreateSchemeBySimulation(id, simTacticId)
        }
        // 关闭窗口
        if (typeof (setModalVisible) === 'function') {
            setModalVisible(false)
        }
        window.close();
    };

    /**
     * 数据提交失败回调
     * */
    const requestErr = (err) => {
        if (props.hasOwnProperty("setDisabledForm")) {
            props.setDisabledForm(false);
        }
        setPrimaryBtnDisabled(false);
        let errMsg = "";
        if (isValidObject(err) && isValidVariable(err.message)) {
            errMsg = err.message;
        } else if (isValidVariable(err)) {
            errMsg = err;
        }
        Modal.error({
            content: (
                <span>
                    <span>{`${operationDescription}失败`}</span>
                    <br />
                    <span>{errMsg}</span>
                </span>
            ),
            okText: "确认",
        });
    };

    // 获取速度值
    const updateDistanceToTimeValue = () => {
        let pointName = getTargetUnit();
        if (!isValidVariable(pointName)) {
            schemeFormData.updateTacticMITDistanceToTime("");
            // 清空速度表单数值
            tacticMeasureForm.setFieldsValue({ 'distanceToTime': '' })
            // 清空速度表单数值
            tacticMeasureForm.setFieldsValue({ 'restrictionMITTimeValue': '' })
            return
        }
        const opt = {
            url: ReqUrls.speedUrl + "info?pointName=" + pointName,
            method: 'GET',
            params: {},
            resFunc: (data) => requestSpeedValueSuccess(data),
            errFunc: (err) => requestSpeedValueErr(err),
        };
        request(opt)
    }
    // 获取基准单元
    const getTargetUnit = () => {
        let targetUnit = "";
        if (restrictionMode !== "CR" && inputMethod === SchemeFormUtil.INPUTMETHOD_SHORTCUT) {
            targetUnit = getTargetUnitByshortcutFormSelecedData()
        } else {
            targetUnit = tacticTargetUnitForm.getFieldValue('targetUnit');
        }
        if (isValidVariable(targetUnit)) {
            // 分号转逗号
            targetUnit = targetUnit.split(';').join(',');
            // 加号转逗号
            targetUnit = targetUnit.split('+').join(',');
        }else{
            targetUnit = ""
        }
        return targetUnit.toUpperCase();
    }

    // 获取速度数值成功
    const requestSpeedValueSuccess = (data) => {
        let value = "";
        let array = [];
        const { result = [] } = data;
        if (result.length > 0) {
            array = result.map(item => item.speed);
            value = Math.max.apply(null, array);
        }
        schemeFormData.updateTacticMITDistanceToTime(value);
        // 更新速度字段值
        tacticMeasureForm.setFieldsValue({ 'distanceToTime': value })
        // 更新MIT时间间隔字段数值
        updateMITTimeValueChange();
    }

    /**
     * 数据提交失败回调
     * */
    const requestSpeedValueErr = (err) => {

        // 清空速度表单数值
        tacticMeasureForm.setFieldsValue({ 'distanceToTime': '' })
        // 清空速度表单数值
        tacticMeasureForm.setFieldsValue({ 'restrictionMITTimeValue': '' })

        let errMsg = "";
        if (isValidObject(err) && isValidVariable(err.message)) {
            errMsg = err.message;
        } else if (isValidVariable(err)) {
            errMsg = err;
        }
        Modal.error({
            content: (
                <span>
                    <span>{`获取速度值失败`}</span>
                    <br />
                    <span>{errMsg}</span>
                </span>
            ),
        });
        // 更新MIT时间间隔字段数值
        updateMITTimeValueChange();
    };

    // 更新MIT时间间隔字段数值
    const updateMITTimeValueChange = async () => {
        try {
            // 必要校验字段
            const fields = [
                'restrictionMITValue',
            ];
            // 触发表单验证取表单数据
            const fieldData = await tacticMeasureForm.validateFields(fields);
            const restrictionMITValue = tacticMeasureForm.getFieldValue('restrictionMITValue')
            const distanceToTime = tacticMeasureForm.getFieldValue('distanceToTime')
            // 若限制类型为MIT
            if (restrictionMode === 'MIT' || restrictionMode === 'AFP' || restrictionMode === 'TC') {
                if (restrictionMITValueUnit === 'T') {
                    tacticMeasureForm.setFieldsValue({ 'restrictionMITTimeValue': restrictionMITValue })
                } else if (restrictionMITValueUnit === 'D') {
                    let newValue = "";
                    if (isValidVariable(restrictionMITValue) && isValidVariable(distanceToTime)) {
                        newValue = Math.ceil((parseInt(restrictionMITValue, 10)) / (parseInt(distanceToTime, 10)))
                    }
                    tacticMeasureForm.setFieldsValue({ 'restrictionMITTimeValue': newValue })
                }
            }
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
            tacticMeasureForm.setFieldsValue({ 'restrictionMITTimeValue': '' })
        }
    };



    // 初始化用户信息
    useEffect(function () {
        const user = localStorage.getItem("user");
        // Modal.info({
        //     content: (
        //         <span>
        //             <div>用户信息为:</div>
        //             <div>{JSON.stringify(user)}</div>
        //         </span>
        //     ),
        // });
        if (isValidVariable(user)) {
            props.systemPage.setUserData(JSON.parse(user));
        }
    }, []);
    // 用户id变化触发更新
    useEffect(function () {
        schemeFormData.triggerCounterChange();
    }, [user.id]);

    // 限制方式变更
    useEffect(function () {
        // 重置备选航路表单配置数据
        setAlterRoutesField(SchemeFormUtil.InitialAlterRoutesFieldData)
        setOriginRouteField(SchemeFormUtil.InitialOriginRouteFieldData)
    }, [restrictionMode]);
    // 手动创建方案默认选中快捷录入方式
    useEffect(function () {
        // SHORTCUT:快捷录入  CUSTOM:自定义
        // 手动创建页面设置为快捷录入方式
        if (pageType === SchemeFormUtil.PAGETYPE_CREATE) {
            schemeFormData.updateInputMethod(SchemeFormUtil.INPUTMETHOD_SHORTCUT);
        }
    }, [pageType]);
    // 速度值、快捷录入勾选变更后更新MIT流控时间间隔字段数值
    useEffect(function () {
        if (isValidVariable(distanceToTime) || shortcutFormSelecedData.length > 0) {
            updateMITTimeValueChange();
        }
    }, [distanceToTime, shortcutFormSelecedData]);
    // MIT限制方式下的限制单位变更后更新MIT时间间隔字段数值
    useEffect(function () {
        // 若MIT限制类型单位为距离
        if (isValidVariable(restrictionMITValueUnit) && restrictionMITValueUnit === "D") {
            // 更新MIT时间间隔字段数值
            updateMITTimeValueChange();
        }
    }, [restrictionMITValueUnit]);

    // 快捷录入表单数据变化、勾选项数据变化、基准点变化更新速度值
    useEffect(function () {
        updateDistanceToTimeValue();
    }, [shortcutFormData, shortcutFormSelecedData, targetUnit]);

    return (
        <div className="scheme-form-container">
            {
                drawOperation()
            }
            <Card title="方案信息" bordered={false} size="">
                <Row className="info-row" align="middle">
                    <Col span={24}>
                        <TacticModeForm
                            disabledForm={props.disabledForm}
                            form={tacticModeForm}
                        />
                    </Col>
                </Row>
                <Row className="info-row" >
                    <Col span={20}>
                        <TacticNameForm
                            disabledForm={props.disabledForm}
                            form={tacticNameForm}
                        />
                    </Col>
                    {
                        props.disabledForm ? ""
                            : <Col span={3}>
                                <Form.Item >
                                    <Button type="primary" onClick={autofillTacticName} >自动命名</Button>
                                </Form.Item>
                            </Col>
                    }
                </Row>
                <Row className="info-row">
                    <Col span={8}>
                        <TacticPublishUnitForm
                            disabledForm={props.disabledForm}
                            form={tacticPublishUnitForm} />
                    </Col>
                    <Col span={8}>
                        <TacticPublishUserForm
                            disabledForm={props.disabledForm}
                            form={tacticPublishUserForm} />
                    </Col>
                    <Col span={8}>
                        <TacticReasonForm
                            disabledForm={props.disabledForm}
                            form={tacticReasonForm} />
                    </Col>
                </Row>
                <TacticDateTimeForm
                    disabledForm={props.disabledForm}
                    form={tacticDateTimeForm} />
            </Card>
            <Card title="措施信息" bordered={false} size="">
                {
                    pageType === SchemeFormUtil.PAGETYPE_CREATE &&
                    <Row className="info-row" >
                        <Col span={20}>
                            <TacticTemplateForm
                                disabledForm={props.disabledForm}
                            />
                        </Col>
                    </Row>
                }
                <TacticMeasureForm
                    pageType={pageType}
                    updateDistanceToTimeValue={updateDistanceToTimeValue}
                    updateMITTimeValueChange={updateMITTimeValueChange}
                    disabledForm={props.disabledForm}
                    form={tacticMeasureForm} />
                {
                    (restrictionMode === "CR" || restrictionMode === "GS") ? "" : (
                        <Row className="info-row" >
                            <Col span={20}>
                                <TacticReserveSlotForm
                                    disabledForm={props.disabledForm}
                                    tacticDateTimeForm={tacticDateTimeForm}
                                    form={tacticReserveSlotForm} />
                            </Col>
                        </Row>
                    )
                }

            </Card>
            <Card title={getTitle()} bordered={false} className="flow-control-flight">
                {
                    (restrictionMode !== "CR" && inputMethod === SchemeFormUtil.INPUTMETHOD_SHORTCUT) ?
                        <TacticShortcutInputForm
                            pageType={pageType}
                            updateDistanceToTimeValue={updateDistanceToTimeValue}
                            updateMITTimeValueChange={updateMITTimeValueChange}
                            disabledForm={props.disabledForm}
                            form={tacticShortcutInputForm} /> : ""
                }

                <Row className={(restrictionMode !== "CR" && inputMethod === SchemeFormUtil.INPUTMETHOD_SHORTCUT) ? "" : "info-row"} >
                    <Col span={8}>
                        <TacticFormerUnitForm
                            pageType={pageType}
                            disabledForm={props.disabledForm}
                            form={tacticFormerUnitForm} />
                    </Col>
                    {
                        restrictionMode === "CR" ? <Col span={8}>
                            <TacticOriginRouteForm
                                pageType={pageType}
                                originRouteField={originRouteField}
                                disabledForm={props.disabledForm}
                                form={tacticOriginRouteForm}
                                validateOriginRouteFormat={validateOriginRouteFormat}
                            // validateMultiRouteFormat={validateMultiRouteFormat}
                            />
                        </Col> : ""
                    }
                    {
                        restrictionMode !== "CR" ? <Col span={8}>
                            <TacticTargetUnitForm
                                pageType={pageType}
                                updateDistanceToTimeValue={updateDistanceToTimeValue}
                                disabledForm={props.disabledForm}
                                form={tacticTargetUnitForm} />
                        </Col> : ""
                    }

                    <Col span={8}>
                        <TacticBehindUnitForm
                            pageType={pageType}
                            disabledForm={props.disabledForm}
                            form={tacticBehindUnitForm} />
                    </Col>
                </Row>
                {
                    restrictionMode === "CR" ? drawAlterRoutes() : ""
                }
                <Row className={(restrictionMode !== "CR" && inputMethod === SchemeFormUtil.INPUTMETHOD_SHORTCUT) ? "" : "info-row"}  >
                    <Col span={8}>
                        <TacticExemptFormerUnitForm
                            pageType={pageType}
                            disabledForm={props.disabledForm}
                            form={tacticExemptFormerUnitForm} />
                    </Col>
                    <Col span={8} className="">

                    </Col>
                    <Col span={8}>
                        <TacticExemptBehindUnitForm
                            pageType={pageType}
                            disabledForm={props.disabledForm}
                            form={tacticExemptBehindUnitForm} />
                    </Col>
                </Row>
                <Row className="info-row" >
                    <TacticAreaProvinceAirportInit />
                    <TacticSpecialAreaAirportInit />
                    <Col span={8}>
                        <TacticDepApForm
                            pageType={pageType}
                            disabledForm={props.disabledForm}
                            form={tacticDepApForm} />
                    </Col>
                    <Col span={8}>
                        <TacticUseHeightForm
                            pageType={pageType}
                            disabledForm={props.disabledForm}
                            form={tacticUseHeightForm} />
                    </Col>
                    <Col span={8}>
                        <TacticArrApForm
                            pageType={pageType}
                            disabledForm={props.disabledForm}
                            form={tacticArrApForm} />
                    </Col>
                </Row>
                <Row className="info-row" >
                    <Col span={8}>
                        <TacticExemptDepApForm
                            pageType={pageType}
                            form={tacticExemptDepApForm}
                            disabledForm={props.disabledForm}
                        />
                    </Col>
                    <Col span={8}>
                        <TacticExemptHeightForm
                            pageType={pageType}
                            form={tacticExemptHeightForm}
                            disabledForm={props.disabledForm}
                        />
                    </Col>
                    <Col span={8}>
                        <TacticExemptArrApForm
                            pageType={pageType}
                            form={tacticExemptArrApForm}
                            disabledForm={props.disabledForm}
                        />
                    </Col>
                </Row>
                <Row className="info-row" >
                    <Col span={12}>
                        <TacticLimitedFlightForm title="包含" pageType={pageType} form={tacticLimitedFlightForm} disabledForm={props.disabledForm} />
                    </Col>
                    <Col span={12}>
                        <TacticExemptFlightForm title="不包含" pageType={pageType} form={tacticExemptFlightForm} disabledForm={props.disabledForm} />
                    </Col>
                </Row>
                <Modal
                    title="另存为模板"
                    destroyOnClose={true}
                    width={800}
                    maskClosable={false}
                    visible={saveAsTemplateModalVisible}
                    okText='保存'
                    onOk={handleSaveAsTemplateModalOk}
                    onCancel={handleSaveAsTemplateModalClose}>
                    <Row className="info-row" >
                        <Col span={24}>
                            <TacticTemplateNameForm
                                form={tacticTemplateNameForm}
                            />
                        </Col>
                    </Row>
                </Modal>
            </Card>
        </div>
    )
}

export default withRouter(inject("schemeFormData", "systemPage", "schemeListData", "flightTableData")(observer(SchemeForm)));