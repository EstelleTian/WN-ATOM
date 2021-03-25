
/*
 * @Author: your name
 * @Date: 2021-03-04 16:39:47
 * @LastEditTime: 2021-03-25 14:46:04
 * @LastEditors: Please set LastEditors
 * @Description: 航班协调-按钮+模态框
 * @FilePath: \WN-ATOM\src\components\NavBar\TodoNav.jsx
 */
import React, { Fragment, useEffect, useCallback, useMemo, useState } from "react";
import { Tabs, Radio, Badge, Modal } from "antd";
import { observer, inject } from "mobx-react";
import SubTable  from 'components/LeftMultiCanvas/SubTable'

function SubTableNav(props) {

    const {
        exemptLen,
        poolLen,
        specialLen,
        expiredLen       
     }= useMemo( ()=>{
        const exemptLen = props.flightTableData.getExemptFlights().length || 0;
        const poolLen = props.flightTableData.getPoolFlights().length || 0;
        const specialLen = props.flightTableData.getSpecialFlights().length || 0;
        const expiredLen = props.flightTableData.getExpiredFlights().length || 0;
        return {
            exemptLen,
            poolLen,
            specialLen,
            expiredLen       
         }
    },[props.flightTableData.list])
    
    
    return (
        <Fragment>
            {
                props.systemPage.user.id !== "" && 
                <Fragment>
                        {
                props.systemPage.userHasAuth(12501 ) && <Radio.Button value="exempt">
                    豁免航班
                        {
                        exemptLen > 0 ?
                            <Badge
                                className="site-badge-count-109"
                                count={exemptLen}
                                style={{ backgroundColor: 'rgb(61, 132, 36)' }}
                            />
                            : ""
                    }
                </Radio.Button>
            }
            {
                props.systemPage.userHasAuth( 12502 ) && <Radio.Button value="pool">
                    等待池
                        {
                        poolLen > 0 ?
                            <Badge
                                className="site-badge-count-109"
                                count={poolLen}
                                style={{ backgroundColor: 'rgb(61, 132, 36)' }}
                            />
                            : ""
                    }
                </Radio.Button>
            }
            {
                props.systemPage.userHasAuth( 12503 ) && <Radio.Button value="special">
                    特殊航班
                        {
                        specialLen > 0 ?
                            <Badge
                                className="site-badge-count-109"
                                count={specialLen}
                                style={{ backgroundColor: 'rgb(61, 132, 36)' }}
                            />
                            : ""
                    }
                </Radio.Button>
            }
            {
                props.systemPage.userHasAuth( 12504 ) && <Radio.Button value="expired">
                    失效航班
                        {
                        expiredLen > 0 ?
                            <Badge
                                className="site-badge-count-109"
                                count={expiredLen}
                                style={{ backgroundColor: 'rgb(61, 132, 36)' }}
                            />
                            : ""
                    }
                </Radio.Button>
            }
                <SubTable />
                </Fragment>
            }
            
           
        </Fragment>

    )
}

export default inject("systemPage", "flightTableData")(observer(SubTableNav))