/*
 * @Author: your name
 * @Date: 2020-12-14 10:18:25
 * @LastEditTime: 2021-03-04 13:57:00
 * @LastEditors: Please set LastEditors
 * @Description: 跑道模块Stores
 * @FilePath: \WN-CDM\src\stores\schemeStores.jsx
 */

import { makeObservable, observable, action, computed } from 'mobx'
import { isValidVariable, isValidObject } from 'utils/basic-verify'
import { SchemeFormUtil } from 'utils/scheme-form-util'

// 方案表单数据
class SchemeForm {
    constructor() {
        makeObservable(this)
    }
    // 原始方案数据
    @observable schemeData = {};
    //计数器用于变更此值以触发子组件更新
    @observable counter = 0;
    //方案交通流录入方式 SHORTCUT:快捷录入  CUSTOM:自定义
    @observable inputMethod = SchemeFormUtil.INPUTMETHOD_CUSTOM;
    // 方案模式 100普通模式 200二类模式
    @observable tacticMode = "100";
    // 方案名称
    @observable tacticName = "";
    // 方案原因
    @observable flowControlReason = "";
    // 方案发布单位
    @observable tacticPublishUnit = "";
    // 方案发布单位中文
    @observable tacticPublishUnitCH = "";
    // 方案发布用户
    @observable tacticPublishUser = "";
    // 方案发布用户中文
    @observable tacticPublishUserCH = "";
    // 方案发布用户中文
    @observable startTime = "";
    // 方案发布用户中文
    @observable endTime = "";
    // 方案限制方式
    @observable restrictionMode = "MIT";
    // MIT限制方式下限制类型 T:时间 D:距离
    @observable restrictionMITValueUnit = "T";

    // 表单限制数值
    @observable restrictionModeValue = "";

    // MIT限制方式下限制数值
    @observable restrictionMITValue = "";
    // MIT限制方式下时间间隔字段
    @observable restrictionMITTimeValue = "";
    //速度字段数值
    @observable distanceToTime = "";

    // AFP限制方式下限制数值
    @observable restrictionAFPValueSequence = "";

    // 基准单元
    @observable targetUnit = "";
    // 前序单元
    @observable formerUnit = "";
    // 后序单元
    @observable behindUnit = "";
    // 豁免前序
    @observable exemptFormerUnit = "";
    // 豁免后序
    @observable exemptBehindUnit = "";
    // 起飞机场
    @observable depAp = "";
    // 降落机场
    @observable arrAp = "";
    // 豁免起飞机场
    @observable exemptDepAp = "";
    // 豁免降落机场
    @observable exemptArrAp = "";
    // 高度
    @observable useHeight = "";
    // 豁免高度
    @observable exemptHeight = "";
    // 原航路
    @observable originRoute = "";
    // 原航路数据集合
    @observable originRouteData = {};
    // 备选航路数据集合
    @observable alterRoutesData = [];


    // 快捷录入表单基础数据
    @observable shortcutFormData = [];
    // 快捷录入表单数据所有航路点格式化后的数据
    @observable shortcutFormPointData = {};

    // 快捷录入表单选中的复选框
    @observable shortcutFormSelecedData = [];
    // 包含-航班号
    @observable flightId = "";
    // 包含-尾流类型
    @observable wakeFlowLevel = "";
    // 包含-运营人
    @observable auType = "";
    // 包含-航班类型
    @observable airlineType = "";
    // 包含-客货类型
    @observable missionType = "";
    // 包含-任务类型
    @observable task = "";
    // 包含-军民航
    @observable organization = "";
    // 包含-限制资质
    @observable ability = "";
    // 包含-受控机型
    @observable aircraftType = "";

    // 不包含-航班号
    @observable exemptionFlightId = "";
    // 不包含-尾流类型
    @observable exemptionWakeFlowLevel = "";
    // 不包含-航班类型
    @observable exemptionAirlineType = "";
    // 不包含-运营人
    @observable exemptionAuType = "";
    // 不包含-客货类型
    @observable exemptionMissionType = "";
    // 不包含-任务类型
    @observable exemptionTask = "";
    // 不包含-军民航
    @observable exemptionOrganization = "";
    // 不包含-限制资质
    @observable exemptionAbility = "";
    // 不包含-受控机型
    @observable exemptionAircraftType = "";




    //更新计数器
    @action triggerCounterChange() {
        let t = this.counter;
        t++;
        this.counter = t;
    }

    // 更新原始方案数据
    @action updateSchemeData(data) {

        // 更新原始方案数据
        this.schemeData = data;
        // 方案基础信息
        const basicTacticInfo = data.basicTacticInfo || {};
        // 方案模式
        const tacticMode = basicTacticInfo.tacticMode || "100";
        // 方案录入方式
        const inputMethod = basicTacticInfo.inputMethod || SchemeFormUtil.INPUTMETHOD_CUSTOM;

        // 方案名称
        const tacticName = basicTacticInfo.tacticName || "";
        // 方案发布单位
        const tacticPublishUnit = basicTacticInfo.tacticPublishUnit || "";
        // 方案发布单位中文
        const tacticPublishUnitCH = basicTacticInfo.tacticPublishUnitCH || "";
        // 方案发布用户
        const tacticPublishUser = basicTacticInfo.tacticPublishUser || "";
        // 方案发布用户中文
        const tacticPublishUserCH = basicTacticInfo.tacticPublishUserCH || "";
        // 方案基础流控对象
        const basicFlowcontrol = basicTacticInfo.basicFlowcontrol || {};
        // 方案原因
        const flowControlReason = basicFlowcontrol.flowControlReason || "";
        // 方案时间信息对象
        const tacticTimeInfo = basicTacticInfo.tacticTimeInfo || {};
        // 方案开始时间(12位字符串)
        const startTime = tacticTimeInfo.startTime || "";
        // 方案结束时间(12位字符串)
        const endTime = tacticTimeInfo.endTime || "";
        // 方案措施信息对象
        const flowControlMeasure = basicFlowcontrol.flowControlMeasure || {};
        // 限制方式
        const restrictionMode = flowControlMeasure.restrictionMode || "";

        // MIT限制方式下限制类型 T:时间 D:距离
        const restrictionMITValueUnit = flowControlMeasure.restrictionMITValueUnit || "";
        // MIT限制方式下限制数值
        const restrictionMITValue = flowControlMeasure.restrictionMITValue || "";
        // 速度数值
        const distanceToTime = flowControlMeasure.distanceToTime || "";
        // MIT限制方式下时间间隔数值
        const restrictionMITTimeValue = flowControlMeasure.restrictionMITTimeValue || "";

        // AFP限制方式下限制数值
        const restrictionAFPValueSequence = flowControlMeasure.restrictionAFPValueSequence || "";
        // 原航路信息数据集合
        const originRouteData = flowControlMeasure.originRouteData || {};
        // 原航路值
        const originRoute = originRouteData.routeStr || "";
        //备选航路
        const alterRouteData1 = flowControlMeasure.alterRouteData1 || {};
        const alterRouteData2 = flowControlMeasure.alterRouteData2 || {};
        const alterRouteData3 = flowControlMeasure.alterRouteData3 || {};
        const alterRouteData4 = flowControlMeasure.alterRouteData4 || {};
        const alterRouteData5 = flowControlMeasure.alterRouteData5 || {};
        let alterRoutesData = [
            alterRouteData1,
            alterRouteData2,
            alterRouteData3,
            alterRouteData4,
            alterRouteData5,
        ]

        let directionList = basicTacticInfo.directionList || [];
        // 流控方向领域对象
        const directionListData = directionList[0] || {};
        // 基准单元
        const targetUnit = directionListData.targetUnit || ""
        // 前序单元
        const formerUnit = directionListData.formerUnit || ""
        // 后序单元
        const behindUnit = directionListData.behindUnit || ""
        // 豁免前序
        const exemptFormerUnit = directionListData.exemptFormerUnit || ""
        // 豁免后序
        const exemptBehindUnit = directionListData.exemptBehindUnit || ""
        // 起飞机场
        const depAp = directionListData.depAp || ""
        // 降落机场
        const arrAp = directionListData.arrAp || ""
        // 豁免起飞机场
        const exemptDepAp = directionListData.exemptDepAp || ""
        // 豁免降落机场
        const exemptArrAp = directionListData.exemptArrAp || ""
        // 高度
        const useHeight = directionListData.useHeight || ""
        // 豁免高度
        const exemptHeight = directionListData.exemptHeight || ""

        // 流控航班类型条件
        const flightPropertyDomain = isValidObject(basicFlowcontrol.flightPropertyDomain) ? basicFlowcontrol.flightPropertyDomain : {};

        // 包含-航班号
        const flightId = flightPropertyDomain.flightId || ""
        // 包含-尾流类型
        const wakeFlowLevel = flightPropertyDomain.wakeFlowLevel || ""
        // 包含-运营人
        const auType = flightPropertyDomain.auType || ""
        // 包含-航班类型
        const airlineType = flightPropertyDomain.airlineType || ""
        // 包含-客货类型
        const missionType = flightPropertyDomain.missionType || ""
        // 包含-任务类型
        const task = flightPropertyDomain.task || ""
        // 包含-军民航
        const organization = flightPropertyDomain.organization || ""
        // 包含-限制资质
        const ability = flightPropertyDomain.ability || ""
        // 包含-受控机型
        const aircraftType = flightPropertyDomain.aircraftType || ""

        // 不包含-航班号
        const exemptionFlightId = flightPropertyDomain.exemptionFlightId || ""
        // 不包含-尾流类型
        const exemptionWakeFlowLevel = flightPropertyDomain.exemptionWakeFlowLevel || ""
        // 不包含-航班类型
        const exemptionAirlineType = flightPropertyDomain.exemptionAirlineType || ""
        // 不包含-运营人
        const exemptionAuType = flightPropertyDomain.exemptionAuType || ""
        // 不包含-客货类型
        const exemptionMissionType = flightPropertyDomain.exemptionMissionType || ""
        // 不包含-任务类型
        const exemptionTask = flightPropertyDomain.exemptionTask || ""
        // 不包含-军民航
        const exemptionOrganization = flightPropertyDomain.exemptionOrganization || ""
        // 不包含-限制资质
        const exemptionAbility = flightPropertyDomain.exemptionAbility || ""
        // 不包含-受控机型
        const exemptionAircraftType = flightPropertyDomain.exemptionAircraftType || ""

        // 更新方案模式
        this.tacticMode = tacticMode;
        // 更新方案录入方式
        this.inputMethod = inputMethod;
        // 更新方案名称
        this.tacticName = tacticName;
        // 更新方案发布单位
        this.tacticPublishUnit = tacticPublishUnit;
        // 更新发布单位中文
        this.tacticPublishUnitCH = tacticPublishUnitCH;
        // 更新发布用户
        this.tacticPublishUser = tacticPublishUser;
        // 更新发布用户中文
        this.tacticPublishUserCH = tacticPublishUserCH;
        // 更新方案原因
        this.flowControlReason = flowControlReason;
        // 更新开始时间
        this.startTime = startTime;
        // 更新方案结束时间
        this.endTime = endTime;

        // 更新方案限制方式
        this.restrictionMode = restrictionMode || "MIT";
        // 更新MIT限制方式下限制类型 T:时间 D:距离
        this.restrictionMITValueUnit = restrictionMITValueUnit || "T";
        // 更新MIT限制方式下限制数值
        this.restrictionMITValue = restrictionMITValue;
        // 更新MIT限制方式下时间间隔数值
        this.restrictionMITTimeValue = restrictionMITTimeValue;
        // 更新速度数值
        this.distanceToTime = distanceToTime;
        // 更新AFP限制方式下限制数值
        this.restrictionAFPValueSequence = restrictionAFPValueSequence;
        // 更新基准单元
        this.targetUnit = targetUnit;
        // 更新前序单元
        this.formerUnit = formerUnit;
        // 更新后序单元
        this.behindUnit = behindUnit;
        // 更新豁免前序
        this.exemptFormerUnit = exemptFormerUnit;
        // 更新豁免后序
        this.exemptBehindUnit = exemptBehindUnit;
        // 更新起飞机场
        this.depAp = depAp;
        // 更新降落机场
        this.arrAp = arrAp;
        // 更新豁免起飞机场
        this.exemptDepAp = exemptDepAp;
        // 更新豁免降落机场
        this.exemptArrAp = exemptArrAp;
        // 更新高度
        this.useHeight = useHeight;
        // 更新豁免高度
        this.exemptHeight = exemptHeight;
        // 原航路
        this.originRoute = originRoute;
        // 原航路数据集合
        this.originRouteData = originRouteData;
        // 备选航路数据集合
        // 航路校验接口返回值中备选航路数据集合, 仅用于记录
        // 原始方案数据中不存在应该字段，且表单提交时也不需要提交应该字段
        this.alterRoutesData = alterRoutesData;

        // 包含-航班号
        this.flightId = flightId;
        // 包含-尾流类型
        this.wakeFlowLevel = wakeFlowLevel;
        // 包含-运营人
        this.auType = auType;
        // 包含-航班类型
        this.airlineType = airlineType;
        // 包含-客货类型
        this.missionType = missionType;
        // 包含-任务类型
        this.task = task;
        // 包含-军民航
        this.organization = organization;
        // 包含-限制资质
        this.ability = ability;
        // 包含-受控机型
        this.aircraftType = aircraftType;
        // 不包含-航班号
        this.exemptionFlightId = exemptionFlightId;
        // 不包含-尾流类型
        this.exemptionWakeFlowLevel = exemptionWakeFlowLevel;
        // 不包含-航班类型
        this.exemptionAirlineType = exemptionAirlineType;
        // 不包含-运营人
        this.exemptionAuType = exemptionAuType;
        // 不包含-客货类型
        this.exemptionMissionType = exemptionMissionType;
        // 不包含-任务类型
        this.exemptionTask = exemptionTask;
        // 不包含-军民航
        this.exemptionOrganization = exemptionOrganization;
        // 不包含-限制资质
        this.exemptionAbility = exemptionAbility;
        // 不包含-受控机型
        this.exemptionAircraftType = exemptionAircraftType;
        if (inputMethod === SchemeFormUtil.INPUTMETHOD_SHORTCUT) {
            // 更新方案交通流快捷录入表单中选中的数据
            this.updateShortcutFormSelecedDataBySingleDirectionListData();
        }
    }

    // 更新方案模式
    @action updateTacticMode(mode) {
        this.tacticMode = mode;
    }
    // 更新方案名称
    @action updateTacticName(name) {
        this.tacticName = name;
    }
    // 更新方案原因
    @action updateTacticReason(reason) {
        this.flowControlReason = reason;
    }
    // 更新方案发布单位
    @action updateTacticPublishUnit(unit) {
        this.tacticPublishUnit = unit;
    }
    // 更新发布单位中文
    @action updateTacticPublishUnitCH(unitCH) {
        this.tacticPublishUnitCH = unitCH;
    }
    // 更新发布用户
    @action updateTacticPublishUser(user) {
        this.tacticPublishUser = user;
    }
    // 更新发布用户中文
    @action updateTacticPublishUserCH(userCH) {
        this.tacticPublishUserCH = userCH;
    }
    // 更新方案开始时间
    @action updateTacticStartTime(startTime) {
        this.startTime = startTime;
    }
    // 更新方案结束时间
    @action updateTacticEndTime(endTime) {
        this.endTime = endTime;
    }
    // 更新方案限制方式
    @action updateTacticRestrictionMode(restrictionMode) {
        this.restrictionMode = restrictionMode;
    }
    // 更新方案速度值
    @action updateTacticMITDistanceToTime(distanceToTime) {
        this.distanceToTime = distanceToTime;
    }
    // 更新MIT限制方式下时间间隔字段值
    @action updateTacticMITTimeValue(restrictionMITTimeValue) {
        this.restrictionMITTimeValue = restrictionMITTimeValue;
    }

    // 更新MIT限制方式下限制类型 T:时间 D:距离
    @action updateTacticRestrictionMITValueUnit(MITValueUnit) {
        this.restrictionMITValueUnit = MITValueUnit;
    }
    // 更新表单限制数值
    @action updateTacticRestrictionModeValue(restrictionModeValue) {
        this.restrictionModeValue = restrictionModeValue;
    }

    // 更新原航路数据集合
    @action updateTacticOriginRouteData(originRouteData) {
        this.originRouteData = originRouteData;
    }
    // 更新备选航路数据集合
    @action updateTacticAlterRoutesData(alterRoutesData) {
        this.alterRoutesData = alterRoutesData;
    }
    // 更新方案交通流录入方式
    @action updateInputMethod(method) {
        this.inputMethod = method;
        // 清空相关基准点
        // 基准单元
        this.targetUnit = "";
        // 前序单元
        this.formerUnit = "";
        // 后序单元
        this.behindUnit = "";
        // 豁免前序
        this.exemptFormerUnit = "";
        // 豁免后序
        this.exemptBehindUnit = "";
    }
    // 更新方案交通流快捷录入表单数据
    @action updateShortcutFormData(data) {
        // 转换成表单需要的格式
        let directionListData = this.getDirectionListData(data);
        // 更新方案交通流快捷录入表单数据
        this.shortcutFormData = directionListData;
        // 方案交通流快捷录入表单数据所有航路点格式化后的数据
        let shortcutFormPointData = this.getShortcutFormPointData(data);
        // 更新方案交通流快捷录入表单数据所有航路点格式化后的数据
        this.shortcutFormPointData = shortcutFormPointData;
        console.log(shortcutFormPointData)
    }

    // 获取方向数据
    @action getDirectionListData(data) {
        let list = [];
        if (isValidObject(data)) {
            for (let i in data) {
                let direction = data[i];
                let obj = this.getSingleDirectionData(direction);
                list.push(obj);
            }
        }
        return list;
    }
    // 获取方案交通流快捷录入表单数据所有航路点数据
    @action getShortcutFormPointData(data) {
        let dataMap = {};
        if (isValidObject(data)) {
            for (let i in data) {
                let direction = data[i];
                direction.map(item => {
                    dataMap[item.name] = item
                })
            }
        }
        return dataMap;
    }

    // 获取单条方向的复选框数据
    @action getSingleDirectionData(directionData) {
        // 方向中第一项
        let point = directionData[0];
        // 方向
        let description = point.description;
        // 方向中文
        let descriptionZh = point.descriptionZh;

        // 方向中的复选框
        let options = directionData.map((element, index) => ({ label: element.name, value: element.name, directionCriteria: element.directionCriteria }))
        return {
            description,
            descriptionZh,
            options,
        }
    }
    // 更新方案交通流快捷录入表单中选中的数据
    @action updateShortcutFormSelecedData(selecedData) {
        const filterList = this.filterShortcutFormSelecedData(selecedData);
        this.shortcutFormSelecedData = filterList;
        console.log(filterList)
    }
    // 比对并计算中选中的数据
    @action filterShortcutFormSelecedData(selecedData) {
        let list = [];
        const _data = this.shortcutFormSelecedData;
        const len1 = _data.length;
        const len2 = selecedData.length;

        // 增加勾选
        if (len1 < len2) {
            // 查找出增加勾选的项
            let addedSeleced = selecedData.filter((item) => {
                return !_data.includes(item);
            });
            const pointData = this.shortcutFormPointData
            // 增加勾选的航路点
            let addedData = addedSeleced[0];
            let addedDataGroup = pointData[addedData].group;
            let newList = selecedData.filter(item => pointData[item].group === addedDataGroup);
            list = newList;
        } else {
            // 取消勾选则直接替换
            list = selecedData;
        }
        return list;
    }
    // 数据回显示时使用方案单方向信息数据更新方案交通流快捷录入表单中选中的数据
    @action updateShortcutFormSelecedDataBySingleDirectionListData() {
        
        // 基准单元
        const targetUnit = this.targetUnit || "" 
        let selecedData = [];

        if (isValidVariable(targetUnit)) {
            selecedData = targetUnit.split(';');
        }
        this.shortcutFormSelecedData = selecedData;
    }
    // 数据回显示时，使用方案多方向信息数据更新方案交通流快捷录入表单中选中的数据(暂未使用，预留方法)
    @action updateShortcutFormSelecedDataByMultipleDirectionListData() {
        // 方案基础信息
        const basicTacticInfo = this.schemeData.basicTacticInfo || {};
        let directionList = basicTacticInfo.directionList || [];
        let selecedData = [];
        if (directionList.length > 0) {
            selecedData = directionList.map(item => item.targetUnit)
            this.shortcutFormSelecedData = selecedData;
        }
    }

}

let schemeFormData = new SchemeForm();

export { schemeFormData }