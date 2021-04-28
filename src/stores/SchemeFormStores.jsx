/*
 * @Author: your name
 * @Date: 2020-12-14 10:18:25
 * @LastEditTime: 2021-03-04 13:57:00
 * @LastEditors: Please set LastEditors
 * @Description: 跑道模块Stores
 * @FilePath: \WN-CDM\src\stores\schemeStores.jsx
 */

import { makeObservable, observable, action, computed } from 'mobx'
import { isValidVariable } from 'utils/basic-verify'

// 方案表单数据
class SchemeForm {
    constructor() {
        makeObservable(this)
    }
    // 原始方案数据
    @observable schemeData = {};
    //计数器用于变更此值以触发子组件更新
    @observable counter = 0;

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
    @observable restrictionMode = "";
    // MIT限制方式下限制类型 T:时间 D:距离
    @observable restrictionMITValueUnit = "";

    // 表单限制数值
    @observable restrictionModeValue = "";

    // MIT限制方式下限制数值
    @observable restrictionMITValue = "";
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

    //更新计数器
    @action triggerCounterChange( ){
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
        const flowControlMeasure = basicTacticInfo.flowControlMeasure || {};
        // 限制方式
        const restrictionMode = flowControlMeasure.restrictionMode || "";
        // MIT限制方式下限制类型 T:时间 D:距离
        const restrictionMITValueUnit = flowControlMeasure.restrictionMITValueUnit || "";
        // MIT限制方式下限制数值
        const restrictionMITValue = flowControlMeasure.restrictionMITValue || "";
        // AFP限制方式下限制数值
        const restrictionAFPValueSequence = flowControlMeasure.restrictionAFPValueSequence || "";
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
        this.restrictionMode = restrictionMode;
        // 更新MIT限制方式下限制类型 T:时间 D:距离
        this.restrictionMITValueUnit = restrictionMITValueUnit;
        // 更新MIT限制方式下限制数值
        this.restrictionMITValue = restrictionMITValue;
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
    
    // 更新MIT限制方式下限制类型 T:时间 D:距离
    @action updateTacticRestrictionMITValueUnit(MITValueUnit) {
        this.restrictionMITValueUnit = MITValueUnit;
    }
    // 更新表单限制数值
    @action updateTacticRestrictionModeValue(restrictionModeValue) {
        this.restrictionModeValue = restrictionModeValue;
    }
    
    
    
}

let schemeFormData = new SchemeForm();

export { schemeFormData }