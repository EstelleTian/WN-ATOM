/*
 * @Author: your name
 * @Date: 2021-03-03 20:22:17
 * @LastEditTime: 2021-04-13 10:35:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\NavBar\LeftBar.jsx
 */

import React, {useMemo}  from 'react'
import {observer, inject} from "mobx-react";
import { Radio } from 'antd'
import RefreshBtn from "components/SchemeList/RefreshBtn";

//顶部 左导航模块
function LeftNav(props){
    const groupNameChange = (e) => {
        const value = e.target.value;
        console.log(e.target.value);
        if( props.systemPage.leftNavSelectedName !== value ){
            props.systemPage.setLeftNavSelectedName(value);
            props.schemeListData.toggleSchemeActive(value);
        }else{
            props.systemPage.setLeftNavSelectedName("");
            props.schemeListData.toggleSchemeActive("");
        }
    }
    let userConcernTrafficListStr = localStorage.getItem("userConcernTrafficList");
    let userConcernTrafficList = useMemo( function(){
       let list = [];
       const arr = JSON.parse(userConcernTrafficListStr) || [];
       let idsList = [];
       let name = "";
       for(let i = 0; i < arr.length; i++){
           let item = arr[i] || {};
           if( item.concernStatus ){
                name = "focus-"+item.concernTrafficId || "";
                idsList.push( name );
                if(i===0){
                    props.systemPage.setLeftNavSelectedName(name);
                    props.schemeListData.toggleSchemeActive(name);  
                }
                
                list.push(item);  
            }
       }
        
        props.systemPage.leftNavNameList = idsList;
        return list
    }, [props.systemPage.user.id])
    return (
        <div className="layout-nav-left layout-row">
            {/*<div className="time-range">*/}
                <Radio.Group defaultValue="a" buttonStyle="solid"  >
                    <Radio.Button value="a">计划范围
                        {/*<Tag color="#3d8424">29/00-29/23</Tag>*/}
                        </Radio.Button>
                </Radio.Group>
            {/*</div>*/}
            {
                props.systemPage.userHasAuth( 12510 ) && <Radio.Group 
                    value={props.systemPage.leftNavSelectedName} 
                    buttonStyle="solid" 
                >
                    {
                        userConcernTrafficList.map( item => (
                            <Radio.Button 
                                key={item.concernTrafficName || ""} 
                                value={`focus-${item.concernTrafficId}`}
                                onClick={ groupNameChange } 
                            >
                                 {item.concernTrafficName}
                            </Radio.Button>
                        ))
                    }
                    
                </Radio.Group>
            }
            
            <Radio.Group  buttonStyle="solid">
                 <RefreshBtn />
            </Radio.Group>
        </div>
    )
}

export  default  inject("systemPage", "schemeListData")( observer(LeftNav))


