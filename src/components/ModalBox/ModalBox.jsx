/*
 * @Author: your name
 * @Date: 2020-12-10 11:11:07
 * @LastEditTime: 2020-12-16 14:29:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\components\ModalBox\ModalBox.jsx
 */
import React, {useState, useRef, useEffect} from 'react'
import Decorator  from 'components/Decorator/Decorator.jsx'

import './ModalBox.scss'

const ModalBox = (props) => {
    let [contentHeight, setContentHeight] = useState(0);
    let modalRef = useRef();
    const { style={}, className = "", title, showDecorator } = props;


    useEffect(() => {
        let offsetHeight = modalRef.current.offsetHeight
        offsetHeight -= 40
        setContentHeight( offsetHeight )
    }, [contentHeight])
    
    return(
        <div ref={modalRef} className={`modal_box ${ className != "" ? className : ""}`}  style={style} >
        { title != "" ? 
            <div className="box_header">
                <span className="title">{title}</span>
                {
                    showDecorator ?  <Decorator></Decorator> : ""
                }
            </div>
            : ""}
            
            <div className="box_content" style={{ height: contentHeight}}>
                {props.children}
            </div>
        </div>
    )
}

export default ModalBox
