/* 
* 模拟状态的方案详情显示页面
*/
import React , {useEffect, useState}from "react";
import { request } from 'utils/request'
import { ReqUrls } from 'utils/request-urls'
import SchemeForm from 'components/RestrictionForm/SchemeForm'

import { customNotice } from 'utils/common-funcs'
import { withRouter } from 'react-router-dom'

import { inject, observer } from "mobx-react";



function DisplaySimulationSchemeDetailPage(props){
    console.log(111);
    //  方案数据
    // let [flowData, setFlowData] = useState({});
    //  方案表单禁用状态
    let [ disabledForm, setDisabledForm] = useState(true);

    //更新方案数据
    const updateSchemeData = data => {
        
        const sourceType = data.tacticProcessInfo.basicTacticInfo.sourceType
        const tacticOriginalSource = data.tacticProcessInfo.basicTacticInfo.tacticOriginalSource
        // let {  status } = data;
        // setFlowData(data);
        // 更新方案表单store数据
        let tacticProcessInfo = data.tacticProcessInfo || {};
        props.schemeFormData.updateTacticPrimaryForward(sourceType)
        props.schemeFormData.updatePrimaryUnit(tacticOriginalSource)
        props.schemeFormData.updateSchemeData(tacticProcessInfo);
    };

    // 请求方案数据失败
    const requestErr = (err, content) => {
        customNotice({
            type: 'error',
            message: content
        })
    };

    // 请求方案数据
    const requestSchemeData = () => {
        // 获取方案ID
        let schemeID = props.location.search.replace(/\?/g, "");
        // 请求参数
        const opt = {
            url: ReqUrls.simulationSchemeDetailUrl + schemeID,
            method:'GET',
            params:{},
            resFunc: (data)=> updateSchemeData(data),
            errFunc: (err)=> requestErr(err, '方案数据获取失败' ),
        };
        // 发送请求
        request(opt);
    };

    useEffect(() => {
        // 请求方案数据
        requestSchemeData();
    }, []);

    return (
        <div className="modify-scheme-container">
            <div className="content">
                
                <SchemeForm
                disabledForm = {disabledForm}
                setDisabledForm = {setDisabledForm}
                ></SchemeForm>
            </div>
        </div>
    )
}
// export default DisplaySimulationSchemeDetailPage;
export default inject("schemeFormData", "systemPage")(observer(DisplaySimulationSchemeDetailPage))
