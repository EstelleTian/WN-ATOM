/*
 * @Author: your name
 * @Date: 2020-12-14 10:18:25
 * @LastEditTime: 2021-03-04 13:57:00
 * @LastEditors: Please set LastEditors
 * @Description:ATOM引接应用配置模块Stores
 * @FilePath: \WN-CDM\src\stores\ATOMConfigModalStores.jsx
 */

import { makeObservable, observable, action } from 'mobx'
import { isValidObject, isValidVariable } from 'utils/basic-verify'
import { difference } from 'lodash';


// 动态跑道发布表单数据
class RunwayDynamicPublishForm {
    constructor() {
        makeObservable(this)
    }
    //模态框是否显示
    @observable modalVisible = false;
    //数据获取或提交请求中
    @observable loading = false;
    // 跑道状态勾选数值变更计数器
    // 用于在跑道状态勾选数值变更后需要强制更新并校验表单对应字段值
    @observable ruwayStatusSelectedDataChangeCounter = 0;

    // 跑道航路点勾选数值变更计数器
    // 用于在跑道航路点勾选数值变更后需要强制更新并校验表单对应字段值
    @observable runwayPointSelectedDataChangeCounter = 0;

    // 配置数据
    @observable configData = {};
    // 机场
    @observable airport = "";

    // 运行模式
    @observable operationmode = "";
    // 跑道航路点数据(元素航路对象)
    @observable runwayPoint = [];
    // 跑道航路点集合(元素为航路点字符串)
    @observable allPoint = [];
    // 跑道配置数据
    @observable listRWGapInfo = [];
    // 跑道配置条数
    @observable runwayNumber = 0;
    // 跑道配置状态复选框被勾选数值
    @observable ruwayStatusSelectedData = {};

    // 跑道配置中航路点复选框被勾选数值
    @observable runwayPointSelectedData = {};

    //更新表单模态框显示状态
    @action toggleModalVisible(visible) {
        this.modalVisible = visible;
    }
    //更新表格loading状态
    @action toggleLoad( load ){
        this.loading = load;
    }
    // 更新配置选项数据
    @action updateConfigData(data) {
        if (isValidObject(data)) {
            this.configData = data;
        } else {
            this.configData = {};
        }
        // 机场
        let airport = data.airportStr || "";
        //  跑道航路点
        let runwayPoint = data.lstRWPoint || [];
        // 跑道配置数据
        let listRWGapInfo = data.listRWGapInfoDefault || [];
        // 跑道配置条数
        let runwayNumber = listRWGapInfo.length;

        // 取第一条跑道数据
        const firstRunway = listRWGapInfo[0] || {};
        // 运行模式
        const operationmode = firstRunway.operationmode || "";
        this.airport = airport;
        this.operationmode = operationmode;
        this.runwayPoint = runwayPoint;
        this.listRWGapInfo = listRWGapInfo;
        this.runwayNumber = runwayNumber;
        // 更新所有航路点
        let allPoint = [... this.runwayPoint].map((item)=> item.pointName);
        this.allPoint = allPoint;
        // 更新各跑道状态勾选数值
        let ruwayStatusSelectedData = this.getRuwayStatusSelectedData();
        this.ruwayStatusSelectedData = ruwayStatusSelectedData;
        // 更新各跑道航路点勾选数值
        let runwayPointSelectedData = this.getRuwayPointSelectedData();
        this.runwayPointSelectedData = runwayPointSelectedData;
    }

    // 获取各跑道状态勾选值
    @action getRuwayStatusSelectedData() {
        let data = {};
        for (let i = 0; i < this.runwayNumber; i++) {
            let singleRunwayData = this.listRWGapInfo[i] || {};
            let id = singleRunwayData.id;
            let isDepRW = singleRunwayData.isDepRW;
            let status = this.convertRunwayStauts(isDepRW);
            data[id] = status;
        }
        return data;
    }

    // 转换跑道状态
    @action convertRunwayStauts(isDepRW) {
        let arr = [];
        isDepRW = isDepRW.toString();
        if (isDepRW === "0") {
            // 关闭
            arr = ["0"];
        } else if (isDepRW === "1") {
            // 起飞
            arr = ["1"];
        } else if (isDepRW === "-1") {
            // 降落
            arr = ["-1"];
        } else if (isDepRW === "2") {
            // 起降
            arr = ["1", "-1"];
        }
        return arr;
    }
    // 更新单条跑道状态复选框勾选数值
    @action updateSingleRunwayStatusChange(value, id) {
        //变更前数值 
        let oldValue = this.ruwayStatusSelectedData[id];
        // 变更前数值中包含关闭
        if (oldValue.includes("0")) {
            // 若变更前数值和变更后数值中都包含关闭
            if (value.includes("0")) {
                // 过滤变更后的数值，去掉勾选关闭选项
                let newValue = value.filter((item) => item !== "0");
                this.ruwayStatusSelectedData[id] = newValue;
            } else {
                // 反之直接使用变更后的数值
                this.ruwayStatusSelectedData[id] = value;
            }
        } else {
            // 变更前数值中不包含关闭且变更后的数值中包含关闭
            if (value.includes("0")) {
                // 只选中关闭选项
                this.ruwayStatusSelectedData[id] = ["0"];
            } else {
                // 反之直接使用变更后的数值
                this.ruwayStatusSelectedData[id] = value;
            }
        }
        this.updateRuwayStatusSelectedDataChangeCounter();
        // 依据状态变化更新航路点勾选中值

        this.updateAllRunwayPointChangeByStatusChange(oldValue, id)

    }

    // 更新单条跑道走廊口复选框勾选数值
    @action updateSingleRunwayPointChange(value, id) {
        
        
        // 跑道配置状态复选框被勾选数值
        let ruwayStatusSelectedData = { ... this.ruwayStatusSelectedData }
        // 跑道配置中航路点复选框被勾选数值
        let runwayPointSelectedData = { ... this.runwayPointSelectedData }

        //变更前数值 
        let oldValue = [...runwayPointSelectedData[id]];
        let len1 = oldValue.length;
        let len2 = value.length;
        // 增加勾选项
        if (len2 > len1) {
            let addValue = difference(value, oldValue);
            // 将其他跑道中含有增加勾选项的跑道数据移除应该项
            let newData = this.getRemoveValue(runwayPointSelectedData, addValue, id);
            // 更新本跑道变更后的数值
            newData = {
                ...newData,
                [id]: value,
            }
            this.runwayPointSelectedData = newData;
        } else if (len2 < len1) {
            // 取消勾选项
            // 被取消项
            let removeValue = difference(oldValue, value);
            // 若被取消项中包含OTHER
            if (removeValue.includes("OTHER")) {
                // 跑道数大于1
                if (this.runwayNumber > 1) {
                    // 其他跑道是否选中起飞状态
                    let otherRunwayIsIncludesDep = this.checkOtherRunwayIsIncludesDep(ruwayStatusSelectedData, id);
                    // 其他跑道未选中起飞状态
                    if (!otherRunwayIsIncludesDep) {
                        // 使用取消勾选前的数值，即不取消本跑道的OTHER勾选
                        runwayPointSelectedData = {
                            ...runwayPointSelectedData,
                            [id]: oldValue
                        }
                        this.runwayPointSelectedData = runwayPointSelectedData;
                    } else {
                        // 其他跑道是否选中OTHER选项
                        let otherRunwayIsIncludesOTHERPoint = this.checkOtherRunwayIsIncludesOTHERPoint(runwayPointSelectedData, id);
                        // 其他跑道已选中OTHER选项
                        if (otherRunwayIsIncludesOTHERPoint) {
                            // 使用取消勾选前的数值，即不取消本跑道的OTHER勾选
                            runwayPointSelectedData = {
                                ...runwayPointSelectedData,
                                [id]: oldValue
                            }
                            this.runwayPointSelectedData = runwayPointSelectedData;
                        }else {
                            // 其他跑道未选中OTHER选项
                            let allRunwayIds = Object.keys(runwayPointSelectedData);
                            let otherRunwayIds = difference(allRunwayIds, [id.toString()]);
                            let oneOtherRunwayId = otherRunwayIds[0];
                            let oneOtherRunwayPointSelectedData = runwayPointSelectedData[oneOtherRunwayId];
                            runwayPointSelectedData = {
                                ...runwayPointSelectedData,
                                [id]: value,
                                [oneOtherRunwayId]: [... oneOtherRunwayPointSelectedData, "OTHER"]
                            }
                            this.runwayPointSelectedData = runwayPointSelectedData;

                        }

                    }
                } else {
                    // 单条跑道，使用取消勾选前的数值，即不取消OTHER勾选
                    runwayPointSelectedData = {
                        ...runwayPointSelectedData,
                        [id]: oldValue
                    }
                    this.runwayPointSelectedData = runwayPointSelectedData;
                }
            } else {
                // 更新本跑道变更后的数值
                runwayPointSelectedData = {
                    ...runwayPointSelectedData,
                    [id]: value
                }
                this.runwayPointSelectedData = runwayPointSelectedData;
            }
        }
        this.updateRuwayPointSelectedDataChangeCounter();
    }

    // 依据状态变化更新航路点勾选中值
    @action updateAllRunwayPointChangeByStatusChange(oldValue, id){
        // 跑道配置状态复选框被勾选数值
        let ruwayStatusSelectedData = { ... this.ruwayStatusSelectedData }
        // 本跑道状态当前勾选的数值
        let currentValue = [... ruwayStatusSelectedData[id ]];
    
        // 其他跑道是否选中起飞状态
        let otherRunwayIsIncludesDep = this.checkOtherRunwayIsIncludesDep(ruwayStatusSelectedData, id);
        // 状态值变更前数值不包含起飞且当前状态勾选的数值包含起飞且其他跑道未选中起飞
        if(!oldValue.includes("1") && currentValue.includes("1") && !otherRunwayIsIncludesDep){
            // 把本跑道所有航路点勾选并将其他跑道的航路点清空勾选
            let newPointSelectedData = this.setSingleRunwayALLPointSelected(id);
            this.runwayPointSelectedData = newPointSelectedData;
        }else if( !currentValue.includes("1")){
            // 当前状态勾选数值不包含起飞则清空当前跑道航点勾选
            let newPointSelectedData = this.clearSingleRunwayPointSelected(id);
            this.runwayPointSelectedData = newPointSelectedData;
            // 其他跑道有选中起飞状态
            if(otherRunwayIsIncludesDep){
                
                let newPointSelectedData = this.updateOtherRunwayPointSelected(id);
                this.runwayPointSelectedData = newPointSelectedData;
            }

        }
        this.updateRuwayPointSelectedDataChangeCounter();
    }

    @action updateRuwayStatusSelectedDataChangeCounter() {
        let t = this.ruwayStatusSelectedDataChangeCounter + 1;
        this.ruwayStatusSelectedDataChangeCounter = t;
    }

    @action updateRuwayPointSelectedDataChangeCounter() {
        let t = this.runwayPointSelectedDataChangeCounter + 1;
        this.runwayPointSelectedDataChangeCounter = t;
    }

    // 获取各跑道航路点勾选数值
    @action getRuwayPointSelectedData() {
        let data = {};
        for (let i = 0; i < this.runwayNumber; i++) {
            let singleRunwayData = this.listRWGapInfo[i] || {};
            let id = singleRunwayData.id;
            let wayPoint = singleRunwayData.wayPoint;
            let points = isValidVariable(wayPoint) ? wayPoint.split(',') : [];
            data[id] = points;
        }
        return data;
    }

     // 把除指定id外的跑道航路点数据中取消指定选项勾选
     @action getRemoveValue (runwayPointSelectedData, value, exemptionId) {
        let obj = { ...runwayPointSelectedData };
        for (let i in obj) {
            let data = [...obj[i]];
            if (i == exemptionId) {
                continue;
            } else {
                let newValue = difference(data, value);
                obj[i] = newValue;
            }
        }
        return obj;

    }

    // 检查除指定id外的跑道是否勾选了起飞选项
    @action  checkOtherRunwayIsIncludesDep  (ruwayStatusSelectedData, exemptionId) {
        let statusSelectedData = { ...ruwayStatusSelectedData };
        for (let i in statusSelectedData) {
            if (i == exemptionId) {
                continue;
            }
            let singleRunwayStatusSelectedData = [...statusSelectedData[i]];
            if (singleRunwayStatusSelectedData.includes("1")) {
                return true;
            }
        }
        return false
    }

    // 检查除指定id外的跑道是否勾选了"OTHER"选项
    @action checkOtherRunwayIsIncludesOTHERPoint  (runwayPointSelectedData, exemptionId) {
        let pointSelectedData = { ...runwayPointSelectedData };
        for (let i in pointSelectedData) {
            if (i == exemptionId) {
                continue;
            }
            let singleRunwayPointSelectedData = [...pointSelectedData[i]];
            if (singleRunwayPointSelectedData.includes("OTHER")) {
                return true;
            }
        }
        return false
    }
    // 将指定某条跑道下所有航路点勾选并将其他跑道的航路点清空勾选
    @action setSingleRunwayALLPointSelected  ( id){

        let pointSelectedData = { ...this.runwayPointSelectedData };
        let allPoint = this.allPoint;
        for (let i in pointSelectedData) {
            if (i == id) {
                pointSelectedData[i] = allPoint;
            }else {
                pointSelectedData[i] = [];
            }
        }
        return pointSelectedData;

    }
    // 清空指定某条跑道下航点勾选状态
    @action clearSingleRunwayPointSelected  (id){
        let pointSelectedData = { ...this.runwayPointSelectedData };
        for (let i in pointSelectedData) {
            if (i == id) {
                pointSelectedData[i] = [];
            }
        }
        return pointSelectedData;
    }
    // 更新除指定跑道外的跑道走廊口勾选状态
    @action updateOtherRunwayPointSelected  (id){
        let pointSelectedData = { ...this.runwayPointSelectedData };
        let allPoint = this.allPoint;
        // 两跑道
        if(this.runwayNumber == 2){
            for (let i in pointSelectedData) {
                if (i == id) {
                    continue;
                }else {
                    pointSelectedData[i] = [... allPoint]
                }
            }
        }else if(this.runwayNumber > 2){
            // 其他跑道是否选中OTHER选项
            let otherRunwayIsIncludesOTHERPoint = this.checkOtherRunwayIsIncludesOTHERPoint(pointSelectedData, id);
            // 其他跑道已选中OTHER选项
            if (otherRunwayIsIncludesOTHERPoint) {
                return pointSelectedData;
            }else {
                // 其他跑道未选中OTHER选项
                let allRunwayIds = Object.keys(pointSelectedData);
                let otherRunwayIds = difference(allRunwayIds, [id.toString()]);
                // 取其他跑道中任一跑道id
                let oneOtherRunwayId = otherRunwayIds[0];
                let oneOtherRunwayPointSelectedData = pointSelectedData[oneOtherRunwayId];
                pointSelectedData = {
                    ...pointSelectedData,
                    [oneOtherRunwayId]: [... oneOtherRunwayPointSelectedData, "OTHER"] // 将此跑道的航路点增加"OTHER"勾选
                }
            }
        }
        
        return pointSelectedData;
    }
    

}

let RunwayDynamicPublishFormData = new RunwayDynamicPublishForm();

export { RunwayDynamicPublishFormData }