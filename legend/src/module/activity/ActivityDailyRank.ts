/**
 * module: 每日竞技
 * author : zrj
*/
module game {
	export class ActivityDailyRank extends BaseChildView {
		public gp_main: eui.Group;
		public gp_top: eui.Group;
		public lb_time: eui.Label;
		public lb_desc: eui.Label;
		public gp_center: eui.Group;
		public gp_left: eui.Group;
		public lb_name1: eui.Label;
		public lb_level1: eui.Label;
		public gp_right: eui.Group;
		public lb_name2: eui.Label;
		public lb_level2: eui.Label;
		public lb_name3: eui.Label;
		public lb_level3: eui.Label;
		public lb_rank: eui.Label;
		public gp_my: eui.Group;
		public lb_my_level: eui.Label;
		public lb_nextlevel: eui.Label;
		public btn_rank: eui.Button;
		public lb_myLv:eui.Label;
		public lb_stageLv:eui.Label;
		public baseItem1: customui.BaseItem;
		public baseItem2: customui.BaseItem;
		public baseItem3: customui.BaseItem;
		public baseItem4: customui.BaseItem;
		public baseItem_reward: customui.BaseItem;

		public gp_rank: eui.Group;
		public scroller: eui.Scroller;
		public list: eui.List;
		public lb_my_rank: eui.Label;
		public img_return: eui.Image;

		private activityModel: ActivityModel = ActivityModel.getInstance();
		private _viewHandleId: number = 0;

		private _curCondition: number = 0;
		private _countDown: number = 0;
		private _initRank: boolean = false;

		private _rewardid_list: Array<number> = [];
		public constructor(skinName: string) {
			super(skinName);
			this.skinName = "ActivityDailyRankSkin"
		}

		protected childrenCreated() {
			super.childrenCreated();
			this.scroller.viewport = this.list;
			this.list.itemRenderer = ActivityDailyRankItem;
			this.lb_rank.textFlow = [{ text: "查看排名", style: { underline: true } }];
			this.baseItem_reward.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getReward, this);
			this.lb_rank.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showRank, this);
			this.btn_rank.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showRank, this);
			this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeRank, this);
			this.closeRank();
			this.baseItem1.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                if(this._rewardid_list.length>0)
				App.GlobalTips.showItemTips(ClientType.BASE_ITEM, this._rewardid_list[0], null);
			}, this);
			this.baseItem2.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                if(this._rewardid_list.length>1)
				App.GlobalTips.showItemTips(ClientType.BASE_ITEM, this._rewardid_list[1], null);
			}, this);
			this.baseItem3.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                if(this._rewardid_list.length>2)
				App.GlobalTips.showItemTips(ClientType.BASE_ITEM, this._rewardid_list[2], null);
			}, this);
			this.baseItem4.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                if(this._rewardid_list.length>3)
				App.GlobalTips.showItemTips(ClientType.BASE_ITEM, this._rewardid_list[3], null);
			}, this);
		}

		public updateView() {
			let activityData = this.activityModel.dailyRankInfo;
			let info = App.ConfigManager.getDaliyRankInfoById(activityData.rank_id);
			let canGet = false;
			let maxLevel = true;
			this.baseItem_reward.touchEnabled = false;
			this.baseItem_reward.touchChildren = false;
			for (let k in activityData.stage_list) {
				let data = activityData.stage_list[k];
				if (data.state == 0) { //不可领
					maxLevel = false;
					this._curCondition = data.condition;
					break;
				} else if (data.state == 1) {  //可领
					canGet = true;
					maxLevel = false;
					this._curCondition = data.condition;
					break;
				} else if (data.state == 2) { //已领
					this._curCondition = data.condition;
				}
			}

			//App.loglh(this._curCondition);
			//阶段奖励
			for (let k in info.stage_reward_all) {
				if (info.stage_reward_all[k][0] == this._curCondition) {
					// let baseItem = new customui.BaseItem();
					// baseItem.updateBaseItem(info.stage_reward_all[k][1][0],info.stage_reward_all[k][1][1]);
					// baseItem.verticalCenter = 0;
					// baseItem.horizontalCenter = 0;
					// this.gp_my.addChild(baseItem);
					this.baseItem_reward.updateBaseItem(info.stage_reward_all[k][1][0], info.stage_reward_all[k][1][1],info.stage_reward_all[k][1][2]);
					break;
				}
			}

			if (canGet) {
				this.baseItem_reward.touchEnabled = true;
				this.baseItem_reward.touchChildren = true;
			}
			if (maxLevel) {

			}

			this.lb_desc.text = info.des;
			this.lb_my_level.text = activityData.value;
			this.lb_my_rank.textFlow = [{text:info.desc+"总"+info.unit +"："},{text:activityData.value+"",style:{textColor:0xffa200}}];
			this.lb_nextlevel.text = String(this._curCondition);
			this.lb_stageLv.textFlow = [{text:info.desc+"总"+info.unit,style:{textColor:0xBFBFBF}}];
			this.lb_myLv.textFlow = [{text:"我的"+info.desc+info.unit,style:{textColor:0xBFBFBF}}];

			//各个排名奖励
			this.baseItem1.updateBaseItem(info.reward1[0][0], info.reward1[0][1], info.reward1[0][2]);

			this._rewardid_list.push(info.reward1[0][1]);
			if (activityData.list.length > 0) {
				this.lb_level1.text = activityData.list[0].key+"级";
				this.lb_name1.text = activityData.list[0].name;
			}
			this.baseItem2.updateBaseItem(info.reward2[0][0], info.reward2[0][1], info.reward2[0][2]);
			this._rewardid_list.push(info.reward2[0][1]);
			if (activityData.list.length > 1) {
				this.lb_level2.text = activityData.list[1].key+"级";
				this.lb_name2.text = activityData.list[1].name;
			}
			this.baseItem3.updateBaseItem(info.reward3[0][0], info.reward3[0][1], info.reward3[0][2]);
			this._rewardid_list.push(info.reward3[0][1]);
			if (activityData.list.length > 2) {
				this.lb_level3.text = activityData.list[2].key+"级";
				this.lb_name3.text = activityData.list[2].name;
			}
			this.baseItem4.updateBaseItem(info.reward4[0][0], info.reward4[0][1], info.reward4[0][2]);
			this._rewardid_list.push(info.reward4[0][1]);

			//倒计时
			if (this._countDown) {
				App.GlobalTimer.remove(this._countDown);
				this._countDown = undefined;
			}
			this.lb_time.text = InvestUtil.getFormatBySecond1(this.activityModel.dailyRankInfo.left_time);
			this._countDown = App.GlobalTimer.addSchedule(1000, activityData.left_time, this.updateTime, this, () => {
				App.GlobalTimer.remove(this._countDown);
				this._countDown = undefined;
				App.Socket.send(30002, {});
			}, this);

			//排行榜
			if (!this._initRank) {
				this.initRank();
				this._initRank = true;
			}
		}

		private updateTime() {
			this.activityModel.dailyRankInfo.left_time--;
			this.lb_time.text = InvestUtil.getFormatBySecond1(this.activityModel.dailyRankInfo.left_time);
		}

		private getReward() {
			App.Socket.send(30003, { condition: this._curCondition });
		}

		private initRank() {
			let listData = this.activityModel.dailyRankInfo.list;
			this.list.dataProvider = new eui.ArrayCollection(listData);
		}

		private showRank() {
			this.gp_center.visible = false;
			this.gp_rank.visible = true;
		}

		private closeRank() {
			this.gp_center.visible = true;
			this.gp_rank.visible = false;
		}
		/**
		 * 打开窗口
		 */
		public open(openParam: any = null): void {
			super.open(openParam);
			// if (this._viewHandleId == 0) {
			// 	this._viewHandleId = App.EventSystem.addEventListener(PanelNotify.ACTIVITY_UPDATE_VIEW,this.updateView,this);
			// }
			App.Socket.send(30002, {});
		}

		/**
		 * 清理
		 */
		public clear(data: any = null): void {
			super.clear(data);
			// if (this._viewHandleId != 0) {
			// 	App.EventSystem.removeEventListener(PanelNotify.ACTIVITY_UPDATE_VIEW,this._viewHandleId);
			// 	this._viewHandleId = 0;
			// }
			if (this._countDown) {
				App.GlobalTimer.remove(this._countDown);
				this._countDown = undefined;
			}
			this._initRank = false;
		}
		/**
		 * 销毁
		 */
		public destroy(): void {
			super.destroy();
		}
	}

	export class ActivityDailyRankItem extends eui.ItemRenderer {
		public lb_name: eui.Label;
		public lb_rank: eui.Label;
		public lb_level: eui.Label;
		public gp_reward: eui.Group;
		public img_rank : eui.Image;

		private activityModel: ActivityModel = ActivityModel.getInstance();

		public constructor() {
			super();
			this.skinName = "ActivityDailyRankItemSkin";
			let layout = new eui.HorizontalLayout();
			layout.gap = 10;
			layout.horizontalAlign = egret.HorizontalAlign.LEFT;
			layout.verticalAlign = egret.VerticalAlign.MIDDLE;
			this.gp_reward.layout = layout;
		}

		protected dataChanged() {
			let activityData = this.activityModel.dailyRankInfo;
			let info = App.ConfigManager.getDaliyRankInfoById(activityData.rank_id);

			this.lb_rank.text = this.data.rank;
			this.lb_level.text = "总"+ info.unit +"："+this.data.key;
			this.lb_name.text = this.data.name;

			this.gp_reward.removeChildren();
			let item = new customui.BaseItem();
			this.gp_reward.addChild(item);
			this.img_rank.visible = true;
			if (this.data.rank == 1) {
				item.updateBaseItem(info.reward1[0][0], info.reward1[0][1], info.reward1[0][2]);
				RES.getResAsync("ranking list_1_png",(texture)=>{
					this.img_rank.source = texture;
				},this);
			} else if (this.data.rank == 2) {
				item.updateBaseItem(info.reward2[0][0], info.reward2[0][1], info.reward2[0][2]);
				RES.getResAsync("ranking list_2_png",(texture)=>{
					this.img_rank.source = texture;
				},this);
			} else if (this.data.rank == 3) {
				item.updateBaseItem(info.reward3[0][0], info.reward3[0][1], info.reward3[0][2]);
				RES.getResAsync("ranking list_3_png",(texture)=>{
					this.img_rank.source = texture;
				},this);
			} else {
				item.updateBaseItem(info.reward4[0][0], info.reward4[0][1], info.reward4[0][2]);
				this.img_rank.visible = false;
			}
		}
	}


}