/*
 * @Author: your name
 * @Date: 2020-12-21 18:41:43
 * @LastEditTime: 2020-12-22 17:24:51
 * @LastEditors: Please set LastEditors
 * @Description: 页面相关store
 * @FilePath: \WN-CDM\src\stores\pageStores.jsx
 */
import { observable, action, computed, makeObservable } from 'mobx'
import { isValidVariable } from 'utils/basic-verify'

class SystemPage{
    constructor(){
        makeObservable(this)
    }
    //左上切换模块名称 执行kpi 豁免航班 等待池 特殊航班 失效航班 待办事项
    @observable leftActiveName = "kpi";
    //右侧切换模块名称 方案列表 外部流控
    @observable rightActiveName = "scheme";
    //左侧导航席位
    @observable xiwei = "";
    //左侧导航-时间范围
    @observable dateRange = "";
    //左上切换模块名称 执行kpi 豁免航班 等待池 特殊航班 失效航班 待办事项
    @action setLeftActiveName( name ){
        if( isValidVariable(name) ){
            this.leftActiveName = name;
        }
    }
    //右侧切换模块名称 方案列表 scheme 外部流控 outer_scheme
    @action setRightActiveName( name ){
        if( isValidVariable(name) ){
            this.rightActiveName = name;
        }
    }
    //左侧导航席位
    @action setXiwei( name ){
        if( isValidVariable(name) ){
            this.xiwei = name;
        }
    }
    //左侧导航-时间范围
    @action setDateRange( name ){
        if( isValidVariable(name) ){
            this.dateRange = name;
        }
    }
}

let systemPage = new SystemPage();

export { systemPage }