
/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2020-12-22 18:35:41
 * @LastEditors: Please set LastEditors
 * @Description: ATOM流控详情
 */
import React, {useEffect, Fragment} from 'react'
import { Tag, Descriptions, Checkbox , Space, Card  } from 'antd'

//NTFM流控交通流信息模块

function TrafficFlow(props){
    const {data} = props;
    const num = data.index + 1;

    return (
        <Fragment>
            <Card title={`交通流${num}`} size="small" className="" bordered={false} >
                <Descriptions  bordered column={{ xxl: 4, xl: 4, lg: 4, md: 3, sm: 2, xs: 1 }}>
                    <Descriptions.Item label="包含关系">
                        包含
                    </Descriptions.Item>
                    <Descriptions.Item label="起飞机场">
                        ZUCK,ZPPP
                    </Descriptions.Item>
                    <Descriptions.Item label="降落机场">
                        ZSNJ,ZSAQ,ZSJH,ZSHC,ZSXZ
                    </Descriptions.Item>
                    <Descriptions.Item label="航路(来向)">
                        A588,A341
                    </Descriptions.Item>
                    <Descriptions.Item label="航路(去向)">
                        A588,A341
                    </Descriptions.Item>
                    <Descriptions.Item label="管制区(来向)" >
                        ZGGGCTA
                    </Descriptions.Item>
                    <Descriptions.Item label="管制区(去向)">
                        ZGGGCTA
                    </Descriptions.Item>
                    <Descriptions.Item label="航路点(来向)">
                        WHA
                    </Descriptions.Item>
                    <Descriptions.Item label="航路点(去向)" >
                        FYG,RENOB
                    </Descriptions.Item>
                    <Descriptions.Item label="飞行方向" >
                        ZBAA,ZBAAA R01,FYG
                    </Descriptions.Item>
                    <Descriptions.Item label="航班号"  >
                        CCA1234,CHB5879
                    </Descriptions.Item>
                    <Descriptions.Item label="尾流"  >
                        M,C
                    </Descriptions.Item>
                    <Descriptions.Item label="航班性质"  >
                        国际
                    </Descriptions.Item>
                    <Descriptions.Item label="运营人"  >
                        国内
                    </Descriptions.Item>
                    <Descriptions.Item label="军民航"  >
                        民用
                    </Descriptions.Item>
                    <Descriptions.Item label="客货"  >
                        客机
                    </Descriptions.Item>
                    <Descriptions.Item label="飞行类型">
                        正班飞行
                    </Descriptions.Item>
                    <Descriptions.Item label="任务性质"  >
                        通用航空飞行
                    </Descriptions.Item>
                    <Descriptions.Item label="机型"  >
                        B737,A320
                    </Descriptions.Item>
                    <Descriptions.Item label="航空公司"  >
                        CCA,CES
                    </Descriptions.Item>
                    <Descriptions.Item label="飞行时长"  >
                        60-120
                    </Descriptions.Item>
                    <Descriptions.Item label="RVSM能力"  >
                        不具备RVSM能力
                    </Descriptions.Item>
                    <Descriptions.Item label="RNP能力"  >
                        L1,O1
                    </Descriptions.Item>
                    <Descriptions.Item label="RNAV能力"  >
                        A1,B1
                    </Descriptions.Item>
                    <Descriptions.Item label="CAT能力"  >
                        CATII
                    </Descriptions.Item>
                    <Descriptions.Item label="高度类型"  >
                        无
                    </Descriptions.Item>
                    <Descriptions.Item label="巡航高度"  >
                        S1010
                    </Descriptions.Item>

                </Descriptions>
            </Card>
        </Fragment>
    )
}


export default TrafficFlow;


