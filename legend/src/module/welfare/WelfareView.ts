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
		private _sign_view: SignView;
		private _note_view: WelfareNoteView;
		private _lvpackage_view:WelfareLvPackageView;
		private _curSelView: BaseChildView;
		private _curSelIndex: number = 0;


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
			this.btn_level.addEventListener(egret.TouchEvent.TOUCH_TAP, () =>{ this.changeWelfareState(WelfareType.Level) }, this);
			this.btn_note.addEventListener(egret.TouchEvent.TOUCH_TAP, () => { this.changeWelfareState(WelfareType.Note) }, this);
			this.btn_code.addEventListener(egret.TouchEvent.TOUCH_TAP, () => { this.changeWelfareState(WelfareType.Code) }, this);

			App.BtnTipManager.addBtnTipItem(ConstBtnTipType.WELFARE_SIGN, this.btn_sign);
			App.BtnTipManager.addBtnTipItem(ConstBtnTipType.WELFARE_LEVEN, this.btn_level);

			

		}

		private changeWelfareState(type: WelfareType) {

			if (this._curSelIndex == type) {
				return;
			}
			if (this._curSelView) {
				this._curSelView.clear();
			}


			switch (type) {
				case WelfareType.Sign:
					if (this._sign_view == null) {
						this._sign_view = new SignView("SignViewSkin")
						this.addChild(this._sign_view);
					}
					this._sign_view.readyOpen({ data: {} });
					this._curSelView = this._sign_view;
					break;
				case WelfareType.Level:
					if (this._lvpackage_view == null) {
						this._lvpackage_view = new WelfareLvPackageView("WelfareLvPackageSkin")
						this.addChild(this._lvpackage_view);
					}
					this._lvpackage_view.readyOpen({ data: {} });
					this._curSelView = this._lvpackage_view;
					break;
				case WelfareType.Note:
					if (this._note_view == null) {
						this._note_view = new WelfareNoteView("WelfareNoteSkin")
						this.addChild(this._note_view);
					}
					this._note_view.readyOpen({ data: {} });
					this._curSelView = this._note_view;
					break;
				case WelfareType.Code:
					
					break;
			}

				this._curSelIndex = type;
		}

		/**
	     * 打开窗口
	    */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			
			this.changeWelfareState(WelfareType.Sign);
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

			this._curSelIndex = 0;

		}
		/**
		 * 销毁
		 */
		public destroy(): void {
			super.destroy();
		}

		//等级礼包
		// public openLevel() {

		// 	App.Socket.send(22001, null);

		// }
		// public updateLevel() {
		// 	this._list_levelpackage.dataProvider = new eui.ArrayCollection(this._welfaredomodel.lvList);
		// }

		// public openNote() {
		// 	let data = (LoginModel.getInstance() as LoginModel).getNotice();
		// 	this.lb_notetitle.textFlow = (new egret.HtmlTextParser).parser(data.top);
		// 	this.lb_notecontent.textFlow = (new egret.HtmlTextParser).parser(data.word);

		// }

		public openCode() {

		}

		//签到
		public openSign() {
			this.gp_sign.addChild(new SignView("SignViewSkin"));
		}


	}



}