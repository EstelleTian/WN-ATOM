/*
 * @Author: your name
 * @Date: 2021-05-12 17:52:33
 * @LastEditTime: 2021-05-12 18:06:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\utils\flight-coordination-record-data-util.js
 */
/**
 * 协调记录表格数据
 */
 import {
    isValidVariable,
    isValidObject,
  } from "utils/basic-verify";
  import { FlightCoordinationRecord } from "utils/flight-coordination-record";
  import { FlightCoordination } from "utils/flightcoordination";
 let FlightCoordinationRecordGridTableDataUtil = {

    /**
     *
     * @param record
     * @returns {___data0}
     */
    convertData: function (record) {

        let data = {};

        data.id = record.id || "";

        if (isValidVariable(record.version)) {
            data.version = record.version;
        }

        if (isValidVariable(record.fid)) {
            data.fid = record.fid;
        }

        if (isValidVariable(record.flightid)) {
            data.flightid = record.flightid;
        }

        if (isValidVariable(record.comment)) {
            data.comments = record.comment;
        }

        if (isValidVariable(record.ipAddress)) {
            data.ipAddress = record.ipAddress;
        }

        if (isValidVariable(record.executedate)) {
            data.executedate = record.executedate;
        }

        if (isValidVariable(record.timestamp)) {
            data.timestamp = record.timestamp;
            data.timestamp_title = record.timestamp.substring(6, 8) +
                "/" + record.timestamp.substring(8, 12);
        }

        if (isValidVariable(record.username)) {
            data.username = record.username;
        }

        if (isValidVariable(record.usernameZh)) {
            data.usernameZh = record.usernameZh;
        }

        if (isValidVariable(record.status)) {
            data.status = FlightCoordinationRecord.getStatusZh(record.status);
        }

        if (isValidVariable(record.type)) {
            data.type = FlightCoordinationRecord.getCoordinationTypeZh(record.type);
            if (record.type == FlightCoordinationRecord.TYPE_MARK_CLEARANCE) {
                data.originalValue = FlightCoordination.getMarkClearanceStatusZhFull(record.originalValue);
                data.value = FlightCoordination.getMarkClearanceStatusZhFull(record.value);
            } else if (record.type == FlightCoordinationRecord.TYPE_CLEARANCE) {
                data.originalValue = FlightCoordination.getClearanceStatusZhFull(record.originalValue);
                data.value = FlightCoordination.getClearanceStatusZhFull(record.value);
            } else if (record.type == FlightCoordinationRecord.TYPE_PRIORITY
                || record.type == FlightCoordinationRecord.GLOBAL_IMMUNITY
                || record.type == FlightCoordinationRecord.CANCEL_IMMUNITY
            ) {
                data.originalValue = FlightCoordination.getPriorityZh(record.originalValue);
                data.value = FlightCoordination.getPriorityZh(record.value);
            } else if (record.type == FlightCoordinationRecord.TYPE_INPOOL) {
                data.originalValue = FlightCoordination.getPoolStatusZh(record.originalValue);
                data.value = FlightCoordination.getPoolStatusZh(record.value);
            } else if (record.type == FlightCoordinationRecord.TYPE_DELAYREASON) {
                data.originalValue = FlightCoordination.getDelayReasonZh(record.originalValue);
                data.value = FlightCoordination.getDelayReasonZh(record.value);
            } else if (record.type == FlightCoordinationRecord.TYPE_CANCEL) {
                data.originalValue = FmeToday.getCancelZh(record.originalValue);
                data.value = FmeToday.getCancelZh(record.value);
            } else if (record.type == FlightCoordinationRecord.TYPE_FME_TODAY) {
                data.originalValue = FlightCoordination.getMarkClearanceStatusZhFull(record.originalValue);
                data.value = FlightCoordination.getMarkClearanceStatusZhFull(record.value);
            } else if (record.type == FlightCoordinationRecord.TYPE_DEICE) {
                data.originalValue = FlightCoordination.getDeiceZh(record.originalValue);
                data.value = FlightCoordination.getDeiceZh(record.value);
            } else if (record.type == FlightCoordinationRecord.TYPE_MARK_NEED_SLOT) {
                data.originalValue = FlightCoordination.getMarkNeedSlotZh(record.originalValue);
                data.value = FlightCoordination.getMarkNeedSlotZh(record.value);
            } else if (record.type == FlightCoordinationRecord.TYPE_MARK_EXEMPT
                || record.type == FlightCoordinationRecord.TYPE_CANCEL_EXEMPT
                || record.type == FlightCoordinationRecord.TYPE_MARK_INTERVAL
                || record.type == FlightCoordinationRecord.TYPE_CANCEL_INTERVAL
                || record.type == FlightCoordinationRecord.SINGLE_FLOW_EXEMPT
                || record.type == FlightCoordinationRecord.CANCEL_EXEMPT_JOINT
                || record.type == FlightCoordinationRecord.HALF_INTERVAL
                || record.type == FlightCoordinationRecord.CANCEL_INTERVAL_JOINT
            ) {
                let originalValue = record.originalValue || "[]";
                let value = record.value || "[]";
                data.originalValue = FlightCoordination.getFlowcontrol(JSON.parse(originalValue))
                data.value = FlightCoordination.getFlowcontrol(JSON.parse(value));
            } else if (record.type == FlightCoordinationRecord.TYPE_SLOT_MANUAL_COBT
                || record.type == FlightCoordinationRecord.TYPE_SLOT_MANUAL_CTOT
                || record.type == FlightCoordinationRecord.TYPE_SLOT_MANUAL_CTO
                || record.type == FlightCoordinationRecord.TYPE_SLOT_MANUAL_DEP_CTO
                || record.type == FlightCoordinationRecord.TYPE_EXCHANGE_SLOT
                || record.type == FlightCoordinationRecord.TYPE_REQ_MANUAL_CTOT
                || record.type == FlightCoordinationRecord.SLOT_MANUAL_CLDT
                || record.type ==  FlightCoordinationRecord.GDP_SLOT_PUB
                || record.type ==  FlightCoordinationRecord.SLOT_COBT_JOINT
                || record.type ==  FlightCoordinationRecord.CLEAR_COBT_JOINT
                || record.type ==  FlightCoordinationRecord.SLOT_CTOT_JOINT
                || record.type ==  FlightCoordinationRecord.CLEAR_CTOT_JOINT
                || record.type ==  FlightCoordinationRecord.UPDATE_PASSTIME
                || record.type ==  FlightCoordinationRecord.CLEAR_PASSTIME
                || record.type == FlightCoordinationRecord.SLOT_CTOT_SOLD
            ) {
                let originalMap = null;
                let newMap = null;
                let original = '';
                let value = '';
                if (isValidVariable(record.originalValue)) {
                    originalMap = parseJSON(record.originalValue);
                }
                if (isValidVariable(record.value)) {
                    newMap = parseJSON(record.value);
                }
                for (let index in originalMap) {
                    let point = index;
                    let passtime = originalMap[point];
                    if (isValidVariable(original)) {
                        if (point == 'LOCKED') {
                            original += FlightCoordination.getRecordSlotStatus(passtime, point);
                        } else if (point == 'EXCHANGED') {
                            let status = originalMap[point];
                            original += FlightCoordination.getRecordCtotStatus(status);
                        } else {
                            original = original + ' \n ' + point + ':' + passtime.substring(6, 8)
                                + '/' + passtime.substring(8, 12);
                        }

                    } else {
                        if (point == 'LOCKED') {
                            original += FlightCoordination.getRecordSlotStatus(passtime, point);
                        } else if (point == 'EXCHANGED') {
                            let status = originalMap[point];
                            original += FlightCoordination.getRecordCtotStatus(status);
                        } else {
                            original = point + ':' + passtime.substring(6, 8)
                                + '/' + passtime.substring(8, 12);
                        }
                    }
                }
                for (let index in newMap) {
                    let point = index;
                    let passtime = newMap[point];
                    if (isValidVariable(value)) {
                        if (point == 'LOCKED') {
                            value += FlightCoordination.getRecordSlotStatus(passtime, point);
                        } else if (point == 'EXCHANGED') {
                            let status = newMap[point];
                            value += FlightCoordination.getRecordCtotStatus(status);
                        } else {
                            value = value + ' \n ' + point + ':' + passtime.substring(6, 8)
                                + '/' + passtime.substring(8, 12);
                        }

                    } else {
                        if (point == 'LOCKED') {
                            value += FlightCoordination.getRecordSlotStatus(passtime, point);
                        } else if (point == 'EXCHANGED') {
                            let status = newMap[point];
                            value += FlightCoordination.getRecordCtotStatus(status);
                        } else {
                            value = point + ':' + passtime.substring(6, 8)
                                + '/' + passtime.substring(8, 12);
                        }
                    }

                }
                data.originalValue = original;
                data.value = value;
            } else if (record.type == FlightCoordinationRecord.TYPE_MARK_QUAL_FLIGHT) {
                data.originalValue = FlightCoordination.getMarkQualFlightZh(record.originalValue);
                data.value = FlightCoordination.getMarkQualFlightZh(record.value);
            } else if (record.type == FlightCoordinationRecord.FIXM_MANUAL_ROUTE) {
                let originalValue = record.originalValue || "";
                let value = record.value || "[]";
                value = JSON.parse(value);
                data.originalValue = originalValue;
                data.value = FlightCoordination.getRoute(value);;
            }else {
//					if(isValidVariable(record.originalValue) && record.originalValue.length >= 12){
//						data.originalValue = record.originalValue.substring(6,8) + '/' + record.originalValue.substring(8,12);
//						data.title = record.originalValue;
//					} else {
//						data.originalValue = record.originalValue;
//					}
//					if(isValidVariable(record.value) && record.value.length >= 12){
//						data.value = record.value.substring(6,8) + '/' + record.value.substring(8,12);
//						data.title = record.value;
//					} else {
//						data.value = record.value;
//					}
//					

                if (isValidVariable(record.originalValue) && record.originalValue.length >= 12) {
                    //循环处理以'/'分割的时间数值
                    let oriValTimes = record.originalValue.split('/');
                    let oriValTimeTem = '';
                    for (let i in oriValTimes) {
                        let oriValTime = oriValTimes [i];
                        if (i == 0) {
                            oriValTimeTem = '  ' + oriValTime.substring(6, 8) + '/' + oriValTime.substring(8, 12);
                        } else {
                            oriValTimeTem = ' ' + oriValTimeTem + ' \n ' + ' ' + oriValTime.substring(6, 8) + '/' + oriValTime.substring(8, 12);
                        }
                    }
                    data.originalValue = oriValTimeTem;
                    data.title = record.originalValue;
                } else {
                    data.originalValue = record.originalValue;
                }
                if (isValidVariable(record.value) && record.value.length >= 12) {
                    //循环处理以'/'分割的时间数值
                    let valTimes = record.value.split('/');
                    let valTimeTem = '';
                    for (let i in valTimes) {
                        let valTime = valTimes [i];
                        if (i == 0) {
                            valTimeTem = '  ' + valTime.substring(6, 8) + '/' + valTime.substring(8, 12);
                        } else {
                            valTimeTem = ' ' + valTimeTem + ' \n ' + ' ' + valTime.substring(6, 8) + '/' + valTime.substring(8, 12);
                        }
                    }
                    data.value = valTimeTem;
                    data.title = record.value;
                } else {
                    data.value = record.value;
                }
            }
        }
        if (!isValidVariable(data.originalValue)) {
            data.originalValue = '';
        }
        if (!isValidVariable(data.value)) {
            data.value = '';
        }
        return data;
    }
};
export {FlightCoordinationRecordGridTableDataUtil}