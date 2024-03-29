/*
 * @Author: your name
 * @Date: 2021-01-22 16:09:16
 * @LastEditTime: 2021-07-22 10:37:42
 * @LastEditors: Please set LastEditors
 * @Description: 消息当日全部数据
 * @FilePath: \WN-ATOM\src\pages\InfoPage\InfoListPage.jsx
 */
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Layout, Tooltip, Spin, Input, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { inject, observer } from "mobx-react";
import { requestGet } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import { customNotice } from "utils/common-funcs";
import {
  isValidVariable,
  isValidObject,
  formatTimeString,
} from "utils/basic-verify";
import { closeMessageDlg } from "utils/client";
import InfoList from "components/Info/InfoList";
import debounce from "lodash/debounce";
import "./InfoPage.scss";

//消息模块
function InfoTodayPage(props) {
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshBtnLoading, setRefreshBtnLoading] = useState(false);
  let [searchVal, setSearchVal] = useState(""); //输入框过滤 输入内容
  let { newsList, systemPage } = props;
  const { user } = systemPage;
  const { generateTime } = newsList;

  // 请求错误处理
  const requestErr = useCallback((err, content) => {
    let errMsg = "";
    if (isValidObject(err) && isValidVariable(err.message)) {
      errMsg = err.message;
    } else if (isValidVariable(err)) {
      errMsg = err;
    }

    customNotice({
      type: "error",
      message: (
        <div>
          <p>{content}</p>
          <p>{errMsg}</p>
        </div>
      ),
    });
  });
  //获取 最近两小时的消息历史记录
  const requestDatas = useCallback(() => {
    if (!isValidVariable(user.id)) {
      return;
    }
    setLoading(true);
    let url = ReqUrls.getTodayNewsUrl + "?userId=" + user.id;
    let params = {};
    const opt = {
      url,
      method: "GET",
      params,
      resFunc: (data) => {
        //更新消息数据
        const generateTime = data.generateTime || "";
        const result = data.result || [];
        if (result.length > 0) {
          let newMsg = result.filter((msg) => "WFPI" !== msg.dataType);
          props.newsList.addAllNews(newMsg, generateTime);
        }
        setLoading(false);
        setRefreshBtnLoading(false);
      },
      errFunc: (err) => {
        requestErr(err, "消息历史数据获取失败");
        setLoading(false);
        setRefreshBtnLoading(false);
      },
    };
    requestGet(opt);
  }, [user.id]);

  useEffect(function () {
    const user = localStorage.getItem("user");
    if (isValidVariable(user)) {
      props.systemPage.setUserData(JSON.parse(user));
      setLogin(true);
    }
  }, []);

  useEffect(
    function () {
      if (isValidVariable(user.id)) {
        //获取接口
        requestDatas();
      }
    },
    [user.id]
  );

  //根据输入框输入值，检索显示
  const resList = useMemo(() => {
    if (searchVal === "") {
      return newsList;
    }
    const sVal = searchVal.toLowerCase();
    let nList = [];
    newsList.list.map((item) => {
      for (let key in item) {
        let val = item[key] || "";
        val = val + "";
        val = val.toLowerCase();
        if (val.indexOf(sVal) !== -1) {
          nList.push(item);
          return;
        }
      }
    });
    return {
      ...newsList,
      list: nList,
    };
  }, [props.newsList.list.length, searchVal]);

  const handleInputVal = useCallback(
    debounce((values) => {
      setSearchVal(values);
    }, 500),
    []
  );

  return (
    <Layout className="layout">
      {login ? (
        <div className="info_canvas">
          <div className="info_header">
            <div className="title">
              {`消息记录(共 ${resList.list.length || 0}条) `}
              &nbsp; &nbsp;
              {` 数据时间:${formatTimeString(generateTime)}  `}
            </div>
            <Input
              allowClear
              style={{ width: "200px", marginRight: "15px" }}
              defaultValue={searchVal}
              placeholder="请输入要查询的关键字"
              onChange={(e) => {
                handleInputVal(e.target.value);
              }}
            />
            <Button
              type="primary"
              loading={refreshBtnLoading}
              style={{ margin: "0 0.25rem" }}
              onClick={(e) => {
                setRefreshBtnLoading(true);
                //刷新列表
                requestDatas();
              }}
            >
              刷新
            </Button>

            {/* <Tooltip title="关闭">
              <div
                className="close"
                onClick={() => {
                  closeMessageDlg("");
                }}
              >
                <CloseOutlined />{" "}
              </div>
            </Tooltip> */}
          </div>
          <Spin spinning={loading}>
            {resList.list.length > 0 && <InfoList newsList={resList} />}
          </Spin>
        </div>
      ) : (
        ""
      )}
    </Layout>
  );
}

// export default withRouter( InfoPage );
export default inject("newsList", "systemPage")(observer(InfoTodayPage));
