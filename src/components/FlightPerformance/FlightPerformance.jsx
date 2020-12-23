/*
 * @Author: your name
 * @Date: 2020-12-15 15:54:57
 * @LastEditTime: 2020-12-16 17:44:02
 * @LastEditors: Please set LastEditors
 * @Description: In U.3ser Settings Edit
 * @FilePath: \WN-CDM\src\components\FlightSearch\FlightSearch.jsx
 */
import React from 'react'
import PerformanceItemHeader from './PerformanceItemHeader'
import List from './List'
import PieChart from './PieChart'
import LineChart from './LineChart'
import './FlightPerformance.scss'


//航班执行情况模块
const FlightPerformance =(props) => {
    return(
        <div className="flight_performance_list_container">

            <div className="performance_item">
                <PerformanceItemHeader style={ {background:"#0c6277", color:"#09f"}}  title="计划"  value="123"  unit="架次"  />
                <div className="content">
                    <List listData={[
                        {
                            id:2,
                            color:"#1890ff",
                            des:"计划起飞",
                            value:1234,
                            unit: "架次"
                        },{
                            id:2,
                            color: "#13c2c2",
                            des:"计划落地",
                            value:99,
                            unit: "架次"
                        },
                        {
                            id:3,
                            color: "#2fc25b",
                            des:"飞越本区",
                            value:12,
                            unit: "架次"
                        },
                        {
                            id:4,
                            color: "#facc14",
                            des:"国际飞越",
                            value:8,
                            unit: "架次"
                        },
                    ]} />
                </div>
            </div>
            <div className="performance_item">
                <PerformanceItemHeader style={ {background:"#595654", color:"#FFCC00"}}  title="执行"  value="88"  unit="%"  />
                <div className="content">
                    <LineChart/>
                </div>
            </div>
            <div className="performance_item">
                <PerformanceItemHeader style={ {background:"#c9b5d8", color:"#9966FF"}}  title="限制"  value="15"  unit="条"  />
                <div className="content">
                    <PieChart/>
                </div>
            </div>
            <div className="performance_item">
                <PerformanceItemHeader style={ {background:"#ff99994c", color:"#CC3366"}} title="绩效"  value="良好"  />
                <div className="content">
                    <List listData={[
                        {
                            id:1,
                            color:"#2fc25b",
                            des:"起飞正常",
                            value:93,
                            unit: "%"
                        },{
                            id:2,
                            color:"#facc14",
                            des:"地面延误",
                            value:14,
                            unit: "架次"
                        },
                        {
                            id:3,
                            color:"#f04864",
                            des:"返航备降",
                            value:7,
                            unit: "架次"
                        },
                    ]}  />
                </div>
            </div>
            <div className="performance_item">
            <PerformanceItemHeader style={ {background:"#ff99994c", color:"#CC3366"}} title="XX"  value="XX"  />
            <div className="content">
                <List listData={[
                    {
                        id:1,
                        color:"#2fc25b",
                        des:"起飞正常",
                        value:93,
                        unit: "%"
                    },{
                        id:2,
                        color:"#facc14",
                        des:"地面延误",
                        value:14,
                        unit: "架次"
                    },
                    {
                        id:3,
                        color:"#f04864",
                        des:"返航备降",
                        value:7,
                        unit: "架次"
                    },
                ]}  />
            </div>
        </div>
        </div>
    )
}


export default FlightPerformance
