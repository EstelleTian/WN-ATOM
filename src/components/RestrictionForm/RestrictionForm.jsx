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
    const { restrictionInfo={} } = flowData;
    const { basicTacticInfo={} } = restrictionInfo;
    const { tacticName, tacticPublishUnit, tacticPublishUser, id, tacticTimeInfo={}, sourceFlowcontrol={}, directionList=[] } = basicTacticInfo;
    let basicStartTime = tacticTimeInfo.startTime;
    let basicEndTime = tacticTimeInfo.endTime;
    const { flowControlName, flowControlTimeInfo={}, flowControlMeasure={}, TrafficFlowDomainMap={},  flowControlPublishType, flowControlReason,} = sourceFlowcontrol; // 流控信息对象

    let flowControlStartTime = flowControlTimeInfo.startTime;
    let flowControlEndTime = flowControlTimeInfo.endTime;

    const { restrictionMode, } = flowControlMeasure;


    // 方向领域对象
    // const { targetUnit, preorderUnit, behindUnit, exemptPreUnit, exemptbehindUnit, highLimit} = getDirectionListData(directionList);
    const directionListData = directionList[0] || {};
    const { targetUnit, preorderUnit, behindUnit, exemptPreUnit, exemptbehindUnit, highLimit } = directionListData;

    const flowControlFlight = isValidObject(sourceFlowcontrol.flowControlFlight) ? sourceFlowcontrol.flowControlFlight : {};
    const { flowControlFlightId ="", flowControlWakeFlowType="", flowControlMissionType="", flowControlPassengerCargoType="",
        flowControlTaskType="", flowControlMilitaryCivilType="", flowControlQualification="",flowControlAircraftType="",
        exemptFlightId="", exemptWakeFlowType="", exemptMissionType="", exemptPassengerCargoType="",
        exemptTaskType="", exemptMilitaryCivilType="", exemptQualification="", exemptAircraftType="",
    } = flowControlFlight;

    const  getRestrictionModeValue = () => {
        const { restrictionMode,  restrictionMITValue} = flowControlMeasure;
        if(restrictionMode == "MIT"){
            return restrictionMITValue;
        }


    };

    let restrictionModeValue =getRestrictionModeValue();

    function getDirectionListData (directionList)  {

        let info = {
            targetUnit: [], // 基准单元
            preorderUnit: [], // 前序单元
            behindUnit: [], // 后续单元
            exemptPreUnit: [],  // 豁免前序单元
            exemptbehindUnit: [],  // 豁免后续单元
            highLimit: [],  // 高限

        };
        let  directionInfo =  directionList.reduce(reducer, info);
        return directionInfo
    };

    function reducer (accumulator, direction)  {

        for(var key in accumulator){
            let pro = direction[key] || "";
            accumulator[key] =  accumulator[key].concat(pro)
        }
        return accumulator;
    }

    const dateFormat = 'YYYYMMDD HHmm';

    let initialValues = {
        tacticName: tacticName || '',
        basicFlowControlName: flowControlName || "",
        flowControlName: flowControlName || "",
        tacticPublishUnit: tacticPublishUnit || "",
        tacticPublishUser:  tacticPublishUser || "",
        targetUnit: targetUnit,
        preorderUnit: preorderUnit,
        behindUnit: behindUnit,
        exemptPreUnit: exemptPreUnit,
        exemptbehindUnit: exemptbehindUnit,
        highLimit: highLimit,
        basicStartTimeDisplay: getDayTimeFromString(basicStartTime) || "",
        basicStartTimeEdit: moment(basicStartTime, dateFormat) || "",
        basicStartTime: basicStartTime || "",
        basicEndTimeDisplay: getDayTimeFromString(basicEndTime) || "",
        basicEndTimeEdit: moment(basicEndTime, dateFormat) || "",
        basicEndTime: basicEndTime || "",
        flowControlStartTimeDisplay: getDayTimeFromString(flowControlStartTime) || "",
        flowControlStartTimeEdit: moment(flowControlStartTime, dateFormat) || "",
        flowControlStartTime: flowControlStartTime || "",
        flowControlEndTimeDisplay: getDayTimeFromString(flowControlEndTime) || "",
        flowControlEndTimeEdit: moment(flowControlEndTime, dateFormat) || "",
        flowControlEndTime: flowControlEndTime || "",
        flowControlPublishType: flowControlPublishType || "",
        flowControlReason: flowControlReason || "",
        // TODO 限制方式及限制数值待处理
        restrictionMode: restrictionMode,
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


    let [ isModalVisible, setIsModalVisible] = useState(false);
    let [ basicStartTimeString, setBasicStartTimeString] = useState(basicStartTime);
    let [ basicEndTimeString, setBasicEndTimeString] = useState(basicEndTime);
    let [ flowControlStartTimeString, setFlowControlStartTimeString] = useState(flowControlStartTime);
    let [ flowControlEndTimeString, setFlowControlEndTimeString] = useState(flowControlEndTime);

    const [form] = Form.useForm();
    useEffect(function(){
        console.log("useEffect", initialValues);
        form.resetFields();//重置，用以表单初始值赋值
        updateDataTime();
        // setBasicStartTimeString(initialValues.basicStartTime);
        // setBasicEndTimeString(initialValues.basicEndTime);

    },[id])


    const updateDataTime =() => {
        setBasicStartTimeString(basicStartTime);
        setBasicEndTimeString(basicEndTime);
        setFlowControlStartTimeString(flowControlStartTime);
        setFlowControlEndTimeString(flowControlEndTime);
    }



    const onCheck = async () => {
        try {
            const values = await form.validateFields();
            setIsModalVisible(true);

        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    const  handleCancel = () => {
        setIsModalVisible(false);
    }

    const handleFormData = async () => {
        try {
            const values = await form.validateFields();
            console.log(values);
            const submitData = handleSubmitData(values);

            submitFormData(submitData)


        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    const handleSubmitData =(values) =>{
        let opt = JSON.parse(JSON.stringify(restrictionInfo));
        let { basicTacticInfo={} } = opt;
        let { tacticTimeInfo={}, directionList, sourceFlowcontrol } = basicTacticInfo;

        const { tacticName, tacticPublishUnit, tacticPublishUser,
            targetUnit, preorderUnit, behindUnit, exemptPreUnit, exemptbehindUnit, highLimit,
            flowControlName, flowControlReason, flowControlPublishType, restrictionRemark,
            restrictionMode,
            flowControlFlightId ="", flowControlWakeFlowType, flowControlMissionType, flowControlPassengerCargoType,
            flowControlTaskType, flowControlMilitaryCivilType, flowControlQualification,flowControlAircraftType="",
            exemptFlightId, exemptWakeFlowType, exemptMissionType, exemptPassengerCargoType,
            exemptTaskType, exemptMilitaryCivilType, exemptQualification, exemptAircraftType="",
        } = values;

        basicTacticInfo.tacticName = tacticName;
        basicTacticInfo.tacticPublishUnit = tacticPublishUnit;
        basicTacticInfo.tacticPublishUser = tacticPublishUser;
        tacticTimeInfo.startTime = basicStartTimeString;
        tacticTimeInfo.endTime = basicEndTimeString;

        if(isValidVariable(directionList)){
            if(isValidObject(directionList[0])){
                directionList[0].targetUnit = targetUnit;
                directionList[0].preorderUnit = preorderUnit;
                directionList[0].behindUnit = behindUnit;
                directionList[0].exemptPreUnit = exemptPreUnit;
                directionList[0].exemptbehindUnit = exemptbehindUnit;
                directionList[0].highLimit = highLimit;
            }else {
                directionList[0] = {
                    targetUnit,
                    preorderUnit,
                    behindUnit,
                    exemptPreUnit,
                    exemptbehindUnit,
                    highLimit
                }
            }
        }else {
            basicTacticInfo.directionList = [];
            basicTacticInfo.directionList[0] = {
                targetUnit,
                preorderUnit,
                behindUnit,
                exemptPreUnit,
                exemptbehindUnit,
                highLimit
            }
        }


        sourceFlowcontrol.flowControlName = flowControlName;
        sourceFlowcontrol.flowControlReason = flowControlReason;
        sourceFlowcontrol.flowControlPublishType = flowControlPublishType;
        sourceFlowcontrol.flowControlMeasure.restrictionRemark = restrictionRemark;
        sourceFlowcontrol.flowControlTimeInfo.startTime = flowControlStartTimeString;
        sourceFlowcontrol.flowControlTimeInfo.endTime = flowControlEndTimeString;

        sourceFlowcontrol.flowControlMeasure.restrictionMode = restrictionMode;
        if(isValidObject(sourceFlowcontrol.flowControlFlight)){
            sourceFlowcontrol.flowControlFlight.flowControlFlightId = flowControlFlightId.join(';');
            sourceFlowcontrol.flowControlFlight.flowControlWakeFlowType = flowControlWakeFlowType.join(';');
            sourceFlowcontrol.flowControlFlight.flowControlMissionType = flowControlMissionType.join(';');
            sourceFlowcontrol.flowControlFlight.flowControlPassengerCargoType = flowControlPassengerCargoType.join(';');
            sourceFlowcontrol.flowControlFlight.flowControlTaskType = flowControlTaskType.join(';');
            sourceFlowcontrol.flowControlFlight.flowControlMilitaryCivilType = flowControlMilitaryCivilType.join(';');
            sourceFlowcontrol.flowControlFlight.flowControlQualification = flowControlQualification.join(';');
            sourceFlowcontrol.flowControlFlight.flowControlAircraftType = flowControlAircraftType;
            sourceFlowcontrol.flowControlFlight.exemptFlightId = exemptFlightId;
            sourceFlowcontrol.flowControlFlight.exemptWakeFlowType = exemptWakeFlowType.join(';');
            sourceFlowcontrol.flowControlFlight.exemptMissionType = exemptMissionType.join(';');
            sourceFlowcontrol.flowControlFlight.exemptPassengerCargoType = exemptPassengerCargoType.join(';');
            sourceFlowcontrol.flowControlFlight.exemptTaskType = exemptTaskType.join(';');
            sourceFlowcontrol.flowControlFlight.exemptMilitaryCivilType = exemptMilitaryCivilType.join(';');
            sourceFlowcontrol.flowControlFlight.exemptQualification = exemptQualification.join(';');
            sourceFlowcontrol.flowControlFlight.exemptAircraftType = exemptAircraftType.join(';');
        }else {
            sourceFlowcontrol["flowControlFlight"] = {
                flowControlFlightId: flowControlFlightId.join(';'),
                flowControlWakeFlowType : flowControlWakeFlowType.join(';'),
                flowControlMissionType : flowControlMissionType.join(';'),
                flowControlPassengerCargoType : flowControlPassengerCargoType.join(';'),
                flowControlTaskType : flowControlTaskType.join(';'),
                flowControlMilitaryCivilType : flowControlMilitaryCivilType.join(';'),
                flowControlQualification : flowControlQualification.join(';'),
                flowControlAircraftType : flowControlAircraftType.join(';'),
                exemptFlightId : exemptFlightId.join(';'),
                exemptWakeFlowType : exemptWakeFlowType.join(';'),
                exemptMissionType : exemptMissionType.join(';'),
                exemptPassengerCargoType : exemptPassengerCargoType.join(';'),
                exemptTaskType : exemptTaskType.join(';'),
                exemptMilitaryCivilType : exemptMilitaryCivilType.join(';'),
                exemptQualification : exemptQualification.join(';'),
                exemptAircraftType : exemptAircraftType.join(';'),
            }
        }



        return opt;
    };

    const submitFormData = (data) => {
        const opt = {
            url:'http://192.168.194.21:58189/hydrogen-scheme-flow-server/simulationTactics/443',
            // url:'http://192.168.243.120:58189/hydrogen-scheme-flow-server/simulationTactics/443',
            method:'POST',
            params:JSON.stringify(data),
            resFunc: (data)=> requestSuccess(data),
            errFunc: (err)=> requestErr(err, '流控导入失败' ),
        };
        request(opt);
    }

    const requestSuccess =(data) => {
        const { restrictionInfo={} } = data;
        const { basicTacticInfo={} } = restrictionInfo;
        const { id } = basicTacticInfo;
        console.log(id);
        setIsModalVisible(false);
        message.success('流控导入成功');
        // TODO
        // sendMsgToClient(id)

    };

    const requestErr = (err, content) => {
        message.error({
            content,
            duration: 4,
        });
    }



    const  updateBasicStartTimeDisplay =(dateString) => {
        const date = getDayTimeFromString(dateString);
        form.setFieldsValue({basicStartTimeDisplay: date});
        setBasicStartTimeString(dateString);
    };
    const  updateBasicEndTimeDisplay =(dateString) => {
        console.log(dateString)
        const date = getDayTimeFromString(dateString);
        form.setFieldsValue({basicEndTimeDisplay: date});
        setBasicEndTimeString(dateString)
    };

    const  updateFlowControlStartTimeDisplay =(dateString) => {
        const date = getDayTimeFromString(dateString);
        form.setFieldsValue({flowControlStartTimeDisplay: date});
        setFlowControlStartTimeString(dateString);


    };
    const  updateFlowControlEndTimeDisplay =(dateString) => {
        const date = getDayTimeFromString(dateString);
        form.setFieldsValue({flowControlEndTimeDisplay: date});
        setFlowControlEndTimeString(dateString);
    };
    const updateRestrictionMode =(mode) => {
        form.setFieldsValue({restrictionMode: mode});
    };
    const updatePublishType =(type) => {
        form.setFieldsValue({flowControlPublishType: type});
    };



    // const setFieldsValue =(values) => {
    //     console.log(values);
    //     return initialValues
    // }

    // form.setFieldsValue(setFieldsValue());

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
            <Button className="r_btn btn_import" type="primary" onClick={onCheck}>
                导入
            </Button>
            <Modal
                title="流控导入"
                visible={isModalVisible}
                maskClosable={false}
                style={{ top: 200 }}
                onOk ={ handleFormData }
                onCancel={handleCancel}
            >
                <p>确定导入当前流控?</p>
            </Modal>
        </div>
    )
}

export default RestrictionForm