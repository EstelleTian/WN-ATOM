/*
 * @Author: your name
 * @Date: 2021-01-26 14:31:45
 * @LastEditTime: 2021-01-27 10:29:54
 * @LastEditors: Please set LastEditors
 * @Description: 容量管理store
 * @FilePath: \WN-ATOM\src\stores\capacityStores.jsx
 */

import { observable, action, computed, makeObservable } from 'mobx'
import { isValidVariable } from 'utils/basic-verify'

 class Capacity{
     constructor(){
        makeObservable(this);
     }
     @observable panes = [
         {
            title: "ZLXY-西安/咸阳",
            key: "ZLXY",
            type: "airport",
            active: true
         }
     ];

     //添加pane
     @action setPane(title, key, type){
        this.panes.map( pane => {
            pane.active = false;
        })

         let obj = {
            title,
            key,
            type,
            active: true
          }
        this.panes.push(obj);
     }
     
     //删除pane
     @action delPane(key){
        this.panes = this.panes.filter( pane => {
            return pane.key !== key;
        })
     }

     //更新pane 激活状态
     @action activePane(key){
        this.panes.map( pane => {
            if( key === pane.key ){
                pane.active = true;
            }else{
                pane.active = false;
            }
        })
     }

     //更新pane 激活状态
     @computed get getActivePane(){
        let res = [];
        this.panes.map( pane => {
            if( pane.active ){
                res.push(pane);
            }
        })
        return res;
     }

     



     
 }

 const capacity = new Capacity();

 export { capacity }