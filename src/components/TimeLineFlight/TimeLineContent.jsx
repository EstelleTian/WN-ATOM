/*
 * @Author: your name
 * @Date: 2020-12-16 15:05:48
 * @LastEditTime: 2020-12-16 19:05:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\components\TimeLineFlight\TimeLineContent.jsx
 */
import React from 'react'
import { inject, observer } from 'mobx-react'
import TimeLineFlight from './TimeLineFlight'

function TimeLineContent(props){
    const timeLineList = props.timeLineList;
    console.log(timeLineList);
    const hasActiveScheme = props.schemeListData.hasActiveScheme;

    let arr = [];
    if( hasActiveScheme ){
        arr = [1];
    }else{
        arr = Array.from({ length: 6}).fill(1)
    }
    return(
        <div className="timeline_dom">
            {
                arr.map(()=>
                    <TimeLineFlight />
                )
            }
        </div>
    )
    
}

export default inject("schemeListData", "timeLineList")(observer(TimeLineContent))
