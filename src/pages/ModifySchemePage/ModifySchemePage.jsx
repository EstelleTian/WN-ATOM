import React , {useEffect, useState}from "react";
import { request } from 'utils/request'
import { ReqUrls } from 'utils/request-urls'
import RestrictionForm from 'components/RestrictionForm/RestrictionForm'
import { customNotice } from 'utils/common-funcs'


function ModifySchemePage(props){
    //  方案数据
    let [flowData, setFlowData] = useState({});
    //  方案表单禁用状态
    let [ disabledForm, setDisabledForm] = useState(true);

    //更新方案数据
    const updateSchemeData = data => {
        let {  status } = data;
        setFlowData(data);
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
                <RestrictionForm
                    operationType="MODIFYSIM" // MODIFYSIM:修改模拟方案
                    operationDescription="修改方案"
                    primaryButtonName="提交"
                    flowData = {flowData}
                    disabledForm = {disabledForm}
                    setDisabledForm = {setDisabledForm}
                    flowData={ flowData }
                    showEditBtn={true}
                    showIgnoreBtn={false}
                />
            </div>
        </div>
    )
}
export default ModifySchemePage;