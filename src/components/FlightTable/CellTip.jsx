/*
 * @Author: liutianjiao
 * @Date:
 * @LastEditTime: 2021-01-14 15:30:49
 * @LastEditors: liutianjiao
 * @Description: 单元格tips
 * @FilePath: CellTip.jsx
 */
import { Tooltip } from "antd";
import React,{ useEffect, useState } from "react";
import { cgreen, cred  } from 'utils/collaborateUtils.js'

const CellTip = ( props ) => {
    const [ tipObj, setTipObj] = useState({
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
            }, 1000)
        }

    }, [tipObj.visible] )

    return (
        <Tooltip title={ tipObj.title } visible={ tipObj.visible } color={ tipObj.color }>
            <div  onContextMenu={ e=>{ setTipObj({
                visible: true,
                title: props.title,
                color: cgreen
            }); }}>
                {props.children}
            </div>
        </Tooltip>
    )


}

//
// const defaultObj = {
//     visible: false,
//     title: "",
//     color: ""
// }
// //航班号右键协调框
// let CellTip = (props) => {
//     const [ tipObj, setTipObj] = useState(defaultObj);
//     useEffect(function(){
//         if( tipObj.visible ){
//             setTimeout(function(){
//                 setTipObj({
//                     visible: false,
//                     title: '',
//                     color: ""
//                 });
//             }, 2500)
//         }
//         return function(){
//             console.log("tooltip卸载了");
//         }
//     }, [ tipObj.visible ] );
//
//     return(
//         <Tooltip title={ props.title } visible={ props.visible } color={ props.color }>
//             { props.children }
//         </Tooltip>
//     )
// }
export default CellTip

