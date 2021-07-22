import React, { Fragment, useMemo } from "react";
import { Radio } from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import { observer, inject } from "mobx-react";
import { ReqUrls } from "utils/request-urls";
import { encrypt, decrypt } from "utils/crpyto-utils";
import { isValidVariable } from "utils/basic-verify";

function MapBar({ systemPage }) {
  const user = systemPage.user || {};
  const airports = user.airports || "";
  const carriers = user.carriers || "";
  const desCN = user.descriptionCN || "";

  const openMap = () => {
    const airport = encodeURIComponent(encrypt(airports));
    const airline = encodeURIComponent(encrypt(carriers));
    const descriptionCN = encodeURIComponent(encrypt(desCN));
    let baseUrl = ReqUrls.mapWebUrl;
    baseUrl =
      baseUrl +
      "?fullscreen=true&airport=" +
      airport +
      "&airline=" +
      airline +
      "&descriptionCN=" +
      descriptionCN;
    window.open(baseUrl);
  };
  return (
    <Radio.Button
      value="map"
      onClick={(e) => {
        openMap(e);
      }}
    >
      查看地图
    </Radio.Button>
  );
}

export default inject("systemPage")(observer(MapBar));
