/*
 * @Author: your name
 * @Date: 2021-02-22 15:02:01
 * @LastEditTime: 2021-02-22 15:18:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\FlightTable\CustomUses.jsx
 */
import React,{ useEffect, useState } from "react";
import { cgreen, cred  } from 'utils/collaborateUtils.js'

export const useTip = ( timer = 1000 ) => {
    const [ tipObj, setTipObj ] = useState({
        visible: false,
        title: "",
        color: ""
    });
    useEffect(function(){
        if( tipObj.visible ){
            setTimeout(function(){
                setTipObj({
                    ...tipObj,
                    visible: false
                });
            }, timer)
        }

    }, [tipObj.visible] )

    return [ tipObj, setTipObj ]

}