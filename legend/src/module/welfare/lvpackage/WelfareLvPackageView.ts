/**
 * Author: lihe
 * Email： hersletter@qq.com
 * 福利等级礼包界面 2017/06/20.
 */
module game {

    /**
     *  等级礼包界面
     */
	export class WelfareLvPackageView extends BaseChildView {

		public scr_levelpackage: eui.Scroller;
		private _list_levelpackage: eui.List = new eui.List();
		private _eventid_level_up: number = 0;//等级礼包
		public btn_lvback: eui.Image;
		private _welfaredomodel: WelfareModel = WelfareModel.getInstance();

		public constructor(skinName: string) {
			super("WelfareLvPackageSkin")
		}

		protected childrenCreated() {
			super.childrenCreated();
			//this.isCreated = true;

			//等级礼包
			this.scr_levelpackage.viewport = this._list_levelpackage;
			this.scr_levelpackage.scrollPolicyH = eui.ScrollPolicy.OFF;
			this._list_levelpackage.itemRenderer = LevelPackageItem;
			this.btn_lvback.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				App.WinManager.closeWin(WinName.WELFARE);
			}, this);
		}

		public updateLevel() {
			this._list_levelpackage.dataProvider = new eui.ArrayCollection(this._welfaredomodel.lvList);
		}
        /**
         * 打开窗口
         */
		public open(openParam: any = null): void {
			super.open(openParam);
			if (this._eventid_level_up == 0) {
				this._eventid_level_up = App.EventSystem.addEventListener(PanelNotify.WELFARE_UPDATELEVELLIST, this.updateLevel, this);
			}
			App.Socket.send(22001, null);
			this._list_levelpackage.dataProvider = new eui.ArrayCollection(this._welfaredomodel.lvList);
		}

        /**
         * 清理
         */
		public clear(data: any = null): void {
			super.clear();
			if (this._eventid_level_up != 0) {
				App.EventSystem.removeEventListener(PanelNotify.MUSTDO_UPDATEACTIVITY, this._eventid_level_up);
				this._eventid_level_up = 0;
			}

		}
        /**
         * 销毁
         */
		public destroy(): void {
			super.destroy();

		}



	}


	export class LevelPackageItem extends eui.ItemRenderer {
		public lb_num1: eui.Label;
		public lb_num2: eui.Label;
		public baseItem1: customui.BaseItem;
		public baseItem2: customui.BaseItem;
		public lb_name: eui.Label;
		public lb_leftnum: eui.Label;

		public btn_take: eui.Image;
		public img_take: eui.Image;
		public img_grey: eui.Image;
		public img_token: eui.Image;
		public wlv: WelfareLvVo;


		public constructor() {
			super();
			this.skinName = "WelfareLvItemSkin";

			this.btn_take.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				this.getLevelReward();
			}, this);


		}

		public getLevelReward() {

			App.loglh("send 22002 !");
			App.Socket.send(22002, { id: this.wlv.id });


		}

		public dataChanged() {

			let wlv = this.data as WelfareLvVo;
			let lvpackage_info = App.ConfigManager.getLvPackageInfoById(wlv.id);
			this.lb_name.text = lvpackage_info.lv + "级礼包";
			if (lvpackage_info.reincarnation > 0)
				this.lb_name.text = lvpackage_info.reincarnation + "转礼包";
			if (wlv.left_num > 0)
				this.lb_leftnum.textFlow = [{ text: wlv.left_num + "", style: { textColor: 0x00f828 } }];
			else if (wlv.left_num == 0)
				this.lb_leftnum.textFlow = [{ text: wlv.left_num + "", style: { textColor: 0xf20000 } }];
			else if (wlv.left_num == -1)
				this.lb_leftnum.textFlow = [{ text: "不限", style: { textColor: 0x00f828 } }];

			let rewardlist: Array<any> = [];
			rewardlist = lvpackage_info.reward;

			if (rewardlist.length > 0) {
				let reward1: Array<any> = [];
				reward1 = rewardlist[0];
				if (reward1.length >= 3) {
					this.baseItem1.setItemNumVisible(true);
					this.baseItem1.updateBaseItem(ClientType.BASE_ITEM, reward1[1], reward1[2]);
					// this.baseItem1.lb_num.visible = true;
					// this.baseItem1.lb_num.text = reward1[2] + "";
				}
			}
			if (rewardlist.length > 1) {
				let reward2: Array<any> = [];
				reward2 = rewardlist[1];

				if (reward2.length >= 3) {
					this.baseItem2.setItemNumVisible(true);
					this.baseItem2.updateBaseItem(ClientType.BASE_ITEM, reward2[1], reward2[2]);
					// this.baseItem2.lb_num.visible = true;
					// this.baseItem2.lb_num.text = reward2[2] + "";
				}
			}
			switch (wlv.state) {
				case 0:
					this.btn_take.visible = false;
					this.img_take.visible = true;
					this.img_grey.visible = true;
					this.img_token.visible = false;
					break;

				case 1:
					this.btn_take.visible = true;
					this.img_take.visible = true;
					this.img_grey.visible = false;
					this.img_token.visible = false;
					break;

				case 2:
					this.btn_take.visible = false;
					this.img_take.visible = false;
					this.img_grey.visible = true;
					this.img_token.visible = true;
					break;

			}
			this.wlv = wlv;


		}
	}



}