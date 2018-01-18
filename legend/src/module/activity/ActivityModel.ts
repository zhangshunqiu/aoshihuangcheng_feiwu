/**
 * 活动数据模型
*/
module game {
	export class ActivityModel extends BaseModel {
		public dailyRankInfo: any = {}; //每日竞技
		public limitGiftInfo: any = {}; //限购礼包
		public dailyRechargeInfo: any = {}; //每日累充
		public continueRechargeInfo: any = {}; //连续充值
		public totalRechargeInfo: any = {}; //累计充值
		public perferentialGiftInfo: any = {};  //特惠礼包

		public redDotDict = {};  //红点字典，key为活动id
		public constructor() {
			super();
		}

		//更新限购礼包信息
		public updateLimitGiftInfo(data) {
			for (let key in this.limitGiftInfo.list) {
				if (this.limitGiftInfo.list[key].id == data.id) {
					this.limitGiftInfo.list[key].left_num = data.left_num;
					break;
				}
				// App.logzrj("data   ",key,this.limitGiftInfo.list[key]);
			}
			// App.logzrj("list",this.limitGiftInfo.list);
		}

		//更新累计充值信息
		public updateTotalRecharge(data) {
			this.totalRechargeInfo["left_time"] = data.left_time;
			this.totalRechargeInfo["charge"] = data.charge;
			this.totalRechargeInfo["state"] = data.state;// 状态 （0不能领 1可领 2已领
		this.checkActicityRedDot(4);
		}

		//更新每日累充信息
		public updateDailyRechargeInfo(data) {
			for (let key in this.dailyRechargeInfo.list) {
				if (this.dailyRechargeInfo.list[key].id == data.id) {
					this.dailyRechargeInfo.list[key].state = 2;
					break;
				}
			}
			this.sortDailyRecharge();
			this.checkActicityRedDot(5);
		}

		//排序每日累充
		public sortDailyRecharge() {
			let final = [];
			let array3 = [];  //未达成
			let array1 = []; //可领
			let array2 = []; //已领
			this.dailyRechargeInfo.list.forEach((value, index, array) => {
				if (value.state == 0) {
					array3.push(value);
				} else if (value.state == 1) {
					array1.push(value);
				} else {
					array2.push(value);
				}
			}, this);
			final = array1.concat(array3, array2);
			this.dailyRechargeInfo.list = final;
		}

		//更新连续充值信息
		public updateContinueRechargeInfo(data) {
			for (let key in this.continueRechargeInfo.list) {
				if (this.continueRechargeInfo.list[key].id == data.id) {
					this.continueRechargeInfo.list[key].state = 2;
					break;
				}
			}
			this.sortContinueRecharge();
		}

		//排序连续充值 0不能领 1可领 2已领
		public sortContinueRecharge() {
			let final = [];
			let array3 = [];  //未达成
			let array1 = []; //可领
			let array2 = []; //已领
			this.continueRechargeInfo.list.forEach((value, index, array) => {
				if (value.state == 0) {
					array3.push(value);
				} else if (value.state == 1) {
					array1.push(value);
				} else {
					array2.push(value);
				}
			}, this);
			final = array1.concat(array3, array2);
			this.continueRechargeInfo.list = final;
		}

		public updatePerferentialGiftInfo(data) {
			this.perferentialGiftInfo = data;
		}

		/**
		 * 活动红点检测，id为活动id
		*/
		public checkActicityRedDot(id) {
			switch (id) {
				case 4: {    //累积充值
					if (this.totalRechargeInfo["state"] == 1) {  //可领取
						this.redDotDict[4] = true;
						App.BtnTipManager.setTypeValue(ConstBtnTipType.ACTIVITY_AllRECHARGE, true);
					} else {
						this.redDotDict[4] = false;
						App.BtnTipManager.setTypeValue(ConstBtnTipType.ACTIVITY_AllRECHARGE, false);
					}
					break;
				}

				case 5: {	//每日累充
					for (let key in this.dailyRechargeInfo.list) {
						if (this.dailyRechargeInfo.list[key].state == 1) {
							this.redDotDict[5] = true;
							App.BtnTipManager.setTypeValue(ConstBtnTipType.ACTIVITY_DAILYRECHARGE, true);
							return;
						}
					}
					this.redDotDict[5] = false;
					App.BtnTipManager.setTypeValue(ConstBtnTipType.ACTIVITY_DAILYRECHARGE, false);
					break;
				}
			}
		}

		public clear() {
			super.clear();
		}

		public destroy() {
			super.destroy();
		}
	}
}