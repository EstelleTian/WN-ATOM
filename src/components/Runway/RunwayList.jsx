
import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react';
import debounce from 'lodash/debounce'
import { inject, observer } from 'mobx-react'
import { Checkbox, Empty, Spin, notification, Radio } from 'antd'
import { requestGet } from 'utils/request'
import { isValidVariable, isValidObject } from 'utils/basic-verify'
import { ReqUrls } from 'utils/request-urls'
import { customNotice } from 'utils/common-funcs'
import  RunwayItem  from "./RunwayItem";
import  RunwayListHeader  from "./RunwayListHeader";

import './RunwayList.scss'




const Filter = (props) => {
    const { runwayListData = {} } = props;
    const { filterKey="" } = runwayListData;
    // 过滤
    const handleFilter =(e)=> {
        const val = e.target.value;
        runwayListData.setFilterKey(val); 
    }
    return (
        <div className="runway-filter">
            <Radio.Group onChange={handleFilter} value={filterKey}>
                <Radio value="EFFECTIVE">正在生效</Radio>
                <Radio value="ALL">今日全部</Radio>
            </Radio.Group>
        </div>
    )
}
const FilterBar = inject("runwayListData")(observer(Filter))

//跑道列表
function List(props) {
    const { runwayListData, systemPage } = props;
    const {  loading } = runwayListData;
    const userId = systemPage.user.id || ""
    const sortedList = []

    useEffect(function(){
        // 初次获取数据启用loading
        // props.runwayListData.toggleLoad(true);
        // 获取数据
        // requestRunwayListDataData();
        // 清除定时
        // clearInterval(props.runwayListData.timeoutId);
        // 开启定时获取数据
        // props.runwayListData.timeoutId = setInterval(runwayListData, 60*1000);
        // return function(){
        //     clearInterval(props.runwayListData.timeoutId);
        //     props.runwayListData.timeoutId = "";
        // }
    },[props.systemPage.userId])
    return (
        <Spin spinning={loading} >
            <div className="list_container" >
            <RunwayListHeader />
                {
                    (sortedList.length > 0) ?
                        sortedList.map((item, index) => (
                            <RunwayItem
                                item={item}
                                key={index}
                                // toggleModalVisible={toggleModalVisible}
                                // toggleModalType={toggleModalType}
                            >
                            </RunwayItem>
                        )
                        ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} imageStyle={{ color: "#fff" }} />

                }
            </div>
        </Spin>
    )
}

const Runway = inject("runwayListData", "systemPage")(observer(List))

const RunwayList = () => {
    return (
        <div className="runway_list_canvas">
            <FilterBar />
            <Runway />
        </div>
    )
}
export default RunwayList