/*
 * @Author: your name
 * @Date: 2020-12-16 18:31:44
 * @LastEditTime: 2020-12-17 09:42:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\components\TimeLineFlight\TimeLineHeader.jsx
 */
import React, {useState} from 'react'
import {getFullTime, getDayTimeFromString, addStringTime } from '../../utils/basic-verify'

function TimeLineHeader(props){
    let now = new Date();
    now = getFullTime(now);
    let [standardTime, setStandardTime] = useState(now)

    const setTimeRange = ( type ) => {
        if( type === "reset" ){
            let now = new Date();
            now = getFullTime(now);
            setStandardTime( now  )
        }else{
            setStandardTime( addStringTime(standardTime, 60*60*1000 * (type*1))  )
        }
        
    }

    return(
        <div className="filter_header">
                    <span className="unit_name">ZLXY</span>
                    <span>
                        <div className="filter_dom condition">过滤条件</div>
                        <div className="filter_dom restriction">流控限制</div>
                    </span>
                    <div>
                        <div className="unit_time">{getDayTimeFromString(standardTime, true)}</div>
                        <div className="unit_time">{getDayTimeFromString( addStringTime(standardTime, 60*60*1000), true )}</div>
                    </div>
                    <div>
                        <div className="unit_hour left" onClick={()=>{ setTimeRange("-1") }}><i className="iconfont icon-shangyibu"></i></div>
                        <div className="unit_hour" onClick={()=>{ setTimeRange("-1") }} >-1h</div>
                        <div className="unit_hour" onClick={()=>{ setTimeRange("reset") }}>重置</div>
                        <div className="unit_hour" onClick={()=>{ setTimeRange("1") }}>+1h</div>
                        <div className="unit_hour" onClick={()=>{ setTimeRange("2") }}>+2h</div>
                        <div className="unit_hour" onClick={()=>{ setTimeRange("4") }}>+4h</div>
                        <div className="unit_hour right" onClick={()=>{ setTimeRange("1") }}><i className="iconfont icon-xiayibu"></i></div>
                    </div>
                </div>
    )
}

export default TimeLineHeader 


