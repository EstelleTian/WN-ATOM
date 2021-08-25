import React, { Fragment, useState, useEffect, useCallback } from "react";
import {
  Form,
  Input,
  Row,
  Col,
  Button,
  Select,
  Spin,
  Modal,
  Space,
  Divider,
  Collapse,
  Checkbox,
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

import { inject, observer } from "mobx-react";
import debounce from "lodash/debounce";
import { requestGet2, request } from "utils/request";
import { ReqUrls, CollaborateUrl } from "utils/request-urls";
import FmeToday from "utils/fmetoday";
import {
  parseFullTime,
  getFullTime,
  isValidObject,
  isValidVariable,
} from "utils/basic-verify";
import RulesDescription from "components/FlightExchangeSlotModal/RulesDescription";
import "./FlightExchangeSlotForm.scss";
const { Panel } = Collapse;

const { Option } = Select;

const convertSpace = (str = "") => {
  const arr = str.split(" ");
  let newStr = "";
  if (arr.length > 0) {
    newStr =
      (arr[0] || "N/A") +
      "    " +
      (arr[1] || "N/A") +
      "         " +
      (arr[2] || "N/A") +
      "     " +
      (arr[3] || "N/A") +
      "   " +
      (arr[4] || "N/A") +
      "   " +
      (arr[5] || "N/A") +
      "      " +
      (arr[6] || "N/A") +
      "        " +
      (arr[7] || "N/A") +
      "      " +
      (arr[8] || "N/A");
  }
  return newStr;
};
const convertSpace2 = (str = "") => {
  const arr = str.split(" ");
  return (
    <span className="slot_input_spans">
      {arr.map((value, index) => (
        <span key={index}>{value}</span>
      ))}
    </span>
  );
};

//航班时隙交换表单
function FlightExchangeSlotForm(props) {
  // 获取备选目标航班请求中标记
  let [fetching, setFetching] = useState(false);
  // 跨公司开关
  let [overKey, setOverKey] = useState(false);
  // 查询关键字
  let [searchKey, setSearchKey] = useState("");

  const {
    flightExchangeSlotFormData,
    systemPage,
    schemeListData,
    exchangeSlot,
  } = props;
  // 用户信息
  const user = systemPage.user || {};

  // 数据请求中loading
  const loading = flightExchangeSlotFormData.loading;
  // 申请航班id
  const claimantFlightid = flightExchangeSlotFormData.claimantFlightid;
  // 申请航班数据(表单显示所需的格式)
  const claimantFlightData =
    flightExchangeSlotFormData.claimantFlightData || {};
  // 申请航班数据
  const claimantFlightCoordinationData =
    flightExchangeSlotFormData.claimantFlightCoordinationData || {};
  // 申请航班格式化后的信息
  let claimantFlightInfo = claimantFlightData.itemText || "";
  // 备选目标航班集合
  const alterTargetFlightList =
    flightExchangeSlotFormData.alterTargetFlightList || [];
  // 格式转换后的备选目标航班集合
  const alterTargetFlightData = alterTargetFlightList.map((item) => {
    // 航班格式化后的信息
    let data = {
      value: item.id,
      text: item.itemText,
    };
    return data;
  });

  // claimantFlightInfo = convertSpace(claimantFlightInfo);
  // 表单初始化默认值
  let initialValues = {
    claimantFlightid: claimantFlightInfo,
  };
  //申请航班id发生变化触发更新
  useEffect(
    function () {
      // 重置备选目标航班集合store
      flightExchangeSlotFormData.updateAlterTargetFlightList({});
      //重置表单，用以表单初始值赋值
      form.resetFields();
      if (isValidVariable(claimantFlightid)) {
        fetchClaimantFlightData();
      }
    },
    [claimantFlightid]
  );

  //申请航班信息变更
  useEffect(
    function () {
      //更新申请航班表单值
      form.setFieldsValue({ claimantFlightid: claimantFlightInfo });
    },
    [claimantFlightInfo]
  );
  //申请航班信息变更
  useEffect(
    function () {
      fetchAlterTargetFlightList("");
    },
    [overKey]
  );

  // 表单
  const [form] = Form.useForm();
  // 目标航班表单下拉选项
  const options = alterTargetFlightData.map((item) => (
    <Option key={item.value}>{convertSpace2(item.text)}</Option>
  ));
  // 请求备选目标航班数据
  const debounceFetcher = debounce(
    (value) => {
      let val = value.trim().toUpperCase();
      setSearchKey(val);
      if (!isValidVariable(val)) {
        return;
      }
      // 重置备选目标航班集合store
      flightExchangeSlotFormData.updateAlterTargetFlightList({});
      setFetching(true);
      fetchAlterTargetFlightList(val);
    },
    500,
    {
      leading: true,
      trailing: false,
    }
  );

  // 处理表单提交数据
  const handleSubmitFormData = async () => {
    try {
      // 触发表单验证取表单数据
      const values = await form.validateFields();
      // 处理提交数据
      const paramsData = handleSubmitData(values);
      Modal.info({
        title: "提交",
        // icon: <ExclamationCircleOutlined />,
        centered: true,
        closable: true,
        content: (
          <div>
            <p>确定提交时隙交换?</p>
          </div>
        ),
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
          submitData(paramsData);
        },
      });
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };

  // 提交数据
  const submitData = (paramsData) => {
    //  启用loading
    flightExchangeSlotFormData.toggleLoad(true);
    // 申请航班的航班号
    let fid = claimantFlightCoordinationData.flightid;
    let title = "时隙交换";

    const opt = {
      url: ReqUrls.applyFlightExchangeSlotUrl,
      method: "POST",
      params: paramsData,
      resFunc: (data) => requestSuccess(data, fid + title),
      errFunc: (err) => requestErr(err, fid + title),
    };
    request(opt);
  };

  // 处理表单提交数据
  const handleSubmitData = (values) => {
    //  航班B id
    let targetFlightId = values.targetFlight;
    //航班B 对象
    let targetFlightData = alterTargetFlightList.find(
      (item) => item.id == values.targetFlight
    );
    // 航班B信息
    let targetFlight = targetFlightData.itemText;

    // 航班A数据
    let claimantFlight = claimantFlightInfo;
    // 用户id
    let userId = user.id;
    //方案id
    const schemeId = schemeListData.activeSchemeId || "";

    let params = {
      userId,
      //航班A id
      flightId: claimantFlightid.toString(),
      //航班B id
      exchangeId: targetFlightId,
      //航班A 信息
      flightFlightItem: claimantFlight,
      //航班B 信息
      exchangeFlightItem: targetFlight,
      // 方案id
      tacticId: schemeId,
      // 方案名称
      tacticName: "",
      // 跨公司开关
      key: overKey,
    };
    return params;
  };
  // 清空表单数据
  const handleClearForm = () => {
    // 重置备选目标航班集合store
    flightExchangeSlotFormData.updateAlterTargetFlightList({});
    //重置表单，用以表单初始值赋值
    form.resetFields();
  };
  //获取备选目标航班列表(航班B)数据
  const fetchAlterTargetFlightList = async (val) => {
    try {
      const userId = user.id || "";
      const result = await requestGet2({
        url:
          ReqUrls.retrieveSubstitutionFmeUrl +
          userId +
          "?queryKey=" +
          val +
          "&exchangeId=" +
          claimantFlightid +
          "&flightId=" +
          "&key=" +
          overKey,
      });
      const alterTargetFlights = result.result || {};
      flightExchangeSlotFormData.updateAlterTargetFlightList(
        alterTargetFlights
      );
      setFetching(false);
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
      setFetching(false);
      flightExchangeSlotFormData.updateAlterTargetFlightList({});
    }
  };

  //获取申请航班(航班A)数据
  const fetchClaimantFlightData = async () => {
    //  启用loading
    flightExchangeSlotFormData.toggleLoad(true);
    try {
      const userId = user.id || "";
      const data = await requestGet2({
        url:
          ReqUrls.retrieveSubstitutionFmeUrl +
          userId +
          "?queryKey=" +
          "&exchangeId=" +
          "&flightId=" +
          claimantFlightid +
          "&key=" +
          overKey,
      });
      const result = data.result || {};
      const claimantFlight = result[claimantFlightid] || {};
      flightExchangeSlotFormData.updateClaimantFlightData(claimantFlight);
      // 关闭loading
      flightExchangeSlotFormData.toggleLoad(false);
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
      // 关闭loading
      flightExchangeSlotFormData.toggleLoad(false);
      flightExchangeSlotFormData.updateClaimantFlightData({});
    }
  };

  //数据提交失败回调
  const requestErr = (err, title) => {
    // 关闭loading
    flightExchangeSlotFormData.toggleLoad(false);
    let errMsg = "";
    if (isValidObject(err) && isValidVariable(err.message)) {
      errMsg = err.message;
    } else if (isValidVariable(err)) {
      errMsg = err;
    }

    Modal.error({
      title: "提交失败",
      content: (
        <span>
          <span>{`${title}提交失败`}</span>
          <br />
          <span>{errMsg}</span>
        </span>
      ),
      centered: true,
      okText: "确定",
    });
  };
  //数据提交成功回调
  const requestSuccess = useCallback((data, title) => {
    // const { flightCoordination } = data;
    //更新单条航班数据
    // props.flightTableData.updateSingleFlight(flightCoordination);
    // 关闭loading
    flightExchangeSlotFormData.toggleLoad(false);
    // 关闭表单模态框
    flightExchangeSlotFormData.toggleModalVisible(false);
    //更新时隙交换列表
    exchangeSlot.setForceUpdate(true);
    Modal.success({
      title: "提交成功",
      content: (
        <span>
          <span>{`${title}提交成功`}</span>
        </span>
      ),
      centered: true,
      okText: "确定",
    });
  });

  return (
    <Spin spinning={loading}>
      <Form
        form={form}
        initialValues={initialValues}
        className="flight-exchange-slot-form"
      >
        <Row gutter={24}>
          <Col span={24}>
            <div>
              <Collapse bordered={false} ghost className="description-collapse">
                <Panel
                  showArrow={false}
                  header={
                    <span>
                      时隙交换规则
                      <QuestionCircleOutlined />
                    </span>
                  }
                  key="1"
                >
                  <RulesDescription />
                </Panel>
              </Collapse>
            </div>
            <div className="over_flag">
              <Checkbox.Group
                options={[{ label: "跨公司", value: "1" }]}
                onChange={(checkedValues) => {
                  if (checkedValues.indexOf("1") > -1) {
                    setOverKey(true);
                  } else {
                    setOverKey(false);
                  }
                }}
              />
            </div>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item label="数据解释" className="form-text-item">
              <span className="ant-form-text">
                <Space size={0} split={<Divider type="vertical" />}>
                  <span>航班号</span>
                  <span>起飞机场</span>
                  <span> 降落机场</span>
                  <span>SOBT</span>
                  <span>GSOBT</span>
                  <span>机型</span>
                  <span>时隙状态</span>
                  <span>受控点</span>
                  <span>受控过点时间</span>
                </Space>
              </span>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="claimantFlightid"
              label="航班A"
              rules={[{ required: true }]}
            >
              <div style={{ paddingLeft: "11px" }}>
                {convertSpace2(claimantFlightInfo)}
              </div>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="targetFlight"
              label="航班B"
              required={true}
              rules={[{ required: true }]}
              className="text-uppercase"
            >
              <Select
                showSearch
                defaultActiveFirstOption={false}
                defaultOpen={true}
                showArrow={false}
                allowClear={true}
                filterOption={false}
                onSearch={debounceFetcher}
                notFoundContent={
                  fetching ? (
                    <Spin size="small" />
                  ) : (
                    "无" + searchKey + "相关可交换时隙航班数据"
                  )
                }
                placeholder="请输入航班号"
              >
                {options}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24} className="btn-box">
            <Button type="primary" onClick={handleSubmitFormData}>
              提交
            </Button>
            <Button onClick={handleClearForm}>清空</Button>
          </Col>
        </Row>
      </Form>
    </Spin>
  );
}

export default inject(
  "flightTableData",
  "schemeListData",
  "flightExchangeSlotFormData",
  "systemPage",
  "exchangeSlot"
)(observer(FlightExchangeSlotForm));
