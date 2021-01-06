import React, {useEffect, useState} from 'react'
import  moment  from 'moment'
import "moment/locale/zh-cn"
import {Button, Modal,   Form, message} from 'antd'
import StaticInfoCard from './StaticInfoCard'
import FlowList from './FlowList'
import { sendMsgToClient } from 'utils/client'
import { getDayTimeFromString, isValidObject, isValidVariable } from '../../utils/basic-verify'
import { request } from 'utils/request'


import './RestrictionForm.scss'

//表单整体
function RestrictionForm(props){
    console.log("RestrictionForm~~ render");
    const  { flowData = {} } = props;
    // 方案数据对象
    const { tacticProcessInfo={} } = flowData;
    const { basicTacticInfo={} } = tacticProcessInfo;
    const { tacticName, tacticPublishUnit, tacticPublishUser, id, tacticTimeInfo={}, sourceFlowcontrol={}, directionList=[] } = basicTacticInfo;
    // 方案开始时间(12位字符串)
    let basicStartTime = tacticTimeInfo.startTime;
    // 方案结束时间(12位字符串)
    let basicEndTime = tacticTimeInfo.endTime;
    const { flowControlName, flowControlTimeInfo={}, flowControlMeasure={}, TrafficFlowDomainMap={},  flowControlPublishType, flowControlReason,} = sourceFlowcontrol; // 流控信息对象
    // 流控开始时间(12位字符串)
    let flowControlStartTime = flowControlTimeInfo.startTime;
    // 流控开始时间(12位字符串)
    let flowControlEndTime = flowControlTimeInfo.endTime;
    // 流控限制方式
    const { restrictionMode, } = flowControlMeasure;


    // const { targetUnit, preorderUnit, behindUnit, exemptPreUnit, exemptbehindUnit, highLimit} = getDirectionListData(directionList);
    // 流控方向领域对象
    const directionListData = directionList[0] || {};
    const { targetUnit, preorderUnit, behindUnit, exemptPreUnit, exemptbehindUnit, highLimit } = directionListData;
    // 流控航班类型条件
    const flowControlFlight = isValidObject(sourceFlowcontrol.flowControlFlight) ? sourceFlowcontrol.flowControlFlight : {};

    const { flowControlFlightId ="", flowControlWakeFlowType="", flowControlMissionType="", flowControlPassengerCargoType="",
        flowControlTaskType="", flowControlMilitaryCivilType="", flowControlQualification="",flowControlAircraftType="",
        exemptFlightId="", exemptWakeFlowType="", exemptMissionType="", exemptPassengerCargoType="",
        exemptTaskType="", exemptMilitaryCivilType="", exemptQualification="", exemptAircraftType="",
    } = flowControlFlight;

    // 依据流控限制方式取流控限制数值方法
    const  getRestrictionModeValue = () => {
        const { restrictionMode,  restrictionMITValue} = flowControlMeasure;
        if(restrictionMode == "MIT"){
            return restrictionMITValue;
        }


    };
    // 流控限制数值
    let restrictionModeValue =getRestrictionModeValue();

    // function getDirectionListData (directionList)  {
    //
    //     let info = {
    //         targetUnit: [], // 基准单元
    //         preorderUnit: [], // 前序单元
    //         behindUnit: [], // 后续单元
    //         exemptPreUnit: [],  // 豁免前序单元
    //         exemptbehindUnit: [],  // 豁免后续单元
    //         highLimit: [],  // 高限
    //
    //     };
    //     let  directionInfo =  directionList.reduce(reducer, info);
    //     return directionInfo
    // };
    //
    // function reducer (accumulator, direction)  {
    //
    //     for(var key in accumulator){
    //         let pro = direction[key] || "";
    //         accumulator[key] =  accumulator[key].concat(pro)
    //     }
    //     return accumulator;
    // }

    // 日期组件格式化方式
    const dateFormat = 'YYYYMMDD HHmm';
    // 表单初始数值对象集合
    let initialValues = {
        // 方案名称
        tacticName: tacticName || '',
        // 方案信息中原始流控名称(仅显示不可编辑)
        basicFlowControlName: flowControlName || "",
        // 流控信息中的流控名称
        flowControlName: flowControlName || "",
        // 方案发布单位
        tacticPublishUnit: tacticPublishUnit || "",
        // 方案发布用户
        tacticPublishUser:  tacticPublishUser || "",
        // 基准单元
        targetUnit: targetUnit,
        // 前序单元
        preorderUnit: preorderUnit,
        // 后序单元
        behindUnit: behindUnit,
        // 豁免前序
        exemptPreUnit: exemptPreUnit,
        // 豁免后序
        exemptbehindUnit: exemptbehindUnit,
        // 限制高度
        highLimit: highLimit,
        // 方案开始时间(非编辑状态下显示)
        basicStartTimeDisplay: getDayTimeFromString(basicStartTime) || "",
        // 方案开始时间(编辑状态下DatePicker组件使用)
        basicStartTimeEdit: moment(basicStartTime, dateFormat) || "",
        // 方案结束时间(非编辑状态下显示)
        basicEndTimeDisplay: getDayTimeFromString(basicEndTime) || "",
        // 方案结束时间(编辑状态下DatePicker组件使用)
        basicEndTimeEdit: moment(basicEndTime, dateFormat) || "",
        // 流控开始时间(非编辑状态下显示)
        flowControlStartTimeDisplay: getDayTimeFromString(flowControlStartTime) || "",
        // 流控开始时间(编辑状态下DatePicker组件使用)
        flowControlStartTimeEdit: moment(flowControlStartTime, dateFormat) || "",
        // 流控开始时间(非编辑状态下显示)
        flowControlEndTimeDisplay: getDayTimeFromString(flowControlEndTime) || "",
        // 流控结束时间(编辑状态下DatePicker组件使用)
        flowControlEndTimeEdit: moment(flowControlEndTime, dateFormat) || "",
        // 流控发布类型
        flowControlPublishType: flowControlPublishType || "",
        // 流控限制原因
        flowControlReason: flowControlReason || "",
        // TODO 限制方式及限制数值待处理
        // 流控限制方式
        restrictionMode: restrictionMode,
        // 流控限制数值
        restrictionModeValue: restrictionModeValue,

        // 包含-航班号
        flowControlFlightId: isValidVariable(flowControlFlightId) ? flowControlFlightId.split(';') : [],
        // 包含-尾流类型
        flowControlWakeFlowType: flowControlWakeFlowType.split(';'),
        // 包含-航班性质
        flowControlMissionType: flowControlMissionType.split(';'),
        // 包含-客货类型
        flowControlPassengerCargoType: flowControlPassengerCargoType.split(';'),
        // 包含-任务类型
        flowControlTaskType: flowControlTaskType.split(';'),
        // 包含-航班属性
        flowControlMilitaryCivilType: flowControlMilitaryCivilType.split(';'),
        // 包含-限制资质
        flowControlQualification: flowControlQualification.split(';'),
        // 包含-受控机型
        flowControlAircraftType: isValidVariable(flowControlAircraftType) ? flowControlAircraftType.split(';') : [],

        // 不包含-航班号
        exemptFlightId: isValidVariable(exemptFlightId) ? exemptFlightId.split(';') : [],
        // 不包含-尾流类型
        exemptWakeFlowType: exemptWakeFlowType.split(';'),
        // 不包含-航班性质
        exemptMissionType: exemptMissionType.split(';'),
        // 不包含-客货类型
        exemptPassengerCargoType: exemptPassengerCargoType.split(';'),
        // 不包含-任务类型
        exemptTaskType: exemptTaskType.split(';'),
        // 不包含-航班属性
        exemptMilitaryCivilType: exemptMilitaryCivilType.split(';'),
        // 不包含-限制资质
        exemptQualification: exemptQualification.split(';'),
        // 不包含-受控机型
        exemptAircraftType:  isValidVariable(exemptAircraftType) ? exemptAircraftType.split(';') : [],

    };

    // 模态框显隐变量
    let [ isModalVisible, setIsModalVisible] = useState(false);
    // 导入按钮禁用变量
    let [ importButtonDisable, setImportButtonDisable] = useState(false);

    // 方案开始时间(12位字符串, 用于实时记录表单方案开始时间数值, 在提交数据时使用)
    let [ basicStartTimeString, setBasicStartTimeString] = useState(basicStartTime);
    // 方案结束时间(12位字符串, 用于实时记录表单方案开始时间数值, 在提交数据时使用)
    let [ basicEndTimeString, setBasicEndTimeString] = useState(basicEndTime);
    // 流控开始时间(12位字符串, 用于实时记录表单方案开始时间数值, 在提交数据时使用)
    let [ flowControlStartTimeString, setFlowControlStartTimeString] = useState(flowControlStartTime);
    // 流控结束时间(12位字符串, 用于实时记录表单方案开始时间数值, 在提交数据时使用)
    let [ flowControlEndTimeString, setFlowControlEndTimeString] = useState(flowControlEndTime);

    const [form] = Form.useForm();
    useEffect(function(){
        console.log("useEffect", initialValues);
        form.resetFields();//重置，用以表单初始值赋值
        // 更新表单各时间数值
        updateDataTime();

    },[id])


    const updateDataTime =() => {
        // 更新方案开始时间
        setBasicStartTimeString(basicStartTime);
        // 更新方案结束时间
        setBasicEndTimeString(basicEndTime);
        // 更新流控开始时间
        setFlowControlStartTimeString(flowControlStartTime);
        // 更新流控结束时间
        setFlowControlEndTimeString(flowControlEndTime);
    };


    // 导入按钮事件
    const  handleImportClick = async () => {
        try {
            const values = await form.validateFields();
            setIsModalVisible(true);

        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    // 模态框取消回调
    const  handleCancel = () => {
        // 隐藏模态框显示
        setIsModalVisible(false);
    };

    // 处理导入表单数据
    const handleImportFormData = async () => {
        try {
            // 触发表单验证取表单数据
            const values = await form.validateFields();
            setImportButtonDisable(true);
            console.log(values);
            // 处理导入提交数据
            const submitData = handleSubmitData(values);
            // 数据提交
            submitFormData(submitData)
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    /**
     * handleSubmitData() 返回接口原数据与表单数据融合后的数据对象
     * @param {Object} 表单数据对象
     * @return {Object}  融合后的数据对象
     * */
    const handleSubmitData =(values) =>{
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
        let sourceFlowcontrol = basicTacticInfo.sourceFlowcontrol;
        if(!isValidObject(sourceFlowcontrol)){
            basicTacticInfo.sourceFlowcontrol= {};
            sourceFlowcontrol = basicTacticInfo.sourceFlowcontrol
        }

        // 方案流控航班类型条件数据对象
        let flowControlFlight = sourceFlowcontrol.flowControlFlight;
        if(!isValidObject(flowControlFlight)){
            sourceFlowcontrol.flowControlFlight= {};
            flowControlFlight = sourceFlowcontrol.flowControlFlight
        }

        // 方案流控限制措施信息对象
        let flowControlMeasure = sourceFlowcontrol.flowControlMeasure;
        if(!isValidObject(flowControlMeasure)){
            sourceFlowcontrol.flowControlMeasure= {};
            flowControlMeasure = sourceFlowcontrol.flowControlMeasure
        }
        // 方案流控时间信息对象
        let flowControlTimeInfo = sourceFlowcontrol.flowControlTimeInfo;
        if(!isValidObject(flowControlTimeInfo)){
            sourceFlowcontrol.flowControlTimeInfo= {};
            flowControlTimeInfo = sourceFlowcontrol.flowControlTimeInfo
        }

        // 表单字段数据
        const { tacticName, tacticPublishUnit, tacticPublishUser,
            targetUnit, preorderUnit, behindUnit, exemptPreUnit, exemptbehindUnit, highLimit,
            flowControlName, flowControlReason, flowControlPublishType, restrictionRemark,
            restrictionMode,
            flowControlFlightId, flowControlWakeFlowType, flowControlMissionType, flowControlPassengerCargoType,
            flowControlTaskType, flowControlMilitaryCivilType, flowControlQualification,flowControlAircraftType,
            exemptFlightId, exemptWakeFlowType, exemptMissionType, exemptPassengerCargoType,
            exemptTaskType, exemptMilitaryCivilType, exemptQualification, exemptAircraftType,
        } = values;
        // 更新方案名称
        basicTacticInfo.tacticName = tacticName;
        // 更新方案发布单位
        basicTacticInfo.tacticPublishUnit = tacticPublishUnit;
        // 更新方案发布用户
        basicTacticInfo.tacticPublishUser = tacticPublishUser;
        // 更新方案开始时间
        tacticTimeInfo.startTime = basicStartTimeString;
        // 更新方案结束时间
        tacticTimeInfo.endTime = basicEndTimeString;
        // 更新基准单元
        directionListData.targetUnit = targetUnit;
        // 更新前序单元
        directionListData.preorderUnit = preorderUnit;
        // 更新后序单元
        directionListData.behindUnit = behindUnit;
        // 更新豁免前序
        directionListData.exemptPreUnit = exemptPreUnit;
        // 更新豁免后序
        directionListData.exemptbehindUnit = exemptbehindUnit;
        // 更新限制高度
        directionListData.highLimit = highLimit;

        // 更新流控名称
        sourceFlowcontrol.flowControlName = flowControlName;
        // 更新流控限制原因
        sourceFlowcontrol.flowControlReason = flowControlReason;
        // 更新流控发布类型
        sourceFlowcontrol.flowControlPublishType = flowControlPublishType;
        // 更新流控备注
        flowControlMeasure.restrictionRemark = restrictionRemark;
        // 更新流控开始时间
        flowControlTimeInfo.startTime = flowControlStartTimeString;
        // 更新流控结束时间
        flowControlTimeInfo.endTime = flowControlEndTimeString;
        // 更新流控限制方式
        flowControlMeasure.restrictionMode = restrictionMode;


        // 更新流控交通流-包含-航班号
        flowControlFlight.flowControlFlightId = flowControlFlightId.join(';');
        // 更新流控交通流-包含-尾流类型
        flowControlFlight.flowControlWakeFlowType = flowControlWakeFlowType.join(';');
        // 更新流控交通流-包含-航班性质
        flowControlFlight.flowControlMissionType = flowControlMissionType.join(';');
        // 更新流控交通流-包含-客货类型
        flowControlFlight.flowControlPassengerCargoType = flowControlPassengerCargoType.join(';');
        // 更新流控交通流-包含-任务类型
        flowControlFlight.flowControlTaskType = flowControlTaskType.join(';');
        // 更新流控交通流-包含-航班属性
        flowControlFlight.flowControlMilitaryCivilType = flowControlMilitaryCivilType.join(';');
        // 更新流控交通流-包含-限制资质
        flowControlFlight.flowControlQualification = flowControlQualification.join(';');
        // 更新流控交通流-包含-受控机型
        flowControlFlight.flowControlAircraftType = flowControlAircraftType.join(';');

        // 更新流控交通流-不包含-航班号
        flowControlFlight.exemptFlightId = exemptFlightId.join(';');
        // 更新流控交通流-不包含-尾流类型
        flowControlFlight.exemptWakeFlowType = exemptWakeFlowType.join(';');
        // 更新流控交通流-不包含-航班性质
        flowControlFlight.exemptMissionType = exemptMissionType.join(';');
        // 更新流控交通流-不包含-客货类型
        flowControlFlight.exemptPassengerCargoType = exemptPassengerCargoType.join(';');
        // 更新流控交通流-不包含-任务类型
        flowControlFlight.exemptTaskType = exemptTaskType.join(';');
        // 更新流控交通流-不包含-航班属性
        flowControlFlight.exemptMilitaryCivilType = exemptMilitaryCivilType.join(';');
        // 更新流控交通流-不包含-限制资质
        flowControlFlight.exemptQualification = exemptQualification.join(';');
        // 更新流控交通流-不包含-受控机型
        flowControlFlight.exemptAircraftType = exemptAircraftType.join(';');

        return opt;
    };

    /**
     * 数据提交
     * */
    const submitFormData = (data) => {
        const opt = {
            url:'http://192.168.194.21:58189/hydrogen-scheme-flow-server/simulationTactics/443',
            method:'POST',
            params:JSON.stringify(data),
            resFunc: (data)=> requestSuccess(data),
            errFunc: (err)=> requestErr(err, '流控导入失败' ),
        };
        request(opt);
    };

    /**
     * 数据提交成功回调
     * */
    const requestSuccess =(data) => {
        const { tacticProcessInfo={} } = data;
        const { basicTacticInfo={} } = tacticProcessInfo;
        const { id } = basicTacticInfo;
        console.log(id);
        setIsModalVisible(false);
        message.success('流控导入成功');
        // TODO
        // sendMsgToClient(id)
        jsEntity.importControl(id);

    };
    /**
     * 数据提交失败回调
     * */
    const requestErr = (err, content) => {
        setImportButtonDisable(false);
        message.error({
            content,
            duration: 4,
        });
    };

    /**
     * 更新方案开始时间
     *
     * */
    const  updateBasicStartTimeDisplay =(dateString) => {
        const date = getDayTimeFromString(dateString);
        // 设置表单非编辑状态下更新方案开始时间
        form.setFieldsValue({basicStartTimeDisplay: date});
        // 更新方案开始时间
        setBasicStartTimeString(dateString);
    };

    /**
     * 更新方案结束时间
     *
     * */
    const  updateBasicEndTimeDisplay =(dateString) => {
        const date = getDayTimeFromString(dateString);
        // 设置表单非编辑状态下更新方案结束时间
        form.setFieldsValue({basicEndTimeDisplay: date});
        // 更新方案结束时间
        setBasicEndTimeString(dateString)
    };

    /**
     * 更新流控开始时间
     *
     * */
    const  updateFlowControlStartTimeDisplay =(dateString) => {
        const date = getDayTimeFromString(dateString);
        // 设置表单非编辑状态下更新流控开始时间
        form.setFieldsValue({flowControlStartTimeDisplay: date});
        // 更新流控开始时间
        setFlowControlStartTimeString(dateString);


    };
    /**
     * 更新流控结束时间
     *
     * */
    const  updateFlowControlEndTimeDisplay =(dateString) => {
        const date = getDayTimeFromString(dateString);
        // 设置表单非编辑状态下更新流控结束时间
        form.setFieldsValue({flowControlEndTimeDisplay: date});
        // 更新流控结束时间
        setFlowControlEndTimeString(dateString);
    };
    /**
     * 更新流控限制方式
     *
     * */
    const updateRestrictionMode =(mode) => {
        // 更新表单中流控限制方式
        form.setFieldsValue({restrictionMode: mode});
    };
    /**
     * 更新流控发布类型
     *
     * */
    const updatePublishType =(type) => {
        // 更新表单中流控发布类型
        form.setFieldsValue({flowControlPublishType: type});
    };


    return (
        <div>
            <Form
                form={form}
                size="small"
                initialValues={initialValues}
                onFinish={(values) => {
                    const newStartTime = moment(values.startTime).format('YYYYMMDDHHmm');
                    console.log(values);
                    console.log(newStartTime);
                    // sendMsgToClient(message)

                }}
                className="destriction_form"
            >
                <StaticInfoCard
                    disabledForm={props.disabledForm}
                    updateBasicStartTimeDisplay={updateBasicStartTimeDisplay }
                    updateBasicEndTimeDisplay={updateBasicEndTimeDisplay }
                />
                <FlowList
                    disabledForm={props.disabledForm}

                    updateFlowControlStartTimeDisplay={updateFlowControlStartTimeDisplay }
                    updateFlowControlEndTimeDisplay={updateFlowControlEndTimeDisplay }
                    updateRestrictionMode={ updateRestrictionMode }
                    updatePublishType={ updatePublishType }
                />

            </Form>
            <Button
                className="r_btn btn_import"
                type="primary"
                onClick={handleImportClick}
                disabled ={ importButtonDisable }
            >
                导入
            </Button>
            <Modal
                title="流控导入"
                visible={isModalVisible}
                maskClosable={false}
                style={{ top: 200 }}
                onOk ={ handleImportFormData }
                onCancel={handleCancel}
            >
                <p>确定导入当前流控?</p>
            </Modal>
        </div>
    )
}

export default RestrictionForm