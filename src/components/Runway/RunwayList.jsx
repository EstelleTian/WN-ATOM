
import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react';
import debounce from 'lodash/debounce'
import { inject, observer } from 'mobx-react'
import {  Empty, Spin,  Radio } from 'antd'
import { request } from 'utils/request'
import {getFullTime, isValidVariable, isValidObject } from 'utils/basic-verify'
import { ReqUrls } from 'utils/request-urls'
import { customNotice } from 'utils/common-funcs'
import  RunwayItem  from "./RunwayItem";
import  RunwayListHeader  from "./RunwayListHeader";
import  RunwayModal  from "./RunwayModal";
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
    const { runwayListData, systemPage, toggleModalVisible, toggleModalType } = props;
    const { filterList, loading } = runwayListData;
    const userId = systemPage.user.id || ""
    const sortedList = filterList;

    //更新跑道列表数据
    const updateRunwayListData = data => {
        runwayListData.toggleLoad(false);
        const generateTime = data.generateTime || "";
        // let obj = {"ZLXY":{"rwGapDefaultMap":{"149796":[{"id":8825,"apName":"ZLXY","rwName":"05L/23R","logicRWDef":"05L","logicRWNameA":"05L","logicRWNameB":"23R","logicRWValueA":2.0,"logicRWTaxitimeA":5,"isDepRW":2,"wayPoint":"P17,P35,P54,NSH,SHX,WJC,TEBIB,OTHER","fromId":8801,"generateTime":"202103100251","startTime":"202103100251","endTime":"202103102359","groupId":149796,"type":1,"userName":"zlxydev","status":1,"isExecuting":2,"operationmode":200},{"id":8826,"apName":"ZLXY","rwName":"05R/23L","logicRWDef":"23L","logicRWNameA":"05R","logicRWNameB":"23L","logicRWValueA":12.0,"logicRWTaxitimeA":13,"isDepRW":0,"fromId":8802,"generateTime":"202103100251","startTime":"202103100251","endTime":"202103102359","groupId":149796,"type":1,"userName":"zlxydev","status":1,"isExecuting":2,"operationmode":200}]},"rwDynamicMap":{"149794":[{"id":8821,"apName":"ZLXY","rwName":"05L/23R","logicRWDef":"05L","logicRWNameA":"05L","logicRWNameB":"23R","logicRWValueA":1.0,"logicRWTaxitimeA":5,"isDepRW":1,"wayPoint":"P17,P35,P54,NSH,SHX,WJC,TEBIB,OTHER","generateTime":"202103100234","startTime":"202103100234","endTime":"202103101032","groupId":149794,"type":2,"userName":"zlxydev","status":1,"isExecuting":1,"operationmode":200},{"id":8822,"apName":"ZLXY","rwName":"05R/23L","logicRWDef":"23L","logicRWNameA":"05R","logicRWNameB":"23L","logicRWTaxitimeA":13,"isDepRW":-1,"generateTime":"202103100234","startTime":"202103100234","endTime":"202103101032","groupId":149794,"type":2,"userName":"zlxydev","status":1,"isExecuting":2,"operationmode":200}],"149795":[{"id":8823,"apName":"ZLXY","rwName":"05L/23R","logicRWDef":"23R","logicRWNameA":"05L","logicRWNameB":"23R","logicRWValueB":3.0,"logicRWTaxitimeA":5,"logicRWTaxitimeB":4,"isDepRW":2,"wayPoint":"P17,P35,P54,NSH,SHX,WJC,TEBIB,OTHER","generateTime":"202103100234","startTime":"202103101130","endTime":"202103101530","groupId":149795,"type":2,"userName":"zlxydev","status":1,"isExecuting":2,"operationmode":200},{"id":8824,"apName":"ZLXY","rwName":"05R/23L","logicRWDef":"05R","logicRWNameA":"05R","logicRWNameB":"23L","logicRWTaxitimeB":25,"isDepRW":-1,"generateTime":"202103100234","startTime":"202103101130","endTime":"202103101530","groupId":149795,"type":2,"userName":"zlxydev","status":1,"isExecuting":2,"operationmode":200}]},"rwGapDefaultMapTodayAll":{"149796":[{"id":8825,"apName":"ZLXY","rwName":"05L/23R","logicRWDef":"05L","logicRWNameA":"05L","logicRWNameB":"23R","logicRWValueA":2.0,"logicRWTaxitimeA":5,"isDepRW":2,"wayPoint":"P17,P35,P54,NSH,SHX,WJC,TEBIB,OTHER","fromId":8801,"generateTime":"202103100251","startTime":"202103100251","endTime":"202103102359","groupId":149796,"type":1,"userName":"zlxydev","status":1,"isExecuting":2,"operationmode":200},{"id":8826,"apName":"ZLXY","rwName":"05R/23L","logicRWDef":"23L","logicRWNameA":"05R","logicRWNameB":"23L","logicRWValueA":12.0,"logicRWTaxitimeA":13,"isDepRW":0,"fromId":8802,"generateTime":"202103100251","startTime":"202103100251","endTime":"202103102359","groupId":149796,"type":1,"userName":"zlxydev","status":1,"isExecuting":2,"operationmode":200}],"149750":[{"id":8801,"apName":"ZLXY","rwName":"05L/23R","logicRWDef":"05L","logicRWNameA":"05L","logicRWNameB":"23R","logicRWValueA":2.0,"logicRWTaxitimeA":5,"isDepRW":2,"wayPoint":"WJC,TEBIB","fromId":8781,"generateTime":"202103090000","startTime":"202103090000","endTime":"202103092359","groupId":149750,"type":1,"userName":"zlxydev","updateTime":"202103100250","status":0,"isExecuting":2,"operationmode":200},{"id":8802,"apName":"ZLXY","rwName":"05R/23L","logicRWDef":"23L","logicRWNameA":"05R","logicRWNameB":"23L","logicRWValueA":12.0,"logicRWValueB":2.0,"logicRWTaxitimeA":13,"logicRWTaxitimeB":25,"isDepRW":2,"wayPoint":"P17,P35,P54,NSH,SHX,OTHER","fromId":8782,"generateTime":"202103090000","startTime":"202103090000","endTime":"202103092359","groupId":149750,"type":1,"userName":"zlxydev","updateTime":"202103100250","status":0,"isExecuting":2,"operationmode":200}]},"rwDynamicMapTodayAll":{"149794":[{"id":8821,"apName":"ZLXY","rwName":"05L/23R","logicRWDef":"05L","logicRWNameA":"05L","logicRWNameB":"23R","logicRWValueA":1.0,"logicRWTaxitimeA":5,"isDepRW":1,"wayPoint":"P17,P35,P54,NSH,SHX,WJC,TEBIB,OTHER","generateTime":"202103100234","startTime":"202103100234","endTime":"202103101032","groupId":149794,"type":2,"userName":"zlxydev","status":1,"isExecuting":1,"operationmode":200},{"id":8822,"apName":"ZLXY","rwName":"05R/23L","logicRWDef":"23L","logicRWNameA":"05R","logicRWNameB":"23L","logicRWTaxitimeA":13,"isDepRW":-1,"generateTime":"202103100234","startTime":"202103100234","endTime":"202103101032","groupId":149794,"type":2,"userName":"zlxydev","status":1,"operationmode":200}],"149795":[{"id":8823,"apName":"ZLXY","rwName":"05L/23R","logicRWDef":"23R","logicRWNameA":"05L","logicRWNameB":"23R","logicRWValueB":3.0,"logicRWTaxitimeA":5,"logicRWTaxitimeB":4,"isDepRW":2,"wayPoint":"P17,P35,P54,NSH,SHX,WJC,TEBIB,OTHER","generateTime":"202103100234","startTime":"202103101130","endTime":"202103101530","groupId":149795,"type":2,"userName":"zlxydev","status":1,"isExecuting":2,"operationmode":200},{"id":8824,"apName":"ZLXY","rwName":"05R/23L","logicRWDef":"05R","logicRWNameA":"05R","logicRWNameB":"23L","logicRWTaxitimeB":25,"isDepRW":-1,"generateTime":"202103100234","startTime":"202103101130","endTime":"202103101530","groupId":149795,"type":2,"userName":"zlxydev","status":1,"isExecuting":2,"operationmode":200}]}}}
        const result = data.result || {};
        runwayListData.updateRunwayList(result, generateTime)
    };

    // 请求跑道列表数据失败
    const requestErr = (err, content) => {
        customNotice({
            type: 'error',
            message: content
        })
    };

    // 请求方案数据
    const requestRunwayListData = () => {
        const now = getFullTime(new Date());
        const nowDate = now.substring(0,8);
        const start = nowDate+'0000';
        const end = nowDate+'2359';
        // 请求参数
        const opt = {
            url: ReqUrls.runwayListUrl + userId +'?airportStr='+'ZLXY,ZLLL'+'&startTime='+ start+'&endTime='+end,
            method:'GET',
            params:{},
            resFunc: (data)=> updateRunwayListData(data),
            errFunc: (err)=> requestErr(err, '跑道数据获取失败' ),
        };
        // 发送请求
        request(opt);
    };

    useEffect(function(){
        // 初次获取数据启用loading
        props.runwayListData.toggleLoad(true);
        // 获取数据
        requestRunwayListData();
        // 清除定时
        clearInterval(props.runwayListData.timeoutId);
        // 开启定时获取数据
        props.runwayListData.timeoutId = setInterval(runwayListData, 60*1000);
        return function(){
            clearInterval(props.runwayListData.timeoutId);
            props.runwayListData.timeoutId = "";
        }
    },[props.systemPage.userId])
    return (
        <Spin spinning={loading} >
            <div className="list_container" >
            <RunwayListHeader />
                {
                    (sortedList.length > 0) ?
                        sortedList.map((item, index) => (
                            <RunwayItem
                                singleGroupRunwayData={item}
                                key={item.id}
                                toggleModalVisible={toggleModalVisible}
                                toggleModalType={toggleModalType}
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

const useSchemeModal = () =>{
    const [ visible, setVisible ] = useState(false); //详情模态框显隐
    const [ modalObj, setModalObj ] = useState({}); //
    const [ modalType, setModalType ] = useState(""); //

    //模态框显隐
    const toggleModalVisible = useCallback(( flag, params )=>{
        setVisible(flag);
        //选中跑道id
        setModalObj(params);
    },[]);
    
    //方案模态框类型切换
    const toggleModalType = useCallback(( type )=>{
        setModalType(type);
    },[]);

    return {
        visible,
        modalObj,
        modalType,
        setVisible,
        toggleModalVisible,
        toggleModalType
    }
}

const RunwayList = () => {
    const {
        visible,
        modalObj,
        modalType,
        setVisible,
        toggleModalVisible,
        toggleModalType
    } = useSchemeModal();
    return (
        <div className="runway_list_canvas">
            <FilterBar />
            <Runway
                toggleModalVisible={ toggleModalVisible }
                toggleModalType={ toggleModalType }
             />
            { 
                visible && <RunwayModal
                    visible={visible}
                    setVisible={setVisible}
                    modalType={ modalType }
                    modalObj={modalObj} />
                        
            }
        </div>
    )
}
export default RunwayList