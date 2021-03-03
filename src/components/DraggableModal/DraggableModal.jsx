/*
 * @Author: your name
 * @Date: 2020-12-10 11:11:07
 * @LastEditTime: 2020-12-16 14:29:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\components\ModalBox\ModalBox.jsx
 */
import React, {useState, useRef, useEffect} from 'react'
import Draggable from 'react-draggable';
import { Modal } from 'antd';

const DraggableModal = (props) => {
    let [disabled, setDisabled] = useState(true);
    let [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
    const {
        style={},
        mask=true,
        maskClosable = true,
        title,
        visible= false,
        width,
        destroyOnClose = true,
        handleOk,
        handleCancel,
        footer,
        wrapClassName=""
    } = props;
    const draggleRef = React.createRef();
    const onStart = (event, uiData) => {
        const { clientWidth, clientHeight } = window.document.documentElement;
        const targetRect = draggleRef.current.getBoundingClientRect();
        setBounds({
            left: -targetRect.left + uiData.x,
            right: clientWidth - (targetRect.right - uiData.x),
            top: -targetRect.top + uiData.y,
            bottom: clientHeight - (targetRect.bottom - uiData.y),
        })
    };

    return(
        <Modal
            title={ <div
                style={{
                    width: '100%',
                    cursor: 'move',
                }}
                onMouseOver={() => {
                    setDisabled(false)
                }}
                onMouseOut={() => {
                    setDisabled(true)
                }}
                // fix eslintjsx-a11y/mouse-events-have-key-events
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
                onFocus={() => {}}
                onBlur={() => {}}
                // end
            >
                {title}
            </div> }
            visible={visible}
            mask={mask}
            onOk={handleOk}
            onCancel={handleCancel}
            style={style}
            maskClosable={ maskClosable }
            width={width}
            destroyOnClose = { destroyOnClose }
            footer = { footer }
            wrapClassName="pointer-events-none"
            modalRender={modal => (
                <Draggable
                    disabled={disabled}
                    bounds={bounds}
                    onStart={(event, uiData) => onStart(event, uiData)}
                >
                    <div ref={draggleRef}>{modal}</div>
                </Draggable>
            )}
        >
            {props.children}
        </Modal>
    )
}

export default DraggableModal
