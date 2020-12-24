/*
 * @Author: your name
 * @Date: 2020-12-10 11:08:04
 * @LastEditTime: 2020-12-24 17:40:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\components\SchemeList\SchemeList.jsx
 */
import React from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, message } from 'antd'
import { request } from '../../utils/request'
import { getTimeFromString } from '../../utils/basic-verify'
import './SchemeItem.scss'
@observer
class SchemeItem extends React.Component{
    onChange(e, item){
        e.preventDefault();
        e.stopPropagation();
        item.toggleActive();
    }
    render(){
        const item = this.props.item;
        const { tacticName, tacticStatus, tacticPublishUser, tacticTimeInfo: { startTime, endTime, createTime} } = item;
        console.log("SchemeItem", item);
        return (
            <div className={`item_container ${item.active ? 'item_active' : ''}`}  onClick={(e)=>{ this.onChange(e, item) }}>
                <Row>
                    <Col span={8}>{tacticName}</Col>
                    <Col span={5}>{tacticPublishUser}</Col>
                    <Col span={5}>航路</Col>
                    <Col span={6}>{getTimeFromString(startTime)} - {getTimeFromString(createTime)}</Col>
                </Row>
                <Row>
                    <Col span={8}>正在执行</Col>
                    <Col span={5}>10分钟</Col>
                    <Col span={5}>ENH</Col>
                    <Col span={6}></Col>
                </Row>
                <Row>
                    <Col span={12}>
                        创建时间:<span>{getTimeFromString(endTime)}</span>
                        原因:<span>其他空域用户</span>
                        备注:<span></span>
                    </Col>
                    <Col span={12}>
                        <span className="opt detail">详情</span>
                        <span className="opt effect">影响</span>
                    </Col>
                </Row>
            </div>
        )
    }
}


@inject("schemeListData")
@observer
class SchemeList extends React.Component{
    constructor( props ){
        super(props);
    }
    updateSchemeListData(data){
        const {tacticProcessInfos} = data;
        const list = tacticProcessInfos.map((item) => {
            const { basicTacticInfo } = item;
            return basicTacticInfo;

        })
        this.props.schemeListData.updateList(list)
    }
    requestErr(err){
        message.error('方案列表获取失败'+err);
    }
    componentWillMount(){
        const opt = {
            url:'http://192.168.243.120:58189/schemeFlow/xian',
            method:'GET',
            params:{},
            resFunc: (data)=> this.updateSchemeListData(data),
            errFunc: (err)=> this.requestErr(err),
        };
        request(opt);
    }
    componentDidUpdate(){
        console.log(333, "componentDidUpdate");
    }

    render(){
        const schemeListData = this.props.schemeListData;
        const { list } = schemeListData;
        return (
            <div className="list_container">
            {
                list.map( (item, index) => (
                    <SchemeItem 
                    item={item} 
                    key={index}>
                    </SchemeItem>
                    )
                )
            }
            </div>
        )
    }
}




export default SchemeList