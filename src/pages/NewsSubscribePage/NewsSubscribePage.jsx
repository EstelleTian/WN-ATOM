/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-05-10 14:01:12
 * @LastEditors: Please set LastEditors
 * @Description: 消息订阅
 * @FilePath: \WN-CDM\src\pages\NewsSubscribePage\NewsSubscribePage.jsx
 */
import React, {
  Fragment,
  lazy,
  Suspense,
  useState,
  useEffect,
  useCallback,
} from "react";
import { inject, observer } from "mobx-react";
import { CloseOutlined } from "@ant-design/icons";
import { customNotice } from "utils/common-funcs";
import { Layout, Tooltip, Tree, Button } from "antd";
import { requestGet2, request2 } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import {
  isValidObject,
  isValidVariable,
  formatTimeString,
} from "utils/basic-verify";
import NewsSubscribeCont from "components/NewsSubscribe/NewsSubscribeCont";
import "./NewsSubscribePage.scss";

const { Header, Footer, Sider, Content } = Layout;

//模拟数据
const mockData = {
  userId: 17,
  isUserSubSuc: false,
  userSubCategoryIds: [],
  userSubCategorys: [],
  userCanSubCategoryIds: [],
  userCanSubCategorys: [],
  failIDs: [],
  failCategorys: [],
  noPermissionIds: [],
  noPermissionCategorys: [],
  categorySubscribeConfigs: [
    {
      children: [
        null,
        {
          children: [],
          seq: 1,
          isSubscribe: true,
          id: 66,
          code: "FLAC",
          name: "航班异常编码",
          type: "FLAI",
        },
        {
          children: [],
          seq: 2,
          isSubscribe: true,
          id: 67,
          code: "FLAD",
          name: "航班下降高度异常",
          type: "FLAI",
        },
        {
          children: [],
          seq: 3,
          isSubscribe: true,
          id: 68,
          code: "FLRF",
          name: "航班复飞告警",
          type: "FLAI",
        },
        {
          children: [],
          seq: 4,
          isSubscribe: true,
          id: 69,
          code: "FLCL",
          name: "航班盘旋告警",
          type: "FLAI",
        },
        {
          children: [],
          seq: 5,
          isSubscribe: true,
          id: 70,
          code: "FLCH ",
          name: "航班盘旋告警",
          type: "FLAI",
        },
        {
          children: [],
          seq: 6,
          isSubscribe: true,
          id: 71,
          code: "FLAL",
          name: "航班备降",
          type: "FLAI",
        },
        {
          children: [],
          seq: 7,
          isSubscribe: true,
          id: 72,
          code: "FLRB",
          name: "航班返航",
          type: "FLAI",
        },
        {
          children: [],
          seq: 8,
          isSubscribe: true,
          id: 73,
          code: "FLCD",
          name: "航班临界延误",
          type: "FLAI",
        },
        {
          children: [],
          seq: 9,
          isSubscribe: true,
          id: 74,
          code: "FLNP",
          name: "航班未按时推出",
          type: "FLAI",
        },
        {
          children: [],
          seq: 10,
          isSubscribe: true,
          id: 75,
          code: "FLCW",
          name: "航班关舱门等待超时",
          type: "FLAI",
        },
        {
          children: [],
          seq: 11,
          isSubscribe: true,
          id: 76,
          code: "FLNC",
          name: "航班未收到关舱门时间",
          type: "FLAI",
        },
        {
          children: [],
          seq: 12,
          isSubscribe: true,
          id: 77,
          code: "NAAA",
          name: "临近机场备降预警",
          type: "FLAI",
        },
      ],
      seq: 1,
      isSubscribe: false,
      id: 65,
      name: "航班异常告警信息",
      type: "FLAI",
    },
    {
      children: [
        null,
        {
          children: [],
          seq: 1,
          isSubscribe: true,
          id: 79,
          code: "WTAW",
          name: "机场气象告警",
          type: "WTAI",
        },
        {
          children: [],
          seq: 2,
          isSubscribe: true,
          id: 80,
          code: "WTRW",
          name: "航路段雷雨气象告警",
          type: "WTAI",
        },
      ],
      seq: 2,
      isSubscribe: false,
      id: 78,
      name: "机场气象告警",
      type: "WTAI",
    },
    {
      children: [
        null,
        {
          children: [],
          seq: 1,
          isSubscribe: true,
          id: 82,
          code: "AFAO",
          name: "外区流控信息-新增",
          type: "FTMI",
        },
        {
          children: [],
          seq: 2,
          isSubscribe: true,
          id: 83,
          code: "UFAO",
          name: "外区流控信息-更新",
          type: "FTMI",
        },
        {
          children: [],
          seq: 3,
          isSubscribe: true,
          id: 84,
          code: "TFAO",
          name: "外区流控信息-终止",
          type: "FTMI",
        },
        {
          children: [],
          seq: 4,
          isSubscribe: true,
          id: 85,
          code: "AFAI",
          name: "区内流控信息-新增",
          type: "FTMI",
        },
        {
          children: [],
          seq: 5,
          isSubscribe: true,
          id: 86,
          code: "UFAI",
          name: "区内流控信息-更新",
          type: "FTMI",
        },
        {
          children: [],
          seq: 6,
          isSubscribe: true,
          id: 87,
          code: "TFAI",
          name: "区内流控信息-终止",
          type: "FTMI",
        },
      ],
      seq: 3,
      isSubscribe: false,
      id: 81,
      name: "流控消息",
      type: "FTMI",
    },
    {
      children: [
        null,
        {
          children: [],
          seq: 1,
          isSubscribe: true,
          id: 89,
          code: "SECM",
          name: "扇区状态修改",
          type: "SECI",
        },
        {
          children: [],
          seq: 2,
          isSubscribe: true,
          id: 90,
          code: "SECS",
          name: "扇区状态终止",
          type: "SECI",
        },
      ],
      seq: 4,
      isSubscribe: false,
      id: 88,
      name: "扇区开合信息",
      type: "SECI",
    },
    {
      children: [
        null,
        {
          children: [],
          seq: 1,
          isSubscribe: true,
          id: 92,
          code: "ARWC ",
          name: "机场跑道变更信息",
          type: "OPEI",
        },
        {
          children: [],
          seq: 2,
          isSubscribe: true,
          id: 93,
          code: "SCVM",
          name: "静态容量调整",
          type: "OPEI",
        },
        {
          children: [],
          seq: 3,
          isSubscribe: true,
          id: 94,
          code: "SCTM",
          name: "静态容量阈值调整",
          type: "OPEI",
        },
        {
          children: [],
          seq: 4,
          isSubscribe: true,
          id: 95,
          code: "DCVM",
          name: "动态容量阈值调整",
          type: "OPEI",
        },
        {
          children: [],
          seq: 5,
          isSubscribe: true,
          id: 96,
          code: "DCTV",
          name: "动态容量临时调整",
          type: "OPEI",
        },
        {
          children: [],
          seq: 6,
          isSubscribe: true,
          id: 97,
          code: "DCTM",
          name: "动态容量阈值调整",
          type: "OPEI",
        },
        {
          children: [],
          seq: 7,
          isSubscribe: true,
          id: 98,
          code: "DCTT",
          name: "动态容量临时阈值调整",
          type: "OPEI",
        },
      ],
      seq: 5,
      isSubscribe: false,
      id: 91,
      name: "运行信息",
      type: "OPEI",
    },
    {
      children: [
        null,
        {
          children: [],
          seq: 1,
          isSubscribe: true,
          id: 135,
          code: "DUPD",
          name: "数据更新消息",
          type: "DATA",
        },
        {
          children: [],
          seq: 2,
          isSubscribe: true,
          id: 136,
          code: "DADD",
          name: "数据新增消息",
          type: "DATA",
        },
        {
          children: [],
          seq: 3,
          isSubscribe: true,
          id: 137,
          code: "DDEL",
          name: "数据删除消息",
          type: "DATA",
        },
      ],
      seq: 8,
      isSubscribe: false,
      id: 134,
      name: "数据更新",
      type: "DATA",
    },
  ],
  generateTime: "20210406104619",
  status: 200,
};

const treeData = [
  {
    title: "消息订阅",
    key: "0",
    children: [
      {
        title: "事件订阅",
        key: "0-0",
      },
      //   {
      //     title: "事件订阅2",
      //     key: "0-1",
      //   },
    ],
  },
];

//消息订阅
function NewsSubscribePage(props) {
  const { newsSubscribe } = props;
  //请求成功回调赋值
  const updateResData = (data) => {
    props.newsSubscribe.setData(data);
  };
  //获取消息订阅数据
  const getSubscribeData = async () => {
    // 从localStorage取用户信息并存入stores
    const userStr = localStorage.getItem("user");
    if (isValidVariable(userStr)) {
      const user = JSON.parse(userStr);
      props.systemPage.setUserData(user);
      const userId = user.id || "";
      if (isValidVariable(userId)) {
        const res = await requestGet2({
          url: ReqUrls.getUserSubscribeUrl,
          params: {
            userId: userId,
          },
        });
        // console.log("res", res);
        updateResData(res);
      } else {
        alert("未获取到用户信息，请重新登录");
      }
    }
  };

  //应用
  const saveData = async () => {
    const res = await request2({
      url: ReqUrls.setUserSubscribeUrl,
      method: "POST",
      params: {
        ...props.newsSubscribe.data,
      },
    });
    // console.log(res);
    customNotice({
      type: "success",
      message: "消息订阅应用成功",
      duration: 5,
    });
  };
  // 初始化用户信息
  useEffect(function () {
    // 从localStorage取用户信息并存入stores
    getSubscribeData();
  }, []);

  return (
    <Layout>
      <div className="subscribe_canvas">
        <div className="subscribe_header">
          <div className="title">消息订阅</div>
          <Tooltip title="关闭">
            <div
              className="close"
              onClick={() => {
                // closeMessageDlg("");
              }}
            >
              <CloseOutlined />
            </div>
          </Tooltip>
        </div>
        <div className="subscribe_body">
          <div className="subscribe_side">
            <Tree
              defaultExpandAll
              showLine={{
                showLeafIcon: false,
              }}
              treeData={treeData}
            />
          </div>
          <div className="subscribe_cont">
            <div className="subscribe_cont_buttons">
              <Button
                size="small"
                className={`${
                  newsSubscribe.buttonSelect === "subscribe" ? "active" : ""
                }`}
                onClick={(e) => {
                  newsSubscribe.setButtonSelect("subscribe");
                }}
              >
                订阅事件
              </Button>
              {/* <Button size="small">过滤事件</Button> */}
            </div>
            {newsSubscribe.buttonSelect === "subscribe" && (
              <NewsSubscribeCont />
            )}
          </div>
        </div>
        <div className="subscribe_footer">
          <Button
            size="small"
            type="primary"
            style={{ marginRight: "15px" }}
            onClick={saveData}
          >
            应用
          </Button>
          <Button
            size="small"
            onClick={(e) => {
              getSubscribeData();
              customNotice({
                type: "success",
                message: "消息订阅已重置",
                duration: 5,
              });
            }}
          >
            重置
          </Button>
        </div>
      </div>
    </Layout>
  );
}

export default inject(
  "systemPage",
  "newsSubscribe"
)(observer(NewsSubscribePage));
