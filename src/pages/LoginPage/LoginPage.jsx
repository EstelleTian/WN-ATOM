import React, { useCallback, useState, useRef, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import md5 from "js-md5";
import { requestGet2 } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import { isValidVariable } from "utils/basic-verify";
import { saveUserInfo, exitSystem, testInternet } from "utils/client";

const msgStyle = {
  top: "110px",
  // left: '-55px',
  position: "relative",
  fontSize: "1.5rem",
};

function LoginPage(props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(1);
  const canvasRef = useRef(null);
  const usernameInput = useRef(null);
  const pwdInput = useRef(null);
  const pageType = props.pageType;
  // alert(navigator.userAgent);

  // 点击登录按钮登录
  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      const username = values.username.trim();
      // 对密码 base64编码 处理
      const password = values.password.trim();
      const cipher = md5(password);

      message.destroy();
      try {
        //校验用户名密码是否正确
        let params = {
          username: username,
          cipher: cipher,
        };
        const verifyObj = await requestGet2({
          url: ReqUrls.loginVerifyUrl,
          params,
        });

        params["macaddress"] = "4C-CC-6A-C9-BA-15";
        params["clientVersion"] = "9.9.9";
        //登录请求
        const data = await requestGet2({
          url: ReqUrls.loginUrl,
          params,
        });
        const { status, user = {}, userConcernTrafficList = {} } = data;
        let obj = {};
        userConcernTrafficList.map((item) => {
          const name = item.concernTrafficName;
          obj[name] = item;
        });

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem(
          "userConcernTrafficList",
          JSON.stringify(Object.values(obj))
        );
        if (pageType === "client") {
          message.success({
            content: "登录成功",
            duration: 5,
            style: msgStyle,
          });
          saveUserInfo(username, password, value + "");
        } else if (pageType === "web") {
          window.open("./#/clearance/web", "_self");
        }

        setLoading(false);
      } catch (err) {
        let msg = err || "登录失败";
        message.error({
          content: msg,
          duration: 10,
          style: msgStyle,
        });
        setLoading(false);
      }
    } catch (e) {}
  });

  // 更新用户信息
  const updateUserInfoData = useCallback((res) => {
    const { updateUserInfo, updateFlowcontrolParams, history } = props;
    // 200 成功
    if (200 === res.status * 1) {
      // 用户信息
      const {
        username = "",
        id: userId,
        waypoints,
        system,
        flowAssemblyAirports,
        systemProgram,
        airports,
        description,
        deiceGroupName,
      } = res.user;
      // 用户权限
      const { allAuthority } = res;
      const params = {
        username, // 用户名
        loginStatus: true, // 登录状态
        userId, // 用户id
        allAuthority, // 用户权限
        airports, // 用户机场
        description, // 用户中文名称
        deiceGroupName, // 除冰分组
      };
      // 更新用户信息
      updateUserInfo(params);
    }
  });

  // useEffect(function(){
  //     setValue(1);
  // },[])

  useEffect(function () {
    let user = localStorage.getItem("user") || "{}";
    user = JSON.parse(user);
    const username = user.username || "";
    // setTimeout(function(){
    // alert("聚焦密码"+username);
    if (isValidVariable(username)) {
      if (username !== "") {
        form.setFieldsValue({
          username,
        });
        //聚焦密码输入框

        pwdInput.current.focus("end");
      }
    } else {
      //聚焦用户名输入框
      usernameInput.current.focus("end");
    }
    // },500)
  }, []);
  return (
    <div className={`login_canvas bg`}>
      <div
        className="close"
        title="关闭"
        onClick={() => {
          exitSystem("");
        }}
      ></div>
      <div className="side_nav left">
        <div className="side_group">
          <div
            onClick={() => {
              setValue(1);
            }}
            className={`side_item m1 ${value == 1 && "active"}`}
          ></div>
          <div
            ref={canvasRef}
            onClick={() => {
              setValue(2);
            }}
            className={`side_item m2 ${value === 2 && "active"}`}
          ></div>
          <div
            onClick={() => {
              setValue(3);
            }}
            className={`side_item m3 ${value === 3 && "active"}`}
          ></div>
        </div>
        <div className="line_bar"></div>
      </div>
      {pageType === "client" && (
        <div
          className="net_btn"
          onClick={(e) => {
            testInternet();
          }}
        >
          {/* 网络连通检测 */}
        </div>
      )}
      <div className="center">
        <div className="title"></div>
        <div className="login_cont">
          <Form
            form={form}
            size="small"
            onFinish={(e) => {
              // e.preventDefault();
              handleSubmit(e);
            }}
            className="login_form"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: "用户名不能为空" }]}
            >
              <Input
                className="form_input"
                prefix={<div className="user_icon" />}
                placeholder="请输入登录ID"
                ref={usernameInput}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "密码不能为空" }]}
            >
              <Input
                type="password"
                className="form_input"
                prefix={<div className="pwd_icon" />}
                placeholder="请输入密码"
                ref={pwdInput}
              />
            </Form.Item>
            {/* 登录按钮 */}
            <Button
              loading={loading}
              type="primary"
              htmlType="submit"
              className="login_btn"
            >
              登录
            </Button>
            {/* <div className="login_btn justify-content-center" ></div> */}
          </Form>
        </div>
      </div>
      <div className="side_nav right">
        <div className="side_group">
          <div
            onClick={() => {
              setValue(4);
            }}
            className={`side_item m4 ${value === 4 && "active"}`}
          ></div>
          <div
            onClick={() => {
              setValue(5);
            }}
            className={`side_item m5 ${value === 5 && "active"}`}
          ></div>
          <div
            onClick={() => {
              setValue(6);
            }}
            className={`side_item m6 ${value === 6 && "active"}`}
          ></div>
        </div>
        <div className="line_bar"></div>
      </div>
    </div>
  );
}

export default LoginPage;
