/*
 * @Author: your name
 * @Date: 2021-02-22 15:40:02
 * @LastEditTime: 2021-04-22 20:08:38
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
    } else if (type === "refuse") {
      return "todo_opt_btn todo_refuse c-btn-red";
    } else if (type === "reback") {
      return "todo_opt_btn todo_reback c-btn-red";
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
