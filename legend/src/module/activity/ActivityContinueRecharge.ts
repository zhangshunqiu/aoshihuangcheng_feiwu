/**
 * module: 连续充值
 * author : zrj
*/
module game {
	export class ActivityContinueRecharge extends BaseChildView {
		public gp_main : eui.Group;
		public gp_top : eui.Group;
		public lb_time : eui.Label;
		public lb_desc : eui.Label;
		public lb_have_day : eui.Label;
		public btn_recharge : eui.Button;
		public scroller : eui.Scroller;
		public btn_rechange:eui.Button;
		public list : eui.List = new eui.List();

		private activityModel :ActivityModel = ActivityModel.getInstance();
		private _viewHandleId : number = 0;

		private _dataArray : eui.ArrayCollection;
		private _countDown : number = 0;
		public constructor(skinName: string) {
			super(skinName);
			this.skinName = "ActivityContinueRechargeSkin"
		}

		protected childrenCreated() {
			super.childrenCreated();
			this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
			this.scroller.verticalScrollBar.autoVisibility = false;
			this.scroller.verticalScrollBar.visible = false;
			this.list.itemRenderer = ActivityContinueRechargeItem;
			this.scroller.viewport = this.list;
			this.btn_rechange.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
				RechargeOpenManager.getInstance().openRechargeView();
			},this);
		}

		public updateView() {
			let activityData = this.activityModel.continueRechargeInfo;
			if (!this._dataArray) {
				this._dataArray = new eui.ArrayCollection(this.activityModel.continueRechargeInfo.list);
				this.list.dataProvider = this._dataArray;
			} else { //有数据了，刷新就行
				// this._dataArray.source = activityData;
				// this._dataArray.refresh();
				this._dataArray = new eui.ArrayCollection(this.activityModel.continueRechargeInfo.list);
				this.list.dataProvider = this._dataArray;
			}
			//倒计时
			if(this._countDown) {
				App.GlobalTimer.remove(this._countDown);
				this._countDown = undefined;
			}
			this.lb_time.text = InvestUtil.getFormatBySecond1(this.activityModel.continueRechargeInfo.left_time);
			this._countDown = App.GlobalTimer.addSchedule(1000,activityData.left_time,this.updateTime,this,()=>{
				App.GlobalTimer.remove(this._countDown);
				this._countDown = undefined;
				App.Socket.send(30012,{});
			},this);

			this.lb_have_day.text = "已达成"+this.activityModel.continueRechargeInfo.days+"天";

		}

		private updateTime() {
			this.activityModel.continueRechargeInfo.left_time--;
			this.lb_time.text = InvestUtil.getFormatBySecond1(this.activityModel.continueRechargeInfo.left_time);
		}

		/**
		 * 打开窗口
		 */
		public open(openParam: any = null): void {
			super.open(openParam);
			// if (this._viewHandleId == 0) {
			// 	this._viewHandleId = App.EventSystem.addEventListener(PanelNotify.ACTIVITY_UPDATE_VIEW,this.updateView,this);
			// }
			App.Socket.send(30012,{});
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
			if(this._countDown) {
				App.GlobalTimer.remove(this._countDown);
				this._countDown = undefined;
			}
		}
		/**
		 * 销毁
		 */
		public destroy(): void {
			super.destroy();
		}
	}

	export class ActivityContinueRechargeItem extends eui.ItemRenderer {
		public gp_main: eui.Label;
		public gp_reward : eui.Group;
		public lb_name: eui.Label;
		public img_txt : eui.Image;
		public btn_get: eui.Button;
		public img_have_get: eui.Image;


		private activityModel: ActivityModel = ActivityModel.getInstance();

		public constructor() {
			super();
			this.skinName = "ActivityContinueRechargeItemSkin";
			this.btn_get.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				App.Socket.send(30013,{id:this.data.id});
			}, this);
			let layout = new eui.HorizontalLayout();
			layout.gap = 5;
			layout.horizontalAlign = egret.HorizontalAlign.LEFT;
			this.gp_reward.layout = layout;
		}

		protected dataChanged() {
			let baseInfo = App.ConfigManager.getRechargeGiftInfoById(this.data.id);
			this.gp_reward.removeChildren();

			for (let k in baseInfo.reward) {
				let item = new customui.BaseItem();
				item.updateBaseItem(baseInfo.reward[k][0],baseInfo.reward[k][1],baseInfo.reward[k][2]);
				this.gp_reward.addChild(item);
			}
			if (this.data.state == 0) {  //不能领
				this.btn_get.visible = true;
				this.img_txt.visible = true;
				this.img_have_get.visible = false;
				RES.getResAsync("invest_txt_weidabiao_png",(texture)=>{
					this.img_txt.source = texture;
				},this);
				this.btn_get.currentState = 'down';
				this.lb_name.textFlow = [{text:"已达成"},{text:this.activityModel.continueRechargeInfo.days+"",style:{textColor:0xf10000}},{text:"/"+baseInfo.add_day+"天"}];
			} else if(this.data.state == 1){  //可以领
				this.btn_get.visible = true;
				this.img_txt.visible = true;
				this.img_have_get.visible = false;
				RES.getResAsync("invest_txt_lijilingqu_png",(texture)=>{
					this.img_txt.source = texture;
				},this);
				this.btn_get.currentState = 'up';
				this.lb_name.textFlow = [{text:"已达成"},{text:this.activityModel.continueRechargeInfo.days+"",style:{textColor:0x00f829}},{text:"/"+baseInfo.add_day+"天"}];
			} else if(this.data.state == 2) {  //已领
				this.btn_get.visible = false;
				this.img_txt.visible = false;
				this.img_have_get.visible = true;
				RES.getResAsync("invest_txt_lijilingqu_png",(texture)=>{
					this.img_txt.source = texture;
				},this);
				this.lb_name.textFlow = [{text:"已达成"},{text:this.activityModel.continueRechargeInfo.days+"",style:{textColor:0x00f829}},{text:"/"+baseInfo.add_day+"天"}];
			}

		}
	}

}