/*
 * @Author: your name
 * @Date: 2020-12-14 10:18:25
 * @LastEditTime: 2020-12-22 19:24:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\stores\FlightStores.jsx
 */

import { makeObservable, observable, action, computed } from 'mobx'

// 单条航班对象
class FlightItem{
    // 航班id
    @observable id = ""
     // 航班选中状态
     @observable selected = false
    constructor( opt ){
        makeObservable(this)
        for( let key in opt ){
            this[key] = opt[key]
        }
        this.selected = false
    }
    // 航班数据更新
    @action update( opt ){
        for( let key in opt ){
            if( this.hasOwnProperty(key) ){
                this[key] = opt[key]
            }
        }
    }
    // 航班状态切换
    @action toggleSelected( ){
        this.selected = !this.selected;
    }

}
 // 航班表格数据
class FlightTableData{
    constructor(){
        makeObservable(this)
    }
    // 列表
    @observable list = [];
    //数据时间
    @observable generateTime = "";

    // 增加航班-单条
    @action addFlight( opt ){
        const item = new FlightItem(opt);
        this.list.unshift( item );
    }
    // 增加航班-多条
    @action addMultiFlight( arr ){
        arr.map( opt => {
            const item = new FlightItem(opt);
            this.list.unshift( item );
        })
    }
    // 删除航班
    @action delFlight( FlightItem ){
        this.list.remove( FlightItem );
    }
    @action update( opt ){
        const item = new FlightItem(opt);

        const list = this.list.filter((flight, index)=> opt.id);
        console.log(list);
        list.map((flight, index) => {
           this.list.splice()
        });

        this.list.unshift( item );
    }

    @action updateList( arr, generateTime ){
        this.list = arr;
        this.generateTime = generateTime;
        // const len = this.list.length;
        // arr.map( item => {
        //     const id = item.id;
        //     //检验list有没有同id的航班
        //     let hasFlight = this.list.filter( todo => id === todo.id).length === 0 ? false : true;
        //
        //     //没有同id的就添加一条
        //     if( len === 0 || hasFlight === false ){
        //         const itemIns = new FlightItem(item);
        //         this.list.unshift( itemIns );
        //     }else{
        //         //有同id的 更新数据
        //         this.list.filter( (flight, index)=> {
        //             if(flight.id == item.id){
        //                 const itemIns = new FlightItem(item);
        //                 this.list.splice(index, 1, itemIns);
        //             }
        //         });
        //
        //     }
        //
        // })
    }

    

}

let flightTableData = new FlightTableData();


export { flightTableData }