/*
 * @Author: your name
 * @Date: 2021-02-22 15:40:02
 * @LastEditTime: 2021-08-26 15:46:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\LeftMultiCanvas\OptionBtn.jsx
 */
import React, { useState, useCallback, useMemo } from "react";
import { Button } from "antd";
export const OptionBtn = (props) => {
  const { type, text, size = "", callback } = props;

  const [load, setLoad] = useState(false);

  const handleClick = useCallback(
    (e) => {
      setLoad(true);
      callback(setLoad);
      e.stopPropagation();
    },
    [type, text, callback]
  );

  const classStr = useMemo(() => {
    if (type === "agree") {
      return "todo_opt_btn todo_agree c-btn-blue";
    } else if (type === "refuse" || type === "reback") {
      return "todo_opt_btn todo_"+type+" c-btn-red";
    } else if (type === "ignore") {
      return "todo_opt_btn";
    } else {
      return "todo_opt_btn todo_confirm c-btn-green";
    }
  }, [type]);

  return (
    <Button
      size={size}
      loading={load}
      className={classStr}
      onClick={handleClick}
    >
      {text}
    </Button>
  );
};
