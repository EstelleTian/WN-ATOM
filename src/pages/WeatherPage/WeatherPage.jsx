import React,{useEffect, useState} from 'react';
import './WeatherPage.scss'
import { request } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import { inject, observer } from "mobx-react";
import { isValidVariable, isValidObject} from 'utils/basic-verify';
import { Tabs, Tooltip, Modal  } from 'antd';
import FeHelper from './FeHelper.js';
function WeatherPage(props) {
    const [isData, getIsData] = useState()

    const { TabPane } = Tabs;

    // const datass = (data)=>{
    //     let arr = []
    //     FeHelper.data.map((item,index)=>{
    //         if ((index+1)%2 === 0) {
    //             console.log(item.rno);
    //         }
    //         let obj= {}
    //         obj.rno = item.rno
    //         obj.rvr1a = item.tdzRvr1a
    //         obj.wd10a = item.tdzWindF10
    //         obj.wd10as = item.tdzWindD10
    //         obj.tains = item.tdzTemp
    //         obj.cloud = item.tdzCloudBase
    //         obj.rhins = item.tdzHumid
    //         arr.push(obj)
    //     })
    //     getIsData(arr)
    //     // console.log(arr);
    //     console.log(FeHelper);
    // } 
    // //获取配置数据
    // const getData = () => {
    //     const opt = {
    //         url: ReqUrls.TimeslotSwitchingUrl  + 'ZLXY',
    //         method: "GET",
    //         resFunc: (data) => datass(data),
    //         errFunc: (err) => fetchErr(err),
    //     };
    //     request(opt);
    // };
    // //数据获取失败回调
    // const fetchErr = (err) => {
    //     let errMsg = "";
    //     if (isValidObject(err) && isValidVariable(err.message)) {
    //         errMsg = err.message;
    //     } else if (isValidVariable(err)) {
    //         errMsg = err;
    //     }
    //     Modal.error({
    //         title: "获取失败",
    //         content: (
    //             <span>
    //                 <span>获取跑道配置数据失败</span>
    //                 <br />
    //                 <span>{errMsg}</span>
    //             </span>
    //         ),
    //         centered: true,
    //         okText: "确定",
    //     });
    // };

    
    // useEffect(()=>{
    //     getData()
    // },[])
    return (
        <div className='Weather'>
            <div className='WeatherPageBox'>
                {
                    FeHelper.data.map((item,index)=>{
                        return(
                        <div className='WeatherPage_item' key={index}>
                            <div className='WeatherPage_Title'>{item.rno}</div>
                                <div className='WeatherPage_Angle'></div>
                                <div className='WeatherPage_Information'>
                                    <div className='InformationItem'>
                                        <span className='ItemLeft'>RVR 1A</span>
                                        <Tooltip title="RVR 1A">
                                            <span className='ItemRight'>P{item.tdzRvr1a}m</span>
                                        </Tooltip>
                                    </div>
                                    <div className='InformationItem'>
                                        <span className='ItemLeft'>Wind 10A</span>
                                        <Tooltip title="Wind 10A">
                                            <span className='ItemRight'>{item.tdzWindF10}m/s {item.tdzWindD10}°</span>
                                        </Tooltip>  
                                    </div>
                                    <div className='InformationItem'>
                                        <span className='ItemLeft'>TEMP</span> 
                                        <Tooltip title="TEMP">
                                            <span className='ItemRight'>{item.tdzTemp}℃</span>
                                        </Tooltip> 
                                    </div>
                                    <div className='InformationItem'>
                                        <span className='ItemLeft'>Cloud HL</span>
                                        <Tooltip title="Cloud HL">
                                            <span className='ItemRight'>{item.tdzCloudBase}m</span>
                                        </Tooltip>  
                                    </div>
                                    <div className='InformationItem'>
                                        <span className='ItemLeft'>RH</span>
                                        <Tooltip title="RH">
                                            <span className='ItemRight'>{item.tdzHumid}%</span>
                                        </Tooltip>  
                                    </div>
                                </div>
                        </div>  
                        )
                    })
                }
            </div>
        </div>
    );
}

export default inject("systemPage")(observer(WeatherPage));