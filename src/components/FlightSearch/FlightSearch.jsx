/*
 * @Author: your name
 * @Date: 2020-12-15 15:54:57
 * @LastEditTime: 2020-12-21 09:42:52
 * @LastEditors: Please set LastEditors
 * @Description: 航班查询
 * @FilePath: \WN-CDM\src\components\FlightSearch\FlightSearch.jsx
 */
import React, {useState, useEffect, useCallback} from 'react'
import { inject, observer } from 'mobx-react'
import { isValidVariable } from 'utils/basic-verify'
import { List, Divider , Icon, Form, Input,  Select, Drawer, Tooltip, Tag  } from 'antd'
import './FlightSearch.scss'
const { Option } = Select;
const { Search } = Input;

//航班查询模块
const FlightSearch = (props) => {

    let [drawerVisible, setDrawerVisible,  ] = useState(0)
    let [flight, setFlight, ] = useState(0)
    let [searchTootipVisible, setSearchTootipVisible, ] = useState(0)
    let [searchLoadingVisible, setSearchLoadingVisible, ] = useState(0)
    // const flightListData = [];
    const data = []
    let [flightListData, setFlightListData, ] = useState(data)
    useEffect(() => {

    }, [drawerVisible, flightListData]);


    const mockFlightListData = [

        {
            id: 0,
            flightId: 'BAV459',
            depap: 'RKSI',
            arrap: 'VVNB',
            sobt: '17/0630',
            reg: 'N/A',
            former: 'N/A'
        },{
            id: 1,
            flightId: 'CCA1130',
            depap: 'ZBLA',
            arrap: 'ZBAA',
            sobt: '17/2130',
            reg: 'N/A',
            former: 'CCA001'
        },
        {
            id: 2,
            flightId: 'CCA112',
            depap: 'ZLLL',
            arrap: 'ZUUU',
            sobt: '17/2142',
            reg: 'N/A',
            former: 'N/A'
        },
        {
            id: 3,
            flightId: 'CCA1553',
            depap: 'ZBHH',
            arrap: 'ZSPD',
            sobt: '17/1915',
            reg: 'N/A',
            former: 'N/A'
        },
        {
            id: 4,
            flightId: 'CCA1110',
            depap: 'ZBXH',
            arrap: 'ZBAA',
            sobt: '17/0900',
            reg: 'N/A',
            former: 'CCA122'
        },
        {
            id: 5,
            flightId: 'CCA4153',
            depap: 'ZUUU',
            arrap: 'ZWWW',
            sobt: '17/1620',
            reg: 'N/A',
            former: 'N/A'
        },
        {
            id: 6,
            flightId: 'CCA8130',
            depap: 'ZLIC',
            arrap: 'ZBTJ',
            sobt: '17/0750',
            reg: 'N/A',
            former: 'N/A'
        },
        {
            id: 7,
            flightId: 'CCA4224',
            depap: 'ZUBZ',
            arrap: 'ZUUU',
            sobt: '17/1505',
            reg: 'N/A',
            former: 'CCA110'
        },
        {
            id: 8,
            flightId: 'CES2219',
            depap: 'ZSSS',
            arrap: 'ZUUU',
            sobt: '17/0645',
            reg: 'N/A',
            former: 'N/A'
        },
        {
            id: 9,
            flightId: 'CES337',
            depap: 'ZLXY',
            arrap: 'ZUCK',
            sobt: '17/2130',
            reg: 'N/A',
            former: 'N/A'
        },
        {
            id: 10,
            flightId: 'CSN777',
            depap: 'ZLXY',
            arrap: 'ZUCK',
            sobt: '17/2130',
            reg: 'N/A',
            former: 'N/A'
        },
        {
            id: 11,
            flightId: 'CSN700',
            depap: 'ZLXY',
            arrap: 'ZUCK',
            sobt: '17/2130',
            reg: 'N/A',
            former: 'N/A'
        },
        {
            id: 12,
            flightId: 'CES9780',
            depap: 'ZYTX',
            arrap: 'ZSWX',
            sobt: '17/2020',
            reg: 'N/A',
            former: 'N/A'
        },
        {
            id: 13,
            flightId: 'CCA991',
            depap: 'ZGGG',
            arrap: 'ZUCK',
            sobt: '17/1430',
            reg: 'N/A',
            former: 'N/A'
        },
        {
            id: 14,
            flightId: 'CSN6250',
            depap: 'ZLXY',
            arrap: 'ZYDQ',
            sobt: '17/2140',
            reg: 'N/A',
            former: 'N/A'
        },

    ];

    const drawFlightItem = useCallback(function (item, index) {
            return (
                <List.Item key={ item.id } onClick={() => {
                    showFlightDetail(item)
                }} >
                    <div className="flight-item">
                        <a className="flight">
                            <div className="flight-prop num">{index + 1}</div>
                            <div className="flight-prop flight-id">{item.flightId}</div>
                            <div className="flight-prop flight-depap">{item.depap}</div>
                            <div className="flight-prop flight-arrap">{item.arrap}</div>
                            <div className="flight-prop flight-sobt">{item.sobt}</div>
                            <div className="flight-prop flight-former">{item.former}</div>
                        </a>
                    </div>
                </List.Item>
            )
        }
    )


    const showFlightDetail = useCallback(function (flight) {
        console.log(flight)
        setFlight(flight);
        setDrawerVisible(true);
    });

    const  closeDrawer = useCallback(function () {
        setDrawerVisible(false)
    })

    const drawFlightSummerData = useCallback(function () {
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
                <div className="descriptions ap">{`${flight.depap}-${flight.arrap}`}</div>
                <div className="descriptions">N/A</div>
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
    const drawDrawerTitle = useCallback(function () {
        const text  = <span>{`查看航班详情`}</span>;

        const title = <Tooltip placement="top" title={text}>
                        <span className="title-flight-id">{flight.flightId}</span>
                    </Tooltip>;
        return title
    });

    const searchFlightData = useCallback(function (value) {
        value = value.toUpperCase();
        if(!isValidVariable(value)){
            setSearchTootipVisible(true);
        }else {
            setSearchTootipVisible(false);
            setSearchLoadingVisible(true);
            setTimeout((value)=>{
                mockData(value)
            },1000*1,value);
        }
    });
    const pressEnter = useCallback(function (e) {
        const value = e.target.value.toUpperCase();
        searchFlightData(value);
    });

    const changeValue = useCallback(function (e) {
        const value = e.target.value;
        if(isValidVariable(value)){
            setSearchTootipVisible(false);
        }
    });

    const  hideTooltip = useCallback(function () {
        setSearchTootipVisible(false);
    })


    const mockData = useCallback(function (value) {
        setSearchLoadingVisible(false)
        setFlightListData((old)=>{
            const data = mockFlightListData.filter((element)=>{
                return element.flightId.indexOf(value) !== -1;
            });
            console.log(data.length);
            if(data.length == 1){
                setDrawerVisible(true);
                showFlightDetail(data[0]);
            }else {
                setDrawerVisible(false);
            }
            return data
        });

    })



    const title = drawDrawerTitle();

    return (

        <div className="container">

            <div className="options">
                <div className="box">

                    <Tooltip title="请输入航班号" color="volcano" visible={searchTootipVisible}>
                        <Search className="flight-search"
                                placeholder="请输入航班号"
                                size="small"
                                allowClear={true}
                                loading={searchLoadingVisible}
                                onSearch={searchFlightData}
                                onPressEnter = {pressEnter}
                                onChange={changeValue}
                                onMouseLeave={ hideTooltip }
                                onBlur ={ hideTooltip }
                                style={{marginRight: '2%', width: '45%'}}
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
                        <div className="flight-prop flight-id">CallSign</div>
                        <div className="flight-prop flight-depap">ADEP</div>
                        <div className="flight-prop flight-arrap">ADES</div>
                        <div className="flight-prop flight-sobt">SOBT</div>
                        <div className="flight-prop flight-former">FORMER</div>
                    </div>
                    <List
                        itemLayout="horizontal"
                        size="small"
                        dataSource={flightListData}
                        renderItem={drawFlightItem}
                    />
                </div>
                <Drawer
                    className="flight-summary-drawer"
                    title={ title }
                    placement="right"
                    closable={true}
                    onClose={ closeDrawer }
                    visible={drawerVisible}
                    mask={ false}
                    getContainer={false}
                    width="70%"
                    style={{position: 'absolute'}}
                >
                    { drawFlightSummerData()}

                </Drawer>
            </div>
        </div>
    )
}


export default FlightSearch
