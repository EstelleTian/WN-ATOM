import React, { Fragment } from 'react'
import { Row, Col, List, Form, Divider} from 'antd'
// import "./FlightExchangeSlotForm.scss";

//航班时隙交换规则说明
function RulesDescription(props) {
    const data = [
        '1.交换双方优先级时间',
        '2.交换双方时隙状态',
        '3.根据时隙状态，酌情交换受控过点时间，交换规则如下：',
    ];
    return (
        <Fragment>
            <Row gutter={24} >
                <Col span={24} className="description-container">
                    <List
                        className="description-list"
                        size="small"
                        split={false}
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    title={item}
                                />
                            </List.Item>
                        )}
                    />
                    <div className="description-table">
                        <div className="layout-row header">
                            <div className="flex cell layout-row">
                                <div className="flex">
                                    <label>航班A</label>
                                </div>
                                <Divider className="divider" type="vertical" />
                                <div className="flex">
                                    
                                    <label>航班B</label>
                                </div>
                            </div>
                            <div className="flex cell">
                                
                                <label>自动状态</label>
                            </div>
                            <div className="flex cell">
                                
                                <label>预锁状态</label>
                            </div>
                            <div className="flex cell">
                                
                                <label>锁定状态</label>
                            </div>
                            <div className="flex cell">
                                
                                <label>人工指定状态</label>
                            </div>
                        </div>
                        <div className="layout-row">
                            <div className="flex cell">
                                
                                <label>自动状态</label>
                            </div>
                            <div className="flex cell">
                                
                                <label>A、B重新计算过点时间</label>
                            </div>
                            <div className="flex cell">
                                
                                <label>A获取B的过点时间，B重新计算过点时间</label>
                            </div>
                            <div className="flex cell">
                                
                                <label>A获取B的过点时间，B重新计算过点时间</label>
                            </div>
                            <div className="flex cell">
                                
                                <label>A获取B的过点时间，B重新计算过点时间</label>
                            </div>
                        </div>
                        <div className="layout-row">
                            <div className="flex cell">
                                
                                <label>预锁状态</label>
                            </div>
                            <div className="flex cell">
                                
                                <label>B获取A的过点时间，A重新计算过点时间</label>
                            </div>
                            <div className="flex cell">
                                
                                <label>交换过点时间</label>
                            </div>
                            <div className="flex cell">
                                
                                <label>交换过点时间</label>
                            </div>
                            <div className="flex cell">
                                
                                <label>交换过点时间</label>
                            </div>
                        </div>
                        <div className="layout-row">
                            <div className="flex cell">
                                
                                <label>锁定状态</label>
                            </div>
                            <div className="flex cell">
                                
                                <label>B获取A的过点时间，A重新计算过点时间</label>
                            </div>
                            <div className="flex cell">
                                
                                <label>交换过点时间</label>
                            </div>
                            <div className="flex cell">
                                
                                <label>交换过点时间</label>
                            </div>
                            <div className="flex cell">
                                
                                <label>交换过点时间</label>
                            </div>
                        </div>
                        <div className="layout-row">
                            <div className="flex cell">
                                
                                <label>人工指定状态</label>
                            </div>
                            <div className="flex cell">
                                
                                <label>B获取A的过点时间，A重新计算过点时间</label>
                            </div>
                            <div className="flex cell">
                                
                                <label>交换过点时间</label>
                            </div>
                            <div className="flex cell">
                                <label>交换过点时间</label>
                            </div>
                            <div className="flex cell">
                                <label>交换过点时间</label>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </Fragment>
    )
}

export default RulesDescription;
