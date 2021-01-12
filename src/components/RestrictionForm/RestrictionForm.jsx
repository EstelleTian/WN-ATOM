import React, {useEffect, useState} from 'react'
import  moment  from 'moment'
import "moment/locale/zh-cn"
import {Button, Modal,   Form,  message as antdMessage} from 'antd'
import StaticInfoCard from './StaticInfoCard'
import FlowList from './FlowList'
import { handleImportControl } from 'utils/client'
import { formatTimeString, getDateFromString, isValidObject, isValidVariable } from '../../utils/basic-verify'
import { request } from 'utils/request'


import './RestrictionForm.scss'

//表单整体
function RestrictionForm(props){
    console.log("RestrictionForm~~ render");
    const  { flowData = {}, showImportBtn,  } = props;
    // 方案数据对象
    const { tacticProcessInfo={} } = flowData;
    const { basicTacticInfo={} } = tacticProcessInfo;
    const { tacticName, tacticPublishUnit, tacticPublishUser, id, tacticTimeInfo={}, sourceFlowcontrol={}, directionList=[] } = basicTacticInfo;

    // 方案开始时间(12位字符串)
    let basicStartTime = tacticTimeInfo.startTime;
    // 方案结束时间(12位字符串)
    let basicEndTime = tacticTimeInfo.endTime;

    let startTimeString = "" ;
    let startDate ="";
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

        // 方案开始日期(DatePicker组件使用)
        startDate: isValidVariable(basicStartTime) ? moment(basicStartTime, dateFormat) : "",
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

    const [form] = Form.useForm();
    useEffect(function(){
        console.log("useEffect", initialValues);
        form.resetFields();//重置，用以表单初始值赋值
        // 更新表单各时间数值
        updateDataTime();
    },[id])


    const updateDataTime =() => {
        // 更新方案开始日期
        setStartDateString(startDate);
        // 更新方案结束日期
        setEndDateString(endDate);
        setStartTime(startTimeString);
        setEndTime(endTimeString);
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
        setConfirmLoading(false);
    };

    // 处理导入表单数据
    const handleImportFormData = async () => {
        try {
            // 触发表单验证取表单数据
            const values = await form.validateFields();
            setImportButtonDisable(true);
            if( props.hasOwnProperty("setDisabledForm")){
                props.setDisabledForm(true);
            }

            setConfirmLoading(true);
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
            restrictionMode, restrictionModeValue,
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
        tacticTimeInfo.startTime = startDateString+ startTime;
        // 更新方案结束时间
        tacticTimeInfo.endTime = endDateString + endTime;
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

        // 更新流控限制方式
        flowControlMeasure.restrictionMode = restrictionMode;
        let modeKey = restrictionModeData[restrictionMode];
        // 更新流控限制方式相应的字段数值
        flowControlMeasure[modeKey] = restrictionModeValue;


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
            url:'http://192.168.194.21:58189/hydrogen-scheme-flow-server/simulationTactics/import/443',
            method:'POST',
            params:JSON.stringify(data),
            resFunc: (data)=> requestSuccess(data),
            errFunc: (err)=> requestErr(err, '流控导入失败' ),
        };
        request(opt);
        //发送到客户端
        // handleImportControl(JSON.stringify(data));
    };

    /**
     * 数据提交成功回调
     * */
    const requestSuccess =(data) => {
        const { tacticProcessInfo={} } = data;
        const { basicTacticInfo={} } = tacticProcessInfo;
        const { id } = basicTacticInfo;
        console.log(id);
        setConfirmLoading(false);
        setIsModalVisible(false);
        antdMessage.success('流控导入成功');
        handleImportControl(id, props.message.id);
    };

    /**
     * 数据提交失败回调
     * */
    const requestErr = (err, text) => {
        if( props.hasOwnProperty("setDisabledForm") ){
            props.setDisabledForm(false);
        }

        setImportButtonDisable(false);
        setConfirmLoading(false);
        setIsModalVisible(false);
        const errMsg = err.message || "";

        antdMessage.error({
            content:  (
                <span>
                    <span>{text}</span>
                    <br/>
                    <span>{errMsg}</span>

                </span>
            ),
            duration: 4,
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
                // colon = { false }
                form={form}
                // size="small"
                initialValues={initialValues}
                onFinish={(values) => {
                    // const newStartTime = moment(values.startTime).format('YYYYMMDDHHmm');
                    console.log(values);
                    // console.log(newStartTime);
                    // sendMsgToClient(message)

                }}
                className="destriction_form"
            >
                <StaticInfoCard
                    disabledForm={props.disabledForm}
                    updateStartDateString={updateStartDateString }
                    updateStartTimeString={updateStartTimeString }
                    updateEndDateString={updateEndDateString }
                    updateEndTimeString ={ updateEndTimeString }
                    updateRestrictionMode={updateRestrictionMode }
                    form = { form}

                />
                {/*<FlowList*/}
                    {/*disabledForm={props.disabledForm}*/}

                    {/*updateFlowControlStartTimeDisplay={updateFlowControlStartTimeDisplay }*/}
                    {/*updateFlowControlEndTimeDisplay={updateFlowControlEndTimeDisplay }*/}
                    {/*updateRestrictionMode={ updateRestrictionMode }*/}
                    {/*updatePublishType={ updatePublishType }*/}
                {/*/>*/}

            </Form>
            {
                showImportBtn
                    ?  <div className="footer" style={{width:props.width}}>
                            <Button
                                className="r_btn btn_import"
                                type="primary"
                                onClick={handleImportClick}
                                disabled ={ importButtonDisable }
                            >
                                { props.btnName || "导入" }
                            </Button>
                            <Modal
                                title={ props.btnName || "导入" }
                                visible={isModalVisible}
                                maskClosable={false}
                                style={{ top: 200 }}
                                onOk ={ handleImportFormData }
                                onCancel={handleCancel}
                                confirmLoading = { confirmLoading }
                                >

                                {
                                    props.btnName ? <p>{`确定${props.btnName}?`}</p> : <p>确定导入当前流控?</p>
                                }



                            </Modal>
                        </div>
                    : ""
            }


        </div>
    )
}

export default RestrictionForm