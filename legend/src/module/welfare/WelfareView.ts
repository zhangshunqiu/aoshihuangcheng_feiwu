/**
* Author: lihe
* Email： hersletter@qq.com
* 福利UI界面逻辑 2017/06/20.
*/
module game {
	export class WelfareView extends BaseView {
		public constructor(viewConf: WinManagerVO = null) {
			super(viewConf);
		}

		// bg
		public commonWin: customui.CommonWin;
		public img_close: eui.Image;
		public btn_sign: eui.Group;
		public btn_level: eui.Group;
		public btn_note: eui.Image;
		public btn_code: eui.Image;
		public bt_back: eui.Image;
		public gp_sign: eui.Group;
		public gp_level: eui.Group;
		public gp_note: eui.Group;
		public gp_code: eui.Group;
		private _curtype = WelfareType.Sign;
		private _curgroup: eui.Group;
		private _welfaredomodel: WelfareModel = WelfareModel.getInstance();

		public scr_levelpackage: eui.Scroller;
		private _list_levelpackage: eui.List = new eui.List();
		private _eventid_level_up: number = 0;//等级礼包
		public btn_lvback:eui.Image;

		public lb_notecontent: eui.Label;
		public lb_notetitle: eui.Label;
		public scr_note:eui.Scroller;
		public vp_note:eui.Group;
		public btn_noteback:eui.Image;


		protected childrenCreated() {
			super.childrenCreated();

			this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				App.WinManager.closeWin(WinName.WELFARE);
			}, this);


			RES.getResAsync("sign_fuli_title_png", (texture) => {
				this.commonWin.img_title.texture = texture;
			}, this);
			this.initView();
		}

		private initView() {

            this.bt_back.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				App.WinManager.closeWin(WinName.WELFARE);
			}, this);
			this.btn_sign.addEventListener(egret.TouchEvent.TOUCH_TAP, () => { this.changeWelfareState(WelfareType.Sign) }, this);
			this.btn_level.addEventListener(egret.TouchEvent.TOUCH_TAP, () => { this.changeWelfareState(WelfareType.Level) }, this);
			this.btn_note.addEventListener(egret.TouchEvent.TOUCH_TAP, () => { this.changeWelfareState(WelfareType.Note) }, this);
			this.btn_code.addEventListener(egret.TouchEvent.TOUCH_TAP, () => { this.changeWelfareState(WelfareType.Code) }, this);
			
			App.BtnTipManager.addBtnTipItem(ConstBtnTipType.WELFARE_SIGN,this.btn_sign);
			App.BtnTipManager.addBtnTipItem(ConstBtnTipType.WELFARE_LEVEN,this.btn_level);

			//等级礼包
			this.scr_levelpackage.viewport = this._list_levelpackage;
			this.scr_levelpackage.scrollPolicyH = eui.ScrollPolicy.OFF;
			this._list_levelpackage.itemRenderer = LevelPackageItem;
			this.btn_lvback.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				App.WinManager.closeWin(WinName.WELFARE);
			}, this);
			this.btn_noteback.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				App.WinManager.closeWin(WinName.WELFARE);
			}, this);

			//公告
            this.scr_note.viewport = this.vp_note;
			this.scr_note.scrollPolicyH = eui.ScrollPolicy.OFF;

		}

		private changeWelfareState(type: WelfareType) {
			
			if(this._curtype==type)
			return;

			this._curgroup.visible = false;

			switch (type) {
				case WelfareType.Sign:
					this._curgroup = this.gp_sign;
					this._curgroup.visible = true;
					//this.openSign();
					break;
				case WelfareType.Level:
					this._curgroup = this.gp_level;
					this._curgroup.visible = true;
					this.openLevel();
					break;
				case WelfareType.Note:
					this._curgroup = this.gp_note;
					this._curgroup.visible = true;
					this.openNote();
					break;
				case WelfareType.Code:
					// this._curgroup = this.gp_code;
					// this._curgroup.visible = true;
					this.openCode();
					break;
			}

			this._curtype = type;
		}

		/**
	     * 打开窗口
	    */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			// App.Socket.send(16001,{});
			if (this._eventid_level_up == 0) {
				this._eventid_level_up = App.EventSystem.addEventListener(PanelNotify.WELFARE_UPDATELEVELLIST, this.updateLevel, this);
			}
			this._curgroup = this.gp_sign;
			this._curtype = WelfareType.Sign;
			this.openSign();
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

		//等级礼包
		public openLevel() {

			App.Socket.send(22001, null);

		}
		public updateLevel() {
			this._list_levelpackage.dataProvider = new eui.ArrayCollection(this._welfaredomodel.lvList);
		}

		public openNote() {
			let data = (LoginModel.getInstance() as LoginModel).getNotice();
			this.lb_notetitle.textFlow =  (new egret.HtmlTextParser).parser(data.top );
			this.lb_notecontent.textFlow = (new egret.HtmlTextParser).parser(data.word);

		}

		public openCode() {

		}

		//签到
		public openSign() {
			this.gp_sign.addChild(new SignView());
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
			App.Socket.send(22002, { lv: this.wlv.lv });

		
		}

		public dataChanged() {

			let wlv = this.data as WelfareLvVo;
			this.lb_name.text = wlv.lv + "级礼包";
	
			if (wlv.left_num > 0)
				this.lb_leftnum.textFlow = [{ text: wlv.left_num + "", style: { textColor: 0x00f828 } }];
			else if (wlv.left_num == 0)
				this.lb_leftnum.textFlow = [{ text: wlv.left_num + "", style: { textColor: 0xf20000 } }];
			else if (wlv.left_num == -1)
				this.lb_leftnum.textFlow = [{ text: "不限", style: { textColor: 0x00f828 } }];

			let lvpackage_info = App.ConfigManager.getLvPackageInfoByLv(wlv.lv);

			let rewardlist:  Array<any> = [];
			rewardlist = lvpackage_info.reward;

			if (rewardlist.length > 0) {
				let reward1:  Array<any> = [];
                reward1 = rewardlist[0];
				if(reward1.length >= 3){

				this.baseItem1.updateBaseItem(ClientType.BASE_ITEM, reward1[1]);
				this.baseItem1.lb_num.visible = true;
				this.baseItem1.lb_num.text =reward1[2] + "";
			}
			}
			if (rewardlist.length > 1) {
				let reward2:  Array<any> = [];
                reward2 = rewardlist[1];

				if(reward2.length >= 3){

				this.baseItem2.updateBaseItem(ClientType.BASE_ITEM,reward2[1]);
				this.baseItem2.lb_num.visible = true;
				this.baseItem2.lb_num.text =reward2[2] + "";
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