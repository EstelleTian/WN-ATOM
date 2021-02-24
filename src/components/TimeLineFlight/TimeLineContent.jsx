/*
 * @Author: your name
 * @Date: 2020-12-16 15:05:48
 * @LastEditTime: 2021-02-24 13:03:37
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
    const activeSchemeId = props.schemeListData.activeSchemeId;

    let arr = [];
    if( activeSchemeId !== "" ){
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
