
import React from "react";
import './CreateFlowPage.jsx'
import RestrictionForm from 'components/RestrictionForm/RestrictionForm'
import SchemeForm from 'components/RestrictionForm/SchemeForm'
import './CreateFlowPage.scss'


function CreateFlowPage(props){

    return (
        <div className="create-flow-container">
            <div className="content">
                {/* <RestrictionForm
                    pageType="CREATE"
                    operationDescription="创建方案"
                    primaryButtonName="创建方案"
                /> */}
                <SchemeForm
                    pageType="CREATE"
                    operationDescription="创建方案"
                    primaryButtonName="创建方案"
                />
                
            </div>

        </div>

    )
}

export default CreateFlowPage;