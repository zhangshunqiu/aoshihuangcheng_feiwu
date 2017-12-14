/**
 * module: 限购礼包
 * author : zrj
*/
module game {
	export class ActivityLimitGift extends BaseChildView {
		public gp_main : eui.Group;
		public gp_top : eui.Group;
		public lb_time : eui.Label;
		public lb_desc : eui.Label;
		public scroller : eui.Scroller;
		public list : eui.List = new eui.List();

		private activityModel :ActivityModel = ActivityModel.getInstance();
		private _viewHandleId : number = 0;

		private _dataArray : eui.ArrayCollection;
		private _countDown : number = 0;
		public constructor(skinName: string) {
			super(skinName);
			this.skinName = "ActivityLimitGiftSkin"
		}

		protected childrenCreated() {
			super.childrenCreated();
			this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
			this.scroller.verticalScrollBar.autoVisibility = false;
			this.scroller.verticalScrollBar.visible = false;
			this.list.itemRenderer = ActivityLimitGiftItem;
			this.scroller.viewport = this.list;

		}

		public updateView() {
			let activityData = this.activityModel.limitGiftInfo;
			if (!this._dataArray) {
				this._dataArray = new eui.ArrayCollection(this.activityModel.limitGiftInfo.list);
				this.list.dataProvider = this._dataArray;
			} else { //有数据了，刷新就行
				// this._dataArray.source = activityData;
				this._dataArray.refresh();
			}
			//倒计时
			if(this._countDown) {
				App.GlobalTimer.remove(this._countDown);
				this._countDown = undefined;
			}
			this.lb_time.text = InvestUtil.getFormatBySecond1(this.activityModel.dailyRankInfo.left_time);
			this._countDown = App.GlobalTimer.addSchedule(1000,activityData.left_time,this.updateTime,this,()=>{
				App.GlobalTimer.remove(this._countDown);
				this._countDown = undefined;
				App.Socket.send(30002,{});
			},this);

		}

		private updateTime() {
			this.activityModel.limitGiftInfo.left_time--;
			this.lb_time.text = InvestUtil.getFormatBySecond1(this.activityModel.limitGiftInfo.left_time);
		}

		/**
		 * 打开窗口
		 */
		public open(openParam: any = null): void {
			super.open(openParam);
			// if (this._viewHandleId == 0) {
			// 	this._viewHandleId = App.EventSystem.addEventListener(PanelNotify.ACTIVITY_UPDATE_VIEW,this.updateView,this);
			// }
			App.Socket.send(30004,{});
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

	export class ActivityLimitGiftItem extends eui.ItemRenderer {
		public gp_main: eui.Label;
		public baseItem: customui.BaseItem;
		public lb_name: eui.Label;
		public lb_origin_price: eui.Label;
		public lb_cur_price: eui.Label;
		public lb_time: eui.Label;
		public img_txt : eui.Image;
		public btn_buy: eui.Button;
		public img_have_buy: eui.Image;
		public img_gold : eui.Image;
		public img_gold1 : eui.Image;
		public bmlb_discount : eui.BitmapLabel;

		private activityModel: ActivityModel = ActivityModel.getInstance();

		public constructor() {
			super();
			this.skinName = "ActivityLimitGiftItemSkin";
			this.btn_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				App.Socket.send(30005,{id:this.data.id});
			}, this);
		}

		protected dataChanged() {
			let baseInfo = App.ConfigManager.getLimitGiftInfoById(this.data.id);
			let itemInfo = App.ConfigManager.getItemInfoById(baseInfo.goods);
			this.baseItem.updateBaseItem(ClientType.BASE_ITEM,baseInfo.goods,baseInfo.num);
			this.lb_name.text = itemInfo.name;
			this.lb_cur_price.text = String(baseInfo.number*baseInfo.discount/10);
			this.lb_origin_price.text = String(baseInfo.number);

			if (baseInfo.money == CurrencyType.COIN) {
				RES.getResAsync("common_jinbi_png",(texture)=> {
					this.img_gold.source = texture;
					this.img_gold1.source = texture;
				},this);
			} else if(baseInfo.money == CurrencyType.GOLD) {
				RES.getResAsync("common_yuanbao_png",(texture)=> {
					this.img_gold.source = texture;
					this.img_gold1.source = texture;
				},this);
			}

			if (this.data.left_num == 0) {  //购买完毕
				this.btn_buy.visible = false;
				this.img_txt.visible = false;
				this.lb_time.visible = false;
				this.img_have_buy.visible = true;
				this.btn_buy.touchEnabled = false;
				this.lb_time.textFlow =[{text:"可购买："},{text:this.data.left_num + "",style:{textColor:0xf10000}},{text:"/" + baseInfo.limit,style:{textColor:0x00f829}}];
			} else {
				this.btn_buy.visible = true;
				this.img_txt.visible = true;
				this.lb_time.visible = true;
				this.img_have_buy.visible = false;
				this.btn_buy.touchEnabled = true;
				this.lb_time.textFlow =[{text:"可购买："},{text:this.data.left_num + "/" + baseInfo.limit,style:{textColor:0x00f829}}];
			}

		}
	}

}