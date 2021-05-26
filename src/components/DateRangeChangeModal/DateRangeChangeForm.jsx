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
  Slider,
} from "antd";
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

const { Option } = Select;

//指定前序航班表单
function DateRangeChangeForm(props) {
  const marks = {
    202105260100: "00",
    202105260200: "01",
    202105260300: "02",
    202105260400: {
      style: {
        color: "#f50",
      },
      label: <strong>03</strong>,
    },
  };
  return (
    <Fragment>
      <div>
        <Slider range marks={marks} defaultValue={[26, 37]} />
      </div>
    </Fragment>
  );
}

export default inject(
  "flightTableData",
  "systemPage"
)(observer(DateRangeChangeForm));
