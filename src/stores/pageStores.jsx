/*
 * @Author: your name
 * @Date: 2020-12-21 18:41:43
 * @LastEditTime: 2021-04-12 11:34:41
 * @LastEditors: Please set LastEditors
 * @Description: 页面相关store
 * @FilePath: \WN-CDM\src\stores\pageStores.jsx
 */
import { observable, action, computed, makeObservable } from 'mobx'
import { isValidVariable } from 'utils/basic-verify'

class UserInfo {
    constructor(opt) {
        makeObservable(this);
        for( let key in opt ){
            this[key] = opt[key];
        }
    }
    @observable id = "";

}

class SystemPage{
    constructor(){
        makeObservable(this)
    }
    //左上导航选中 模块名称
    @observable leftNavSelectedName = "";
    @observable leftNavNameList = [];
    //左上切换模块名称 执行kpi 
    @observable leftActiveName = "kpi";
    // @observable leftActiveName = "todo";
    //右侧切换模块名称 方案列表 外部流控
    @observable rightActiveName = "scheme";
    //右侧切换模块名称 豁免、等待池、特殊、失效、航班协调
    @observable modalActiveName = "";
    //左侧导航席位
    @observable xiwei = "";
    //左侧导航-时间范围
    @observable dateRange = "";
    //用户对象信息
    @observable user = {};
    //全局刷新按钮
    @observable pageRefresh = false;
    //左上导航选中 模块名称
    @action setLeftNavSelectedName( name ){
        this.leftNavSelectedName = name;
    }
    //左上切换模块名称 执行kpi 
    @action setLeftActiveName( name ){
        if( name === "" ){
            this.leftActiveName = name;
        }else if( isValidVariable(name) ){
            this.leftActiveName = name;
        }
    }
    //右侧切换模块名称 方案列表 scheme 外部流控 outer_scheme
    @action setRightActiveName( name ){
        if( isValidVariable(name) ){
            this.rightActiveName = name;
        }
    }
    //右侧切换模块名称 豁免、等待池、特殊、失效、航班协调
    @action setModalActiveName( name ){
        this.modalActiveName = name;
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
    //用户信息-赋值
    @action setUserData( user ){
        const userinfo = new UserInfo(user);
        this.user = userinfo;
    }

    //用户信息-赋值
    @action userHasAuth( authCode ){
        let flag = false;
        if( isValidVariable(this.user.id) ){
            const roles = this.user.roles || [];
            if( roles.length > 0 ){
                roles.map( role => {
                    if( !flag ){
                        const authorities = role.authorities || [];
                        if( authorities.length > 0 ){
                            authorities.map( authority => {
                                if( !flag ){
                                    const code = authority.code || "";
                                    if( authCode*1 > 0 && code*1 > 0 && authCode*1 === code*1 ){
                                        flag = true;
                                    }
                                }
                            })
                        }
                    }
                })
            }
        }
        return flag;
    }
}

let systemPage = new SystemPage();

export { systemPage }