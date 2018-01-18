/**
 * 活动模块控制器
 * author ：zrj
*/
module game {
	export class ActivityController extends BaseController {
		public constructor() {
			super();
			this.initProtocol();
			this.initEventListener();
		}
		/**
		 * 初始化协议
		 */
		protected initProtocol() {
			this.registerProtocal(30001,this.handleActivityList,this);
			this.registerProtocal(30002,this.handleActivityDailyRank,this);
			this.registerProtocal(30003,this.handleActivityDailyRankReward,this);
			this.registerProtocal(30004,this.handleActivityLimitGiftInfo,this);
			this.registerProtocal(30005,this.handleActivityLimitGiftReward,this);
			this.registerProtocal(30008,this.handleActivityTotalRecharge,this);
			this.registerProtocal(30009,this.handleActivityTotalRechargeReward,this);
			this.registerProtocal(30006,this.handleActivityPerferentialGiftInfo,this);
			this.registerProtocal(30007,this.handleActivityGetPerferentialGift,this);
			this.registerProtocal(30010,this.handleActivityDailyRechargeInfo,this);
			this.registerProtocal(30011,this.handleActivityDailyRechargeReward,this);
			this.registerProtocal(30012,this.handleActivityContinueRechargeInfo,this);
			this.registerProtocal(30013,this.handleActivityContinueRechargeReward,this);
		}

		//开服活动信息
		public handleActivityList(data) {
			App.logzrj("data:",data);
			ActivityManager.getInstance().updateActivityDict(data.list);
		}

		//每日竞技信息
		public handleActivityDailyRank(data) {
			App.logzrj("data:",data);
			ActivityModel.getInstance().dailyRankInfo = data;
			this.dispatchEvent(PanelNotify.ACTIVITY_UPDATE_VIEW);
		}

		//每日竞技领取奖励
		public handleActivityDailyRankReward(data) {
			App.logzrj("data:",data);
			App.Socket.send(30002,null);
			this.dispatchEvent(PanelNotify.ACTIVITY_UPDATE_VIEW);
		}


		//限购礼包信息
		public handleActivityLimitGiftInfo(data) {
			App.logzrj("data:",data);
			ActivityModel.getInstance().limitGiftInfo = data;
			this.dispatchEvent(PanelNotify.ACTIVITY_UPDATE_VIEW);
		}

		//限购礼包领取
		public handleActivityLimitGiftReward(data) {
			App.logzrj("data:",data);
			ActivityModel.getInstance().updateLimitGiftInfo(data);
			this.dispatchEvent(PanelNotify.ACTIVITY_UPDATE_VIEW);
		}

		//累计充值信息
		public handleActivityTotalRecharge(data) {
			ActivityModel.getInstance().updateTotalRecharge(data);
			this.dispatchEvent(PanelNotify.ACTIVITY_UPDATE_VIEW);
		}

		//累计充值返回
		public handleActivityTotalRechargeReward(data) {
			ActivityModel.getInstance().totalRechargeInfo["state"] = 2;// 状态 （0不能领 1可领 2已领
			ActivityModel.getInstance().checkActicityRedDot(4);
			this.dispatchEvent(PanelNotify.ACTIVITY_UPDATE_VIEW);
		}


		//每日累充礼包信息
		public handleActivityDailyRechargeInfo(data) {
			App.logzrj("data:",data);
			ActivityModel.getInstance().dailyRechargeInfo = data;
			// ActivityModel.getInstance().sortDailyRecharge();
			ActivityModel.getInstance().updateDailyRechargeInfo(data);
			this.dispatchEvent(PanelNotify.ACTIVITY_UPDATE_VIEW);
		}

		//每日累充礼包领取
		public handleActivityDailyRechargeReward(data) {
			App.logzrj("data:",data);
			ActivityModel.getInstance().updateDailyRechargeInfo(data);
			this.dispatchEvent(PanelNotify.ACTIVITY_UPDATE_VIEW);
		}

		//连续充值礼包信息
		public handleActivityContinueRechargeInfo(data) {
			App.logzrj("data:",data);
			ActivityModel.getInstance().continueRechargeInfo = data;
			ActivityModel.getInstance().sortContinueRecharge();
			this.dispatchEvent(PanelNotify.ACTIVITY_UPDATE_VIEW);
		}

		//连续充值礼包领取
		public handleActivityContinueRechargeReward(data) {
			App.logzrj("data:",data);
			ActivityModel.getInstance().updateContinueRechargeInfo(data);
			this.dispatchEvent(PanelNotify.ACTIVITY_UPDATE_VIEW);
		}

		//特惠礼包信息
		public handleActivityPerferentialGiftInfo(data) {
			(ActivityModel.getInstance() as ActivityModel).updatePerferentialGiftInfo(data);
			this.dispatchEvent(PanelNotify.ACTIVITY_UPDATE_VIEW);
		}
		
		/**
		 * 购买特惠礼包
		 */
		public handleActivityGetPerferentialGift(data) {
			(ActivityModel.getInstance() as ActivityModel).perferentialGiftInfo.list[data.id-1].state = 2;  //购买成功后把购买状态改为已购买
			this.dispatchEvent(PanelNotify.ACTIVITY_UPDATE_VIEW);
		}

		/**
		 * 销毁
		 */
		public destroy() {
			super.destroy();
		}

		/**
		 * 清理
		 */
		public clear() {
			super.clear();
		}
	}
}
