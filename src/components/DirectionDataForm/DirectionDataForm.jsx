import React, { useEffect, useState, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import "moment/locale/zh-cn"
import { Button, Modal, Form, Space, Card, Row, Col, Input, Select, Tooltip, Tag, Divider,Spin, Popover } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import ExemptCard from 'components/RestrictionForm/ExemptCard'
import LimitedCard from 'components/RestrictionForm/LimitedCard'
import TacticAreaProvinceAirportList from 'components/RestrictionForm/TacticAreaProvinceAirportList'
import TacticAreaProvinceAirportInit from 'components/RestrictionForm/TacticAreaProvinceAirportInit'
import TacticSpecialAreaAirportInit from 'components/RestrictionForm/TacticSpecialAreaAirportInit'
import { handleUpdateDirectionData } from 'utils/client'
import { isValidObject, isValidVariable } from '../../utils/basic-verify'
import { SchemeFormUtil } from "utils/scheme-form-util";
const { Option } = Select;

import { NWGlobal } from 'utils/global';


import './EditDirectionDataForm.scss'
import { inject, observer } from "mobx-react";

//方向数据表单整体
function DirectionDataForm(props) {
    // 方向数据对象
    let [directionData, setDirectionData] = useState({});
    let [loading, setLoading] = useState(false);

  // 所有区域标签机场数据
  const areaAirportListData = props.schemeFormData.areaAirportListData;
const alist = props.schemeFormData.sortDirectionAirportData
console.log(alist);

    NWGlobal.setEditDirectionData = function (str) {

        const data = JSON.parse(str);

        // const data = {
        //     directionKey: "区内-IGADA",
        //     directionName: "区内-IGADA",
        //     direction: {
        //         targetUnit: "IGADA",
        //         formerUnit: "QIAN",
        //         behindUnit: "HOU",
        //         exemptFormerUnit: "HUOQIAN",
        //         exemptBehindUnit: "HUOHOU",
        //         depAp: "ZLAK;ZLHZ;ZLQY;ZLXY;ZLYA;ZLYL;ZBAA",
        //         arrAp: "ZLXY;ZLIC",
        //         exemptDepAp: "HUOQI",
        //         exemptArrAp: "HUOJIANG",
        //     },
        //     flowControlFlight: {
        //         flightId: "CCA123;CCA456",
        //         aircraftType: "B747",
        //     },

        // }
        setDirectionData(data);
    }
    // 区域标签机场集合
    const areaLabelAirport = [
        {
            label: '兰州区域',
            airport: 'ZBAL;ZBAR;ZBEN;ZBUH;ZLDH;ZLDL;ZLGL;ZLGM;ZLGY;ZLHB;ZLHX;ZLIC;ZLJC;ZLJQ;ZLLL;ZLLN;ZLTS;ZLXH;ZLXN;ZLYS;ZLZW;ZLZY',
            code: 'ZLLL'
        },
        {
            label: '西安区域',
            airport: 'ZLAK;ZLHZ;ZLQY;ZLXY;ZLYA;ZLYL',
            code: 'ZLXY'
        },
        {
            label: '山东',
            airport: 'ZSDY;ZSJG;ZSJN;ZSLY;ZSQD;ZSRZ;ZSWF;ZSWH;ZSHZ;ZSYT',
            code: 'ZSYT'
        },
        {
            label: '广东',
            airport: 'ZGFS;ZGGG;ZGHZ;ZGLD;ZGMX;ZGNT;ZGOW;ZGSD;ZGSZ;ZGUH;ZGYJ;ZGZJ',
            code: 'ZGZJ'
        },
        {
            label: '广西',
            airport: 'ZGBH;ZGBS;ZGHC;ZGKL;ZGNN;ZGWW;ZGWZ;ZGYL;ZGZH',
            code: 'ZGZH'
        },
        {
            label: '海南',
            airport: 'ZJ??',
            code: 'ZJ??'
        },
        {
            label: '河南',
            airport: 'ZHCC;ZHLY;ZHNY;ZHXY',
            code: 'ZHXY'
        },
        {
            label: '湖北',
            airport: 'ZHES;ZHHH;ZHSN;ZHSS;ZHSY;ZHXF;ZHJZ;ZHYC',
            code: 'ZHYC'
        },
        {
            label: '湖南',
            airport: 'ZGCD;ZGCJ;ZGDY;ZGHA;ZGHY;ZGLG;ZGSY;ZGYY',
            code: 'ZGYY'
        },
        {
            label: '安徽',
            airport: 'ZSAQ;ZSFY;ZSWA;ZSJH;ZSOF;ZSTX',
            code: 'ZSTX'
        },
        {
            label: '福建',
            airport: 'ZSAM;ZSFZ;ZSLO;ZSQZ;ZSSM;ZSWY',
            code: 'ZSWY'
        },
        {
            label: '江苏',
            airport: 'ZSCG;ZSLG;ZSNJ;ZSNT;ZSSH;ZSWX;ZSXZ;ZSYA;ZSYN',
            code: 'ZSYN'
        },
        {
            label: '江西',
            airport: 'ZSCN;ZSGS;ZSGZ;ZSJD;ZSJJ;ZSSR;ZSYC',
            code: 'ZSYC'
        },
        {
            label: '山东',
            airport: 'SDY;ZSJG;ZSJN;ZSLY;ZSQD;ZSRZ;ZSWF;ZSWH;ZSHZ;ZSYT',
            code: 'ZSYT'
        },
        {
            label: '上海市',
            airport: 'ZSPD;ZSSL;ZSSS',
            code: 'ZSSS'
        },
        {
            label: '浙江',
            airport: 'ZSHC;ZSJU;ZSLQ;ZSNB;ZSWZ;ZSYW;ZSZS',
            code: 'ZSZS'
        },
        {
            label: '贵州',
            airport: 'ZUAS;ZUBJ;ZUGY;ZUKJ;ZULB;ZUMT;ZUNP;ZUPS;ZUTR;ZUYI;ZUZY',
            code: 'ZUZY'
        },
        {
            label: '四川',
            airport: 'ZUBZ;ZUDC;ZUDX;ZUGH;ZUGU;ZUGZ;ZUHY;ZUJZ;ZUKD;ZULZ;ZUMY;ZUNC;ZUSN;ZUUU;ZUXC;ZUXJ;ZUTF;ZUYB;ZUZH',
            code: 'ZUZH'
        },
        {
            label: '西藏',
            airport: 'ZUAL;ZUBD;ZULS;ZUNZ;ZURK',
            code: 'ZURK'
        },
        {
            label: '云南',
            airport: 'ZPBS;ZPCW;ZPDL;ZPDQ;ZPJH;ZPJM;ZPLC;ZPLJ;ZPMS;ZPNL;ZPPP;ZPSM;ZPTC;ZPWS;ZPZT',
            code: 'ZPZT'
        },
        {
            label: '重庆市',
            airport: 'ZUCK;ZUQJ;ZUWS;ZUWL;ZUWX',
            code: 'ZUWX'
        },
        {
            label: '北京市',
            airport: 'ZBAA;ZBAD',
            code: 'ZBAD'
        },
        {
            label: '河北',
            airport: 'ZBCD;ZBDH;ZBHD;ZBSJ;ZBSN;ZBZJ',
            code: 'ZBZJ'
        },
        {
            label: '内蒙古',
            airport: 'ZBAL;ZBAR;ZBCF;ZBDS;ZBEN;ZBER;ZBES;ZBHH;ZBHZ;ZBLA;ZBMZ;ZBOW;ZBTL;ZBUC;ZBUH;ZBUL;ZBXH;ZBYZ;ZBZL',
            code: 'ZBZL'
        },
        {
            label: '山西',
            airport: 'ZBCZ;ZBDT;ZBLF;ZBLL;ZBPS;ZBXZ;ZBYC;ZBYN',
            code: 'ZBYN'
        },
        {
            label: '天津市',
            airport: 'ZBTJ',
            code: 'ZBTJ'
        },
        {
            label: '宁夏',
            airport: 'ZLGY;ZLIC;ZLZW',
            code: 'ZLZW'
        },
        {
            label: '甘肃',
            airport: 'ZLDH;ZLJC;ZLJQ;ZLLL;ZLLN;ZLQY;ZLTS;ZLXH;ZLZY',
            code: 'ZLZY'
        },
        {
            label: '青海',
            airport: 'ZLDL;ZLGL;ZLGM;ZLHB;ZLHX;ZLXN;ZLYS',
            code: 'ZLYS'
        },
        {
            label: '陕西',
            airport: 'ZLAK;ZLHZ;ZLXY;ZLYA;ZLYL',
            code: 'ZLYL'
        },
        {
            label: '新疆',
            airport: 'ZW??',
            code: 'ZW??'
        },
        {
            label: '黑龙江',
            airport: 'ZYDQ;ZYDU;ZYFY;ZYHB;ZYHE;ZYJD;ZYJM;ZYJS;ZYJX;ZYLD;ZYMD;ZYMH;ZYQQ;ZYSF',
            code: 'ZYSF'
        },
        {
            label: '吉林',
            airport: 'ZYBA;ZYBS;ZYCC;ZYJL;ZYSQ;ZYTN;ZYYJ',
            code: 'ZYYJ'
        },
        {
            label: '辽宁',
            airport: 'ZYAS;ZYCH;ZYCY;ZYDD;ZYJZ;ZYTL;ZYTT;ZYTX;ZYYK',
            code: 'ZYYK'
        },
        {
            label: '香港',
            airport: 'VHHH',
            code: 'VHHH'
        },
        {
            label: '澳门',
            airport: 'VMMC',
            code: 'VMMC'
        },
        {
            label: '台湾',
            airport: 'RC??',
            code: 'RC??'
        },
    ]

    const systemPage = props.systemPage || {};
    // 用户信息
    const user = systemPage.user || {};


    const { directionName = "", direction = {}, flightProperty = {} } = directionData;

    const { targetUnit, formerUnit, behindUnit, exemptFormerUnit, exemptBehindUnit, useHeight, exemptHeight, depAp, arrAp, exemptDepAp, exemptArrAp } = direction;

    const { flightId = "", wakeFlowLevel = "", airlineType = "", missionType = "", auType = "",
        task = "", organization = "", ability = "", aircraftType = "",
        exemptionFlightId = "", exemptionWakeFlowLevel = "", exemptionAirlineType = "", exemptionMissionType = "", exemptionAuType,
        exemptionTask = "", exemptionOrganization = "", exemptionAbility = "", exemptionAircraftType = "",
    } = flightProperty;

    // 转换成区域标签
    function formatAreaLabel(labelData, airport) {
        let array = labelData.reduce(reducer, airport);
        let sortedArray = [...new Set(array)].sort((a, b) => a.localeCompare(b));
        return sortedArray
    }
    // 筛选机场
    function reducer(accumulator, currentValue, index, array) {
        let currentArr = currentValue.airport.split(';');
        let len = currentArr.length;
        let includesArr = currentArr.filter((v) => accumulator.includes(v));
        if (includesArr.length === len) {
            accumulator = accumulator.map((item) => (currentArr.includes(item) ? currentValue.label : item))
        }
        return accumulator
    }

    // 解析指定数值中的区域标签，转换为对应的机场
    function parseAreaLabelAirport(arr) {
        let result = [];
        if (Array.isArray(arr)) {
            if (arr.length == 0) {
                return result;
            }

            for (let i = 0; i < arr.length; i++) {
                let label = arr[i];
                let airports = findAreadLabelAirport(label);
                if (isValidVariable(airports)) {
                    result = result.concat(airports);
                } else {
                    result = result.concat(label)
                }
            }
        }
        return result;
    }
    // 查找指定区域标签对应的机场集合
    function findAreadLabelAirport(label) {
        for (let i = 0; i < areaLabelAirport.length; i++) {
            let data = areaLabelAirport[i];
            let dataLabel = data.label.trim();
            if (label === dataLabel) {
                let arr = data.airport.split(';');
                return arr;
            }
        }
    }

    // 需要将数值转换为大写的字段
    const upperFields = [
        "targetUnit",
        "formerUnit",
        "behindUnit",
        "exemptFormerUnit",
        "exemptBehindUnit",
        "flightId",
        "exemptionFlightId",
        "aircraftType",
        "exemptionAircraftType",
        "depAp",
        "arrAp",
        "exemptDepAp",
        "exemptArrAp",
    ];

    let abc = 'ZBAL;ZLXY;AAAA;ZBAR;ZBEN;ZBUH;ZLDH;ZLDL;ZLGL;ZLGM;ZLGY;ZLHB;ZLHX;ZLIC;ZLJC;ZLJQ;ZLLL;ZLLN;ZLTS;ZLXH;ZLXN;ZLYS;ZLZW;ZLZY'.split(';');

    let depApArray = isValidVariable(depAp) ? depAp.split(';') : [];
    let arrApArray = isValidVariable(arrAp) ? arrAp.split(';') : [];
    let exemptDepApArray = isValidVariable(exemptDepAp) ? exemptDepAp.split(';') : [];
    let exemptArrApArray = isValidVariable(exemptArrAp) ? exemptArrAp.split(';') : [];

    // 表单初始数值对象集合
    let initialValues = {
        // 方向名称
        directionName: directionName,
        // 基准单元
        targetUnit: targetUnit,
        // 前序单元
        formerUnit: formerUnit,
        // 后序单元
        behindUnit: behindUnit,
        // 豁免前序
        exemptFormerUnit: exemptFormerUnit,
        // 豁免后序
        exemptBehindUnit: exemptBehindUnit,
        // 限制高度
        useHeight: useHeight,
        // 豁免高度
        exemptHeight: exemptHeight,
        // 起飞机场
        depAp: formatAreaLabel(areaLabelAirport, depApArray),
        // 降落机场
        arrAp: formatAreaLabel(areaLabelAirport, arrApArray),
        // 豁免起飞机场
        exemptDepAp: formatAreaLabel(areaLabelAirport, exemptDepApArray),
        // 豁免降落机场
        exemptArrAp: formatAreaLabel(areaLabelAirport, exemptArrApArray),


        // 包含-航班号
        flightId: isValidVariable(flightId) ? flightId.split(';') : [],
        // 包含-尾流类型
        wakeFlowLevel: isValidVariable(wakeFlowLevel) ? wakeFlowLevel.split(';') : [],
        // 包含-运营人
        auType: isValidVariable(auType) ? auType.split(';') : [],
        // 包含-航班类型
        airlineType: isValidVariable(airlineType) ? airlineType.split(';') : [],
        // 包含-客货类型
        missionType: isValidVariable(missionType) ? missionType.split(';') : [],
        // 包含-任务类型
        task: isValidVariable(task) ? task.split(';') : [],
        // 包含-军民航
        organization: isValidVariable(organization) ? organization.split(';') : [],
        // 包含-限制资质
        ability: isValidVariable(ability) ? ability.split(';') : [],
        // 包含-受控机型
        aircraftType: isValidVariable(aircraftType) ? aircraftType.split(';') : [],

        // 不包含-航班号
        exemptionFlightId: isValidVariable(exemptionFlightId) ? exemptionFlightId.split(';') : [],
        // 不包含-尾流类型
        exemptionWakeFlowLevel: isValidVariable(exemptionWakeFlowLevel) ? exemptionWakeFlowLevel.split(';') : [],
        // 不包含-航班类型
        exemptionAirlineType: isValidVariable(exemptionAirlineType) ? exemptionAirlineType.split(';') : [],
        // 不包含-运营人
        exemptionAuType: isValidVariable(exemptionAuType) ? exemptionAuType.split(';') : [],
        // 不包含-客货类型
        exemptionMissionType: isValidVariable(exemptionMissionType) ? exemptionMissionType.split(';') : [],
        // 不包含-任务类型
        exemptionTask: isValidVariable(exemptionTask) ? exemptionTask.split(';') : [],
        // 不包含-军民航
        exemptionOrganization: isValidVariable(exemptionOrganization) ? exemptionOrganization.split(';') : [],
        // 不包含-限制资质
        exemptionAbility: isValidVariable(exemptionAbility) ? exemptionAbility.split(';') : [],
        // 不包含-受控机型
        exemptionAircraftType: isValidVariable(exemptionAircraftType) ? exemptionAircraftType.split(';') : [],
    };

    const [form] = Form.useForm();
    console.log(form);
    useEffect(function () {
        //重置表单，用于重新初始表单的initialValues属性
        form.resetFields();
    }, [user.id, directionData]);

    // 拼接名称
    const spliceName = (fieldData)=> {
        let { targetUnit, formerUnit, behindUnit, depAp, arrAp } = fieldData;
        let name = "";
        if (isValidVariable(formerUnit)) {
            // 前序-基准点
            name = `${formerUnit.toUpperCase()}-${targetUnit.toUpperCase()}`;
        } else if (isValidVariable(depAp) && isValidVariable(depAp.join(';'))) {
            depAp = depAp.join(';').toUpperCase();
            // 起飞机场-基准点
            name = `${depAp}-${targetUnit.toUpperCase()}`;
        } else if (isValidVariable(behindUnit)) {
            // 基准点-后序
            name = `${targetUnit.toUpperCase()}-${behindUnit.toUpperCase()}`;
        } else if (isValidVariable(arrAp) && isValidVariable(arrAp.join(';'))) {
            arrAp = arrAp.join(';').toUpperCase();
            // 基准点-降落机场
            name = `${targetUnit.toUpperCase()}-${arrAp}`;
        } else {
            // 基准点
            name = `${targetUnit.toUpperCase()}`;
        }
        return name;
    }



    /**
     * 自动命名
     *
     * */
    const autofillName = async () => {
        try {
            // 必要校验字段
            const fields = [
                'targetUnit',
            ];
            // 触发表单验证取表单数据
            const values = await form.validateFields(fields);
            // 基准单元
            let { targetUnit } = values;
            let fieldsObj = form.getFieldsValue(['formerUnit', 'behindUnit', 'depAp', 'arrAp']);
            let fieldData = {...fieldsObj, targetUnit}
            let name = spliceName(fieldData);
            // 更新
            form.setFieldsValue({ 'directionName': name });
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };
    /**
     * 自动命名并提交方向
     *
     * */
     const handleAutoFillTacticNameSubmitFormData = (fieldData) => {
        let name = spliceName(fieldData);
        // 更新方向名称
        form.setFieldsValue({ 'directionName': name });
        // 提交
        handleSubmitFormData();
    }
    // 另存为模板
    const saveAsTemplate =()=> {
        Modal.info({
            title: '功能开发中',
            content: (
              <div>
                <p>方向另存为模板功能开发中...</p>
              </div>
            ),
            onOk() {},
          });
    }

    // 应用按钮点击事件
    const handleSubmitButtonClick = async () => {
        try {
            // 触发表单验证取表单数据
            const fieldData = await form.validateFields();
            // 校验方向名称是否与限制条件相符
            checkTacticName(fieldData);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    /**
     * 方向名称检查
     *
     * */
    const checkTacticName = (fieldData) => {
        // 当前方向名称输入框数值
        const directionName = form.getFieldValue('directionName');
        let name = spliceName(fieldData);
        if (name.trim() === directionName.trim()) {
            // 调用提交函数
            handleSubmitFormData();
        } else {
            Modal.confirm({
                title: '提示',
                icon: <ExclamationCircleOutlined />,
                centered: true,
                closable: true,
                content: <div><p>限制条件与方向名称不相符，</p><p>建议自动命名后应用</p></div>,
                okText: '自动命名并应用',
                cancelText: '直接应用',
                onOk: () => { handleAutoFillTacticNameSubmitFormData(fieldData) },
                onCancel: (close) => {
                    // 若close为函数则为取消按钮点击触发，反之为关闭按钮触发
                    if (typeof close === 'function') {
                        // 调用提交函数
                        handleSubmitFormData();
                        // 关闭模态框
                        close();
                    }
                },
            });
        }
    };

    // 处理表单提交数据
    const handleSubmitFormData = async () => {
        try {
            // 触发表单验证取表单数据
            const values = await form.validateFields();
            // 处理提交数据
            const submitData = handleSubmitData(values);
            // 数据提交
            submitFormData(submitData)
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };
    // 清空表单数据,但保留与表单不相关的其他字段及数值
    const restFormData = () => {
        // 复制原数据
        let directionDataCopy = JSON.parse(JSON.stringify(directionData));
        // 方向基本信息数据对象
        let direction = directionDataCopy.direction;
        if (!isValidObject(direction)) {
            directionDataCopy.direction = {};
            direction = directionDataCopy.direction;
        }
        // 方向流控航班类型条件数据对象
        let flightProperty = directionDataCopy.flightProperty;
        if (!isValidObject(flightProperty)) {
            directionDataCopy.flightProperty = {};
            flightProperty = directionDataCopy.flightProperty;
        }

        // 更新方向名称
        directionDataCopy.directionName = "";

        // 更新基准单元
        direction.targetUnit = "";
        // 更新前序单元
        direction.formerUnit = "";
        // 更新后序单元
        direction.behindUnit = "";
        // 更新豁免前序
        direction.exemptFormerUnit = "";
        // 更新豁免后序
        direction.exemptBehindUnit = "";
        // 更新限制高度
        direction.useHeight = "";
        // 更新豁免高度
        direction.exemptHeight = "";

        // 起飞机场
        direction.depAp = "";
        // 降落机场
        direction.arrAp = "";
        // 豁免起飞机场
        direction.exemptDepAp = "";
        // 豁免降落机场
        direction.exemptArrAp = "";

        // 更新流控交通流-包含-航班号
        flightProperty.flightId = "";
        // 更新流控交通流-包含-尾流类型
        flightProperty.wakeFlowLevel = "";
        // 更新流控交通流-包含-运营人
        flightProperty.auType = "";
        // 更新流控交通流-包含-航班类型
        flightProperty.airlineType = "";
        // 更新流控交通流-包含-客货类型
        flightProperty.missionType = "";
        // 更新流控交通流-包含-任务类型
        flightProperty.task = "";
        // 更新流控交通流-包含-军民航
        flightProperty.organization = "";
        // 更新流控交通流-包含-限制资质
        flightProperty.ability = "";
        // 更新流控交通流-包含-受控机型
        flightProperty.aircraftType = "";

        // 更新流控交通流-不包含-航班号
        flightProperty.exemptionFlightId = "";
        // 更新流控交通流-不包含-尾流类型
        flightProperty.exemptionWakeFlowLevel = "";
        // 更新流控交通流-不包含-航班类型
        flightProperty.exemptionAirlineType = "";
        // 更新流控交通流-不包含-运营人
        flightProperty.exemptionAuType = "";
        // 更新流控交通流-不包含-客货类型
        flightProperty.exemptionMissionType = "";
        // 更新流控交通流-不包含-任务类型
        flightProperty.exemptionTask = "";
        // 更新流控交通流-不包含-军民航
        flightProperty.exemptionOrganization = "";
        // 更新流控交通流-不包含-限制资质
        flightProperty.exemptionAbility = "";
        // 更新流控交通流-不包含-受控机型
        flightProperty.exemptionAircraftType = "";
        setDirectionData(directionDataCopy);
    }


    // 将数值批量转换为大写
    const toUpperCaseValues = (values) => {
        for (var v in values) {
            if (upperFields.includes(v)) {
                values[v] = upperCaseValue(values[v]);
            }
        }
        return values;
    };

    // 转换为大写
    const upperCaseValue = (values) => {
        if (typeof values === 'string') {
            return values.toUpperCase();
        } else if (Array.isArray(values)) {
            return values.join(',').toUpperCase().split(',')
        }
    }

    /**
     * 处理表单数据
     * 
     * */
    const handleSubmitData = (values) => {
        // 转为大写
        values = toUpperCaseValues(values);

        // 复制方向数据对象
        let opt = JSON.parse(JSON.stringify(directionData));

        // 方向基本信息数据对象
        let direction = opt.direction;
        if (!isValidObject(direction)) {
            opt.direction = {};
            direction = opt.direction;
        }
        // 方向流控航班类型条件数据对象
        let flightProperty = opt.flightProperty;
        if (!isValidObject(flightProperty)) {
            opt.flightProperty = {};
            flightProperty = opt.flightProperty;
        }

        // 表单字段数据
        const { directionName, targetUnit, formerUnit, behindUnit, exemptFormerUnit, exemptBehindUnit, useHeight, exemptHeight,
            depAp, arrAp, exemptDepAp, exemptArrAp,
            flightId, wakeFlowLevel, auType, airlineType, missionType,
            task, organization, ability, aircraftType,
            exemptionFlightId, exemptionWakeFlowLevel, exemptionAirlineType, exemptionAuType, exemptionMissionType,
            exemptionTask, exemptionOrganization, exemptionAbility, exemptionAircraftType,
        } = values;

        // 更新方向名称
        opt.directionName = directionName;

        // 更新基准单元
        direction.targetUnit = targetUnit;
        // 更新前序单元
        direction.formerUnit = formerUnit;
        // 更新后序单元
        direction.behindUnit = behindUnit;
        // 更新豁免前序
        direction.exemptFormerUnit = exemptFormerUnit;
        // 更新豁免后序
        direction.exemptBehindUnit = exemptBehindUnit;
        // 更新限制高度
        direction.useHeight = useHeight;
        // 更新豁免高度
        direction.exemptHeight = exemptHeight;

        // 起飞机场
        direction.depAp = parseAreaLabelAirport(depAp).join(';');
        // 降落机场
        direction.arrAp = parseAreaLabelAirport(arrAp).join(';');
        // 豁免起飞机场
        direction.exemptDepAp = parseAreaLabelAirport(exemptDepAp).join(';');
        // 豁免降落机场
        direction.exemptArrAp = parseAreaLabelAirport(exemptArrAp).join(';');


        // 更新流控交通流-包含-航班号
        flightProperty.flightId = flightId.join(';');
        // 更新流控交通流-包含-尾流类型
        flightProperty.wakeFlowLevel = wakeFlowLevel.join(';');
        // 更新流控交通流-包含-运营人
        flightProperty.auType = auType.join(';');
        // 更新流控交通流-包含-航班类型
        flightProperty.airlineType = airlineType.join(';');
        // 更新流控交通流-包含-客货类型
        flightProperty.missionType = missionType.join(';');
        // 更新流控交通流-包含-任务类型
        flightProperty.task = task.join(';');
        // 更新流控交通流-包含-军民航
        flightProperty.organization = organization.join(';');
        // 更新流控交通流-包含-限制资质
        flightProperty.ability = ability.join(';');
        // 更新流控交通流-包含-受控机型
        flightProperty.aircraftType = aircraftType.join(';');

        // 更新流控交通流-不包含-航班号
        flightProperty.exemptionFlightId = exemptionFlightId.join(';');
        // 更新流控交通流-不包含-尾流类型
        flightProperty.exemptionWakeFlowLevel = exemptionWakeFlowLevel.join(';');
        // 更新流控交通流-不包含-航班类型
        flightProperty.exemptionAirlineType = exemptionAirlineType.join(';');
        // 更新流控交通流-不包含-运营人
        flightProperty.exemptionAuType = exemptionAuType.join(';');
        // 更新流控交通流-不包含-客货类型
        flightProperty.exemptionMissionType = exemptionMissionType.join(';');
        // 更新流控交通流-不包含-任务类型
        flightProperty.exemptionTask = exemptionTask.join(';');
        // 更新流控交通流-不包含-军民航
        flightProperty.exemptionOrganization = exemptionOrganization.join(';');
        // 更新流控交通流-不包含-限制资质
        flightProperty.exemptionAbility = exemptionAbility.join(';');
        // 更新流控交通流-不包含-受控机型
        flightProperty.exemptionAircraftType = exemptionAircraftType.join(';');
        return opt;
    };

    /**
     * 数据提交
     * */
    const submitFormData = (data) => {
        // 启用loading
        setLoading(true);
        // 转换格式
        let dataString = JSON.stringify(data);
        // 调用客户端方法并传入数据
        handleUpdateDirectionData(dataString);
        // 关闭页面
        window.close();
    };


    /**
     * 更新指定机场字段数值
     *
     * */
    const updateFormAirportFieldValue = (field, value) => {
        let data = {};
        data[field] = value;
        // 更新表单中流控发布类型
        form.setFieldsValue(data);
        // setRenderNumber(renderNumber++);
    };


    // 初始化用户信息
    useEffect(function () {
        const user = localStorage.getItem("user");
        if (isValidVariable(user)) {
            props.systemPage.setUserData(JSON.parse(user));
        }
        // else{
        //     props.history.push('/')
        // }
    }, []);
    // 过滤区域标签机场集合中指定标签对应的机场
    const filterAreaAirport = (label) => {
        for (let i = 0; i < areaLabelAirport.length; i++) {
            let item = areaLabelAirport[i];
            if (item.label.trim() === label.trim()) {
                // 找到第一个匹配的则直接return
                return item.airport;
            }
        }
        return ''
    }
    // 过滤区域标签机场集合中指定code对应的label
    const filterAreaLabel = (code) => {
        for (let i = 0; i < areaLabelAirport.length; i++) {
            let item = areaLabelAirport[i];
            if (item.code.trim() === code.trim()) {
                // 找到第一个匹配的则直接return
                return item.label;
            }
        }
        return ''
    }
    const directArr = (val,airp)=>{
        const visArr = SchemeFormUtil.handleAirportSelectInputValue(
            val,
            areaAirportListData
            );
            // 更新表单数值
        form.setFieldsValue({ [airp] : visArr });
    }

    // 自定义 tag 内容 render
    const tagRender = ({ label, closable, onClose, value }) => {
        var str=value.split('');
        for(var i = 0; i < str.length; i++) {
            str[i].charCodeAt() >= 65 && str[i].charCodeAt() <= 90?str[i]: str[i] = str[i].toUpperCase();
        }
        value = str.join('')
        // 过滤出当前录入的标签下的机场集合
        const isValue = [...new Set(value.split(';'))]
        // console.log(isValue);
        let airport = filterAreaAirport(value);
        // console.log(isValue);
        // 更新表单数值
        // form.setFieldsValue({ [field] : valueArr });
        if (Array.isArray(isValue)) {
            return (
                isValue.map((item,i)=>{
                    return(
                        <Tooltip title={airport || item} key={item}>
                            <Tag
                                closable={closable}
                                onClose={onClose}
                            >
                                {label.props ? label.props.children : item}
                            </Tag>
                        </Tooltip>
                    )
                }
            )
               
            )
        }
        
    }

    // 区域标签快捷点选按钮点击
    function areaBlockChange(value) {
        // 拆分参数
        const arr = value.split('-');
        // 字段名
        const field = arr[0];
        // 区域code
        const code = arr[1];
        // 获取区域集合中对应code的label值
        let label = filterAreaLabel(code);
        // 获取当前字段值
        let fieldValue = form.getFieldValue(field);
        // 若当前字段值中包含此标签label,则不作操作
        if (fieldValue.indexOf(label) > -1) {
            return;
        }
        // 反之将当前label追加到当前字段值中去
        let valueArr = [...fieldValue, label];
        // 更新当前字段值
        updateFormAirportFieldValue(field, valueArr);
    }
    const updataField = (field)=>{
        props.schemeFormData.updateFieldItem(field)
    }
    // 快速录入指定区域机场
    const shortcutInputValue = (label) => {
        const field = props.schemeFormData.fieldListItem
        // 获取当前字段值
        let fieldValue = form.getFieldValue(field) || [];
        // 若当前字段值中包含此标签label,则不作操作
        if (fieldValue.indexOf(label) > -1) {
            return;
        }
        // 反之将当前label追加到当前字段值中去
        let valueArr = [...fieldValue, label];
        // 处理机场数值
        valueArr = SchemeFormUtil.handleAirportSelectInputValue(
        valueArr,
        areaAirportListData
        );
        console.log(999,valueArr);
        // 更新表单数值
        form.setFieldsValue({ [field] : valueArr });
    };
    // 区域标签绘制
    function areaBlock(field) {
        return (
            <Space>
                <Button size="small" onClick={() => { areaBlockChange(`${field}-ZLLL`) }}>兰州区域</Button>
                <Button size="small" onClick={() => { areaBlockChange(`${field}-ZLXY`) }}>西安区域</Button>
                {/* <Button size="small" onClick={() => { areaBlockChange(`${field}-ZSQD`) }}>山东</Button> */}
                {/* <Button size="small" onClick={() => { }}>更多</Button> */}
                <Popover
                    trigger="click"
                    placement="rightTop"
                    content={
                      <TacticAreaProvinceAirportList
                        shortcutInputValue={shortcutInputValue}
                        targetForm={form}
                      />
                    }
                  >
                    <Button size="small" onClick={()=>updataField(field)}>省份</Button>
                </Popover>
            </Space>
        )
    }
    
    return (
        <Spin spinning={loading} >
        <div className="direction-edit-wrapper">
            <Form
                form={form}
                initialValues={initialValues}
                onFinish={(values) => {
                    console.log(values);
                }}
                className={props.bordered ? `advanced_form bordered-form` : "advanced_form"}
            >
                <Fragment>
                    <Card bordered={false}>
                        <Row gutter={24} >
                            <Col span={16}>
                                <Form.Item
                                    label="选择模板"
                                >
                                    <Select
                                        disabled={props.disabledForm}
                                        // mode="tags"
                                        style={{ width: '100%' }}
                                        placeholder="选择模板"
                                        allowClear={true}
                                    >
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                    <Divider style={{ margin: '0 0 6px' }} />
                    <Card bordered={false} className="flow-control-flight">
                        <Row gutter={24} >
                            <Col span={16}>
                                <Form.Item
                                    name="directionName"
                                    label="方向名称"
                                    required={true}
                                    rules={[{ required: true }]}
                                >
                                    <Input allowClear={true} disabled={props.disabledForm} />
                                </Form.Item>
                            </Col>
                            <Col span={3}>
                                <Form.Item >
                                    <Button type="primary" onClick={autofillName} >自动命名</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={8}>
                                <Form.Item
                                    name="formerUnit"
                                    label="前序单元"
                                >
                                    <Input allowClear={true} className="text-uppercase" disabled={props.disabledForm} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="targetUnit"
                                    label="基准单元"
                                    required={true}
                                    rules={[{ required: true }]}
                                >
                                    <Input allowClear={true} className="text-uppercase" disabled={props.disabledForm} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="behindUnit"
                                    label="后序单元"
                                >
                                    <Input allowClear={true} className="text-uppercase" disabled={props.disabledForm} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={8}>
                                <Form.Item
                                    name="exemptFormerUnit"
                                    label="豁免前序"
                                >
                                    <Input allowClear={true} className="text-uppercase" disabled={props.disabledForm} />
                                </Form.Item>
                            </Col>
                            <Col span={8} className="">

                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="exemptBehindUnit"
                                    label="豁免后序"
                                >
                                    <Input allowClear={true} className="text-uppercase" disabled={props.disabledForm} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <TacticAreaProvinceAirportInit />
                            <TacticSpecialAreaAirportInit />
                            <Col span={8}>

                                <Form.Item
                                    name="depAp"
                                    label="起飞机场"
                                >
                                    <Select
                                        disabled={props.disabledForm}
                                        mode="tags"
                                        style={{ width: '100%' }}
                                        placeholder=""
                                        open={false}
                                        onChange={(val) => (directArr(val,'depAp'))}
                                        className="text-uppercase"
                                        allowClear={true}
                                        tagRender={tagRender}
                                    >
                                    </Select>
                                </Form.Item>

                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="useHeight"
                                    label="高度"
                                >
                                    <Input allowClear={true} className="text-uppercase" disabled={props.disabledForm} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="arrAp"
                                    label="降落机场"
                                >
                                    <Select
                                        disabled={props.disabledForm}
                                        mode="tags"
                                        style={{ width: '100%' }}
                                        placeholder=""
                                        open={false}
                                        onChange={(val) => (directArr(val,'arrAp'))}
                                        className="text-uppercase"
                                        allowClear={true}
                                        tagRender={tagRender}
                                    >
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        {
                            props.disabledForm ? "" :
                                <Row gutter={24}>
                                    <Col span={8}>
                                        <Form.Item
                                            className="hidden-label"
                                            name="intervalDepFlight"
                                            label={` `}
                                        >
                                            {areaBlock('depAp')}
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} className=""></Col>
                                    <Col span={8}>
                                        <Form.Item
                                            className="hidden-label"
                                            name="arrAp-area"
                                            label={` `}
                                        >
                                            {areaBlock('arrAp')}
                                        </Form.Item>
                                    </Col>
                                </Row>
                        }

                        <Row gutter={24}>
                            <Col span={8}>
                                <Form.Item
                                    name="exemptDepAp"
                                    label="豁免起飞机场"
                                >
                                    <Select
                                        disabled={props.disabledForm}
                                        mode="tags"
                                        style={{ width: '100%' }}
                                        placeholder=""
                                        open={false}
                                        onChange={(val) => (directArr(val,'exemptDepAp'))}
                                        className="text-uppercase"
                                        allowClear={true}
                                        tagRender={tagRender}
                                    >
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="exemptHeight"
                                    label="豁免高度"
                                >
                                    <Input allowClear={true} className="text-uppercase" disabled={props.disabledForm} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="exemptArrAp"
                                    label="豁免降落机场"
                                >
                                    <Select
                                        disabled={props.disabledForm}
                                        mode="tags"
                                        style={{ width: '100%' }}
                                        placeholder=""
                                        open={false}
                                        onChange={(val) => (directArr(val,'exemptArrAp'))}
                                        className="text-uppercase"
                                        allowClear={true}
                                        tagRender={tagRender}
                                    >
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        {
                            props.disabledForm ? "" :
                                <Row gutter={24}>
                                    <Col span={8}>
                                        <Form.Item
                                            className="hidden-label"
                                            name="exemptDepAp-area"
                                            label={` `}
                                        >
                                            {areaBlock('exemptDepAp')}
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} className=""></Col>
                                    <Col span={8}>
                                        <Form.Item
                                            className="hidden-label"
                                            name="exemptArrAp-area"
                                            label={` `}
                                        >
                                            {areaBlock('exemptArrAp')}
                                        </Form.Item>
                                    </Col>
                                </Row>
                        }
                        <Row gutter={12}>
                            <Col span={12}>
                                <LimitedCard title="包含" disabledForm={props.disabledForm} />
                            </Col>
                            <Col span={12}>
                                <ExemptCard title="不包含" disabledForm={props.disabledForm} />
                            </Col>
                        </Row>
                    </Card>
                </Fragment>

                <footer className="footer-bar">
                    <Space size="middle">
                    <Button size="small" onClick={saveAsTemplate}>另存为模板</Button>
                        <Button type="primary" size="small" onClick={handleSubmitButtonClick}>应用</Button>
                        <Button size="small" onClick={restFormData}>清空</Button>
                    </Space>
                </footer>
            </Form>
        </div>
        </Spin>
    )
}

export default withRouter(inject("systemPage", "schemeFormData")(observer(DirectionDataForm)));