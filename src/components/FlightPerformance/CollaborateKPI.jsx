import React, {
  Fragment,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { inject, observer } from "mobx-react";
import { Spin, Row, Col } from "antd";
import { isValidVariable } from "utils/basic-verify.js";
import { requestGet2 } from "utils/request.js";
import { ReqUrls } from "utils/request-urls.js";
import { customNotice } from "utils/common-funcs";
import PerformanceItemHeader from "./PerformanceItemHeader";
import "./CollaborateKPI.scss";
const CollaborateKPI = function (props) {
  const [loading, setLoading] = useState(false);
  const [flightRecordTypeMap, setFlightRecordTypeMap] = useState({});
  const [fcMap, setFcMap] = useState({});
  const timer = useRef();
  let style = { background: "rgb(69 87 137)", color: "#d4d4d4" };
  const { userSubscribeData = {} } = props;
  let subscribeData = userSubscribeData.subscribeData || {};
  // 区域
  let { focus } = subscribeData;

  //获取数据
  const requestData = useCallback(
    async (nextRefresh, showLoading) => {
      if (showLoading) {
        setLoading(true);
      }
      const timerFunc = function () {
        if (nextRefresh) {
          timer.current = setTimeout(function () {
            requestData(nextRefresh, false);
          }, 30 * 1000);
        }
      };

      try {
        //获取数据
        const resData = await requestGet2({
          url: ReqUrls.totalCollaborateUrl,
          params: {
            targetUnit: focus,
          },
        });
        // console.log("resData", resData);
        //数据赋值
        const {
          flightRecordTypeNumMap = {},
          fcMap = {},
          generateTime = "",
        } = resData;
        setFlightRecordTypeMap(flightRecordTypeNumMap);
        setFcMap(fcMap);
        setLoading(false);
        timerFunc();
      } catch (err) {
        customNotice({
          type: "error",
          message: "获取航班协调数据失败",
        });
        setLoading(false);
        timerFunc();
      }
    },
    [focus]
  );

  const {
    INTERVAL = 0,
    EXEMPT = 0,
    SINGLEEXEMPT = 0,
    INPOOL = 0,
    CTD = 0,
    TOBT = 0,
  } = flightRecordTypeMap;

  //componentDidMount
  useEffect(function () {
    requestData(true, true);
  }, []);

  //componentDidMount
  useEffect(
    function () {
      requestData(false, true);
    },
    [focus]
  );

  return (
    <Fragment>
      <PerformanceItemHeader style={style} title={"协调KPI"} />
      <Spin spinning={loading}>
        <Row className="col_kpi_card">
          <Col span={24} className="sub_title">
            运行配置
          </Col>
          <Col span={4}></Col>
          {/* <Col span={4} className="sub_item">
            <div className="total">
              <div className="item_value">
                <span>总计</span>
                <span className="number">22</span>
                <span>次</span>
              </div>
            </div>
          </Col> */}
          <Col span={4} className="sub_item">
            <div className="item_name">扇区开合</div>
            <div className="item_value">
              <span className="number">0</span>
              <span>次</span>
            </div>
          </Col>
          <Col span={4} className="sub_item">
            <div className="item_name">容量变更</div>
            <div className="item_value">
              <span className="number">0</span>
              <span>次</span>
            </div>
          </Col>
          <Col span={4} className="sub_item">
            <div className="item_name">机场跑道变更</div>
            <div className="item_value">
              <span className="number">0</span>
              <span>次</span>
            </div>
          </Col>
          <Col span={4} className="sub_item">
            <div className="item_name">机场容量变更</div>
            <div className="item_value">
              <span className="number">0</span>
              <span>次</span>
            </div>
          </Col>
        </Row>
        <Row className="col_kpi_card">
          <Col span={24} className="sub_title">
            航班协调
          </Col>
          {/* <Col span={4} className="sub_item">
            <div className="total">
              <div className="item_value">
                <span>总计</span>
                <span className="number">53</span>
                <span>架次</span>
              </div>
            </div>
          </Col> */}
          {/* <Col span={2}></Col> */}
          {/* <Col span={4} className="sub_item">
            <div className="item_name">标记豁免</div>
            <div className="item_value">
              <span className="number">10</span>
              <span>架次</span>
            </div>
          </Col> */}
          {/* <Col span={4} className="sub_item first"> */}
          <Col span={4} className="sub_item ">
            <div className="item_name">全局豁免</div>
            <div className="item_value">
              <span className="number">{EXEMPT}</span>
              <span>架次</span>
            </div>
          </Col>
          <Col span={4} className="sub_item">
            <div className="item_name">单方案豁免</div>
            <div className="item_value">
              <span className="number">{SINGLEEXEMPT}</span>
              <span>架次</span>
            </div>
          </Col>
          <Col span={4} className="sub_item">
            <div className="item_name">半数间隔</div>
            <div className="item_value">
              <span className="number">{INTERVAL}</span>
              <span>架次</span>
            </div>
          </Col>
          <Col span={4} className="sub_item">
            <div className="item_name">出入池</div>
            <div className="item_value">
              <span className="number">{INPOOL}</span>
              <span>架次</span>
            </div>
          </Col>
          <Col span={4} className="sub_item">
            <div className="item_name">调整CTOT</div>
            <div className="item_value">
              <span className="number">{CTD}</span>
              <span>架次</span>
            </div>
          </Col>
          <Col span={4} className="sub_item">
            <div className="item_name">TOBT变更</div>
            <div className="item_value">
              <span className="number">{TOBT}</span>
              <span>架次</span>
            </div>
          </Col>
        </Row>
      </Spin>
    </Fragment>
  );
};

export default inject("userSubscribeData")(observer(CollaborateKPI));
