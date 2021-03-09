
import React, { useState, useEffect, useCallback, memo } from 'react'
import './RunwayListHeader.scss'


//单条方案
function RunwayListHeader(props){
    return (
        <div className="runway-list-header layout-column">
            <div className="layout-row">
                <div className="left-column layout-column justify-content-center">
                    <div className="name">
                        <div className="cell">
                            <span className="runway-name" title="跑道名称" >{`跑道名称`}</span>
                        </div>
                    </div>
                </div>
                <div className="right-column layout-row">
                    <div className="layout-column">
                        <div className="column-box">
                            <div className="cell" title="跑道方向" >{`跑道方向`}</div>
                        </div>
                    </div>
                    <div className="layout-column">
                        <div className="column-box">
                            <div className="cell" title="使用情况" >{`使用情况`}</div>
                        </div>
                    </div>
                    <div className="layout-column">
                        <div className="column-box">
                            <div className="cell" title="起飞间隔" >{`起飞间隔`}</div>
                        </div>
                    </div>
                    <div className="layout-column">
                        <div className="column-box">
                            <div className="cell" title="滑行时间" >{`滑行时间`}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RunwayListHeader