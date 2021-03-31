import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import "moment/locale/zh-cn"
import { Button, Modal, Form, Space } from 'antd'
import { InfoCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

import StaticInfoCard from './StaticInfoCard'
import { handleImportControl, closeCreateDlg, closeControlDetail, handleImportControlForUpdate, handleUpdateFlowControl } from 'utils/client'
import { getFullTime, formatTimeString, addStringTime, parseFullTime, isValidObject, isValidVariable } from 'utils/basic-verify'
import { request } from 'utils/request'
import { ReqUrls } from 'utils/request-urls'
import { REGEXP } from 'utils/regExpUtil'

import './RestrictionForm.scss'
import { inject, observer } from "mobx-react";

//表单整体
function RestrictionForm(props) {
    // 区域标签机场集合
    const areaLabelAirport = [
        {
            label: '兰州',
            airport: 'ZBAL;ZBAR;ZBEN;ZBUH;ZLDH;ZLDL;ZLGL;ZLGM;ZLGY;ZLHB;ZLHX;ZLIC;ZLJC;ZLJQ;ZLLL;ZLLN;ZLTS;ZLXH;ZLXN;ZLYS;ZLZW;ZLZY',
            code:'ZLLL'
        },
        {
            label: '西安',
            airport: 'ZLAK;ZLHZ;ZLQY;ZLXY;ZLYA;ZLYL',
            code:'ZLXY'
        },
        {
            label: '山东',
            airport: 'ZSHZ;ZSJG;ZSJN;ZSDY;ZSWF;ZSRZ;ZSLY;ZSYT;ZSWH;ZSQD',
            code: 'ZSQD'
        },
    ]
    const flowData = props.flowData || {};
    const showIgnoreBtn = props.showIgnoreBtn || false;
    const showEditBtn = props.showEditBtn || false;
    const systemPage = props.systemPage || {};
    const primaryButtonName = props.primaryButtonName || "";
    const setModalVisible = props.setModalVisible || {};
    const operationType = props.operationType || "";
    const operationDescription = props.operationDescription || "";
    // 用户信息
    const user = systemPage.user || {};
    // 用户名
    let username = user.username || "";
    // 用户名中文
    let userDescriptionCN = user.descriptionCN || "";
    // 用户所属单位
    let userUnit = user.unit || "";
    // 用户所属单位
    let userUnitCn = user.unitCn || "";

    // 方案数据对象
    const tacticProcessInfo = flowData.tacticProcessInfo || {};
    const formerTacticProcessInfo = flowData.formerTacticProcessInfo || {};
    const basicTacticInfo = tacticProcessInfo.basicTacticInfo || {};

    let { tacticName = "", id = "", tacticPublishUnit = "", tacticPublishUnitCH="", tacticPublishUser = "", tacticPublishUserCH = "" } = basicTacticInfo;

    let basicFlowcontrol = basicTacticInfo.basicFlowcontrol || {};
    let tacticTimeInfo = basicTacticInfo.tacticTimeInfo || {};
    let directionList = basicTacticInfo.directionList || [];

    const formerBasicTacticInfo = formerTacticProcessInfo.basicTacticInfo || {};
    const formerId = formerBasicTacticInfo.id || "";
    // 方案开始时间(12位字符串)
    let basicStartTime = tacticTimeInfo.startTime;
    // 方案结束时间(12位字符串)
    let basicEndTime = tacticTimeInfo.endTime;
    // 当前终端时间
    let now = getFullTime(new Date());
    now = addStringTime(now, 1000 * 60 * 5);

    let startTimeString = now.substring(8, 12);
    let startDate = now.substring(0, 8);
    let endTimeString = "";
    let endDate = "";
    if (isValidVariable(basicStartTime)) {
        startTimeString = basicStartTime.substring(8, 12);
        startDate = basicStartTime.substring(0, 8);
    }
    if (isValidVariable(basicEndTime)) {
        endTimeString = basicEndTime.substring(8, 12);
        endDate = basicEndTime.substring(0, 8);
    }

    // 流控信息对象
    let flowControlTimeInfo = basicFlowcontrol.flowControlTimeInfo || {};
    let flowControlMeasure = basicFlowcontrol.flowControlMeasure || {};
    let flowControlName = basicFlowcontrol.flowControlName || "";
    let flowControlPublishType = basicFlowcontrol.flowControlPublishType || "";
    let flowControlReason = basicFlowcontrol.flowControlReason || "";


    // 流控开始时间(12位字符串)
    let flowControlStartTime = flowControlTimeInfo.startTime;
    // 流控开始时间(12位字符串)
    let flowControlEndTime = flowControlTimeInfo.endTime;
    // 流控限制方式
    const { restrictionMode, restrictionMITValueUnit = "T", restrictionMITTimeValue = "" } = flowControlMeasure;


    // 流控方向领域对象
    const directionListData = directionList[0] || {};
    const { targetUnit, formerUnit, behindUnit, exemptFormerUnit, exemptBehindUnit, highLimit, exemptHeight, depAp, arrAp, exemptDepAp, exemptArrAp } = directionListData;
    // 流控航班类型条件
    const flightPropertyDomain = isValidObject(basicFlowcontrol.flightPropertyDomain) ? basicFlowcontrol.flightPropertyDomain : {};

    const { flowControlFlightId = "", wakeFlowLevel = "", airlineType = "", missionType = "", auType = "",
        task = "", organization = "", ability = "", aircraftType = "",
        exemptFlightId = "", exemptionWakeFlowLevel = "", exemptionAirlineType = "", exemptionMissionType = "", exemptionAuType,
        exemptionTask = "", exemptionOrganization = "", exemptionAbility = "", exemptionAircraftType = "",
    } = flightPropertyDomain;

    // 确认提交模态框显隐变量
    let [isModalVisible, setIsModalVisible] = useState(false);
    // 确认提交模态框确定按钮loading变量
    let [confirmLoading, setConfirmLoading] = useState(false);
    // 主要操作按钮禁用变量
    let [importButtonDisable, setImportButtonDisable] = useState(false);

    // 方案开始日期(8位字符串, 用于实时记录表单方案开始时间数值, 在提交数据时使用)
    let [startDateString, setStartDateString] = useState(startDate);
    // 方案结束日期(8位字符串, 用于实时记录表单方案开始时间数值, 在提交数据时使用)
    let [endDateString, setEndDateString] = useState(endDate);

    // 方案开始日期(8位字符串, 用于实时记录表单方案开始时间数值, 在提交数据时使用)
    let [startTime, setStartTime] = useState(startDate);
    // 方案结束日期(8位字符串, 用于实时记录表单方案开始时间数值, 在提交数据时使用)
    let [endTime, setEndTime] = useState(endDate);

    // 忽略模态框显隐变量
    let [isIgnoreModalVisible, setIsIgnoreModalVisible] = useState(false);

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

    // 解析指定数值中的区域标签，转换为对应的机场
    function parseAreaLabelAirport(arr){
        let result = [];
        if(Array.isArray(arr)){
            if(arr.length == 0){
                return result;
            }
            for(let i=0; i<arr.length; i++){
                let label = arr[i];
                let airports = findAreadLabelAirport(label);
                if (isValidVariable(airports)) {
                   result = result.concat(airports);
                }else {
                   result = result.concat(label)
                }
            }
        }
        return result;
    }
    // 查找指定区域标签对应的机场集合
    function findAreadLabelAirport(label){
        for(let i=0; i<areaLabelAirport.length; i++){
            let data = areaLabelAirport[i];
            let dataLabel = data.label.trim();
            if(label === dataLabel){
                let arr = data.airport.split(';');
                return arr;
            }
        }
    }

    // 依据流控限制方式取流控限制数值方法
    const getRestrictionModeValue = () => {
        const { restrictionMode, restrictionMITValue, restrictionAFPValueSequence } = flowControlMeasure;
        if (restrictionMode == "MIT") {
            return restrictionMITValue;
        } else if (restrictionMode == "AFP") {
            return restrictionAFPValueSequence;
        }
    };

    // 依据流控限制方式取流控限制数值方法
    const restrictionModeData = {
        "MIT": "restrictionMITValue",
        "AFP": "restrictionAFPValueSequence",
    };

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


    if (operationType === "CREATE" || operationType === "IMPORT" || operationType === "IMPORTWITHFORMER") {
        tacticPublishUnit = isValidVariable(tacticPublishUnit) ? tacticPublishUnit : userUnit;
        tacticPublishUnitCH = isValidVariable(tacticPublishUnitCH) ? tacticPublishUnitCH : userUnitCn;
        
        tacticPublishUser = isValidVariable(tacticPublishUser) ? tacticPublishUser : username;
        tacticPublishUserCH = isValidVariable(tacticPublishUserCH) ? tacticPublishUserCH : userDescriptionCN;
    }

    // 流控限制数值
    let restrictionModeValue = getRestrictionModeValue();

    let abc = 'ZBAL;ZLXY;AAAA;ZBAR;ZBEN;ZBUH;ZLDH;ZLDL;ZLGL;ZLGM;ZLGY;ZLHB;ZLHX;ZLIC;ZLJC;ZLJQ;ZLLL;ZLLN;ZLTS;ZLXH;ZLXN;ZLYS;ZLZW;ZLZY'.split(';');
    let depApArray = isValidVariable(depAp) ? depAp.split(';') : [];
    let arrApArray = isValidVariable(arrAp) ? arrAp.split(';') : [];
    let exemptDepApArray = isValidVariable(exemptDepAp) ? exemptDepAp.split(';') : [];
    let exemptArrApArray = isValidVariable(exemptArrAp) ? exemptArrAp.split(';') : [];
    // 日期组件格式化方式
    const dateFormat = 'YYYY-MM-DD HHmm';
    // 表单初始数值对象集合
    let initialValues = {
        // 方案名称
        tacticName: tacticName || '',
        // 方案信息中原始流控名称(仅显示不可编辑)
        basicFlowControlName: flowControlName || "",
        // 流控信息中的流控名称
        flowControlName: flowControlName || "",
        
        // 方案发布单位中文(只显示不可编辑)
        tacticPublishUnitCH: tacticPublishUnitCH || "",
        // 方案发布用户中文(只显示不可编辑)
        tacticPublishUserCH: tacticPublishUserCH,
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

        // 方案开始日期(DatePicker组件使用)
        startDate: isValidVariable(basicStartTime) ? moment(basicStartTime, dateFormat) : moment(now, dateFormat),
        // 方案开始时间
        startTime: startTimeString,
        // 方案结束日期(DatePicker组件使用)
        endDate: isValidVariable(basicEndTime) ? moment(basicEndTime, dateFormat) : "",
        // 方案结束时间
        endTime: endTimeString,

        // 方案开始时间(非编辑状态下显示)
        basicStartTimeDisplay: isValidVariable(basicStartTime) ? formatTimeString(basicStartTime) : "",
        // 方案结束时间(非编辑状态下显示)
        basicEndTimeDisplay: isValidVariable(basicEndTime) ? formatTimeString(basicEndTime) : "",

        // 流控发布类型
        flowControlPublishType: flowControlPublishType || "",
        // 流控限制原因
        flowControlReason: flowControlReason || "WEATHER",
        // TODO 限制方式及限制数值待处理
        // 流控限制方式
        restrictionMode: restrictionMode || "MIT",
        // 流控限制数值
        restrictionModeValue: restrictionModeValue,
        //  MIT限制方式下的限制单位
        restrictionMITValueUnit: restrictionMITValueUnit,
        //  MIT限制方式下的时间方式数值
        restrictionMITTimeValue: restrictionMITTimeValue || restrictionModeValue ,
        // MIT限制方式下的速度值
        distanceToTime: "12",


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
        form.resetFields();//重置，用以表单初始值赋值
        // 更新表单各时间数值
        updateDataTime();
    }, [id, user.id]);


    const updateDataTime = () => {
        // 更新方案开始日期
        setStartDateString(startDate);
        // 更新方案结束日期
        setEndDateString(endDate);
        // 
        setStartTime(startTimeString);
        // 
        setEndTime(endTimeString);

    };

    // 主要操作按钮事件
    const handlePrimaryBtnClick = async () => {
        try {
            // 触发表单验证取表单数据
            const fieldData = await form.validateFields();
            checkStartDateTimeRange(fieldData);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    // 模态框取消回调
    const handleCancel = () => {
        // 隐藏模态框显示
        setIsModalVisible(false);
        setConfirmLoading(false);
    };

    // 处理表单提交数据
    const handleSubmitFormData = async () => {
        try {
            // 触发表单验证取表单数据
            const values = await form.validateFields();
            setImportButtonDisable(true);
            if (props.hasOwnProperty("setDisabledForm")) {
                props.setDisabledForm(true);
            }
            setConfirmLoading(true);
            // 处理提交数据
            const submitData = handleSubmitData(values);
            // 数据提交
            submitFormData(submitData)
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };


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


        // 复制方案数据对象
        let opt = JSON.parse(JSON.stringify(tacticProcessInfo));
        // 方案基本信息数据对象
        let basicTacticInfo = opt.basicTacticInfo;
        if (!isValidObject(basicTacticInfo)) {
            opt.basicTacticInfo = {};
            basicTacticInfo = opt.basicTacticInfo
        }
        // 方案时间信息对象
        let tacticTimeInfo = basicTacticInfo.tacticTimeInfo;
        if (!isValidObject(tacticTimeInfo)) {
            basicTacticInfo.tacticTimeInfo = {};
            tacticTimeInfo = basicTacticInfo.tacticTimeInfo
        }

        // 方案方向信息集合
        let directionList = basicTacticInfo.directionList;
        if (!isValidVariable(directionList)) {
            basicTacticInfo.directionList = [];
            directionList = basicTacticInfo.directionList
        }
        // 方案方向信息第一个数据项
        let directionListData = directionList[0];
        if (!isValidVariable(directionListData)) {
            directionList[0] = {};
            directionListData = directionList[0]
        }

        // 方案流控领域对象
        let basicFlowcontrol = basicTacticInfo.basicFlowcontrol;
        if (!isValidObject(basicFlowcontrol)) {
            basicTacticInfo.basicFlowcontrol = {};
            basicFlowcontrol = basicTacticInfo.basicFlowcontrol
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

        // 表单字段数据
        const { tacticName, targetUnit, formerUnit, behindUnit, exemptFormerUnit, exemptBehindUnit, highLimit, exemptHeight,
            depAp, arrAp, exemptDepAp, exemptArrAp,
            flowControlName, flowControlReason, flowControlPublishType, restrictionRemark,
            restrictionMode, restrictionModeValue, restrictionMITValueUnit, distanceToTime, restrictionMITTimeValue,
            flowControlFlightId, wakeFlowLevel, auType, airlineType, missionType,
            task, organization, ability, aircraftType,
            exemptFlightId, exemptionWakeFlowLevel, exemptionAirlineType, exemptionAuType, exemptionMissionType,
            exemptionTask, exemptionOrganization, exemptionAbility, exemptionAircraftType,
        } = values;
        // 结束日期时间
        let endDateTime = endDateString + endTime
        // 校验结束日期格式
        const endDateFormatValid = REGEXP.DATE8.test(endDateString);
        // 校验结束时间格式
        const endTimeFormatValid = REGEXP.TIMEHHmm.test(endTime);
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


        // 更新方案开始时间
        tacticTimeInfo.startTime = startDateString + startTime;
        
        // 更新方案结束时间
        tacticTimeInfo.endTime = (endDateFormatValid && endTimeFormatValid) ? endDateTime :"";
        // 更新基准单元
        directionListData.targetUnit = targetUnit;
        // 更新前序单元
        directionListData.formerUnit = formerUnit;
        // 更新后序单元
        directionListData.behindUnit = behindUnit;
        // 更新豁免前序
        directionListData.exemptFormerUnit = exemptFormerUnit;
        // 更新豁免后序
        directionListData.exemptBehindUnit = exemptBehindUnit;
        // 更新限制高度
        directionListData.highLimit = highLimit;
        // 更新豁免高度
        directionListData.exemptHeight = exemptHeight;
        // 起飞机场
        directionListData.depAp = parseAreaLabelAirport(depAp).join(';');
        // 降落机场
        directionListData.arrAp = parseAreaLabelAirport(arrAp).join(';');
        // 豁免起飞机场
        directionListData.exemptDepAp = parseAreaLabelAirport(exemptDepAp).join(';');
        // 豁免降落机场
        directionListData.exemptArrAp = parseAreaLabelAirport(exemptArrAp).join(';');

        // 更新流控名称
        basicFlowcontrol.flowControlName = flowControlName;
        // 更新流控限制原因
        basicFlowcontrol.flowControlReason = flowControlReason;
        // 更新流控发布类型
        basicFlowcontrol.flowControlPublishType = flowControlPublishType;
        // 更新流控备注
        flowControlMeasure.restrictionRemark = restrictionRemark;

        // 更新流控限制方式
        flowControlMeasure.restrictionMode = restrictionMode;
        let modeKey = restrictionModeData[restrictionMode];
        // 更新流控限制方式相应的字段数值
        flowControlMeasure[modeKey] = restrictionModeValue;
        // 若限制类型为MIT
        if (restrictionMode === "MIT") {
            // 更新MIT流控时间间隔字段数值
            flowControlMeasure.restrictionMITTimeValue = restrictionMITTimeValue;
            // 更新速度字段数值
            flowControlMeasure.distanceToTime = distanceToTime;
            // 更新MIT限制单位
            flowControlMeasure.restrictionMITValueUnit = restrictionMITValueUnit;
        }else {
            // 更新MIT流控时间间隔字段数值
            // flowControlMeasure.restrictionMITTimeValue = null;
            // 更新速度字段数值
            // flowControlMeasure.distanceToTime = distanceToTime;
            // 更新MIT限制单位
            // flowControlMeasure.restrictionMITValueUnit = null;
        }

        // 更新流控交通流-包含-航班号
        flightPropertyDomain.flowControlFlightId = flowControlFlightId.join(';');
        // 更新流控交通流-包含-尾流类型
        flightPropertyDomain.wakeFlowLevel = wakeFlowLevel.join(';');
        // 更新流控交通流-包含-运营人
        flightPropertyDomain.auType = auType.join(';');
        // 更新流控交通流-包含-航班类型
        flightPropertyDomain.airlineType = airlineType.join(';');
        // 更新流控交通流-包含-客货类型
        flightPropertyDomain.missionType = missionType.join(';');
        // 更新流控交通流-包含-任务类型
        flightPropertyDomain.task = task.join(';');
        // 更新流控交通流-包含-军民航
        flightPropertyDomain.organization = organization.join(';');
        // 更新流控交通流-包含-限制资质
        flightPropertyDomain.ability = ability.join(';');
        // 更新流控交通流-包含-受控机型
        flightPropertyDomain.aircraftType = aircraftType.join(';');

        // 更新流控交通流-不包含-航班号
        flightPropertyDomain.exemptFlightId = exemptFlightId.join(';');
        // 更新流控交通流-不包含-尾流类型
        flightPropertyDomain.exemptionWakeFlowLevel = exemptionWakeFlowLevel.join(';');
        // 更新流控交通流-不包含-航班类型
        flightPropertyDomain.exemptionAirlineType = exemptionAirlineType.join(';');
        // 更新流控交通流-不包含-运营人
        flightPropertyDomain.exemptionAuType = exemptionAuType.join(';');
        // 更新流控交通流-不包含-客货类型
        flightPropertyDomain.exemptionMissionType = exemptionMissionType.join(';');
        // 更新流控交通流-不包含-任务类型
        flightPropertyDomain.exemptionTask = exemptionTask.join(';');
        // 更新流控交通流-不包含-军民航
        flightPropertyDomain.exemptionOrganization = exemptionOrganization.join(';');
        // 更新流控交通流-不包含-限制资质
        flightPropertyDomain.exemptionAbility = exemptionAbility.join(';');
        // 更新流控交通流-不包含-受控机型
        flightPropertyDomain.exemptionAircraftType = exemptionAircraftType.join(';');

        return opt;
    };

    /**
     * 数据提交
     * */
    const submitFormData = (data) => {
        const id = basicTacticInfo.id;
        const opt = {
            url: ReqUrls.importSchemeUrl + user.id,
            method: 'POST',
            params: JSON.stringify(data),
            resFunc: (data) => requestSuccess(id, data),
            errFunc: (err) => requestErr(err),
        };

        // 若为手动创建或修改正式的方案操作，则使用createSchemeUrl
        if (operationType === "MODIFY" || operationType === "CREATE") {
            opt.url = ReqUrls.createSchemeUrl + user.id;
        }
        // 若为模拟状态的方案修改，则使用modifySimulationSchemeUrl
        if (operationType === "MODIFYSIM") {
            opt.url = ReqUrls.modifySimulationSchemeUrl + user.id;
            opt.method = "PUT";
        }
        request(opt);
    };

    /**
     * 数据提交成功回调
     * */
    const requestSuccess = (oldId, data) => {

        const { tacticProcessInfo = {} } = data;
        const { basicTacticInfo = {} } = tacticProcessInfo;
        const { id } = basicTacticInfo;
        setConfirmLoading(false);
        setIsModalVisible(false);

        //发送到客户端
        if (operationType === 'CREATE') { // 方案创建
            handleImportControl(id);
        } else if (operationType === 'IMPORT') { // 外区流控导入方案 
            handleImportControl(id, props.message.id);
        } else if (operationType === 'MODIFY') { // 正式方案进行模拟修改操作
            handleImportControlForUpdate(oldId, id);
        } else if (operationType === 'IMPORTWITHFORMER') { //  外区流控导入方案，且已有关联的方案
            handleImportControlForUpdate(formerId, id);
        } else if (operationType === 'MODIFYSIM') { // 模拟的方案进行修改操作
            handleUpdateFlowControl(id);
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

        setImportButtonDisable(false);
        setConfirmLoading(false);
        setIsModalVisible(false);
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
        });
    };

    /**
     * 更新方案开始日期
     *
     * */
    const updateStartDateString = (dateString) => {
        const startTime = form.getFieldsValue()['startTime'];
        const startDate = dateString.substring(0, 4) + '-' + dateString.substring(4, 6) + '-' + dateString.substring(6, 8);
        form.setFieldsValue({ basicStartTimeDisplay: `${startDate} ${startTime}` });
        // 更新方案开始日期
        setStartDateString(dateString.substring(0, 8));
    };


    /**
     * 更新方案开始时间
     *
     * */
    const updateStartTimeString = (timeString) => {
        const startDate = form.getFieldsValue()['startDate'];
        const startDateString = moment(startDate).format("YYYYMMDDHHmm").substring(0, 8);
        const date = startDateString.substring(0, 4) + '-' + startDateString.substring(4, 6) + '-' + startDateString.substring(6, 8);
        form.setFieldsValue({ basicStartTimeDisplay: `${date} ${timeString}` });
        setStartTime(timeString);
    };

    /**
     * 更新方案结束日期
     *
     * */
    const updateEndDateString = (dateString) => {
        const endTime = form.getFieldsValue()['endTime'];
        const endDate = dateString.substring(0, 4) + '-' + dateString.substring(4, 6) + '-' + dateString.substring(6, 8);
        form.setFieldsValue({ basicEndTimeDisplay: `${endDate} ${endTime}` });
        // 更新方案结束日期
        setEndDateString(dateString.substring(0, 8))

    };


    /**
     * 更新方案结束时间
     *
     * */
    const updateEndTimeString = (timeString) => {
        const endDate = form.getFieldsValue()['endDate'];
        const endDateString = moment(endDate).format("YYYYMMDDHHmm").substring(0, 8);
        const date = endDateString.substring(0, 4) + '-' + endDateString.substring(4, 6) + '-' + endDateString.substring(6, 8);
        form.setFieldsValue({ basicEndTimeDisplay: `${date} ${timeString}` });
        setEndTime(timeString)
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
    };

    /**
     * 自动命名
     *
     * */
    const autofillTacticName = async () => {
        try {
            // 必要校验字段
            const fields = [
                'targetUnit',
                'restrictionMode',
                'restrictionModeValue',
                'restrictionMITValueUnit',
                'arrAp',
            ];
            // 触发表单验证取表单数据
            const fieldData = await form.validateFields(fields);
            let autoName = spliceName(fieldData);
            // 更新
            form.setFieldsValue({ 'tacticName': autoName });
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };
    /**
     * 打开编辑
     * */
    const handleOpenEdit = () => {
        if (props.hasOwnProperty("setDisabledForm")) {
            props.setDisabledForm(false);
        }
    };
    // 拼接名称
    const spliceName = (fieldData)=> {
        // 限制数值单位集合
        const restrictionModeUnit = {
            "AFP": "架",
        };
        // 限制数值单位
        let unit = "";
        let { targetUnit, restrictionMode, restrictionModeValue, arrAp, restrictionMITValueUnit } = fieldData;
        let autoName = "";
        unit = restrictionModeUnit[restrictionMode];
        if (restrictionMode === "MIT") {
            if (restrictionMITValueUnit === 'T') {
                unit = '分钟'
            } else if (restrictionMITValueUnit === 'D') {
                unit = '公里'
            }
        }
        if (isValidVariable(arrAp) && isValidVariable(arrAp.join(';'))) {
            arrAp = arrAp.join(';').toUpperCase();
            // 拼接名称
            autoName = `${targetUnit.toUpperCase()}-${arrAp}-${restrictionModeValue}${unit}`;
        } else {
            // 拼接名称
            autoName = `${targetUnit.toUpperCase()}-${restrictionModeValue}${unit}`;
        }
        return autoName;
    }

    // 校验结束日期时间与当前时间大小
    const validateStartDateTimeRange = (getFieldValue) => {
         // 当前时间
         let currentTime = moment().format("YYYYMMDDHHmm").substring(0, 12);
         let startDateTimeString = startDateString + startTime;
         if (parseFullTime(currentTime).getTime() > parseFullTime(startDateTimeString).getTime() ) {
            return false;
        }else {
             return true;
         }
    }

    // 检查开始时间与当前时间大小
    const checkStartDateTimeRange = (fieldData) => {
        // 方案名称
        let valided = validateStartDateTimeRange();
        if (valided) {
            // 校验方案名称是否与限制条件相符
            checkTacticName(fieldData);
        } else {
            Modal.confirm({
                title: '提示',
                icon: <ExclamationCircleOutlined />,
                centered: true,
                closable: true,
                content: <div><p>开始时间早于当前时间，</p><p>建议修改后提交</p></div>,
                okText: '去修改',
                cancelText: '直接提交',
                onOk: ()=> { },
                onCancel: (close)=>{ 
                    // 若close为函数则为取消按钮点击触发，反之为关闭按钮触发
                    if(typeof close ==='function'){
                        // 校验方案名称是否与限制条件相符
                        checkTacticName(fieldData);
                        // 关闭模态框
                        close();
                    }
                 },
            });
        }
    };

    /**
     * 方案名称检查
     *
     * */
    const checkTacticName = (fieldData) => {
        // 方案名称
        const tacticName = form.getFieldsValue()['tacticName'];
        let autoName = spliceName(fieldData);
        if (autoName.trim() === tacticName.trim()) {
            // 开启确认模态框
            setIsModalVisible(true);
        } else {
            Modal.confirm({
                title: '提示',
                icon: <ExclamationCircleOutlined />,
                centered: true,
                closable: true,
                content: <div><p>限制条件与方案名称不相符，</p><p>建议自动命名后提交</p></div>,
                okText: '自动命名并提交',
                cancelText: '直接提交',
                onOk: ()=> { handleAutoFillTacticNameSubmitFormData(fieldData)},
                onCancel: (close)=>{ 
                    // 若close为函数则为取消按钮点击触发，反之为关闭按钮触发
                    if(typeof close ==='function'){
                        // 调用提交函数
                        handleSubmitFormData();
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
        form.setFieldsValue({ 'tacticName': autoName });
        // 提交
        handleSubmitFormData();
    }



    /**
     * 主按钮
     *
     * */
    const drawprimaryBtn = () => {
        //  若表单为不可编辑状态且为MODIFYSIM(模拟状态的方案修改)操作
        if (props.disabledForm && operationType === "MODIFYSIM") {
            return ""
        } else {
            return (
                <div className="button-container">
                    <Button
                        className={setPrimaryButtonClassName()}
                        type="primary"
                        onClick={handlePrimaryBtnClick}
                        disabled={importButtonDisable}
                    >
                        {primaryButtonName}
                    </Button>
                    <Modal
                        title={primaryButtonName}
                        visible={isModalVisible}
                        maskClosable={false}
                        centered
                        onOk={handleSubmitFormData}
                        onCancel={handleCancel}
                        confirmLoading={confirmLoading}
                    >
                        <p>{`确定${primaryButtonName}?`}</p>
                    </Modal>
                </div>
            )
        }
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
     * 忽略
     *
     * */
    const drawIgnoreBtn = () => {
        return (
            <div className="button-container">
                <Button
                    className="r_btn btn_ignore"
                    onClick={() => {
                        setIsIgnoreModalVisible(true)
                    }}
                    disabled={isIgnoreModalVisible}
                >
                    忽略
                </Button>
                <Modal
                    title={"忽略"}
                    visible={isIgnoreModalVisible}
                    maskClosable={false}
                    centered
                    onOk={e => {
                        // 隐藏模态框显示
                        setIsIgnoreModalVisible(false);
                        window.close();
                    }}
                    onCancel={e => {
                        // 隐藏模态框显示
                        setIsIgnoreModalVisible(false);
                    }}
                    confirmLoading={false}
                >
                    确定忽略当前流控?
                </Modal>
            </div>
        )
    };

    const setPrimaryButtonClassName = () => {
        if (operationType === "MODIFY") {
            return "btn_update"
        } else if (operationType === "CREATE") {
            return "btn_create"
        } else if (operationType === "IMPORT") {
            return "btn_import"
        } else if (operationType === "IMPORTWITHFORMER") {
            return "btn_import"
        }
    };

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
                </Space>
            </div>
        )
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


    return (
        <div>

            <Form
                form={form}
                initialValues={initialValues}
                onFinish={(values) => {
                    console.log(values);
                }}
                className={props.bordered ? `advanced_form bordered-form` : "advanced_form"}
            >
                {
                    drawOperation()
                }
                <StaticInfoCard
                    disabledForm={props.disabledForm}
                    updateStartDateString={updateStartDateString}
                    updateStartTimeString={updateStartTimeString}
                    updateEndDateString={updateEndDateString}
                    updateEndTimeString={updateEndTimeString}
                    updateFormAirportFieldValue={updateFormAirportFieldValue}
                    autofillTacticName={autofillTacticName}
                    form={form}
                    areaLabelAirport = {areaLabelAirport}

                />

            </Form>
        </div>
    )
}

export default withRouter(inject("newsList", "systemPage")(observer(RestrictionForm)));