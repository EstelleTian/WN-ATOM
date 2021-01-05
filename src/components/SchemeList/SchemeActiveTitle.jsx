import React from 'react'
import {inject, observer} from "mobx-react";
import { formatTimeString } from 'utils/basic-verify'

const SchemeTitle = function(props){
    const activeScheme = props.schemeListData.activeScheme || {};
    const generateTime = props.flightTableData.generateTime || "";
    return (
        <div className="left_top">
            <div>{ activeScheme.tacticName || ""}{ generateTime === "" ? "" : "(数据时间:"+ formatTimeString(generateTime) +")" }</div>
        </div>
    )
}

export default inject("schemeListData","flightTableData")(observer(SchemeTitle))