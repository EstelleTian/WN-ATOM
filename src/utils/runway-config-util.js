import { isValidObject, isValidVariable } from './basic-verify';
/**
 * 跑道通用方法
 */
const RunwayConfigUtil = {
    // 默认跑道
    TYPE_DEFAULT: "DEFAULT",
    // 动态跑道
    TYPE_DYNAMIC: "DYNAMIC",
    // 定期跑道
    TYPE_REGULAR: "REGULAR",
    // 正在执行
    EXECUTION_STATUS_EXECUTING: "EXECUTING",
    // 将要执行
    EXECUTION_STATUS_FUTURE: "FUTURE",
    // 人工终止
    EXECUTION_STATUS_TERMINATED_MANUAL: "TERMINATED_MANUAL",
    // 正常结束
    EXECUTION_STATUS_FINISHED: "FINISHED",
    // 动态范围外使用
    EXECUTION_STATUS_OUT_OF_DYNAMIC_RANGE_EXECUTING: "OUT_OF_DYNAMIC_RANGE_EXECUTING",
    


    



    /**
     * 获取跑道使用状态
     *
     * @param runwayData 跑道数据
     * @param type 跑道类型
     * @returns 状态
     */
     getRunwayTypeZh : function ( type ) {
        let typeZh="";
        if(type === this.TYPE_DEFAULT){
            typeZh ="默认"
        } else if( type === this.TYPE_DYNAMIC){
            typeZh ="动态"
        }
        return typeZh;
    },

    /**
     * 获取跑道执行状态
     *
     * @param runwayData 跑道数据
     * @param type 跑道类型
     * @returns 状态
     */
     getExecutionStatus : function (runwayData, type ) {
        let status="";
        let isExecuting = runwayData.isExecuting || "";
        isExecuting = isExecuting.toString();

        if(type === this.TYPE_DEFAULT){
            status = isExecuting === "1" ? this.EXECUTION_STATUS_EXECUTING : this.EXECUTION_STATUS_OUT_OF_DYNAMIC_RANGE_EXECUTING
        }else if( type === this.TYPE_DYNAMIC){
            if(isExecuting === "1"){
                status = this.EXECUTION_STATUS_EXECUTING 
            } else if(isExecuting === "2"){
                status = this.EXECUTION_STATUS_FUTURE 
            } else if(isExecuting === "3"){
                status = this.EXECUTION_STATUS_TERMINATED_MANUAL
            } else if(isExecuting === "4"){
                status = this.EXECUTION_STATUS_FINISHED
            }
        }
        return status;
    },

    /**
     * 获取跑道执行状态
     *
     * @param runwayData 跑道数据
     * @param type 跑道类型
     * @returns 状态
     */
    getExecutionStatusZH : function (runwayData, type ) {
        let status="";
        let isExecuting = runwayData.isExecuting || "";
        isExecuting = isExecuting.toString();
        if(type === this.TYPE_DEFAULT){
            status = isExecuting === "1" ? "正在使用" : "动态范围外使用"
        }else if( type === this.TYPE_DYNAMIC){
            if(isExecuting === "1"){
                status = "正在使用"
            } else if(isExecuting === "2"){
                status = "将要使用"
            } else if(isExecuting === "3"){
                status = "人工终止"
            } else if(isExecuting === "4"){
                status = "正常结束"
            }
        }
        return status;
    },

    /**
     * 获取跑道执行状态文字className
     *
     * @param runwayData 跑道数据
     * @param type 跑道类型
     * @returns className
     */
     getExecutionStatusClassName : function (runwayData, type ) {
        let classNameString="";
        let isExecuting = runwayData.isExecuting || "";
        isExecuting = isExecuting.toString();

        if(type === this.TYPE_DEFAULT){
            classNameString = isExecuting === "1" ? this.EXECUTION_STATUS_EXECUTING : this.EXECUTION_STATUS_OUT_OF_DYNAMIC_RANGE_EXECUTING
        }else if( type === this.TYPE_DYNAMIC){
            if(isExecuting === "1"){
                classNameString = this.EXECUTION_STATUS_EXECUTING 
            } else if(isExecuting === "2"){
                classNameString = this.EXECUTION_STATUS_FUTURE 
            } else if(isExecuting === "3"){
                classNameString = this.EXECUTION_STATUS_TERMINATED_MANUAL
            } else if(isExecuting === "4"){
                classNameString = this.EXECUTION_STATUS_FINISHED
            }
        }
        return classNameString;
    },
};

export { RunwayConfigUtil };