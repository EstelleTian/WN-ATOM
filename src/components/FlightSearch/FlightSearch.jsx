/*
 * @Author: your name
 * @Date: 2020-12-15 15:54:57
 * @LastEditTime: 2020-12-21 09:42:52
 * @LastEditors: Please set LastEditors
 * @Description: 航班查询
 * @FilePath: \WN-CDM\src\components\FlightSearch\FlightSearch.jsx
 */
import React, {useState, useEffect, useCallback} from 'react'
import { getFullTime,getDayTimeFromString, isValidObject, isValidVariable } from 'utils/basic-verify'
import { List, Divider , Icon, Form, Input,  Select, Drawer, Tooltip, Tag  } from 'antd'

import { request } from 'utils/request'
import { ReqUrls } from 'utils/request-urls'


import './FlightSearch.scss'
const { Option } = Select;
const { Search } = Input;

//航班查询模块
const FlightSearch = (props) => {

    const NORMAL = '';
    const EMPTY = '航班不存在';
    const FAILURE = '查询失败';

    let [drawerVisible, setDrawerVisible,  ] = useState(0);
    // 单个航班数据
    let [flight, setFlight, ] = useState(0);
    let [searchTootipVisible, setSearchTootipVisible, ] = useState(0);
    let [searchTootipText, setSearchTootipText, ] = useState(NORMAL);
    let [searchLoadingVisible, setSearchLoadingVisible, ] = useState(0);
    let [selectedID, setSelectedID, ] = useState(-1);
    const data = [];
    let [flightListData, setFlightListData, ] = useState(data);
    useEffect(() => {

    }, [drawerVisible, flightListData, selectedID, flight ]);


    /**
     * 隐藏tooltip
     * */
    const  hideTooltip = useCallback(function () {
        setSearchTootipVisible(false);
    });
    /**
     * 关闭单个航班信息抽屉
     * */
    const  closeDrawer = useCallback(function () {
        setDrawerVisible(false);
        setSelectedID(-1)
    });

    /**
     * 显示单个航班信息
     * */
    const showSingleFlightSummary = useCallback(function (flight) {
        setSelectedID(flight.id);
        // 更新航班略情抽屉中的航班数据
        setFlight(flight);
        setDrawerVisible(true);
    });

    /**
     * 绘制航班列表中单个航班信息
     * */
    const drawFlightItem = useCallback(function (item, index) {

            let FLIGHTID = item.FLIGHTID;
            let DEPAP = item.DEPAP || 'N/A';
            let ARRAP = item.ARRAP || 'N/A';
            let SOBT = item.SOBT || 'N/A';
            let REG = item.REG || 'N/A';
            let FORMER = item.FORMER || 'N/A';

        return (
                <List.Item
                    className={(item.id === selectedID) ? 'selected': ''}
                    key={ item.id }
                    onClick={() => {
                        showSingleFlightSummary(item)
                     }}
                >
                    <div className="flight-item">
                        <a className="flight">
                            <div className="flight-prop num">{index + 1}</div>
                            <div className="flight-prop flight-id">{FLIGHTID}</div>
                            <div className="flight-prop flight-depap-arrap">{`${DEPAP}-${ARRAP}`}</div>
                            <div className="flight-prop flight-sobt">{SOBT}</div>
                            <div className="flight-prop flight-reg">{REG}</div>
                            <div className="flight-prop flight-former">{FORMER}</div>
                        </a>
                    </div>
                </List.Item>
            )
        }
    );

    /**
     *  绘制航班略情数据
     * */
    const drawFlightSummerData = useCallback(function (flight) {
        const id = flight.id;
        const FLIGHTID = flight.FLIGHTID || 'N/A';
        const DEPAP = flight.DEPAP || 'N/A';
        const ARRAP = flight.ARRAP || 'N/A';


        return (
            <div className="summary-container">
                <div className="state">
                    <Tag color="#2db7f5">计划</Tag>
                    {/*<Tag color="#87d068">起飞</Tag>*/}
                    {/*<Tag color="#722ed1">降落</Tag>*/}
                    {/*<Tag color="#f50">返航</Tag>*/}
                </div>

                <div className="flight-summary summary-nav">
                    <div className="descriptions ap">ADEP-ADES</div>
                    <div className="descriptions">AGCT</div>
                    <div className="descriptions">AOBT</div>
                    <div className="descriptions">ATOT</div>
                    <div className="descriptions">RWY</div>
                    <div className="descriptions">SID</div>
                </div>
                <div className="flight-summary summary-value">
                    <div className="descriptions ap">{`${DEPAP}-${ARRAP}`}</div>
                    <div className="descriptions">{}</div>
                    <div className="descriptions">1200</div>
                    <div className="descriptions">1215</div>
                    <div className="descriptions">02L</div>
                    <div className="descriptions">N/A</div>
                </div>

                <Divider orientation="center"> {`前序航班 ${flight.former}`}</Divider>
                <div className="state">
                    <Tag color="#87d068">起飞</Tag>
                </div>

                <div className="flight-summary summary-nav">
                    <div className="descriptions ap">ADEP-ADES</div>
                    <div className="descriptions">ACTYPE</div>
                    <div className="descriptions">REG</div>
                    <div className="descriptions">ALDT</div>
                </div>
                <div className="flight-summary summary-value">
                    <div className="descriptions ap">ZBLA-ZBAA</div>
                    <div className="descriptions">B738</div>
                    <div className="descriptions">1200</div>
                    <div className="descriptions">N/A</div>
                </div>
            </div>
        )


    })

    /**
     *  获取航班略情抽屉标题
     * */
    const getDrawerTitle = useCallback(function () {
        const text  = <span>{`查看航班详情`}</span>;
        const title = <Tooltip placement="top" title={text}>
                        <span className="title-flight-id">{flight.FLIGHTID}{flight.id}</span>
                    </Tooltip>;
        return title
    });

    /**
     * 发送获取航班数据请求
     *
     * */
    const requestFlightData = useCallback((flightId) => {
        setSearchLoadingVisible(true);
        const nowDate = getFullTime(new Date()).substring(0,8);
        const start = nowDate+'0000';
        // const start = '202101150000';
        const end = nowDate+'2359';
        const opt = {
            url: ReqUrls.searchFlightUrl+`${flightId}/${start}/${end}`,
            method:'GET',
            params:{},
            resFunc: (data)=> {
                updateFlightListData(data)
            },
            errFunc: (err)=> {
                requestErr(err, '查询失败')
            } ,
        };
        request(opt);
    });


    /**
     * 航班查询
     * */
    const searchFlightData = useCallback(function (value, event) {
        // 检测事件是否为输入框的清除图标点击事件
        if(isValidVariable(event)){
            const target = event.currentTarget;
            const nodeName = target.nodeName;
            const eventType = event.type.toUpperCase();
            if(nodeName ==='INPUT' && eventType === 'CLICK'){
                // 隐藏tooltip
                hideTooltip();
                return;
            }
        }
        if(isValidVariable(value)) {
            // 获取航班数据
            requestFlightData(value);
        }else {
            setSearchTootipText('请输入航班号');
            setSearchTootipVisible(true);
            // 添加点击事件
            addClickEventListener();
        }
    });

    /**
     * 在document 添加点击事件,用于隐藏tooltip
     * */
    const addClickEventListener = () => {
        document.addEventListener(`click`, function onClickOutside() {
            // 隐藏tooltip
            hideTooltip();
            document.removeEventListener(`click`, onClickOutside)
        })
    };
    /**
     * 输入框按下回车的回调
     * */
    const pressEnter = useCallback(function (e) {
        e.preventDefault();
        e.stopPropagation();
        const value = e.target.value.toUpperCase();
        // 航班查询
        searchFlightData(value);
    });

    /**
     *
     * 输入框内容变化时的回调
     * */
    const handleInputValueChange = (e) => {
        // 隐藏
        hideTooltip();
    };

    const convertSingleFlight = (flightData)=> {
        let flight = flightData.fmeTodayTraMonitor || {}
        let { alarmField, taskField, eapField, oapField, tobtField, cobtField, ctotField, fmeToday, ffixField, ctoField, etoField, agctField } = flight;
        let obj = {
            key: flight.id,
            id: flight.id,
            FLIGHTID: flight.flightId,
            DEPAP:  flight.depap,
            ARRAP: flight.arrap,
            REG : flight.reg,
            SOBT: getDayTimeFromString(flight.sobt),
            EOBT: getDayTimeFromString(flight.eobt),
            FORMER: flight.formerFlightid,
        };

        return obj;

    }

    /**
     * 更新航班列表数据
     *
     * */
    const  updateFlightListData = useCallback(function (data) {
        // 隐藏loading
        setSearchLoadingVisible(false);
        // 关闭单个航班信息抽屉
        closeDrawer();

        // 结果数据id集合
        let dataList = [];
        // 结果数据对象
        let dataMap = {};
        if(isValidObject(data) && isValidObject(data.result)){
            dataList = Object.keys(data.result);
            dataMap = data.result;
        }
        // 遍历将结果数据对象转为数组形式
        let flightListData = [];
        dataList.map((item)=> {
            let flight = convertSingleFlight(dataMap[item]);
            flightListData.push(flight);
        });
        // 更新航班列表数据
        setFlightListData((old)=>{
            return flightListData
        });
        // 航班列表数据个数
        const  len = flightListData.length;
        // 若为0个
        if(len === 0){
            setSearchTootipText(EMPTY);
            setSearchTootipVisible(true);
            // 添加点击事件
            addClickEventListener();
        }else if (len === 1){
            setDrawerVisible(true);
            // 显示单个航班信息
            showSingleFlightSummary(flightListData[0]);
        }
    });

    /**
     * 请求失败回调
     *
     * */
    const requestErr = (err) => {
        // 隐藏loading
        setSearchLoadingVisible(false);
        // 关闭单个航班信息抽屉
        closeDrawer();

        let errMsg = "";
        if(isValidObject(err) && isValidVariable(err.message)){
            errMsg = err.message;
        }else if(isValidVariable(err)){
            errMsg = err;
        }
        let content = FAILURE;
        if(isValidVariable(errMsg)){
            content = `${content} : ${errMsg}`
        }
        setSearchTootipText(content);
        setSearchTootipVisible(true);
        // 添加点击事件
        addClickEventListener();
    };

    // 航班略情抽屉标题
    const drawerTitle = getDrawerTitle();

    return (
        <div className="container">

            <div className="options">
                <div className="box">

                    <Tooltip title={searchTootipText} color="volcano" visible={searchTootipVisible}>
                        <Search className="flight-search"
                                placeholder="航班号"
                                size="small"
                                allowClear={true}
                                loading={searchLoadingVisible}
                                onSearch={searchFlightData}
                                onPressEnter = {pressEnter}
                                onChange={handleInputValueChange}
                                // onMousedown={ handleInputValueChange}
                                // onMouseLeave={ handleMouseLeave }
                                // onBlur ={ changeTootipText }
                                style={{marginRight: '2%', width: '30%'}}
                        />
                    </Tooltip>
                    <Select
                        size="small"
                        style={{marginRight: '2%'}}
                        defaultValue="today"
                    >
                        <Option value="yestoday">昨日</Option>
                        <Option value="today">今日</Option>
                        <Option value="tomorrow">明日</Option>
                    </Select>
                </div>
            </div>
            <div className="content">
                <div className="flight-list">
                    <div className="list-nav">
                        <div className="flight-prop num">Num</div>
                        <div title="航班号" className="flight-prop flight-id">FLIGHTID</div>
                        <div title="起飞机场" className="flight-prop flight-depap-arrap">DEPAP-ARRAP</div>
                        <div title="计划撤轮档" className="flight-prop flight-sobt">SOBT</div>
                        <div title="计划撤轮档" className="flight-prop flight-reg">REG</div>
                        <div title="前序航班" className="flight-prop flight-former">FORMER</div>
                    </div>
                    <List
                        itemLayout="horizontal"
                        size="small"
                        dataSource={flightListData}
                        renderItem={drawFlightItem}
                    />
                </div>
                <Drawer
                    destroyOnClose= {true}
                    className="flight-summary-drawer"
                    title={ drawerTitle }
                    placement="right"
                    closable={true}
                    onClose={ closeDrawer }
                    visible={drawerVisible}
                    mask={ false}
                    getContainer={false}
                    width="73%"
                    style={{position: 'absolute'}}
                >
                    { drawFlightSummerData(flight)}

                </Drawer>
            </div>
        </div>
    )
}


export default FlightSearch
