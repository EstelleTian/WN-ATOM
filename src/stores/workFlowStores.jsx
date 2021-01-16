/*
 * @Author: your name
 * @Date: 2020-12-14 10:18:25
 * @LastEditTime: 2020-12-24 19:07:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\stores\schemeStores.jsx
 */

import { makeObservable, observable, action, computed } from 'mobx'
import { isValidVariable } from 'utils/basic-verify'

// 单条方案对象
class SchemeItem{
    // 方案id
    @observable id = ""
    // 方案选中状态
    @observable active = false
    constructor( opt ){
        makeObservable(this)
        for( let key in opt ){
            this[key] = opt[key]
        }
        this.active = false
    }
    // 方案数据更新
    @action update( opt ){
        for( let key in opt ){
            if( this.hasOwnProperty(key) ){
                this[key] = opt[key]
            }
        }
    }
    // 方案状态激活
    @action toggleActive( flag ){
        this.active = flag;
    }

}
 // 方案列表数据
class SchemeListData{
    constructor(){
        makeObservable(this)
    }
    // 方案列表
    @observable list = [];
    //数据时间
    @observable generateTime = "";
    //方案id
    @observable schemeId = "";
    //定时器
    @observable timeoutId = "";
    //方案状态
    @observable statusValues = ['FUTURE','RUNNING'];
    //数据获取
    @observable loading = false;
    //更新表格loading状态
    @action toggleLoad( load ){
        this.loading = load;
    }
    //更新表格loading状态
    @action setStatusValues( values ){
        this.statusValues = values;
    }
    // 增加方案-单条
    @action addScheme( opt ){
        const item = new SchemeItem(opt);
        this.list.unshift( item );
    }
    // 增加方案-多条
    @action addMultiScheme( arr ){
        arr.map( opt => {
            const item = new SchemeItem(opt);
            this.list.unshift( item );
        })
    }
    // 删除方案
    @action delScheme( schemeItem ){
        this.list.remove( schemeItem );
    }
    // 更新方案-全部
    @action updateList( arr, generateTime){
        this.list = [];
        arr.map( item => {
            const itemIns = new SchemeItem(item);
            if( item.id === this.schemeId){
                itemIns.active = true;
            }
            this.list.push( itemIns );

        });
        this.generateTime = generateTime;
    }

    // 更新方案-多条
    @action updateList2( arr ){
        const len = this.list.length;
        arr.map( item => {
            const id = item.id;
            //检验list有没有同id的方案
            let sameScheme = this.list.filter( todo => id === todo.id);
            let hasScheme = sameScheme.length === 0 ? false : true;

            //没有同id的就添加一条
            if( len === 0 || hasScheme === false ){
                const itemIns = new SchemeItem(item);
                this.list.push( itemIns );
            }else{
                //有同id的 更新数据
                sameScheme.map( orgScheme => {
                    orgScheme.update(item);
                })

            }
            
        })
    }
    //查找有没有激活的方案
    @computed get hasActiveScheme(){
        let len = this.list.filter( todo => todo.active).length;
        if( len > 0 ){
            return true
        }else{
            return false
        }
    } 
    //查找激活方案
    @computed get activeScheme(){
        let active = {};
        let activeList = this.list.filter( todo => todo.active );
        if( activeList.length > 0 ){
            active = activeList[0];
        }
        return active;
    }
    //激活选中方案，重置其他方案
    @action toggleSchemeActive( id ){
        // console.log(id)
        let res = false;
        this.list.map( todo => {
            const todoid = todo.id;
            if( id === todoid ){
                todo.toggleActive( true );
                this.schemeId = id;
                res = true;
            }else{
                todo.toggleActive( false );
            }
        } );
        return res;
    }

    @computed get sortedList(){
        if( this.list.length > 0 ){
            let newList = this.list.slice() .sort( (a,b) => {
                const data1 = a.tacticTimeInfo.publishTime;
                const data2 = b.tacticTimeInfo.publishTime;
                if (isValidVariable(data1) && isValidVariable(data2)) {
                    let res = data1.localeCompare(data2);
                    if (0 !== res) {
                        return res*(-1);
                    }
                } else if (isValidVariable(data1)) {
                    return -1;
                } else if (isValidVariable(data2)) {
                    return 1;
                }
                return 0;
            })
            return newList
        }else{
            return this.list;
        }

    }
}

let schemeListData = new SchemeListData();

export { schemeListData }