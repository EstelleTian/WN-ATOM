/*
 * @Author: your name
 * @Date: 2020-12-14 13:47:11
 * @LastEditTime: 2020-12-24 18:47:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\components\ExecuteKPI\SubTable.jsx
 */
import React from 'react'
import {Row, Col, Spin, Progress} from 'antd'
import {AlertOutlined} from '@ant-design/icons'
import { inject, observer } from 'mobx-react'

import ReactEcharts from 'echarts-for-react'
import GaugeChart from './GaugeChart'
import PieChart from '../FlightPerformance/PieChart'


import AirportMonitor from '../MiniMonitor/AirportMonitor'
import './ExecuteKPI.scss'

//单个方案执行KPI模块
const ExecuteKPI = (props) => {
    const executeKPIData = props.executeKPIData;
    const { loading } = executeKPIData;
    return (
        <Spin spinning={loading} >
            <div className="kpi_canvas">
                <Row className="row_model">
                    <Col span={10} className="impact block">
                        <div className="block-title">影响航班</div>
                        <div className="block-content flex justify-content-center layout-column-center">
                            <div className="num text-center">80</div>
                            <div className="unit text-center">架次</div>
                        </div>

                    </Col>
                    <Col span={14} className="block">
                        <Row>
                            <Col span={12} className="impact_sub block">
                                <div className="block-title">临界</div>
                                <div className="block-content flex">
                                    <div className="layout-row">
                                        <div className="num layout-column justify-content-center">10</div>
                                        <div className="unit layout-column ">架次</div>
                                    </div>

                                </div>

                            </Col>
                            <Col span={12} className="impact_sub block">
                                <div className="block-title">申请协调</div>
                                <div className="block-content flex">
                                    <div className="layout-row">
                                        <div className="num layout-column justify-content-center">15</div>
                                        <div className="unit layout-column ">架次</div>
                                    </div>
                                </div>

                            </Col>
                        </Row>
                        <Row>
                            <Col span={12} className="impact_sub block">
                                <div className="block-title">入池</div>
                                <div className="block-content flex">
                                    <div className="layout-row ">
                                        <div className="num layout-column justify-content-center">21</div>
                                        <div className="unit layout-column ">架次</div>
                                    </div>
                                </div>
                            </Col>
                            <Col span={12} className="impact_sub block">
                                <div className="block-title">关舱门等待</div>
                                <div className="block-content flex">
                                    <div className="layout-row">
                                        <div className="num layout-column justify-content-center">9</div>
                                        <div className="unit layout-column ">架次</div>
                                    </div>

                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className="row_model">
                    <Col span={10} className="block">
                        <div className="block-title">影响程度</div>
                        <div className="warn flex justify-content-center layout-column">
                            <AlertOutlined />
                            <div className="text-center">高</div>
                        </div>
                    </Col>
                    <Col span={14} className="block">
                        <div className="block-title">DCB</div>
                        <div className="warn flex justify-content-center layout-column">
                            <AirportMonitor title=""/>
                        </div>

                    </Col>
                </Row>
                <Row className="ant-row-no-wrap">
                    <Col span={10} className="row_model ctot-rate">
                        <Col span={24} className="block">
                            <div className="block-title">CTOT符合率</div>
                            <div className="flex justify-content-center layout-column">
                                <PieChart style={{width: '100%', height: '150px'}}></PieChart>
                            </div>
                        </Col>
                        <Col span={24} className="block">
                            <div className="block-title">平均跳变次数</div>
                            <div className="flex justify-content-center layout-column">
                                <div className="layout-row justify-content-center">
                                    <div className="layout-row justify-content-center dance">
                                        <div className="num layout-column justify-content-center">3</div>
                                        <div className="unit layout-column ">次</div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Col>

                    <Col span={14} className="row_model delay-rate">
                        <Col span={24} className="block ">
                            <div className="block-title">预计延误率</div>
                            <div className="flex justify-content-center layout-column">
                                <Row className="total text-center justify-content-center">
                                    <Progress
                                        strokeLinecap="square"
                                        type="dashboard"
                                        percent={30}
                                        // strokeWidth={8}
                                        gapDegree={1}
                                        trailColor="#64737a"
                                    />

                                </Row>
                                <Row className="part">
                                    <Col span={12} className="block row_model flex">
                                        <div className="block-title percent text-center">30%</div>
                                        <div className="flex justify-content-center layout-column">
                                            <Progress
                                                percent={50}
                                                showInfo={false}
                                                trailColor="#64737a"
                                            />
                                            <div className="text-center point">西安机场</div>
                                        </div>
                                    </Col>
                                    <Col span={12} className="block row_model flex ">
                                        <div className="block-title percent text-center">30%</div>
                                        <div className="flex justify-content-center layout-column">
                                            <Progress
                                                percent={50}
                                                showInfo={false}
                                                trailColor="#64737a"
                                            />
                                            <div className="text-center point">西安机场</div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row className="part">
                                    <Col span={12} className="block row_model flex">
                                        <div className="block-title percent text-center">30%</div>
                                        <div className="flex justify-content-center layout-column">
                                            <Progress
                                                percent={50}
                                                showInfo={false}
                                                trailColor="#64737a"
                                            />
                                            <div className="text-center point">西安机场</div>
                                        </div>
                                    </Col>
                                    <Col span={12} className="block row_model flex">
                                        <div className="block-title percent text-center">30%</div>
                                        <div className="flex justify-content-center layout-column">
                                            <Progress
                                                percent={50}
                                                showInfo={false}
                                                trailColor="#64737a"
                                            />
                                            <div className="text-center point">西安机场</div>
                                        </div>
                                    </Col>
                                </Row>

                            </div>
                        </Col>
                    </Col>
                </Row>
                {/*<Row className="row_model">*/}
                    {/*<Col span={10} className="block">*/}
                        {/*<GaugeChart className="layout-row flex-wrap justify-content-center"*/}
                                    {/*value={80} style={{width: '240px', height: '200px'}}/>*/}
                    {/*</Col>*/}
                    {/*<Col span={14}>*/}
                        {/*<Row>*/}
                            {/*<Col span={12} className="impact_sub">*/}
                                {/*<GaugeChart size="small" value={80} name="西安机场"*/}
                                            {/*style={{width: '120px', height: '100px'}}/>*/}
                            {/*</Col>*/}
                            {/*<Col span={12} className="impact_sub">*/}
                                {/*<GaugeChart size="small" value={90} name="银川机场"*/}
                                            {/*style={{width: '120px', height: '100px'}}/>*/}
                            {/*</Col>*/}
                        {/*</Row>*/}
                        {/*<Row>*/}
                            {/*<Col span={12} className="impact_sub">*/}
                                {/*<GaugeChart size="small" value={70} name="西宁机场"*/}
                                            {/*style={{width: '120px', height: '100px'}}/>*/}
                            {/*</Col>*/}
                            {/*<Col span={12} className="impact_sub">*/}
                                {/*<GaugeChart size="small" value={75} name="延安机场"*/}
                                            {/*style={{width: '120px', height: '100px'}}/>*/}
                            {/*</Col>*/}
                        {/*</Row>*/}
                    {/*</Col>*/}
                {/*</Row>*/}
                {/*<Row className="row_model">*/}
                    {/*<Col span={10} className="block">*/}
                        {/*<div className="title">受控CTOT符合率分布</div>*/}
                        {/*<div className="warn flex justify-content-center layout-column">*/}
                            {/*<PieChart style={{width: '240px', height: '200px'}}></PieChart>*/}
                        {/*</div>*/}
                    {/*</Col>*/}
                    {/*<Col span={14} className="impact_sub">*/}
                        {/*<div className="title">平均跳变次数</div>*/}
                        {/*<div className="num">—<span className="sub_title2">次</span></div>*/}
                    {/*</Col>*/}
                {/*</Row>*/}


            </div>
        </Spin>
    )
}

export default inject("executeKPIData", "schemeListData")(observer(ExecuteKPI))
