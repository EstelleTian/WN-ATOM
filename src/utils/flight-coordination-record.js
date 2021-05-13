/*
 * @Author: your name
 * @Date: 2021-05-12 18:03:12
 * @LastEditTime: 2021-05-12 18:03:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\utils\flight-coordination-record.js
 */
/**
 * FlightCoordinationRecord对象常量
 */
 let FlightCoordinationRecord = {
	/**
	 * 协调类型
	 */
	TYPE_PRIORITY : "PRIORITY",
	TYPE_TOBT : "TOBT",
	TYPE_HOBT : "HOBT",
	TYPE_RUNWAY : "RUNWAY",
	TYPE_BOARDINGTIME : "BOARDING",
	TYPE_CLOSETIME : "CLOSETIME",
	TYPE_AOBT : "AOBT",
	TYPE_POSITION : "POSITION",
	TYPE_CLEARANCE : "CLEARANCE",
	TYPE_MARK_CLEARANCE : "MARK_CLEARANCE",
	TYPE_DELAYREASON : "DELAY",
	TYPE_INPOOL : "INPOOL",
	TYPE_CANCEL : "CANCEL",
	TYPE_DEICE : "DEICE",
	TYPE_MARK_NEED_SLOT: "MARK_NEED_SLOT",
	TYPE_POINT_TIME : "POINT_TIME",
	TYPE_EXCHANGE_SLOT : "EXCHANGE_SLOT",
	TYPE_FORMER_ID : "FORMER_ID",
	TYPE_FME_TODAY : "FME_TODAY",
	TYPE_SLOT_HOBT_PUB : "SLOT_HOBT_PUB",
	TYPE_SLOT_HOBT_CNL : "SLOT_HOBT_CNL",
	TYPE_SLOT_CTOT_PUB : "SLOT_CTOT_PUB",
	TYPE_SLOT_CTOT_CNL : "SLOT_CTOT_CNL",
	TYPE_SLOT_INPOOL : "SLOT_INPOOL",
	TYPE_SLOT_MANUAL : "SLOT_MANUAL",
	TYPE_SLOT_MANUAL_COBT : "SLOT_MANUAL_COBT",
	TYPE_SLOT_MANUAL_CTOT : "SLOT_MANUAL_CTOT",
	TYPE_SLOT_MANUAL_CTO : "SLOT_MANUAL_CTO",
	TYPE_SLOT_MANUAL_DEP_CTO : "SLOT_MANUAL_DEP_CTO",
	TYPE_MARK_READY : 'MARK_READY',
	TYPE_REQ_MANUAL_CTOT : 'REQ_MANUAL_CTOT',
	TYPE_MARK_QUAL_FLIGHT : 'MARK_QUAL_FLIGHT',
	TYPE_MARK_INTERVAL : 'MARK_INTERVAL',
	TYPE_CANCEL_INTERVAL : 'CANCEL_INTERVAL',
	TYPE_MARK_EXEMPT : 'MARK_EXEMPT',
	TYPE_CANCEL_EXEMPT : 'CANCEL_EXEMPT',
	TRANSPONDER_CODE: 'TRANSPONDER_CODE',
	SLOT_MANUAL_CLDT: "SLOT_MANUAL_CLDT",
	GDP_SLOT_PUB:'GDP_SLOT_PUB',
	FIXM_MANUAL_ROUTE:'FIXM_MANUAL_ROUTE',
	SINGLE_FLOW_EXEMPT:'SINGLE_FLOW_EXEMPT',// 单流控豁免(联合)
	GLOBAL_IMMUNITY:'GLOBAL_IMMUNITY', // 全局豁免(联合)
	HALF_INTERVAL:'HALF_INTERVAL', // 半数间隔(联合)
	UPDATE_PASSTIME:'UPDATE_PASSTIME',//过点时间修改(联合)
	CLEAR_PASSTIME:'CLEAR_PASSTIME',//过点时间撤销(联合)
	SLOT_COBT_JOINT:'SLOT_COBT_JOINT', //人工指定COBT(联合)
	CLEAR_COBT_JOINT:'CLEAR_COBT_JOINT', //人工撤销COBT(联合)
	SLOT_CTOT_JOINT:'SLOT_CTOT_JOINT', //人工指定CTOT(联合)
	CLEAR_CTOT_JOINT:'CLEAR_CTOT_JOINT', //人工撤销CTOT(联合)
	CANCEL_IMMUNITY:'CANCEL_IMMUNITY', // 取消全局豁免(联合)
	CANCEL_EXEMPT_JOINT:'CANCEL_EXEMPT_JOINT', // 取消单流控豁免(联合)
	CANCEL_INTERVAL_JOINT:'CANCEL_INTERVAL_JOINT', // 取消半数间隔(联合)
	SLOT_CTOT_SOLD:'SLOT_CTOT_SOLD', // 次日时隙固化

	/**
	 * 协调状态
	 */
	STATUS_DEFAULT : 0,
	STATUS_APPLY : 1,
	STATUS_APPROVE : 2,
	STATUS_REFUSE : 3,
	STATUS_MODIFY : 4,
	STATUS_AGREE:600,//时隙交换同意
	STATUS_WITHDRAW:610,//时隙交换撤回
    STATUS_SYSTEM_ASSIGNED : 500, // 系统分配
    STATUS_MANUAL_ASSIGNED : 510, // 人工分配
    STATUS_SYSTEM_RELEASED  : 550, //系统释放
    STATUS_MANUAL_RELEASED  : 560, //人工释放
	STATUS_AGREE  : 600, // 同意
	STATUS_REVERT  : 610, // 撤回
	STATUS_XIESHANG  : 620, // 协商


	/**
	 * 时隙交换环节状态
	 * */
	SLOT_EXCHANGE_STEP_STATUS_APPLY:"1",  // 申请
	SLOT_EXCHANGE_STEP_STATUS_APPROVE:"2", // 批复(公司批复)
	SLOT_EXCHANGE_STEP_STATUS_REVOKE:"3", //撤回
	SLOT_EXCHANGE_STEP_STATUS_REFUSE:"4", // 拒绝
	SLOT_EXCHANGE_STEP_STATUS_FINISHED:"5", //完成(流量室批复)
	SLOT_EXCHANGE_STEP_STATUS_INVALID:"6", //失效

	/**
	 * 获取协调状态中文
	 * 
	 * @param status
	 * @returns
	 */
	getStatusZh : function(status) {
		let s = parseInt(status, 10); 
		let zh = null;
		switch (s) {
			case this.STATUS_APPLY:
				zh = '申请';
				break;
			case this.STATUS_APPROVE:
				zh = '批复';
				break;
			case this.STATUS_REFUSE:
				zh = '拒绝';
				break;
			case this.STATUS_MODIFY:
				zh = '调整';
				break;
			case this.STATUS_AGREE:
				zh = '同意';
				break;
            case this.STATUS_WITHDRAW:
                zh = '撤回';
                break;
			case this.STATUS_SYSTEM_ASSIGNED:
				zh = '系统分配';
				break;
			case this.STATUS_MANUAL_ASSIGNED:
				zh = '人工分配';
				break;
			case this.STATUS_SYSTEM_RELEASED:
				zh = '系统释放';
				break;
			case this.STATUS_MANUAL_RELEASED:
				zh = '人工释放';
				break;
			case this.STATUS_AGREE:
				zh = '同意';
				break;
			case this.STATUS_REVERT:
				zh = '撤回';
				break;
			case this.STATUS_XIESHANG:
				zh = '协商';
				break;
			default:
				zh = s;
				break;
		}
		return zh;
	},
	
	/**
	 * 获取协调类型中文
	 * 
	 * @param type
	 * @returns
	 */
	getCoordinationTypeZh : function (type){
		let zh = null;
		switch (type) {
			case this.TYPE_PRIORITY:
				zh = '任务';
				break;
			case this.TYPE_TOBT:
				zh = '预关时间TOBT';
				//zh = '预关时间';
				break;
			case this.TYPE_HOBT:
				zh = '协关时间HOBT';
				//zh = '协关时间';
				break;
			case this.TYPE_RUNWAY:
				zh = '跑道RWY';
				//zh = '跑道';
				break;
			case this.TYPE_BOARDINGTIME:
				zh = '上客时间ASBT';
				//zh = '上客时间';
				break;
			case this.TYPE_CLOSETIME:
				zh = '实关时间AGCT';
				//zh = '实关时间';
				break;
			case this.TYPE_AOBT:
				zh = '推出时间AOBT';
				//zh = '推出时间';
				break;
			case this.TYPE_POSITION:
				zh = '机位SPOT';
				//zh = '机位';
				break;
			case this.TYPE_SLOT_MANUAL_CTOT:
				zh = '人工指定CTOT';
				//zh = '人工指定';
				break;
			case this.TYPE_SLOT_MANUAL_COBT:
				zh = '人工指定COBT';
				//zh = '人工指定';
				break;
			case this.TYPE_MARK_CLEARANCE:
				zh = '标记放行';
				break;
			case this.TYPE_CLEARANCE:
				zh = '放行';
				break;	
			case this.TYPE_DELAYREASON:
				zh = '延误原因';
				break;	
			case this.TYPE_INPOOL:
				zh = '等待池';
				break;		
			case this.TYPE_CANCEL:
				zh = '标记取消';
				break;
			case this.TYPE_DEICE:
				zh = '除冰';
				break;
			case this.TYPE_MARK_NEED_SLOT:
				zh = '时隙分配标记';
				break;
			case this.TYPE_POINT_TIME:
				zh = '调整过点时间';
				break;
			case this.TYPE_SLOT_MANUAL_DEP_CTO:
				//zh = '起飞指定CTO';
				zh = '起飞后指定过点时间'; //2019/12/25修改命名
				//zh = '人工指定';
				break;
			case this.TYPE_SLOT_MANUAL_CTO:
				zh = '人工指定CTO';
				//zh = '人工指定';
				break;
			case this.TYPE_EXCHANGE_SLOT:
				zh = '时隙交换';
				break;
			case this.TYPE_FORMER_ID:
				zh = '指定前序航班';
				break;
			case this.TYPE_FME_TODAY:
				zh = '航班计划管理';
				break;
			case this.TYPE_SLOT_HOBT_PUB:
				zh = '发布协关HOBT';
				//zh = '发布协关';
				break;
			case this.TYPE_SLOT_HOBT_CNL:
				zh = '取消协关HOBT';
				//zh = '取消协关';
				break;
			case this.TYPE_SLOT_CTOT_PUB:
				zh = '发布预撤COBT';
				break;
			case this.TYPE_SLOT_CTOT_CNL:
				zh = '取消预撤COBT';
				break;
			case this.TYPE_SLOT_INPOOL:
				zh = '系统入池';
				break;
			case this.TYPE_SLOT_MANUAL:
				zh = '人工指定';
				break;	
			case this.TYPE_MARK_READY:
				zh = '标记准备完毕';
				break;
			case this.TYPE_MARK_QUAL_FLIGHT:
				zh = '标记二类飞行资质';
				break;
			case this.TYPE_MARK_INTERVAL:
				zh = '标记半数间隔';
				break;
			case this.TYPE_CANCEL_INTERVAL:
				zh = '取消半数间隔';
				break;
			case this.TYPE_MARK_EXEMPT:
				zh = '标记单流控豁免';
				break;
			case this.TYPE_CANCEL_EXEMPT:
				zh = '取消单流控豁免';
				break;
			case this.TRANSPONDER_CODE:
				zh = '应答机编码';
				break;
			case this.SLOT_MANUAL_CLDT:
				zh = '人工指定CLDT';
				break;
			case this.GDP_SLOT_PUB:
				zh = '发布到港CLDT';
				break;
			case this.FIXM_MANUAL_ROUTE:
				zh = '调整航线';
				break;
			case this.SINGLE_FLOW_EXEMPT:
				zh = '单流控豁免(联合)';
				break;
			case this.GLOBAL_IMMUNITY:
				zh = '全局豁免(联合)';
				break;
			case this.HALF_INTERVAL:
				zh = '半数间隔(联合)';
				break;
			case this.UPDATE_PASSTIME:
				zh = '过点时间修改(联合)';
				break;
			case this.CLEAR_PASSTIME:
				zh = '过点时间撤销(联合)';
				break;
			case this.SLOT_COBT_JOINT:
				zh = '人工指定COBT(联合)';
				break;
			case this.CLEAR_COBT_JOINT:
				zh = '人工撤销COBT(联合)';
				break;
			case this.SLOT_CTOT_JOINT:
				zh = '人工指定CTOT(联合)';
				break;
			case this.CLEAR_CTOT_JOINT:
				zh = '人工撤销CTOT(联合)';
				break;
			case this.CANCEL_IMMUNITY:
				zh = '取消全局豁免(联合)';
				break;
			case this.CANCEL_EXEMPT_JOINT:
				zh = '取消单流控豁免(联合)';
				break;
			case this.CANCEL_INTERVAL_JOINT:
				zh = '取消半数间隔(联合)';
				break;
			case this.SLOT_CTOT_SOLD:
				zh = '次日时隙固化';
				break;
			default:
				zh = type;
				break;
		}
		return zh;
	},

	/**
	 * 获取时隙交换状态中文
	 * */

	getSlotExchangeStatusZh: function(status){
		let zh = null;
		if( status ==  this.SLOT_EXCHANGE_STEP_STATUS_APPLY || status == this.SLOT_EXCHANGE_STEP_STATUS_APPROVE){
			//时隙状态
			zh = '进行中';
		}else if(status == this.SLOT_EXCHANGE_STEP_STATUS_REVOKE || status == this.SLOT_EXCHANGE_STEP_STATUS_REFUSE){
			zh = '失败';
		}else if(status == this.SLOT_EXCHANGE_STEP_STATUS_FINISHED){
			zh = '完成';
		}else if(status == this.SLOT_EXCHANGE_STEP_STATUS_INVALID){
			zh = '失效';
		}
		return zh;
	},
	/**
	 * 获取ATOM流控状态中文
	 * */

	getInterconnectStatusZh: function(status){
		let zh = null;
		if( status == 100 ){
			//时隙状态
			zh = '新增';
		}else if(status == 200){
			zh = '变更';
		}else if(status == 300 ){
			zh = '终止';
		}
		return zh;
	},
	/**
	 * 获取状态中文
	 * */

	getInterconnectOperationStatusZh: function(status){
		let zh = "待处理";
		if( status == 400 ){
			zh = '已忽略';
		}else if(status == 200){
			zh = '处理中';
		}else if(status == 300 ){
			zh = '已处理';
		}else if(status == 500 ){
			zh = '已结束';
		}
		return zh;
	},
	/**
	 * 获取西部联合放行状态中文
	 * */

	getJointStatusZh: function(status){
		let zh = null;
		if( status*1 == 0 ){
			//联合放行
			zh = '进行中';
		}else if( status*1 == 1 ){
			//联合放行
			zh = '完成';
		}else if( status*1 == 2 ){
			//联合放行
			zh = '失败';
		}else if( status*1 == 3 ){
			//联合放行
			zh = '失效';
		}else if( status*1 == 4 ){
			//联合放行
			zh = '确认中';
		}
		return zh;
	},
	/**
	 * 获取西部联合放行状态中文
	 * */

	getJointType: function(value){
		let res = null;
		if( value == "100" ){
			res = "时隙交换"
		}else if( value == "200" ){
			res = "全局豁免"
		}else if( value == "300" ){
			res = "单流控豁免"
		}else if( value == "400" ){
			res = "半数间隔"
		}else if( value == "500" ){
			res = "过点时间修改"
		}else if( value == "600" ){
			res = "CTOT修改"
		}else if( value == "700" ){
			res = "COBT修改"
		}else if( value == "800" ){
			res = "取消全局豁免"
		}else if( value == "900" ){
			res = "取消单流控豁免"
		}else if( value == "1000" ){
			res = "取消半数间隔"
		}
		return res;
	},
	/**
	 * 获取西部联合放行状态中文
	 * */

	getJointCreateUser: function(value){
		let res = "";
		if( value == "SW" ){
			res = "西南"
		}else if( value == "XA" ){
			res = "西安"
		}else if( value == "XJ" ){
			res = "新疆"
		}else if( value == "LZ" ){
			res = "兰州"
		}else if( value == "CENTER" ){
			res = "中心"
		}
		return res;
	},
	/**
	 * 获取精细化管理状态中文
	 * case 0: res = "审核中"; break;
	 case 1: res = "成功"; break;
	 case 2: res = "失败"; break;
	 * */

	getFixmStatusZh: function(status){
		let zh = "";
		if( status == 0){
			zh = '审核中';
		}else if(status == 1){
			zh = '成功';
		}else if(status == 2){
			zh = '失败';
		}else if(status == 3){
			zh = '协商';
		}else{
			zh = status;
		}
		return zh;
	},
	/**
	 * 获取精细化管理状态中文
	 * */

	getFixmTypeZh: function(value){
		let zh = "";
		if( value ==  'FC_ROUTE_MODIFY'){
			zh = '调整航线';
		}else if(value == 'FC_TOBT_MODIFY'){
			zh = '调整TOBT';
		}else if(value == 'FC_PRIORITY_MODIFY'){
			zh = '调整优先级';
		}else if(value == 'FC_SLOT_EXCHANGE'){
			zh = '时隙交换';
		}
		return zh;
	},

	/**
	 * 获取时隙交换状态背景色
	 * */

	getSlotExchangeStatusDisplayStyle: function(status){
		let style = '';
		if(status == this.SLOT_EXCHANGE_STEP_STATUS_APPLY || status == this.SLOT_EXCHANGE_STEP_STATUS_APPROVE){
			//时隙状态-进行中
			style = 'background-color:#FF9900';
		}else if(status == this.SLOT_EXCHANGE_STEP_STATUS_REVOKE || status == this.SLOT_EXCHANGE_STEP_STATUS_REFUSE){
			//时隙状态-失败
			style = 'background-color:#E26A6A';
		}else if(status == this.SLOT_EXCHANGE_STEP_STATUS_FINISHED){
			//时隙状态-完成
			style = 'background-color:#00CC00';
		}else if(status == this.SLOT_EXCHANGE_STEP_STATUS_INVALID){
			//时隙状态-失效
			style = 'background-color:#eeeeee';
		}

		return style;
	},
	/**
	 * ATOM流控-状态类型
	 * */

	getInterconnectDisplayStyle: function(status){
		let style = '';
		if(status == 100){
			//新增
			style = 'color:#0095EB';
		}else if(status == 300){
			//终止
			style = 'color:#E26A6A';
		}else if(status == 200){
			//变更
			style = 'color:#00CC00';
		}

		return style;
	},
	/**
	 * 获取西部联合放行状态背景色
	 * */

	getJointDisplayStyle: function(status){
		let style = '';
		if(status*1 == 0){
			//时隙状态-进行中
			style = 'background-color:#FF9900';
		}else if(status*1 == 1){
			//时隙状态-完成
			style = 'background-color:#00CC00';
		}else if(status*1 == 2){
			//时隙状态-失败
			style = 'background-color:#E26A6A';
		}else if(status*1 == 3){
			//时隙状态-失效
			style = 'background-color:#E26A6A';
		}else if(status*1 == 4){
			//时隙状态-确认中
			style = 'background-color:#f1c27e';
		}

		return style;
	},

	/**
	 * 获取时隙交换状态中文
	 * */

	getSlotExchangeStepStatusZh: function(stepStatus){
		let zh = null;
		switch (stepStatus) {
			case this.SLOT_EXCHANGE_STEP_STATUS_APPLY:
				zh = '申请';
				break;
			case this.SLOT_EXCHANGE_STEP_STATUS_APPROVE:
				zh = '批复(公司批复)';
				break;
			case this.SLOT_EXCHANGE_STEP_STATUS_REVOKE:
				zh = '撤回';
				break;
			case this.SLOT_EXCHANGE_STEP_STATUS_REFUSE:
				zh = '拒绝';
				break;
			case this.SLOT_EXCHANGE_STEP_STATUS_FINISHED:
				zh = '完成(流量室批复)';
				break;
			case this.SLOT_EXCHANGE_STEP_STATUS_INVALID:
				zh = '失效';
				break;
			default:
				zh = status;
				break;
		}

		return zh;
	},
	/**
	 * 获取时隙交换状态中文
	 * */

	getJointStepStatusZh: function(regionstatus){
		let obj = {};
		//console.log(regionstatus);
		for(let region in regionstatus) {
			let status = regionstatus[region].status;
			let key = "";
			let val = "";
			switch (region){
				case "SW": {
					key = "西南";
					break;
				}
				case "XA": {
					key = "西安";
					break;
				}
				case "LZ": {
					key = "兰州";
					break;
				}
				case "XJ": {
					key = "新疆";
					break;
				}
				case "CENTER": {
					key = "中心";
					break;
				}
			}

			obj[key] = status;
		}
		return obj;
	},
	/**
	 * 协调记录类型状态中文
	 * */
	getFlowTypeZh: function(type){
		let zh;
		switch (type){
			 case "PUBLISH": zh = "发布";break;
			 case "TIME_SEGMENT": zh = "二类放行";break;
			 case "RESERVE_SLOT": zh = "预留时隙";break;
			 case "COMPRESS_STRATEGY": zh = "压缩窗口";break;
			 case "TERMINATE": zh = "人工终止";break;
			 case "UPDATE": zh = "修改";break;
			 case "STOP": zh = "系统终止";break;
			 case "PER_TERMINATE": zh = "即将终止";break;
			 case "FINISHED": zh = "正常结束";break;
			 case "ADJUST_SYSTEM_STATUS": zh = "系统维护";break;
			/***start***/
			/**
			 * @date    20200928
			 * @type    添加
			 * @des     次日预演系统-流控协调记录-增加同步和封盘类型
			 * @version  CRSREQ-202009151200
			 * @name    张旭友
			 * @reason 流控协调记录-增加同步和封盘类型
			 */
			 case "TYPE_NEXTDAY_TOFLOW": zh = "同步";break;
			 case "TYPE_NEXTDAY_CLOSE": zh = "封盘";break;
		    /***end***/
		}

		return zh;
	},
	/**
	 * 协调记录类型状态中文
	 * */
	getFlowStatusZh: function(type){
		let zh;
		switch (type){
			 case "PUBLISH": zh = "发布";break;
			 case "UPDATE": zh = "修改";break;
			 case "STOP": zh = "停止";break;
			 case "ADJUST": zh = "调整";break;
		}

		return zh;
	},
};
export {FlightCoordinationRecord}