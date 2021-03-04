/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-03-01 19:33:36
 * @LastEditors: Please set LastEditors
 * @Description:左上切换模块 执行kpi 豁免航班 等待池 特殊航班 失效航班 待办事项
 * @FilePath: \WN-CDM\src\pages\FangxingPage\FangxingPage.jsx
 */
import React, {  Suspense, useCallback, useState, useEffect, useMemo, useRef} from 'react';
import { Table, Spin,  Button, Input, Radio, Select  } from 'antd';
import {inject, observer} from "mobx-react";
import debounce from 'lodash/debounce'
import { DoubleLeftOutlined, DoubleRightOutlined, SyncOutlined } from '@ant-design/icons';
import { ReqUrls, CollaborateIP } from "utils/request-urls";
import { requestGet, request  } from "utils/request";
import { getFullTime, getDayTimeFromString, isValidVariable, formatTimeString  } from "utils/basic-verify";
import { FlightCoordination  } from "utils/flightcoordination";
import moment from "moment";
import './MyApplication.scss';

const { Option } = Select;
//获取屏幕宽度，适配 2k
let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;
//根据key识别列表列配置columns

const columns = [
    {
        title: "流水号",
        dataIndex: "id",
        align: 'center',
        key: "id",
        width: 80,
    },
    {
        title: "工作名称",
        dataIndex: "businessName",
        align: 'left',
        key: "businessName",
        width: 240,
    },{
        title: "流程类型",
        dataIndex: "processDefinitionName",
        align: 'left',
        key: "processDefinitionName",
        width: 180,
        sorter: (a, b) => a.processDefinitionName.localeCompare(b.processDefinitionName),
    },{
        title: "工作所处环节",
        dataIndex: "activityName",
        align: 'left',
        key: "activityName",
        width: 180,
        sorter: (a, b) => a.activityName.localeCompare(b.activityName),
    },{
        title: "提交时间",
        dataIndex: "startTime",
        align: 'center',
        key: "startTime",
        width: 180,
        defaultSortOrder: 'descend',
        sorter: (a, b) => {
            return a.startTime - b.startTime;
        },
        render: (text, record, index) => {
            if( text === "" ){
                return text
            }else {
                return getFullTime(new Date(text), 1)
            }
        }
    },{
        title: "状态",
        dataIndex: "status",
        align: 'center',
        key: "status",
        width: 80,
        sorter: (a, b) => a.status.localeCompare(b.status),
    },
];
const MyApplication = (props) => {
    const [tableWidth, setWidth] = useState(1000);
    const [tableHeight, setHeight] = useState(800);
    const { tableLoading, requestMyApplicationDatas, refreshBtnLoading, generateTime, myApplicationList } = props;
    const myApplication = myApplicationList.myApplication || [];
    const { filterData } = myApplicationList;
    const dataList = filterData;
    const refreshData = ()=> {
        requestMyApplicationDatas(true);
    };

    const updateFilterKey = useCallback(
        debounce((value) => {
            props.myApplicationList.setFilterKey(value.trim().toUpperCase())
            console.log(value)
        }, 500,{'leading': true,}),
        []
    )
    const updateFilterTimeRange = (value)=> {
        props.myApplicationList.setFilterTimeRange(value)
    }
    return (
        <Suspense fallback={<div className="load_spin"><Spin tip="加载中..."/></div>}>
            <div className="advanced-search-filters">
                <div className="advanced-search-base-input-filter">
                    <Input
                        allowClear
                        className="input-filter-key"
                        placeholder="请输入要查询的关键字"
                        onChange={(e)=> { updateFilterKey(e.target.value) }}
                    />
                </div>
                {/*<div className="advanced-search-base-radio-filter">
                    <Radio.Group value="ALL" onChange={(e)=> { updateFilterTimeRange(e.target.value) }}>
                        <Radio value="ALL">全部时段</Radio>
                        <Radio value="TODAY">今日</Radio>
                        <Radio value="WEEK">最近一周</Radio>
                        <Radio value="ONEMONTH">最近一个月</Radio>
                    </Radio.Group>
                </div>*/}
                <div className="advanced-search-button-refresh">
                    <Button type="primary" loading = { refreshBtnLoading } style={{ marginLeft: "1rem" }}
                            onClick = { e => { refreshData()  }}
                    >
                        刷新
                    </Button>
                </div>
            </div>
            <div>
                <Table
                    columns={ columns }
                    dataSource={ dataList }
                    size="small"
                    bordered
                    pagination={false}
                    loading={ tableLoading }
                    scroll={{
                        x: tableWidth,
                        y: tableHeight
                    }}
                />
            </div>
        </Suspense>
    )
}

export default inject("myApplicationList")(observer(MyApplication))



