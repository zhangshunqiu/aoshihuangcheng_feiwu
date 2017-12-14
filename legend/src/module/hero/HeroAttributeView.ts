/**
* module : 英雄详细属性
* author : zrj
*/
module game {
	export class HeroAttributeView extends BaseView {
		public gp_main: eui.Group;
		public commonWin: customui.CommonWin;
		public hero_head: game.HeroHeadComponentView;
		public bmlb_cap: eui.BitmapLabel;
		public img_return: eui.Image;
		public gp_base: eui.Group;
		public lb_ac: eui.Label;
		public lb_hp: eui.Label;
		public lb_mp: eui.Label;
		public lb_def: eui.Label;
		public lb_sdef: eui.Label;
		public gp_special: eui.Group;
		public lb_crit: eui.Label;
		public lb_rcrit: eui.Label;
		public lb_paralysis: eui.Label;
		public lb_damage_offset_rate: eui.Label;
		public lb_damage_reduction: eui.Label;
		public lb_damage_deepen: eui.Label;
		public lb_hit_rate: eui.Label;
		public lb_dodge: eui.Label;

		private _handleId: number;
		private _curPos: number = 0;
		private _labelArray: Array<eui.Label> = [];
		private heroModel: HeroModel = HeroModel.getInstance();
		public constructor(viewConf: WinManagerVO = null) {
			super(viewConf);
			this.skinName = "HeroAttributeSkin";
			this.y += 64;
			this.readyOpenWin();
		}

		protected childrenCreated() {
			super.childrenCreated();
			this.initView();
		}

		private initView() {
			RES.getResAsync("equipping_biaoti_png", (texture) => {
				this.commonWin.img_title.texture = texture;
			}, this);
			this.commonWin.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				(EventSystem.getInstance() as EventSystem).dispatchEvent(WinManagerEvent.WIN_REMOVE, new WinManagerEvent(new WinManagerVO("", "", WinLay.MODULE_LAY), this));
			}, this);
			this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				(EventSystem.getInstance() as EventSystem).dispatchEvent(WinManagerEvent.WIN_REMOVE, new WinManagerEvent(new WinManagerVO("", "", WinLay.MODULE_LAY), this));
			}, this);
			this._labelArray.push(this.lb_ac);
			this._labelArray.push(this.lb_hp);
			this._labelArray.push(this.lb_mp);
			this._labelArray.push(this.lb_def);
			this._labelArray.push(this.lb_sdef);
			this._labelArray.push(this.lb_crit);
			this._labelArray.push(this.lb_rcrit);
			this._labelArray.push(this.lb_hit_rate);
			this._labelArray.push(this.lb_dodge);
			this._labelArray.push(this.lb_damage_deepen);
			this._labelArray.push(this.lb_damage_reduction);
			this._labelArray.push(this.lb_paralysis);
			this._labelArray.push(this.lb_damage_offset_rate);

			this._curPos = this.heroModel.curPos;
			this.updateView(this._curPos);
		}

		private updateView(data) {
			this._curPos = data;
			let heroInfo = this.heroModel.heroInfo[this._curPos];
			// let attributeInfo = this.heroModel.heroInfo[this._curPos].attributeInfo;
			let attrArray = ["ac", "hp", "mp", "def", "sdef", "crit", "rcrit", "hit_rate", "dodge", "damage_deepen", "damage_reduction", "paralysis", "damage_offset_rate"];
			this.bmlb_cap.text = String(heroInfo.score);
			for (let i = 0; i < attrArray.length; i++) {
				if (i == 0) {
					let key = "ac";
					if (heroInfo.job == CareerType.SOLDIER) {
						key = "ac";
					} else if (heroInfo.job == CareerType.MAGES) {
						key = "mac";
					} else if (heroInfo.job == CareerType.TAOIST) {
						key = "sc";
					}
					this._labelArray[i].text = "" + heroInfo.getAtrributeByKey(key).value;
					if (heroInfo.getAtrributeByKey(key).addValue) {
						this._labelArray[i].text = "+" + heroInfo.getAtrributeByKey(key).addValue;
					}
				} else if (i <= 4) {
					this._labelArray[i].text = "" + heroInfo.getAtrributeByKey(attrArray[i]).value;
					if (heroInfo.getAtrributeByKey(attrArray[i]).addValue) {
						this._labelArray[i].text = "+" + heroInfo.getAtrributeByKey(attrArray[i]).addValue;
					}
				} else {
					this._labelArray[i].text = "" + Math.floor(heroInfo.getAtrributeByKey(attrArray[i]).value / 100) + "%";
					if (heroInfo.getAtrributeByKey(attrArray[i]).addValue) {
						this._labelArray[i].text = "+" + Math.floor(heroInfo.getAtrributeByKey(attrArray[i]).addValue) + "%";
					}
				}
			}

		}

		/**
		 * 打开窗口
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			if (!this._handleId) {
				this._handleId = App.EventSystem.addEventListener(PanelNotify.HERO_ON_HERO_SELECT, this.updateView, this);
			}
			this.hero_head.readyOpen(openParam);
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
			if (this._handleId) {
				App.EventSystem.removeEventListener(PanelNotify.HERO_ON_HERO_SELECT, this._handleId);
				this._handleId = undefined;
			}
			this.hero_head.clear(data);
		}
		/**
		 * 销毁
		 */
		public destroy(): void {
			super.destroy();
		}
	}
}