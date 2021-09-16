import React, { useEffect, useState } from "react";
import { request } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import { isValidObject, isValidVariable } from "utils/basic-verify";
import SchemeForm from "components/RestrictionForm/SchemeForm";
import { inject, observer } from "mobx-react";
import { customNotice } from "utils/common-funcs";
/*
 * 依据模拟状态的方案创建方案页面
 */
function CreateSchemeBySimulationSchemePage(props) {
  //  方案表单禁用状态
  let [disabledForm, setDisabledForm] = useState(false);
  //更新方案数据
  const updateSchemeData = (data) => {
    // console.log(16,data.tacticProcessInfo.basicTacticInfo);
    const sourceType = data.tacticProcessInfo.basicTacticInfo.sourceType
    const tacticOriginalSource = data.tacticProcessInfo.basicTacticInfo.tacticOriginalSource
    // setFlowData(data);
    // 更新方案表单store数据
    let tacticProcessInfo = data.tacticProcessInfo || {};
    props.schemeFormData.updateTacticPrimaryForward(sourceType)
    props.schemeFormData.updatePrimaryUnit(tacticOriginalSource)
    props.schemeFormData.updateSchemeData(tacticProcessInfo);
  };

  // 请求方案数据失败
  const requestErr = (err, content) => {
    let errMsg = "";
    if (isValidObject(err) && isValidVariable(err.message)) {
      errMsg = err.message;
    } else if (isValidVariable(err)) {
      errMsg = err;
    }
    customNotice({
      type: "error",
      message: (
        <div>
          <p>{`${content}`}</p>
          <p>{errMsg}</p>
        </div>
      ),
    });
  };

  // 请求方案数据
  const requestSchemeData = () => {
    // 获取方案ID
    let schemeID = props.location.search.replace(/\?/g, "");
    // 请求参数
    const opt = {
      url: ReqUrls.simulationSchemeDetailUrl + schemeID,
      method: "GET",
      params: {},
      resFunc: (data) => updateSchemeData(data),
      errFunc: (err) => requestErr(err, "方案数据获取失败"),
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
          pageType="CREATEBYSIM" //依据已有模拟状态的方案创建方案
          operationDescription="创建方案"
          primaryButtonName="创建方案"
          disabledForm={disabledForm}
          setDisabledForm={setDisabledForm}
          showEditBtn={false}
          showIgnoreBtn={false}
        />
      </div>
    </div>
  );
}
export default inject(
  "schemeFormData",
  "systemPage"
)(observer(CreateSchemeBySimulationSchemePage));
