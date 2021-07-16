import React, { Fragment, useEffect } from 'react'
import { inject, observer } from "mobx-react";
import { isValidVariable, isValidObject } from 'utils/basic-verify';
import { request } from 'utils/request'
import { ReqUrls } from "utils/request-urls";


//方案特殊区域机场数据(兰州、西安)初始化组件
function TacticSpecialAreaAirportInit(props) {

    const { schemeFormData, pageType, systemPage } = props;
    // 用户信息
    const user = systemPage.user || {};
    // 用户机场 
    const region = user.region || ""; 

    // 初始化获取数据
    useEffect(() => {
        // 请求区域机场数据
        requeSpecialAreaAirportData();
    }, []);
    //更新方案区域机场基础数据
    const updateSpecialAreaAirportData = data => {
        if (isValidObject(data) && isValidObject(data.result)) {
            schemeFormData.updateSpecialAreaAirportData(data.result);
        }else {
            schemeFormData.updateSpecialAreaAirportData({})
        }
    };
    // 请求交通流快捷录入表单依赖数据失败
    const requestErr = (err, content) => {
        // let errMsg = ""
        // if (isValidObject(err) && isValidVariable(err.message)) {
        //     errMsg = err.message;
        // } else if (isValidVariable(err)) {
        //     errMsg = err;
        // }
        // customNotice({
        //     type: 'error',
        //     message: <div>
        //         < p>{`${content}`}</p>
        //         <p>{errMsg}</p>
        //     </div>
        // })
    };


    // 请求数据
    const requeSpecialAreaAirportData = () => {
        // 请求参数
        const opt = {
            url: ReqUrls.schemeTemplateDataUrl+"retrieveAirportTemplate/all?type=TemplateZLAirport",
            method: 'GET',
            params: {},
            resFunc: (data) => updateSpecialAreaAirportData(data),
            errFunc: (err) => requestErr(err, ''),
        };
        // 发送请求
        request(opt);
    };
    
    return (
        <Fragment>
        </Fragment>
    )
}
export default inject("schemeFormData", "systemPage")(observer(TacticSpecialAreaAirportInit));
