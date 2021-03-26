import React, { useEffect, useState, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import "moment/locale/zh-cn"
import { Button, Modal, Form, Space, Card, Row, Col, Input, Select, Tooltip, Tag, Divider,Spin } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import ExemptCard from 'components/RestrictionForm/ExemptCard'
import LimitedCard from 'components/RestrictionForm/LimitedCard'
import { handleUpdateDirectionData } from 'utils/client'
import { isValidObject, isValidVariable } from '../../utils/basic-verify'
const { Option } = Select;

import { NWGlobal } from 'utils/global';


import './EditDirectionDataForm.scss'
import { inject, observer } from "mobx-react";

//方向数据表单整体
function DirectionDataForm(props) {
    // 方向数据对象
    let [directionData, setDirectionData] = useState({});
    let [loading, setLoading] = useState(false);

    

    NWGlobal.setEditDirectionData = function (str) {

        const data = JSON.parse(str);

        // const data = {
        //     directionKey: "区内-IGADA",
        //     directionName: "区内-IGADA",
        //     direction: {
        //         targetUnit: "IGADA",
        //         formerUnit: "QIAN",
        //         behindUnit: "HOU",
        //         exemptFormerUnit: "HUOQIAN",
        //         exemptBehindUnit: "HUOHOU",
        //         depAp: "ZLAK;ZLHZ;ZLQY;ZLXY;ZLYA;ZLYL;ZBAA",
        //         arrAp: "ZLXY;ZLIC",
        //         exemptDepAp: "HUOQI",
        //         exemptArrAp: "HUOJIANG",
        //     },
        //     flowControlFlight: {
        //         flowControlFlightId: "CCA123;CCA456",
        //         aircraftType: "B747",
        //     },

        // }
        setDirectionData(data);
    }
    // 区域标签机场集合
    const areaLabelAirport = [
        {
            label: '兰州',
            airport: 'ZBAL;ZBAR;ZBEN;ZBUH;ZLDH;ZLDL;ZLGL;ZLGM;ZLGY;ZLHB;ZLHX;ZLIC;ZLJC;ZLJQ;ZLLL;ZLLN;ZLTS;ZLXH;ZLXN;ZLYS;ZLZW;ZLZY',
            code: 'ZLLL'
        },
        {
            label: '西安',
            airport: 'ZLAK;ZLHZ;ZLQY;ZLXY;ZLYA;ZLYL',
            code: 'ZLXY'
        },
        {
            label: '山东',
            airport: 'ZSHZ;ZSJG;ZSJN;ZSDY;ZSWF;ZSRZ;ZSLY;ZSYT;ZSWH;ZSQD',
            code: 'ZSQD'
        },
    ]

    const systemPage = props.systemPage || {};
    // 用户信息
    const user = systemPage.user || {};


    const { directionName = "", direction = {}, flowControlFlight = {} } = directionData;

    const { targetUnit, formerUnit, behindUnit, exemptFormerUnit, exemptBehindUnit, highLimit, exemptHeight, depAp, arrAp, exemptDepAp, exemptArrAp } = direction;

    const { flowControlFlightId = "", wakeFlowLevel = "", airlineType = "", missionType = "", auType = "",
        task = "", organization = "", ability = "", aircraftType = "",
        exemptFlightId = "", exemptionWakeFlowLevel = "", exemptionAirlineType = "", exemptionMissionType = "", exemptionAuType,
        exemptionTask = "", exemptionOrganization = "", exemptionAbility = "", exemptionAircraftType = "",
    } = flowControlFlight;

    // 转换成区域标签
    function formatAreaLabel(labelData, airport) {
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
            accumulator = accumulator.map((item) => (currentArr.includes(item) ? currentValue.label : item))
        }
        return accumulator
    }

    // 解析指定数值中的区域标签，转换为对应的机场
    function parseAreaLabelAirport(arr) {
        let result = [];
        if (Array.isArray(arr)) {
            if (arr.length == 0) {
                return result;
            }

            for (let i = 0; i < arr.length; i++) {
                let label = arr[i];
                let airports = findAreadLabelAirport(label);
                if (isValidVariable(airports)) {
                    result = result.concat(airports);
                } else {
                    result = result.concat(label)
                }
            }
        }
        return result;
    }
    // 查找指定区域标签对应的机场集合
    function findAreadLabelAirport(label) {
        for (let i = 0; i < areaLabelAirport.length; i++) {
            let data = areaLabelAirport[i];
            let dataLabel = data.label.trim();
            if (label === dataLabel) {
                let arr = data.airport.split(';');
                return arr;
            }
        }
    }

    // 需要将数值转换为大写的字段
    const upperFields = [
        "targetUnit",
        "formerUnit",
        "behindUnit",
        "exemptFormerUnit",
        "exemptBehindUnit",
        "flowControlFlightId",
        "exemptFlightId",
        "aircraftType",
        "exemptionAircraftType",
        "depAp",
        "arrAp",
        "exemptDepAp",
        "exemptArrAp",
    ];

    let abc = 'ZBAL;ZLXY;AAAA;ZBAR;ZBEN;ZBUH;ZLDH;ZLDL;ZLGL;ZLGM;ZLGY;ZLHB;ZLHX;ZLIC;ZLJC;ZLJQ;ZLLL;ZLLN;ZLTS;ZLXH;ZLXN;ZLYS;ZLZW;ZLZY'.split(';');

    let depApArray = isValidVariable(depAp) ? depAp.split(';') : [];
    let arrApArray = isValidVariable(arrAp) ? arrAp.split(';') : [];
    let exemptDepApArray = isValidVariable(exemptDepAp) ? exemptDepAp.split(';') : [];
    let exemptArrApArray = isValidVariable(exemptArrAp) ? exemptArrAp.split(';') : [];

    // 表单初始数值对象集合
    let initialValues = {
        // 方向名称
        directionName: directionName,
        // 基准单元
        targetUnit: targetUnit,
        // 前序单元
        formerUnit: formerUnit,
        // 后序单元
        behindUnit: behindUnit,
        // 豁免前序
        exemptFormerUnit: exemptFormerUnit,
        // 豁免后序
        exemptBehindUnit: exemptBehindUnit,
        // 限制高度
        highLimit: highLimit,
        // 豁免高度
        exemptHeight: exemptHeight,
        // 起飞机场
        depAp: formatAreaLabel(areaLabelAirport, depApArray),
        // 降落机场
        arrAp: formatAreaLabel(areaLabelAirport, arrApArray),
        // 豁免起飞机场
        exemptDepAp: formatAreaLabel(areaLabelAirport, exemptDepApArray),
        // 豁免降落机场
        exemptArrAp: formatAreaLabel(areaLabelAirport, exemptArrApArray),


        // 包含-航班号
        flowControlFlightId: isValidVariable(flowControlFlightId) ? flowControlFlightId.split(';') : [],
        // 包含-尾流类型
        wakeFlowLevel: isValidVariable(wakeFlowLevel) ? wakeFlowLevel.split(';') : [],
        // 包含-运营人
        auType: isValidVariable(auType) ? auType.split(';') : [],
        // 包含-航班类型
        airlineType: isValidVariable(airlineType) ? airlineType.split(';') : [],
        // 包含-客货类型
        missionType: isValidVariable(missionType) ? missionType.split(';') : [],
        // 包含-任务类型
        task: isValidVariable(task) ? task.split(';') : [],
        // 包含-军民航
        organization: isValidVariable(organization) ? organization.split(';') : [],
        // 包含-限制资质
        ability: isValidVariable(ability) ? ability.split(';') : [],
        // 包含-受控机型
        aircraftType: isValidVariable(aircraftType) ? aircraftType.split(';') : [],

        // 不包含-航班号
        exemptFlightId: isValidVariable(exemptFlightId) ? exemptFlightId.split(';') : [],
        // 不包含-尾流类型
        exemptionWakeFlowLevel: isValidVariable(exemptionWakeFlowLevel) ? exemptionWakeFlowLevel.split(';') : [],
        // 不包含-航班类型
        exemptionAirlineType: isValidVariable(exemptionAirlineType) ? exemptionAirlineType.split(';') : [],
        // 不包含-运营人
        exemptionAuType: isValidVariable(exemptionAuType) ? exemptionAuType.split(';') : [],
        // 不包含-客货类型
        exemptionMissionType: isValidVariable(exemptionMissionType) ? exemptionMissionType.split(';') : [],
        // 不包含-任务类型
        exemptionTask: isValidVariable(exemptionTask) ? exemptionTask.split(';') : [],
        // 不包含-军民航
        exemptionOrganization: isValidVariable(exemptionOrganization) ? exemptionOrganization.split(';') : [],
        // 不包含-限制资质
        exemptionAbility: isValidVariable(exemptionAbility) ? exemptionAbility.split(';') : [],
        // 不包含-受控机型
        exemptionAircraftType: isValidVariable(exemptionAircraftType) ? exemptionAircraftType.split(';') : [],
    };

    const [form] = Form.useForm();
    
    useEffect(function () {
        //重置表单，用于重新初始表单的initialValues属性
        form.resetFields();
    }, [user.id, directionData]);

    // 拼接名称
    const spliceName = (fieldData)=> {
        let { targetUnit, formerUnit, behindUnit, depAp, arrAp } = fieldData;
        let name = "";
        if (isValidVariable(formerUnit)) {
            // 前序-基准点
            name = `${formerUnit.toUpperCase()}-${targetUnit.toUpperCase()}`;
        } else if (isValidVariable(depAp) && isValidVariable(depAp.join(';'))) {
            depAp = depAp.join(';').toUpperCase();
            // 起飞机场-基准点
            name = `${depAp}-${targetUnit.toUpperCase()}`;
        } else if (isValidVariable(behindUnit)) {
            // 基准点-后序
            name = `${targetUnit.toUpperCase()}-${behindUnit.toUpperCase()}`;
        } else if (isValidVariable(arrAp) && isValidVariable(arrAp.join(';'))) {
            arrAp = arrAp.join(';').toUpperCase();
            // 基准点-降落机场
            name = `${targetUnit.toUpperCase()}-${arrAp}`;
        } else {
            // 基准点
            name = `${targetUnit.toUpperCase()}`;
        }
        return name;
    }



    /**
     * 自动命名
     *
     * */
    const autofillName = async () => {
        try {
            // 必要校验字段
            const fields = [
                'targetUnit',
            ];
            // 触发表单验证取表单数据
            const values = await form.validateFields(fields);
            // 基准单元
            let { targetUnit } = values;
            let fieldsObj = form.getFieldsValue(['formerUnit', 'behindUnit', 'depAp', 'arrAp']);
            let fieldData = {...fieldsObj, targetUnit}
            let name = spliceName(fieldData);
            // 更新
            form.setFieldsValue({ 'directionName': name });
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };
    /**
     * 自动命名并提交方向
     *
     * */
     const handleAutoFillTacticNameSubmitFormData = (fieldData) => {
        let name = spliceName(fieldData);
        // 更新方向名称
        form.setFieldsValue({ 'directionName': name });
        // 提交
        handleSubmitFormData();
    }
    // 另存为模板
    const saveAsTemplate =()=> {
        Modal.info({
            title: '功能开发中',
            content: (
              <div>
                <p>方向另存为模板功能开发中...</p>
              </div>
            ),
            onOk() {},
          });
    }

    // 应用按钮点击事件
    const handleSubmitButtonClick = async () => {
        try {
            // 触发表单验证取表单数据
            const fieldData = await form.validateFields();
            // 校验方向名称是否与限制条件相符
            checkTacticName(fieldData);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    /**
     * 方向名称检查
     *
     * */
    const checkTacticName = (fieldData) => {
        // 当前方向名称输入框数值
        const directionName = form.getFieldValue('directionName');
        let name = spliceName(fieldData);
        if (name.trim() === directionName.trim()) {
            // 调用提交函数
            handleSubmitFormData();
        } else {
            Modal.confirm({
                title: '提示',
                icon: <ExclamationCircleOutlined />,
                centered: true,
                closable: true,
                content: <div><p>限制条件与方向名称不相符，</p><p>建议自动命名后应用</p></div>,
                okText: '自动命名并应用',
                cancelText: '直接应用',
                onOk: () => { handleAutoFillTacticNameSubmitFormData(fieldData) },
                onCancel: (close) => {
                    // 若close为函数则为取消按钮点击触发，反之为关闭按钮触发
                    if (typeof close === 'function') {
                        // 调用提交函数
                        handleSubmitFormData();
                        // 关闭模态框
                        close();
                    }
                },
            });
        }
    };

    // 处理表单提交数据
    const handleSubmitFormData = async () => {
        try {
            // 触发表单验证取表单数据
            const values = await form.validateFields();
            // 处理提交数据
            const submitData = handleSubmitData(values);
            // 数据提交
            submitFormData(submitData)
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };
    // 清空表单数据,但保留与表单不相关的其他字段及数值
    const restFormData = () => {
        // 复制原数据
        let directionDataCopy = JSON.parse(JSON.stringify(directionData));
        // 方向基本信息数据对象
        let direction = directionDataCopy.direction;
        if (!isValidObject(direction)) {
            directionDataCopy.direction = {};
            direction = directionDataCopy.direction;
        }
        // 方向流控航班类型条件数据对象
        let flowControlFlight = directionDataCopy.flowControlFlight;
        if (!isValidObject(flowControlFlight)) {
            directionDataCopy.flowControlFlight = {};
            flowControlFlight = directionDataCopy.flowControlFlight;
        }

        // 更新方向名称
        directionDataCopy.directionName = "";

        // 更新基准单元
        direction.targetUnit = "";
        // 更新前序单元
        direction.formerUnit = "";
        // 更新后序单元
        direction.behindUnit = "";
        // 更新豁免前序
        direction.exemptFormerUnit = "";
        // 更新豁免后序
        direction.exemptBehindUnit = "";
        // 更新限制高度
        direction.highLimit = "";
        // 更新豁免高度
        direction.exemptHeight = "";

        // 起飞机场
        direction.depAp = "";
        // 降落机场
        direction.arrAp = "";
        // 豁免起飞机场
        direction.exemptDepAp = "";
        // 豁免降落机场
        direction.exemptArrAp = "";

        // 更新流控交通流-包含-航班号
        flowControlFlight.flowControlFlightId = "";
        // 更新流控交通流-包含-尾流类型
        flowControlFlight.wakeFlowLevel = "";
        // 更新流控交通流-包含-运营人
        flowControlFlight.auType = "";
        // 更新流控交通流-包含-航班类型
        flowControlFlight.airlineType = "";
        // 更新流控交通流-包含-客货类型
        flowControlFlight.missionType = "";
        // 更新流控交通流-包含-任务类型
        flowControlFlight.task = "";
        // 更新流控交通流-包含-军民航
        flowControlFlight.organization = "";
        // 更新流控交通流-包含-限制资质
        flowControlFlight.ability = "";
        // 更新流控交通流-包含-受控机型
        flowControlFlight.aircraftType = "";

        // 更新流控交通流-不包含-航班号
        flowControlFlight.exemptFlightId = "";
        // 更新流控交通流-不包含-尾流类型
        flowControlFlight.exemptionWakeFlowLevel = "";
        // 更新流控交通流-不包含-航班类型
        flowControlFlight.exemptionAirlineType = "";
        // 更新流控交通流-不包含-运营人
        flowControlFlight.exemptionAuType = "";
        // 更新流控交通流-不包含-客货类型
        flowControlFlight.exemptionMissionType = "";
        // 更新流控交通流-不包含-任务类型
        flowControlFlight.exemptionTask = "";
        // 更新流控交通流-不包含-军民航
        flowControlFlight.exemptionOrganization = "";
        // 更新流控交通流-不包含-限制资质
        flowControlFlight.exemptionAbility = "";
        // 更新流控交通流-不包含-受控机型
        flowControlFlight.exemptionAircraftType = "";
        setDirectionData(directionDataCopy);
    }


    // 将数值批量转换为大写
    const toUpperCaseValues = (values) => {
        for (var v in values) {
            if (upperFields.includes(v)) {
                values[v] = upperCaseValue(values[v]);
            }
        }
        return values;
    };

    // 转换为大写
    const upperCaseValue = (values) => {
        if (typeof values === 'string') {
            return values.toUpperCase();
        } else if (Array.isArray(values)) {
            return values.join(',').toUpperCase().split(',')
        }
    }

    /**
     * handleSubmitData() 返回接口原数据与表单数据融合后的数据对象
     * @param {Object} 表单数据对象
     * @return {Object}  融合后的数据对象
     * */
    const handleSubmitData = (values) => {

        values = toUpperCaseValues(values);

        // 复制方向数据对象
        let opt = JSON.parse(JSON.stringify(directionData));


        // 方向基本信息数据对象
        let direction = opt.direction;
        if (!isValidObject(direction)) {
            opt.direction = {};
            direction = opt.direction;
        }

        // 方向流控航班类型条件数据对象
        let flowControlFlight = opt.flowControlFlight;
        if (!isValidObject(flowControlFlight)) {
            opt.flowControlFlight = {};
            flowControlFlight = opt.flowControlFlight;
        }


        // 表单字段数据
        const { directionName, targetUnit, formerUnit, behindUnit, exemptFormerUnit, exemptBehindUnit, highLimit, exemptHeight,
            depAp, arrAp, exemptDepAp, exemptArrAp,
            flowControlFlightId, wakeFlowLevel, auType, airlineType, missionType,
            task, organization, ability, aircraftType,
            exemptFlightId, exemptionWakeFlowLevel, exemptionAirlineType, exemptionAuType, exemptionMissionType,
            exemptionTask, exemptionOrganization, exemptionAbility, exemptionAircraftType,
        } = values;

        // 更新方向名称
        opt.directionName = directionName;

        // 更新基准单元
        direction.targetUnit = targetUnit;
        // 更新前序单元
        direction.formerUnit = formerUnit;
        // 更新后序单元
        direction.behindUnit = behindUnit;
        // 更新豁免前序
        direction.exemptFormerUnit = exemptFormerUnit;
        // 更新豁免后序
        direction.exemptBehindUnit = exemptBehindUnit;
        // 更新限制高度
        direction.highLimit = highLimit;
        // 更新豁免高度
        direction.exemptHeight = exemptHeight;

        // 起飞机场
        direction.depAp = parseAreaLabelAirport(depAp).join(';');
        // 降落机场
        direction.arrAp = parseAreaLabelAirport(arrAp).join(';');
        // 豁免起飞机场
        direction.exemptDepAp = parseAreaLabelAirport(exemptDepAp).join(';');
        // 豁免降落机场
        direction.exemptArrAp = parseAreaLabelAirport(exemptArrAp).join(';');


        // 更新流控交通流-包含-航班号
        flowControlFlight.flowControlFlightId = flowControlFlightId.join(';');
        // 更新流控交通流-包含-尾流类型
        flowControlFlight.wakeFlowLevel = wakeFlowLevel.join(';');
        // 更新流控交通流-包含-运营人
        flowControlFlight.auType = auType.join(';');
        // 更新流控交通流-包含-航班类型
        flowControlFlight.airlineType = airlineType.join(';');
        // 更新流控交通流-包含-客货类型
        flowControlFlight.missionType = missionType.join(';');
        // 更新流控交通流-包含-任务类型
        flowControlFlight.task = task.join(';');
        // 更新流控交通流-包含-军民航
        flowControlFlight.organization = organization.join(';');
        // 更新流控交通流-包含-限制资质
        flowControlFlight.ability = ability.join(';');
        // 更新流控交通流-包含-受控机型
        flowControlFlight.aircraftType = aircraftType.join(';');

        // 更新流控交通流-不包含-航班号
        flowControlFlight.exemptFlightId = exemptFlightId.join(';');
        // 更新流控交通流-不包含-尾流类型
        flowControlFlight.exemptionWakeFlowLevel = exemptionWakeFlowLevel.join(';');
        // 更新流控交通流-不包含-航班类型
        flowControlFlight.exemptionAirlineType = exemptionAirlineType.join(';');
        // 更新流控交通流-不包含-运营人
        flowControlFlight.exemptionAuType = exemptionAuType.join(';');
        // 更新流控交通流-不包含-客货类型
        flowControlFlight.exemptionMissionType = exemptionMissionType.join(';');
        // 更新流控交通流-不包含-任务类型
        flowControlFlight.exemptionTask = exemptionTask.join(';');
        // 更新流控交通流-不包含-军民航
        flowControlFlight.exemptionOrganization = exemptionOrganization.join(';');
        // 更新流控交通流-不包含-限制资质
        flowControlFlight.exemptionAbility = exemptionAbility.join(';');
        // 更新流控交通流-不包含-受控机型
        flowControlFlight.exemptionAircraftType = exemptionAircraftType.join(';');
        return opt;
    };

    /**
     * 数据提交
     * */
    const submitFormData = (data) => {
        // 启用loading
        setLoading(true);
        // 转换格式
        let dataString = JSON.stringify(data);
        // 调用客户端方法并传入数据
        handleUpdateDirectionData(dataString);
        // 关闭页面
        window.close();
    };


    /**
     * 更新指定机场字段数值
     *
     * */
    const updateFormAirportFieldValue = (field, value) => {
        let data = {};
        data[field] = value;
        // 更新表单中流控发布类型
        form.setFieldsValue(data);
        // setRenderNumber(renderNumber++);
    };



    useEffect(function () {
        const user = localStorage.getItem("user");
        if (isValidVariable(user)) {
            props.systemPage.setUserData(JSON.parse(user));
        }
        // else{
        //     props.history.push('/')
        // }
    }, []);
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
    // 过滤区域标签机场集合中指定code对应的label
    const filterAreaLabel = (code) => {
        for (let i = 0; i < areaLabelAirport.length; i++) {
            let item = areaLabelAirport[i];
            if (item.code.trim() === code.trim()) {
                // 找到第一个匹配的则直接return
                return item.label;
            }
        }
        return ''
    }

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

    // 区域标签快捷点选按钮点击
    function areaBlockChange(value) {
        // 拆分参数
        const arr = value.split('-');
        // 字段名
        const field = arr[0];
        // 区域code
        const code = arr[1];
        // 获取区域集合中对应code的label值
        let label = filterAreaLabel(code);
        // 获取当前字段值
        let fieldValue = form.getFieldValue(field);
        // 若当前字段值中包含此标签label,则不作操作
        if (fieldValue.indexOf(label) > -1) {
            return;
        }
        // 反之将当前label追加到当前字段值中去
        let valueArr = [...fieldValue, label];
        // 更新当前字段值
        updateFormAirportFieldValue(field, valueArr);
    }

    function areaBlock(field) {
        return (
            <Space>
                <Button size="small" onClick={() => { areaBlockChange(`${field}-ZLLL`) }}>兰州</Button>
                <Button size="small" onClick={() => { areaBlockChange(`${field}-ZLXY`) }}>西安</Button>
                <Button size="small" onClick={() => { areaBlockChange(`${field}-ZSQD`) }}>山东</Button>
                <Button size="small" onClick={() => { }}>更多</Button>
            </Space>
        )
    }


    return (
        <Spin spinning={loading} >
        <div className="direction-edit-wrapper">
            <Form
                form={form}
                initialValues={initialValues}
                onFinish={(values) => {
                    console.log(values);
                }}
                className={props.bordered ? `advanced_form bordered-form` : "advanced_form"}
            >
                <Fragment>
                    <Card bordered={false}>
                        <Row gutter={24} >
                            <Col span={16}>
                                <Form.Item
                                    label="选择模板"
                                >
                                    <Select
                                        disabled={props.disabledForm}
                                        // mode="tags"
                                        style={{ width: '100%' }}
                                        placeholder="选择模板"
                                        allowClear={true}
                                    >
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                    <Divider style={{ margin: '0 0 6px' }} />
                    <Card bordered={false} className="flow-control-flight">
                        <Row gutter={24} >
                            <Col span={16}>
                                <Form.Item
                                    name="directionName"
                                    label="方向名称"
                                    required={true}
                                    rules={[{ required: true }]}
                                >
                                    <Input allowClear={true} className="text-uppercase" disabled={props.disabledForm} />
                                </Form.Item>
                            </Col>
                            <Col span={3}>
                                <Form.Item >
                                    <Button type="primary" onClick={autofillName} >自动命名</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={8}>
                                <Form.Item
                                    name="formerUnit"
                                    label="前序单元"
                                >
                                    <Input allowClear={true} className="text-uppercase" disabled={props.disabledForm} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="targetUnit"
                                    label="基准单元"
                                    required={true}
                                    rules={[{ required: true }]}
                                >
                                    <Input allowClear={true} className="text-uppercase" disabled={props.disabledForm} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="behindUnit"
                                    label="后序单元"
                                >
                                    <Input allowClear={true} className="text-uppercase" disabled={props.disabledForm} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={8}>
                                <Form.Item
                                    name="exemptFormerUnit"
                                    label="豁免前序"
                                >
                                    <Input allowClear={true} className="text-uppercase" disabled={props.disabledForm} />
                                </Form.Item>
                            </Col>
                            <Col span={8} className="">

                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="exemptBehindUnit"
                                    label="豁免后序"
                                >
                                    <Input allowClear={true} className="text-uppercase" disabled={props.disabledForm} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={8}>

                                <Form.Item
                                    name="depAp"
                                    label="起飞机场"
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

                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="highLimit"
                                    label="高度"
                                >
                                    <Input allowClear={true} className="text-uppercase" disabled={props.disabledForm} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="arrAp"
                                    label="降落机场"
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
                            </Col>
                        </Row>
                        {
                            props.disabledForm ? "" :
                                <Row gutter={24}>
                                    <Col span={8}>
                                        <Form.Item
                                            className="hidden-label"
                                            name="depAp-area"
                                            label={` `}
                                        >
                                            {areaBlock('depAp')}
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} className=""></Col>
                                    <Col span={8}>
                                        <Form.Item
                                            className="hidden-label"
                                            name="arrAp-area"
                                            label={` `}
                                        >
                                            {areaBlock('arrAp')}
                                        </Form.Item>
                                    </Col>
                                </Row>
                        }

                        <Row gutter={24}>
                            <Col span={8}>
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
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="exemptHeight"
                                    label="豁免高度"
                                >
                                    <Input allowClear={true} className="text-uppercase" disabled={props.disabledForm} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="exemptArrAp"
                                    label="豁免降落机场"
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
                            </Col>
                        </Row>
                        {
                            props.disabledForm ? "" :
                                <Row gutter={24}>
                                    <Col span={8}>
                                        <Form.Item
                                            className="hidden-label"
                                            name="exemptDepAp-area"
                                            label={` `}
                                        >
                                            {areaBlock('exemptDepAp')}
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} className=""></Col>
                                    <Col span={8}>
                                        <Form.Item
                                            className="hidden-label"
                                            name="exemptArrAp-area"
                                            label={` `}
                                        >
                                            {areaBlock('exemptArrAp')}
                                        </Form.Item>
                                    </Col>
                                </Row>
                        }
                        <Row gutter={12}>
                            <Col span={12}>
                                <LimitedCard title="包含" disabledForm={props.disabledForm} />
                            </Col>
                            <Col span={12}>
                                <ExemptCard title="不包含" disabledForm={props.disabledForm} />
                            </Col>
                        </Row>
                    </Card>
                </Fragment>

                <footer className="footer-bar">
                    <Space size="middle">
                    <Button size="small" onClick={saveAsTemplate}>另存为模板</Button>
                        <Button type="primary" size="small" onClick={handleSubmitButtonClick}>应用</Button>
                        <Button size="small" onClick={restFormData}>清空</Button>
                    </Space>
                </footer>
            </Form>
        </div>
        </Spin>
    )
}

export default withRouter(inject("systemPage")(observer(DirectionDataForm)));