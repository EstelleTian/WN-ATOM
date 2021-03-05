import React, {useEffect, useState} from 'react'
import { withRouter } from 'react-router-dom'
import  moment  from 'moment'
import "moment/locale/zh-cn"
import {Button, Modal, Form} from 'antd'
import StaticInfoCard from './StaticInfoCard'
import { handleImportControl, closeCreateDlg, closeControlDetail, handleImportControlForUpdate } from 'utils/client'
import { getFullTime, formatTimeString,addStringTime, isValidObject, isValidVariable } from '../../utils/basic-verify'
import { request } from 'utils/request'
import { ReqUrls } from 'utils/request-urls'
import './RestrictionForm.scss'
import {inject, observer} from "mobx-react";

//表单整体
function RestrictionForm(props){
    const  {
        flowData = {}, showIgnoreBtn=false, showEditBtn= false, systemPage,
        primaryButtonName, setModalVisible,  operationType, operationDescription
    } = props;
    const  { user={} } = systemPage;
    let userDescriptionCN = user.descriptionCN ||　"";

    // 方案数据对象
    const { tacticProcessInfo={} } = flowData;
    const { formerTacticProcessInfo={} } = flowData;
    const { basicTacticInfo={} } = tacticProcessInfo;
    let { tacticName, tacticPublishUnit, tacticPublishUser, id }
     = basicTacticInfo;

    let basicFlowcontrol = basicTacticInfo.basicTacticInfo || {};
    let tacticTimeInfo = basicTacticInfo.tacticTimeInfo || {};
    let directionList = basicTacticInfo.directionList || [];

    const formerBasicTacticInfo = formerTacticProcessInfo.basicTacticInfo || {};
    const formerId = formerBasicTacticInfo.id || "";
    // 方案开始时间(12位字符串)
    let basicStartTime = tacticTimeInfo.startTime;
    // 方案结束时间(12位字符串)
    let basicEndTime = tacticTimeInfo.endTime;
    // 当前终端时间
    let now = getFullTime( new Date());
    now = addStringTime(now,1000*60*5);

    let startTimeString = now.substring(8,12);
    let startDate = now.substring(0,8);
    let endTimeString = "" ;
    let endDate ="";
    if(isValidVariable(basicStartTime)){
        startTimeString = basicStartTime.substring(8,12);
        startDate = basicStartTime.substring(0,8);
    }
    if(isValidVariable(basicEndTime)){
        endTimeString = basicEndTime.substring(8,12);
        endDate = basicEndTime.substring(0,8);
    }

    const { flowControlName, flowControlTimeInfo={}, flowControlMeasure={},  flowControlPublishType, flowControlReason } 
    = basicFlowcontrol; // 流控信息对象
    // 流控开始时间(12位字符串)
    let flowControlStartTime = flowControlTimeInfo.startTime;
    // 流控开始时间(12位字符串)
    let flowControlEndTime = flowControlTimeInfo.endTime;
    // 流控限制方式
    const { restrictionMode, } = flowControlMeasure;


    // 流控方向领域对象
    const directionListData = directionList[0] || {};
    const { targetUnit, formerUnit, behindUnit, exemptFormerUnit, exemptbehindUnit, highLimit, exemptHeight, depAp, arrAp, exemptDepAp, exemptArrAp } = directionListData;
    // 流控航班类型条件
    const flowControlFlight = isValidObject(basicFlowcontrol.flowControlFlight) ? basicFlowcontrol.flowControlFlight : {};

    const { flowControlFlightId ="", wakeFlowLevel="", airlineType="", missionType="", auType ="",
        task="", organization="", ability="",aircraftType="",
        exemptFlightId="", exemptionWakeFlowLevel="", exemptionAirlineType="", exemptionMissionType="", exemptionAuType,
        exemptionTask="", exemptionOrganization="", exemptionAbility="", exemptionAircraftType="",
    } = flowControlFlight;

    // 依据流控限制方式取流控限制数值方法
    const  getRestrictionModeValue = () => {
        const { restrictionMode,  restrictionMITValue, restrictionAFPValueSequence} = flowControlMeasure;
        if(restrictionMode == "MIT"){
            return restrictionMITValue;
        }else if(restrictionMode == "AFP"){
            return restrictionAFPValueSequence;
        }
    };

    // 依据流控限制方式取流控限制数值方法
   const restrictionModeData = {
        "MIT": "restrictionMITValue",
        "AFP": "restrictionAFPValueSequence",
    };

    // 需要将数值转换为大写的字段
    const upperFields=[
        "tacticPublishUser",
        "targetUnit",
        "formerUnit",
        "behindUnit",
        "exemptFormerUnit",
        "exemptbehindUnit",
        "flowControlFlightId",
        "aircraftType",
        "exemptFlightId",
        "aircraftType",
        "exemptionAircraftType",
        "depAp",
        "arrAp",
        "exemptDepAp",
        "exemptArrAp",
    ];


    if( operationType === "CREATE"){
        tacticPublishUser =  tacticPublishUser || userDescriptionCN;
    }

    // 流控限制数值
    let restrictionModeValue =getRestrictionModeValue();

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
        // 方案发布单位
        tacticPublishUnit: tacticPublishUnit || "流量室",
        // 方案发布用户
        tacticPublishUser:  tacticPublishUser,
        // 基准单元
        targetUnit: targetUnit,
        // 前序单元
        formerUnit: formerUnit,
        // 后序单元
        behindUnit: behindUnit,
        // 豁免前序
        exemptFormerUnit: exemptFormerUnit,
        // 豁免后序
        exemptbehindUnit: exemptbehindUnit,
        // 限制高度
        highLimit: highLimit,
        // 豁免高度
        exemptHeight: exemptHeight,
        // 起飞机场
        depAp: depAp,
        // 降落机场
        arrAp: arrAp,
        // 豁免起飞机场
        exemptDepAp: exemptDepAp,
        // 豁免降落机场
        exemptArrAp: exemptArrAp,

        // 方案开始日期(DatePicker组件使用)
        startDate: isValidVariable(basicStartTime) ? moment(basicStartTime, dateFormat) :  moment(now, dateFormat) ,
        // 方案开始时间
        startTime: startTimeString,
        // 方案结束日期(DatePicker组件使用)
        endDate: isValidVariable(basicEndTime) ? moment(basicEndTime, dateFormat) : "",
        // 方案结束时间
        endTime: endTimeString,

        // 方案开始时间(非编辑状态下显示)
        basicStartTimeDisplay: isValidVariable(basicStartTime) ?  formatTimeString(basicStartTime) : "",
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

        // 包含-航班号
        flowControlFlightId: isValidVariable(flowControlFlightId) ? flowControlFlightId.split(';') : [],
        // 包含-尾流类型
        wakeFlowLevel: isValidVariable(wakeFlowLevel) ? wakeFlowLevel.split(';') : [] ,
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
        exemptionOrganization: isValidVariable(exemptionOrganization) ?  exemptionOrganization.split(';') : [],
        // 不包含-限制资质
        exemptionAbility:isValidVariable(exemptionAbility) ? exemptionAbility.split(';') : [],
        // 不包含-受控机型
        exemptionAircraftType:  isValidVariable(exemptionAircraftType) ? exemptionAircraftType.split(';') : [],

    };

    // 模态框显隐变量
    let [ isModalVisible, setIsModalVisible] = useState(false);
    // 主要操作按钮禁用变量
    let [ importButtonDisable, setImportButtonDisable] = useState(false);
    // 模态框确定按钮loading变量
    let [ confirmLoading, setConfirmLoading] = useState(false);

    // 方案开始日期(8位字符串, 用于实时记录表单方案开始时间数值, 在提交数据时使用)
    let [ startDateString, setStartDateString] = useState(startDate);
    // 方案结束日期(8位字符串, 用于实时记录表单方案开始时间数值, 在提交数据时使用)
    let [ endDateString, setEndDateString] = useState(endDate);

    // 方案开始日期(8位字符串, 用于实时记录表单方案开始时间数值, 在提交数据时使用)
    let [ startTime, setStartTime] = useState(startDate);
    // 方案结束日期(8位字符串, 用于实时记录表单方案开始时间数值, 在提交数据时使用)
    let [ endTime, setEndTime] = useState(endDate);

    // 忽略模态框显隐变量
    let [ isIgnoreModalVisible, setIsIgnoreModalVisible] = useState(false);

    const [form] = Form.useForm();
    useEffect(function(){
        form.resetFields();//重置，用以表单初始值赋值
        // 更新表单各时间数值
        updateDataTime();
    },[id, user.id]);


    const updateDataTime =() => {
        // 更新方案开始日期
        setStartDateString(startDate);
        // 更新方案结束日期
        setEndDateString(endDate);
        setStartTime(startTimeString);
        setEndTime(endTimeString);
    };

    // 主要操作按钮事件
    const  handlePrimaryBtnClick = async () => {
        try {
            // 触发表单验证取表单数据
            const values = await form.validateFields();
            // 开启确认模态框
            setIsModalVisible(true);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    // 模态框取消回调
    const  handleCancel = () => {
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
            if( props.hasOwnProperty("setDisabledForm")){
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
    const  toUpperCaseValues =(values) =>{
        for( var v in values){
            if(upperFields.includes(v)){
                values[v] = upperCaseValue(values[v]);
            }
        }
        return values;
    };

    // 转换为大写
    const  upperCaseValue = (values) => {
        if(typeof values == 'string'){
            return values.toUpperCase();
        }else if(Array.isArray(values)){
            return values.join(',').toUpperCase().split(',')
        }
    }

    /**
     * handleSubmitData() 返回接口原数据与表单数据融合后的数据对象
     * @param {Object} 表单数据对象
     * @return {Object}  融合后的数据对象
     * */
    const handleSubmitData =(values) =>{

        values = toUpperCaseValues(values);


        // 复制方案数据对象
        let opt = JSON.parse(JSON.stringify(tacticProcessInfo));
        // 方案基本信息数据对象
        let basicTacticInfo = opt.basicTacticInfo;
        if(!isValidObject(basicTacticInfo)){
            opt.basicTacticInfo= {};
            basicTacticInfo = opt.basicTacticInfo
        }
        // 方案时间信息对象
        let tacticTimeInfo = basicTacticInfo.tacticTimeInfo;
        if(!isValidObject(tacticTimeInfo)){
            basicTacticInfo.tacticTimeInfo= {};
            tacticTimeInfo = basicTacticInfo.tacticTimeInfo
        }

        // 方案方向信息集合
        let directionList = basicTacticInfo.directionList;
        if(!isValidVariable(directionList)){
            basicTacticInfo.directionList= [];
            directionList = basicTacticInfo.directionList
        }
        // 方案方向信息第一个数据项
        let directionListData = directionList[0];
        if(!isValidVariable(directionListData)){
            directionList[0] = {};
            directionListData = directionList[0]
        }

        // 方案流控领域对象
        let basicFlowcontrol = basicTacticInfo.basicFlowcontrol;
        if(!isValidObject(basicFlowcontrol)){
            basicTacticInfo.basicFlowcontrol= {};
            basicFlowcontrol = basicTacticInfo.basicFlowcontrol
        }

        // 方案流控航班类型条件数据对象
        let flowControlFlight = basicFlowcontrol.flowControlFlight;
        if(!isValidObject(flowControlFlight)){
            basicFlowcontrol.flowControlFlight= {};
            flowControlFlight = basicFlowcontrol.flowControlFlight
        }

        // 方案流控限制措施信息对象
        let flowControlMeasure = basicFlowcontrol.flowControlMeasure;
        if(!isValidObject(flowControlMeasure)){
            basicFlowcontrol.flowControlMeasure= {};
            flowControlMeasure = basicFlowcontrol.flowControlMeasure
        }
        // 方案流控时间信息对象
        let flowControlTimeInfo = basicFlowcontrol.flowControlTimeInfo;
        if(!isValidObject(flowControlTimeInfo)){
            basicFlowcontrol.flowControlTimeInfo= {};
            flowControlTimeInfo = basicFlowcontrol.flowControlTimeInfo
        }

        // 表单字段数据
        const { tacticName, tacticPublishUnit, tacticPublishUser,
            targetUnit, formerUnit, behindUnit, exemptFormerUnit, exemptbehindUnit, highLimit, exemptHeight,
            depAp, arrAp, exemptDepAp, exemptArrAp,
            flowControlName, flowControlReason, flowControlPublishType, restrictionRemark,
            restrictionMode, restrictionModeValue,
            flowControlFlightId, wakeFlowLevel, auType, airlineType, missionType,
            task, organization, ability,aircraftType,
            exemptFlightId, exemptionWakeFlowLevel, exemptionAirlineType,exemptionAuType,  exemptionMissionType,
            exemptionTask, exemptionOrganization, exemptionAbility, exemptionAircraftType,
        } = values;
        // 更新方案名称
        basicTacticInfo.tacticName = tacticName;
        // 更新方案发布单位
        basicTacticInfo.tacticPublishUnit = tacticPublishUnit;
        // 更新方案发布用户
        basicTacticInfo.tacticPublishUser = tacticPublishUser;
        // 更新方案开始时间
        tacticTimeInfo.startTime = startDateString+ startTime;
        // 更新方案结束时间
        tacticTimeInfo.endTime = endDateString + endTime;
        // 更新基准单元
        directionListData.targetUnit = targetUnit;
        // 更新前序单元
        directionListData.formerUnit = formerUnit;
        // 更新后序单元
        directionListData.behindUnit = behindUnit;
        // 更新豁免前序
        directionListData.exemptFormerUnit = exemptFormerUnit;
        // 更新豁免后序
        directionListData.exemptbehindUnit = exemptbehindUnit;
        // 更新限制高度
        directionListData.highLimit = highLimit;
        // 更新豁免高度
        directionListData.exemptHeight = exemptHeight;
        // 起飞机场
        directionListData.depAp = depAp;
        // 降落机场
        directionListData.arrAp = arrAp;
        // 豁免起飞机场
        directionListData.exemptDepAp = exemptDepAp;
        // 豁免降落机场
        directionListData.exemptArrAp = exemptArrAp;

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
        
        if(operationType === 'MODIFY'){
            // 若为方案修以下字段设置为null
            basicTacticInfo.id = null;
            basicTacticInfo.tacticTimeInfo.createTime = null;
        }

        return opt;
    };

    /**
     * 数据提交
     * */
    const submitFormData = (data) => {
        const id = basicTacticInfo.id;
        const opt = {
            url: ReqUrls.createFlowUrl + user.id,
            method:'POST',
            params:JSON.stringify(data),
            resFunc: (data)=> requestSuccess(id,data),
            errFunc: (err)=> requestErr(err ),
        };
        request(opt);
        //发送到客户端
        // handleImportControl(JSON.stringify(data));
    };

    /**
     * 数据提交成功回调
     * */
    const requestSuccess =(oldId, data) => {

        const { tacticProcessInfo={} } = data;
        const { basicTacticInfo={} } = tacticProcessInfo;
        const { id } = basicTacticInfo;
        setConfirmLoading(false);
        setIsModalVisible(false);
        if(isValidVariable(setModalVisible)){
            setModalVisible(false)
        }

        //发送到客户端
        if(operationType ==='CREATE'){
            handleImportControl(id);
        }else if(operationType === 'IMPORT'){
            handleImportControl(id, props.message.id);
        }else if(operationType === 'MODIFY'){
            handleImportControlForUpdate(oldId,id);
        }else if(operationType === 'IMPORTWITHFORMER'){
            handleImportControlForUpdate(formerId,id);
        }
        if(operationType !=='MODIFY'){
            Modal.success({
                content: `${operationDescription}成功`,
                // maskClosable:true,
                onOk: () =>{
                    if(isValidVariable(setModalVisible)){
                        setModalVisible(false)
                    }else {
                        window.close();
                    }
                }
            });
        }
    };

    /**
     * 数据提交失败回调
     * */
    const requestErr = (err) => {
        if( props.hasOwnProperty("setDisabledForm") ){
            props.setDisabledForm(false);
        }

        setImportButtonDisable(false);
        setConfirmLoading(false);
        setIsModalVisible(false);
        let errMsg = "";
        if(isValidObject(err) && isValidVariable(err.message)){
            errMsg = err.message;
        }else if(isValidVariable(err)){
            errMsg = err;
        }
        Modal.error({
            content: (
                <span>
                    <span>{ `${operationDescription}失败`}</span>
                    <br/>
                    <span>{errMsg}</span>

                </span>
            ),
        });
    };

    /**
     * 更新方案开始日期
     *
     * */
    const  updateStartDateString =(dateString) => {
        const startTime = form.getFieldsValue()['startTime'];
        const startDate = dateString.substring(0,4) +'-'+ dateString.substring(4,6) +'-' + dateString.substring(6,8);
        form.setFieldsValue({basicStartTimeDisplay: `${startDate} ${startTime}`});
        // 更新方案开始日期
        setStartDateString(dateString.substring(0,8));
    };


    /**
     * 更新方案开始时间
     *
     * */
    const  updateStartTimeString =(timeString) => {
        const startDate =  form.getFieldsValue()['startDate'];
        const startDateString = moment(startDate).format("YYYYMMDDHHmm").substring(0,8);
        const date = startDateString.substring(0,4) +'-'+ startDateString.substring(4,6) +'-' + startDateString.substring(6,8);
        form.setFieldsValue({basicStartTimeDisplay: `${date} ${timeString}`});
        setStartTime(timeString);
    };

    /**
     * 更新方案结束日期
     *
     * */
    const  updateEndDateString =(dateString) => {
        const endTime = form.getFieldsValue()['endTime'];
        const endDate = dateString.substring(0,4) +'-'+ dateString.substring(4,6) +'-' + dateString.substring(6,8);
        form.setFieldsValue({basicEndTimeDisplay: `${endDate} ${endTime}`});
        // 更新方案结束日期
        setEndDateString(dateString.substring(0,8))

    };


    /**
     * 更新方案结束时间
     *
     * */
    const  updateEndTimeString =(timeString) => {
        const endDate =  form.getFieldsValue()['endDate'];
        const endDateString = moment(endDate).format("YYYYMMDDHHmm").substring(0,8);
        const date = endDateString.substring(0,4) +'-'+ endDateString.substring(4,6) +'-' + endDateString.substring(6,8);
        form.setFieldsValue({basicEndTimeDisplay: `${date} ${timeString}`});
        setEndTime(timeString)
    };


    /**
     * 更新流控发布类型
     *
     * */
    const updateFormAirportFieldValue =(field, value) => {
        let data = {};
        data[field] = value;
        // 更新表单中流控发布类型
        form.setFieldsValue(data);
        // setRenderNumber(renderNumber++);
    };

    /**
     * 自动命名
     *
     * */
    const autofillTacticName = async () => {
        try {
            // 限制数值单位集合
            const restrictionModeUnit = {
                "MIT":"分钟一架",
                "AFP":"架",
            };
            // 限制数值单位
            let unit = "";
            // 必要校验字段
            const fields =[
                'targetUnit',
                'restrictionMode',
                'restrictionModeValue',
                'startDate',
                'startTime',
            ];
            // 触发表单验证取表单数据
            const values = await form.validateFields(fields);
            const { startTime, targetUnit, restrictionMode, restrictionModeValue, } = values;
            unit = restrictionModeUnit[restrictionMode];
            // 拼接名称
            const name = `${startTime}-${targetUnit.toUpperCase()}-${restrictionMode}-${restrictionModeValue} ${unit} `;
            // 更新
            form.setFieldsValue({'tacticName': name});

        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };
    /**
     * 打开编辑
     * */
    const handleOpenEdit =()=> {
        if( props.hasOwnProperty("setDisabledForm")){
            props.setDisabledForm(false);
        }
    };

    /**
     * 保存编辑
     *
     * */
    const handleSaveEdit = async () => {
        try {
            // 触发表单验证取表单数据
            const values = await form.validateFields();
            if( props.hasOwnProperty("setDisabledForm")){
                props.setDisabledForm(true);
            }
        } catch (errorInfo) {

            console.log('Failed:', errorInfo);

        }
    };


    /**
     * 编辑按钮
     *
     * */
    const drawEditBtn = ()=> {
        return(
            <div>
                {
                    props.disabledForm ?
                        <Button
                            className="btn_edit"
                            type="primary"
                            onClick={ handleOpenEdit }>
                            编辑
                        </Button>
                        : <Button
                            className="btn_save_edit"
                            type="primary"
                            onClick={ handleSaveEdit } >
                            保存编辑
                         </Button>
                }
            </div>
        )
    };
    /**
     * 忽略
     *
     * */
    const drawIgnoreBtn = ()=> {
        return (
            <div>
                <Button
                    className="r_btn btn_ignore"
                    onClick={()=>{
                        setIsIgnoreModalVisible(true)
                    }}
                    disabled ={ isIgnoreModalVisible }
                >
                    忽略
                </Button>
                <Modal
                    title={ "忽略" }
                    visible={isIgnoreModalVisible}
                    maskClosable={false}
                    centered
                    onOk ={ e=>{
                        // 隐藏模态框显示
                        setIsIgnoreModalVisible(false);
                        window.close();
                    } }
                    onCancel={e=>{
                        // 隐藏模态框显示
                        setIsIgnoreModalVisible(false);
                    }}
                    confirmLoading = { false }
                >
                    确定忽略当前流控?
                </Modal>
            </div>
        )
    };

    const setPrimaryButtonClassName = ()=>{
        if(operationType ==="MODIFY"){
            return "btn_update"
        }else if(operationType ==="CREATE"){
            return "btn_create"
        }else if(operationType ==="IMPORT"){
            return "btn_import"
        }else if(operationType ==="IMPORTWITHFORMER"){
            return "btn_import"
        }
    };

    /**
     * 操作栏
     * */
    const drawOperation = ()=> {
        return (
            <div className="footer" style={{width:props.width}}>

                {
                    showEditBtn ? (drawEditBtn()) : ""
                }
                <div>
                    <Button
                        className={ setPrimaryButtonClassName() }
                        type="primary"
                        onClick={handlePrimaryBtnClick}
                        disabled ={ importButtonDisable }
                    >
                        { primaryButtonName }
                    </Button>
                    <Modal
                        title={ primaryButtonName }
                        visible={isModalVisible}
                        maskClosable={false}
                        centered
                        onOk ={ handleSubmitFormData }
                        onCancel={handleCancel}
                        confirmLoading = { confirmLoading }
                    >
                        <p>{`确定${primaryButtonName}?`}</p>
                    </Modal>
                </div>
                {
                    showIgnoreBtn ? (drawIgnoreBtn()) : ""
                }
            </div>
        )
    };


    useEffect(function(){
        const user = localStorage.getItem("user");
        if( isValidVariable(user) ){
            props.systemPage.setUserData( JSON.parse(user) );
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
                className={ operationType ==="MODIFY"? "advanced_form scheme_update_form" :"advanced_form" }
            >
                <StaticInfoCard
                    disabledForm={props.disabledForm}
                    updateStartDateString={updateStartDateString }
                    updateStartTimeString={updateStartTimeString }
                    updateEndDateString={updateEndDateString }
                    updateEndTimeString ={ updateEndTimeString }
                    updateFormAirportFieldValue={updateFormAirportFieldValue }
                    autofillTacticName={autofillTacticName }
                    form = { form}

                />

            </Form>
            {
                drawOperation()
            }
        </div>
    )
}

export default withRouter( inject("newsList", "systemPage")(observer(RestrictionForm)) );