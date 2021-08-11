/*
 * @Author: your name
 * @Date: 2020-12-18 18:39:39
 * @LastEditTime: 2021-08-11 10:40:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\components\Common\DateRange.jsx
 */
import React, { useEffect, useCallback, useRef } from "react";
import { isValidVariable, isValidObject } from "utils/basic-verify.js";
import { request2 } from "utils/request.js";
import { ReqUrls } from "utils/request-urls.js";
import { customNotice } from "utils/common-funcs";

//计划时间范围获取数据
function PostUserInfo() {
  // 定时器
  let timer = useRef();
  // 定时请求
  const requestTimer = () => {
    // 清除定时器
    clearTimeout(timer.current);
    timer.current = "";
    // 获取数据
    postUserInfo();
    // 定时间隔 10分钟
    let timerInterval = 10 * 60 * 1000;
    // 开启定时
    timer.current = setTimeout(requestTimer, timerInterval);
  };

  //获取数据
  const postUserInfo = useCallback(async () => {
    try {
      const user = localStorage.getItem("user") || "";
      const token = localStorage.getItem("token") || "";

      //获取数据
      const resData = await request2({
        url: ReqUrls.postUserInfoUrl + "?clientVersion=9.9.9&token=" + token,

        method: "POST",
        params: user,
      });
      //   console.log(resData);
    } catch (err) {
      //   console.log(err);
      //   customNotice({
      //     type: "error",
      //     message: "计划时间范围数据获取失败",
      //   });
    }
  }, []);
  //componentDidMount
  useEffect(function () {
    //开启定时上传用户信息
    requestTimer();
  }, []);
  return null;
}

export default PostUserInfo;
