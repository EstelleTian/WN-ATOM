import React, { Fragment, useEffect } from 'react'
import { inject, observer } from "mobx-react";
import { isValidVariable, isValidObject } from 'utils/basic-verify';
import { request } from 'utils/request'
import { customNotice } from 'utils/common-funcs'
import { ReqUrls } from "utils/request-urls";

//方案区域省份机场数据初始化组件
function TacticAreaProvinceAirportInit(props) {

    const { schemeFormData, systemPage } = props;
    // 用户信息
    const user = systemPage.user || {};
    // 用户机场 
    const region = user.region || ""; 

    // 初始化获取数据
    useEffect(() => {
        // 请求区域省份机场数据
        requeAreaProvinceAirportData();
    }, []);
    //更新区域省份基础数据
    const updateAreaAirportData = data => {
        if (isValidObject(data) && isValidObject(data.result)) {
            schemeFormData.updateAreaProvinceAirportData(data.result);
        }else {
            schemeFormData.updateAreaProvinceAirportData({})
            customNotice({
                type: 'error',
                message: <div>
                    <p>获取到的区域省份机场数据为空</p>
                </div>
            })
        }
    };
    // 请求数据失败
    const requestErr = (err, content) => {
        let errMsg = ""
        if (isValidObject(err) && isValidVariable(err.message)) {
            errMsg = err.message;
        } else if (isValidVariable(err)) {
            errMsg = err;
        }
        customNotice({
            type: 'error',
            message: <div>
                < p>{`${content}`}</p>
                <p>{errMsg}</p>
            </div>
        })
    };


    // 请求数据
    const requeAreaProvinceAirportData = () => {
        // 请求参数
        const opt = {
            url: ReqUrls.schemeTemplateDataUrl+'retrieveAirportTemplate/all',
            method: 'GET',
            params: {},
            resFunc: (data) => updateAreaAirportData(data),
            errFunc: (err) => requestErr(err, '区域省份机场数据获取失败'),
        };
        // 发送请求
        request(opt);
    };
    
    return (
        <Fragment>
        </Fragment>
    )
}
export default inject("schemeFormData", "systemPage")(observer(TacticAreaProvinceAirportInit));
