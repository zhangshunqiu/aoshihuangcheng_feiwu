/**
* module : 寻宝模块
* author : zrj
*/
module game {
	export class RaiderRewardView extends BaseView {
		public gp_main: eui.Group;
		public commonWin: customui.CommonWin;
		public gp_reward: eui.Group;
		public btn_store: eui.Button;
		public btn_buy: eui.Button;
		public img_cost: eui.Image;
		public lb_cost: eui.Label;
		public img_time: eui.Image;
		public img_btn_time: eui.Image;
		public img_close: eui.Image;

		private _data: any;
		private _itemArray: Array<customui.BaseItem> = [];
		private raiderModel: RaiderModel = RaiderModel.getInstance();
		public constructor(data) {
			super(data);
			this.skinName = "RaiderRewardSkin";
			// this._data = data;
		}

		protected childrenCreated() {
			super.childrenCreated();
			// this.initView();
			this.btn_store.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeRaider, this);
			this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeRaider, this);
			this.btn_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.buyRaider, this);

			let layout = new eui.TileLayout();
			layout.requestedColumnCount = 5;
			layout.requestedRowCount = 4;
			layout.verticalGap = 35;
			layout.horizontalGap = 22;
			layout.paddingLeft = 25;
			layout.horizontalAlign = egret.HorizontalAlign.JUSTIFY;
			this.gp_reward.layout = layout;

			if (this.raiderModel.time == 1) {
				this.lb_cost.text = String(App.ConfigManager.getConstConfigByType("TREASURE_GOLD").value);
				RES.getResAsync("raider_txt_1_png", (texture) => {
					this.img_time.source = texture;
				}, this);
				RES.getResAsync("raider_txt_xunbao1ci_png", (texture) => {
					this.img_btn_time.source = texture;
				}, this);
			} else {
				this.lb_cost.text = String(App.ConfigManager.getConstConfigByType("TREASURE_GOLDS").value);
				RES.getResAsync("raider_txt_10_png", (texture) => {
					this.img_time.source = texture;
				}, this);
				RES.getResAsync("raider_txt_xunbao10ci_png", (texture) => {
					this.img_btn_time.source = texture;
				}, this);
			}
		}

		private initView() {
			// this.commonWin.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeRaider, this);
			this.gp_reward.removeChildren();
			for (let key in this._data) {
				let info = this._data[key];

				let item = new customui.BaseItem();
				item.updateBaseItem(info.good_type, info.good_id, info.num);
				item.setItemNameVisible(true);
				this.gp_reward.addChild(item);
			}
		}

		private closeRaider() {
			// PopUpManager.removePopUp(this);
			App.WinManager.closeWin(WinName.POP_RAIDER_REWARD);
		}

		private buyRaider() {
			if (this.raiderModel.time == 1) {
				App.Socket.send(26003, {});
			} else {
				App.Socket.send(26004, {});
			}

		}

		/**
		 * 打开窗口
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			this._data = openParam.data;
			this.initView();
		}

		/**
		 * 关闭窗口
		 */
		public closeWin(callback): void {
			super.closeWin(callback);
		}

		/**
		 * 清理
		 */
		public clear(data: any = null): void {
			super.clear(data);
		}
		/**
		 * 销毁
		 */
		public destroy(): void {
			super.destroy();
		}
	}

}