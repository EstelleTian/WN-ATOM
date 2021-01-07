
import React from "react";
import './CreateFlowPage.jsx'
import RestrictionForm from 'components/RestrictionForm/RestrictionForm'


function CreateFlowPage(props){
    return (
        <RestrictionForm showImportBtn={true} btnName="创建方案"/>
    )
}

export default CreateFlowPage;